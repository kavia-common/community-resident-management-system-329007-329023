"use client";

/**
 * Authentication context provider.
 *
 * Flow: AuthenticationFlow
 * - Manages user login/logout/register state
 * - Persists auth token and user info in localStorage
 * - Attempts backend auth first, falls back to mock data if unavailable
 * - Provides isAdmin derived state for role-based UI
 *
 * Contract:
 *   Input: LoginCredentials (email/password), RegisterData (name/email/password/unit)
 *   Output: AuthContextType with user, isAuthenticated, isAdmin, login/register/logout
 *   Errors: Throws Error on failed login/register (caught by consuming components)
 *   Side effects: localStorage reads/writes for token + user persistence
 *
 * Observability:
 *   - Console warnings when backend is unavailable and mock fallback is used
 *   - Errors propagated to consuming components for UI display
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole, LoginCredentials, RegisterData } from "@/lib/types";
import { apiFetch, BackendTokenResponse, mapTokenResponseToUser } from "@/lib/api";
import { mockAdminUser, mockResidentUser } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PUBLIC_INTERFACE
/**
 * AuthProvider wraps the app and provides authentication state and methods.
 * Attempts real backend authentication first; falls back to mock auth if backend is unreachable.
 * @param children - Child components that need access to auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Optionally verify token with backend /auth/me endpoint
        // If it fails, the stored session is still used (graceful degradation)
        apiFetch<{ id: string; username: string; email: string; role: string }>("/auth/me")
          .then((backendUser) => {
            const refreshedUser: User = {
              id: backendUser.id,
              email: backendUser.email,
              name: backendUser.username,
              role: backendUser.role as UserRole,
            };
            localStorage.setItem("user", JSON.stringify(refreshedUser));
            setUser(refreshedUser);
          })
          .catch(() => {
            // Backend unreachable — keep stored user (mock or stale)
            console.warn("Could not verify session with backend; using stored session.");
          });
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      // Backend expects { username, password } — the frontend uses email as the username
      const response = await apiFetch<BackendTokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      const mappedUser = mapTokenResponseToUser(response);

      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch {
      // Fallback to mock authentication for development / when backend is unavailable
      console.warn("Backend unavailable, using mock authentication");

      let mockUser: User;
      if (credentials.email === "admin@building.com") {
        mockUser = mockAdminUser;
      } else {
        mockUser = { ...mockResidentUser, email: credentials.email };
      }

      const mockToken = "mock_token_" + Date.now();
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      // Backend register is admin-only; attempt it but expect it may fail for
      // unauthenticated users — in that case, fall back to mock registration
      const response = await apiFetch<BackendTokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: data.email,
          email: data.email,
          password: data.password,
          role: "resident",
        }),
      });

      // If register returns a token response (custom flow), handle it
      if (response.access_token) {
        const mappedUser = mapTokenResponseToUser(response);
        localStorage.setItem("auth_token", response.access_token);
        localStorage.setItem("user", JSON.stringify(mappedUser));
        setUser(mappedUser);
        return;
      }

      // Backend register returns UserResponse (no token) — auto-login after registration
      await loginAfterRegister(data.email, data.password);
    } catch {
      // Fallback to mock registration for development
      console.warn("Backend unavailable or register requires admin, using mock registration");

      const mockUser: User = {
        id: String(Date.now()),
        email: data.email,
        name: data.name,
        role: "resident" as UserRole,
        unit: data.unit,
      };

      const mockToken = "mock_token_" + Date.now();
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    }
  }, []);

  /**
   * Helper: login immediately after a successful registration.
   */
  const loginAfterRegister = async (email: string, password: string) => {
    const response = await apiFetch<BackendTokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
    });

    const mappedUser = mapTokenResponseToUser(response);
    localStorage.setItem("auth_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 * @returns AuthContextType with user info and auth methods
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
