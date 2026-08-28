const API_BASE = "/api";

export function getToken(): string | null {
  return localStorage.getItem("jobease_token");
}

export function setToken(token: string) {
  localStorage.setItem("jobease_token", token);
}

export function removeToken() {
  localStorage.removeItem("jobease_token");
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API request failed with status ${response.status}`);
  }

  return data as T;
}
