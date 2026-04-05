import { API_BASE_URL } from "@/lib/config";

const LEGACY_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST?.trim();
const REALTIME_BASE_URL = import.meta.env.VITE_REALTIME_BASE_URL?.trim();

function normalizeLegacyBackendHost(host: string) {
  if (host.startsWith("http://") || host.startsWith("https://")) {
    return host;
  }

  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${host}`;
}

function realtimeBaseUrl() {
  if (REALTIME_BASE_URL) {
    return REALTIME_BASE_URL;
  }

  if (LEGACY_BACKEND_HOST) {
    return normalizeLegacyBackendHost(LEGACY_BACKEND_HOST);
  }

  return API_BASE_URL;
}

export function buildRealtimeHttpUrl(path: string, searchParams?: URLSearchParams) {
  const baseUrl = realtimeBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const url = new URL(path, `${baseUrl.replace(/\/$/, "")}/`);
  if (searchParams) {
    url.search = searchParams.toString();
  }
  return url.toString();
}

export function buildRealtimeWebSocketUrl(path: string, searchParams?: URLSearchParams) {
  const httpUrl = buildRealtimeHttpUrl(path, searchParams);
  if (!httpUrl) {
    return null;
  }

  const url = new URL(httpUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}
