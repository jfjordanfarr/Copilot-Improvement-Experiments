import ast
import json
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple


class OracleError(Exception):
    pass


def read_request() -> Dict:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            raise OracleError("Missing oracle request payload")
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise OracleError(f"Failed to decode oracle request payload: {exc}") from exc


def resolve_files(root: Path, include: List[str], exclude: List[str]) -> List[Path]:
    candidates: Set[Path] = set()

    if include:
        for pattern in include:
            for entry in root.glob(pattern):
                if entry.is_file() and entry.suffix == ".py":
                    candidates.add(entry.resolve())
    else:
        for entry in root.rglob("*.py"):
            if entry.is_file():
                candidates.add(entry.resolve())

    if exclude:
        excluded: Set[Path] = set()
        for pattern in exclude:
            for entry in root.glob(pattern):
                if entry.is_file():
                    excluded.add(entry.resolve())
        candidates.difference_update(excluded)

    return sorted(candidates)


def normalise_relative(root: Path, target: Path) -> str:
    return target.relative_to(root).as_posix()


def build_module_maps(
    root: Path,
    files: Iterable[Path],
    package_roots: List[str],
    entry_packages: Set[str]
) -> Tuple[Dict[str, str], Dict[str, str]]:
    module_to_file: Dict[str, str] = {}
    file_to_module: Dict[str, str] = {}

    resolved_package_roots = [Path(root / pkg).resolve() for pkg in package_roots] if package_roots else [root]

    for file_path in files:
        matched = False
        for package_root in resolved_package_roots:
            try:
                relative = file_path.relative_to(package_root)
            except ValueError:
                continue

            module_parts = list(relative.with_suffix("").parts)
            if module_parts and module_parts[-1] == "__init__":
                module_parts = module_parts[:-1]
            if not module_parts:
                continue

            top_level = module_parts[0]
            if entry_packages and top_level not in entry_packages:
                continue

            module_name = ".".join(module_parts)
            rel_path = normalise_relative(root, file_path)
            module_to_file[module_name] = rel_path
            file_to_module[rel_path] = module_name
            matched = True
            break

        if not matched and not package_roots:
            # When package roots are not supplied, fall back to root-relative names.
            relative = file_path.relative_to(root)
            module_parts = list(relative.with_suffix("").parts)
            if module_parts and module_parts[-1] == "__init__":
                module_parts = module_parts[:-1]
            if not module_parts:
                continue

            top_level = module_parts[0]
            if entry_packages and top_level not in entry_packages:
                continue

            module_name = ".".join(module_parts)
            rel_path = normalise_relative(root, file_path)
            module_to_file[module_name] = rel_path
            file_to_module[rel_path] = module_name

    return module_to_file, file_to_module


def resolve_from_target(module_name: str, alias: Optional[str], module_map: Dict[str, str]) -> Optional[str]:
    if not module_name:
        return None

    targets = []
    if alias:
        targets.append(f"{module_name}.{alias}")
    targets.append(module_name)

    for candidate in targets:
        if candidate in module_map:
            return module_map[candidate]
    return None


def resolve_relative_module(current: str, module: Optional[str], level: int) -> str:
    current_parts = current.split(".") if current else []
    module_parts = module.split(".") if module else []

    if level > 0:
        if level <= len(current_parts):
            base_parts = current_parts[:-level]
        else:
            base_parts = []

        if not base_parts and current_parts:
            base_parts = current_parts
    else:
        base_parts = []

    combined = [part for part in (*base_parts, *module_parts) if part]
    return ".".join(combined)


def collect_edges(
    root: Path,
    files: List[Path],
    module_map: Dict[str, str],
    file_to_module: Dict[str, str]
) -> List[Dict[str, str]]:
    edges: Set[Tuple[str, str]] = set()
    serialised_edges: List[Dict[str, str]] = []

    for file_path in files:
        rel_source = normalise_relative(root, file_path)
        current_module = file_to_module.get(rel_source)

        try:
            source_ast = ast.parse(file_path.read_text(encoding="utf-8"))
        except (SyntaxError, UnicodeDecodeError) as exc:
            raise OracleError(f"Failed to parse {rel_source}: {exc}") from exc

        for node in ast.walk(source_ast):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    module_name = alias.name
                    target_rel = resolve_from_target(module_name, None, module_map)
                    if target_rel:
                        edge_key = (rel_source, target_rel)
                        if edge_key not in edges:
                            edges.add(edge_key)
                            serialised_edges.append(
                                {
                                    "source": rel_source,
                                    "target": target_rel,
                                    "relation": "imports",
                                    "provenance": "module-import"
                                }
                            )
            elif isinstance(node, ast.ImportFrom):
                if node.level and current_module is None:
                    continue

                base_module = resolve_relative_module(current_module or "", node.module, node.level or 0)
                if base_module and node.module is not None:
                    target_rel = resolve_from_target(base_module, None, module_map)
                    if target_rel:
                        edge_key = (rel_source, target_rel)
                        if edge_key not in edges:
                            edges.add(edge_key)
                            serialised_edges.append(
                                {
                                    "source": rel_source,
                                    "target": target_rel,
                                    "relation": "imports",
                                    "provenance": "module-import"
                                }
                            )

                for alias in node.names:
                    if alias.name == "*":
                        continue

                    alias_context = base_module or current_module or ""
                    if not alias_context:
                        continue

                    nested_rel = resolve_from_target(alias_context, alias.name, module_map)
                    if nested_rel:
                        edge_key = (rel_source, nested_rel)
                        if edge_key not in edges:
                            edges.add(edge_key)
                            serialised_edges.append(
                                {
                                    "source": rel_source,
                                    "target": nested_rel,
                                    "relation": "imports",
                                    "provenance": "module-import"
                                }
                            )

    serialised_edges.sort(key=lambda item: (item["source"], item["target"], item["relation"]))
    return serialised_edges


def main() -> None:
    request = read_request()

    root_arg = request.get("root")
    if not isinstance(root_arg, str) or not root_arg:
        raise OracleError("Oracle request missing 'root' path")

    root = Path(root_arg)
    if not root.exists():
        raise OracleError(f"Fixture root does not exist: {root}")

    include_patterns = request.get("include") or []
    exclude_patterns = request.get("exclude") or []
    package_roots = request.get("package_roots") or []
    entry_packages = set(request.get("entry_packages") or [])

    files = resolve_files(root, include_patterns, exclude_patterns)
    module_map, file_to_module = build_module_maps(root, files, package_roots, entry_packages)
    edges = collect_edges(root, files, module_map, file_to_module)

    json.dump({"edges": edges}, sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    try:
        main()
    except OracleError as exc:
        sys.stderr.write(f"oracle-error: {exc}\n")
        sys.exit(2)
    except Exception as exc:  # pragma: no cover - unexpected failure
        sys.stderr.write(f"oracle-fatal: {exc}\n")
        sys.exit(3)
