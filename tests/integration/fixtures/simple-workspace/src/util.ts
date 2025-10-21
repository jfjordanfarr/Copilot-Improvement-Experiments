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
// util touched 1760921425710
// util touched 1760926014071
// util touched 1760926493164
// util touched 1761061231623
// util touched 1761061380073
// util touched 1761062972937
// util touched 1761063144061
// util touched 1761063302250
// util touched 1761063444817
// util touched 1761063844481
// util touched 1761064217499
// util touched 1761064716697
// util touched 1761064830714
// util touched 1761065763031
// util touched 1761067923213
// util touched 1761068473540
// util touched 1761068877071
// util touched 1761069056786
// util touched 1761069530416