export type UserRole = "admin" | "customer";

export type AppUser = {
  id: string;
  clerkUserId: string;
  email?: string;
  name?: string;
  role: UserRole;
};

export type ApiErrorItem = {
  code?: string;
  message: string;
};

export type ApiEnvelope<T> = {
  status: "success" | "error";
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: ApiErrorItem[];
};
