"use client";

/**
 * Registration page component.
 * Allows new residents to create an account.
 */

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

// PUBLIC_INTERFACE
/**
 * RegisterPage provides the registration form for new users.
 * @param onSwitchToLogin - Callback to switch to login view
 */
export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, unit });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: "#f9fafb" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#3b82f6" }}>
            🏢 Resident Hub
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
            Create your community account
          </p>
        </div>

        {/* Registration card */}
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
              <label htmlFor="reg-name" className="label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="label">Email Address</label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-unit" className="label">Unit / Apartment Number</label>
              <input
                id="reg-unit"
                type="text"
                className="input-field"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., 101"
                required
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <input
                id="reg-password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="reg-confirm" className="label">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm" style={{ color: "#64748b" }}>
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-medium hover:underline"
                style={{ color: "#3b82f6" }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
