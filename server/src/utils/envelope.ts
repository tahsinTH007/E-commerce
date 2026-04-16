// Utility functions and types for API response envelopes
export type ApiEnvelope<T> = {
  status: "success" | "error";
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: Array<{ message: string; code?: string }>;
};

// Helper function to create a successful response envelope
export function ok<T>(data: T, meta?: Record<string, unknown>): ApiEnvelope<T> {
  return {
    status: "success",
    data,
    meta,
  };
}

// Helper function to create an error response envelope
export function fail(message: string, code?: string): ApiEnvelope<null> {
  return { status: "error", data: null, errors: [{ message, code }] };
}
