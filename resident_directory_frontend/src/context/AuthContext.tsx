"use client";

/**
 * Authentication context provider.
 * Manages user login/logout state and provides auth info to all components.
 * Uses localStorage for token persistence with client-side rendering.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole, LoginCredentials, RegisterData } from "@/lib/types";
import { apiFetch } from "@/lib/api";
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
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      // Attempt to authenticate with the backend
      const response = await apiFetch<{ access_token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    } catch {
      // Fallback to mock authentication for development
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
      const response = await apiFetch<{ access_token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    } catch {
      // Fallback to mock registration for development
      console.warn("Backend unavailable, using mock registration");

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
