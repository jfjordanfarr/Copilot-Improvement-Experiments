# C# Advanced Symbol Fixture

This fixture exercises link-aware diagnostics against inheritance-heavy C# code. It mixes
`protected internal` APIs, abstract members, and internal-only entry points so symbol extraction
has to cope with non-public accessibility.

## Notable Paths

- [`src/Diagnostics/BaseWidget.cs`](src/Diagnostics/BaseWidget.cs) — abstract base with protected
  hooks and metadata helpers.
- [`src/Diagnostics/Widgets/LatencyProbeWidget.cs`](src/Diagnostics/Widgets/LatencyProbeWidget.cs)
  — renders using non-null state requirements.
- [`docs/registry.md`](docs/registry.md) — documentation describing how registry wiring should
  link back to implementation artifacts.

The fixture is intentionally small but covers the modifiers we have struggled to parse when mapping
symbol surfaces from real-world .NET repositories.
