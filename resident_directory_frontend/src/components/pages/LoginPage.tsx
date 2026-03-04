"use client";

/**
 * Login page component.
 * Handles user authentication with email and password.
 * Includes a link to switch to registration.
 */

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

// PUBLIC_INTERFACE
/**
 * LoginPage provides the login form for user authentication.
 * @param onSwitchToRegister - Callback to switch to registration view
 */
export default function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#3b82f6" }}>
            🏢 Resident Hub
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
            Sign in to your community portal
          </p>
        </div>

        {/* Login card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-lg text-sm text-white"
                style={{ backgroundColor: "#EF4444" }}
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: "#f0f9ff", color: "#3b82f6" }}>
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Admin: admin@building.com / any password</p>
            <p>Resident: any other email / any password</p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm" style={{ color: "#64748b" }}>
              Don&apos;t have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="font-medium hover:underline"
                style={{ color: "#3b82f6" }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
