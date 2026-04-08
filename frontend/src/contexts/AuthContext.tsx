import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, ApiUser } from "@/lib/api";

export type AppRole = "ROLE_ADMIN" | "ROLE_OWNER" | "ROLE_WORKER";

// Map backend roles to frontend display/routing
export const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: "Admin",
  ROLE_OWNER: "Field Owner",
  ROLE_WORKER: "Field Worker",
};

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  role: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { fullName: string; username: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("thdms_token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("thdms_role"));
  const [isLoading, setIsLoading] = useState(!!token);

  const logout = useCallback(() => {
    localStorage.removeItem("thdms_token");
    localStorage.removeItem("thdms_role");
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  // On mount, if token exists, fetch user info
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => {
        setUser(u);
        setRole(u.role);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setIsLoading(false));
  }, [token, logout]);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    localStorage.setItem("thdms_token", res.token);
    localStorage.setItem("thdms_role", res.role);
    setToken(res.token);
    setRole(res.role);
    // Fetch full user info
    const u = await authApi.me();
    setUser(u);
  };

  const register = async (data: { fullName: string; username: string; password: string; role: string }) => {
    await authApi.register(data);
    // Auto-login after register
    await login(data.username, data.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
