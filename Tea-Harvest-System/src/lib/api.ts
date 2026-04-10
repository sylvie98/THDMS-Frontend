const rawApiBase = import.meta.env.VITE_API_URL?.trim();
const API_BASE = rawApiBase ? rawApiBase.replace(/\/$/, "") : "/api";

function getToken(): string | null {
  return localStorage.getItem("thdms_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || json.detail || text;
        } catch {
          errorMessage = text;
        }
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return (await res.text()) as T;
  }

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
  assignedFields?: ApiField[];
}

export interface ApiField {
  fieldId: number;
  fieldName: string;
  location: string;
  owner?: ApiUser | null;
  harvests?: ApiHarvest[];
  workers?: ApiUser[]; 
}

export interface ApiHarvest {
  harvestId: number;
  field: ApiField;
  worker?: ApiUser | null;
  harvestDate: string; // "yyyy-MM-dd"
  quantity: number;
  status: string; // "PENDING", "VERIFIED", "REJECTED"
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

  create: (data: { fieldName: string; location: string; owner: { userId: number } }) =>
    request<ApiField>("/fields", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: { fieldName: string; location: string; owner: { userId: number } }) =>
    request<ApiField>(`/fields/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/fields/${id}`, { method: "DELETE" }),

  // FIX: Backend already filters fields by the authenticated worker, so we just call getAll()
  getByWorker: async (workerId: number) => {
    return request<ApiField[]>("/fields");
  },
  
  assignWorker: (fieldId: number, workerId: number) => 
    request<ApiField>(`/fields/${fieldId}/workers/${workerId}`, { method: "POST" }),
    
  removeWorker: (fieldId: number, workerId: number) => 
    request<ApiField>(`/fields/${fieldId}/workers/${workerId}`, { method: "DELETE" }),
};

// ── Harvests API ──────────────────────────────────
export const harvestsApi = {
  getAll: () => request<ApiHarvest[]>("/harvests"),

  // FIX: Client-side filtering to match the backend structure and avoid 404s
  getByField: async (fieldId: number) => {
    const harvests = await request<ApiHarvest[]>("/harvests");
    return harvests.filter((h) => h.field && h.field.fieldId === fieldId);
  },

  // FIX: Client-side date filtering to avoid 404s
  getByDateRange: async (start: string, end: string) => {
    const harvests = await request<ApiHarvest[]>("/harvests");
    return harvests.filter((h) => h.harvestDate >= start && h.harvestDate <= end);
  },

  create: (data: { field: { fieldId: number }; harvestDate: string; quantity: number }) =>
    request<ApiHarvest>("/harvests", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: { field: { fieldId: number }; harvestDate: string; quantity: number }) =>
    request<ApiHarvest>(`/harvests/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/harvests/${id}`, { method: "DELETE" }),

  updateStatus: (id: number, status: string) => 
    request<ApiHarvest>(`/harvests/${id}/status`, { 
      method: "PATCH", 
      body: JSON.stringify({ status }) 
    }),
};