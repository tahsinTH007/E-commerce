import { apiGet, apiPost } from "@/lib/api";
import type { SyncResponse } from "./types";

export function syncUser() {
  return apiPost<SyncResponse>("/auth/sync");
}

export function getMe() {
  return apiGet<SyncResponse>("/auth/me");
}
