export type PrimitiveValue = string | number | boolean | null;
export type NormalizedValue = PrimitiveValue | NormalizedArray | NormalizedObject;
export type NormalizedArray = NormalizedValue[];
export interface NormalizedObject {
  [key: string]: NormalizedValue;
}

export function normalizeValue(value: unknown): NormalizedValue {
  if (value === undefined) {
    return null;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue) as NormalizedArray;
  }

  if (typeof value === "object") {
    const result: NormalizedObject = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      result[key] = normalizeValue(nested);
    }
    return result;
  }

  return null;
}

export function summarizeShape(value: NormalizedValue): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  if (Array.isArray(value)) {
    return `array(${value.length})`;
  }

  return `object(${Object.keys(value as NormalizedObject).length})`;
}
