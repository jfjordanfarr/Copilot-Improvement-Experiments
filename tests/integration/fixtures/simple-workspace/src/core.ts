import { evaluateFeature } from "./feature";

/**
 * Core business logic module
 * @link docs/architecture.md
 */

export interface Request {
  id: string;
  payload: unknown;
}

export interface Response {
  status: number;
  data: unknown;
}

export function processRequest(request: Request): Response {
  const evaluation = evaluateFeature(request.payload);

  return {
    status: evaluation.ok ? 200 : 400,
    data: {
      processed: true,
      id: request.id,
      normalizedPayload: evaluation.normalized
    }
  };
}

export function validateRequest(request: Request): boolean {
  const evaluation = evaluateFeature(request.payload);
  return Boolean(request.id && evaluation.ok);
}
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation
// Updated implementation