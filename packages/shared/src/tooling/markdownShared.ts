export interface ReferenceDefinition {
  index: number;
  url: string;
}

export function extractReferenceDefinitions(content: string): Map<string, ReferenceDefinition> {
  const map = new Map<string, ReferenceDefinition>();
  const lines = content.split(/\r?\n/);
  let offset = 0;

  for (const line of lines) {
    const definitionMatch = line.match(/^\s*\[([^\]]+)\]:\s*(.+)$/);
    if (definitionMatch) {
      const identifier = definitionMatch[1].trim().toLowerCase();
      const rawTarget = definitionMatch[2].trim();
      map.set(identifier, {
        index: offset,
        url: rawTarget
      });
    }

    offset += line.length + 1;
  }

  return map;
}

export function computeLineStarts(content: string): number[] {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    const char = content.charCodeAt(index);
    if (char === 10) {
      starts.push(index + 1);
    }
  }
  return starts;
}

export function toLineAndColumn(index: number, lineStarts: number[]): { line: number; column: number } {
  let low = 0;
  let high = lineStarts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const start = lineStarts[mid];
    const nextStart = mid + 1 < lineStarts.length ? lineStarts[mid + 1] : Number.POSITIVE_INFINITY;

    if (index < start) {
      high = mid - 1;
    } else if (index >= nextStart) {
      low = mid + 1;
    } else {
      return {
        line: mid + 1,
        column: index - start + 1
      };
    }
  }

  return { line: 1, column: index + 1 };
}

export function parseLinkTarget(raw: string): string | undefined {
  if (!raw) {
    return undefined;
  }

  let target = raw.trim();

  if (target.startsWith("<") && target.endsWith(">")) {
    target = target.slice(1, -1).trim();
  }

  const spaceIndex = target.indexOf(" ");
  if (spaceIndex !== -1) {
    target = target.slice(0, spaceIndex);
  }

  const quoteIndex = target.indexOf('"');
  if (quoteIndex !== -1) {
    target = target.slice(0, quoteIndex);
  }

  const singleQuoteIndex = target.indexOf("'");
  if (singleQuoteIndex !== -1) {
    target = target.slice(0, singleQuoteIndex);
  }

  target = target.trim();

  if (target.length === 0) {
    return undefined;
  }

  return target;
}
