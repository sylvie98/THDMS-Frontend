const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function getToken(): string | null {
  return localStorage.getItem("thdms_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ── Auth ──────────────────────────────────────────
export interface AuthResponse {
  token: string;
  role: string;
  username: string;
}

export interface ApiUser {
  userId: number;
  fullName: string;
  username: string;
  role: string;
  password?: string;
  fields?: ApiField[];
}

export interface ApiField {
  fieldId: number;
  fieldName: string;
  location: string;
  owner?: ApiUser | null;
  harvests?: ApiHarvest[];
}

export interface ApiHarvest {
  harvestId: number;
  field: ApiField;
  harvestDate: string; // "yyyy-MM-dd"
  quantity: number;
}

// ── Auth API ──────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  register: (data: { fullName: string; username: string; password: string; role: string }) =>
    request<ApiUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<ApiUser>("/auth/me"),
};

// ── Users API ─────────────────────────────────────
export const usersApi = {
  getAll: () => request<ApiUser[]>("/users"),

  getById: (id: number) => request<ApiUser>(`/users/${id}`),

  create: (data: { fullName: string; username: string; password: string; role: string }) =>
    request<ApiUser>("/users", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: { fullName: string; username: string; password?: string; role: string }) =>
    request<ApiUser>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/users/${id}`, { method: "DELETE" }),
};

// ── Fields API ────────────────────────────────────
export const fieldsApi = {
  getAll: () => request<ApiField[]>("/fields"),

  getById: (id: number) => request<ApiField>(`/fields/${id}`),

  create: (data: { fieldName: string; location: string; owner?: { userId: number } }) =>
    request<ApiField>("/fields", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: { fieldName: string; location: string; owner?: { userId: number } }) =>
    request<ApiField>(`/fields/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/fields/${id}`, { method: "DELETE" }),
};

// ── Harvests API ──────────────────────────────────
export const harvestsApi = {
  getAll: () => request<ApiHarvest[]>("/harvests"),

  getByField: (fieldId: number) => request<ApiHarvest[]>(`/harvests/field/${fieldId}`),

  getByDateRange: (start: string, end: string) =>
    request<ApiHarvest[]>(`/harvests/reports?start=${start}&end=${end}`),

  create: (data: { field: { fieldId: number }; harvestDate: string; quantity: number }) =>
    request<ApiHarvest>("/harvests", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: { field: { fieldId: number }; harvestDate: string; quantity: number }) =>
    request<ApiHarvest>(`/harvests/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/harvests/${id}`, { method: "DELETE" }),
};
