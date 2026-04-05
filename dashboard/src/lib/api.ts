import { ApiError } from "@/lib/api-error";
import { API_BASE_URL } from "@/lib/config";
import { mockApiFetch } from "@/lib/mock-api";

// ─── Toggle ───────────────────────────────────────────────────────────────────
// Set to true  → always use local mock data (ignores VITE_API_BASE_URL)
// Set to false → use live API when VITE_API_BASE_URL is set, mock otherwise
const USE_MOCK_DATA = false;
// ─────────────────────────────────────────────────────────────────────────────

const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? "";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (API_TOKEN) {
    headers.set("Authorization", `Bearer ${API_TOKEN}`);
  }

  if (USE_MOCK_DATA || !API_BASE_URL) {
    return mockApiFetch<T>(path, { ...init, headers });
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    throw new ApiError(
      0,
      path,
      "Unable to reach the API. Check the server and connection, then refresh the dashboard.",
      error,
    );
  }

  if (!response.ok) {
    let details: unknown;

    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }

    throw new ApiError(
      response.status,
      path,
      `API ${response.status}: ${path}`,
      details,
    );
  }

  return response.json() as Promise<T>;
}
