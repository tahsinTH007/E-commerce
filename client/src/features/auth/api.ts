import { apiGet, apiPost } from "@/lib/api";
import type { SyncResponse } from "./types";

/// Calls the /auth/sync endpoint to synchronize the user's authentication state.
export function syncUser() {
  return apiPost<SyncResponse>("/auth/sync");
}

/// Calls the /auth/me endpoint to retrieve the current authenticated user's information.
export function getMe() {
  return apiGet<SyncResponse>("/auth/me");
}
