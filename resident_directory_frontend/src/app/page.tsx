"use client";

/**
 * Main entry page for the Resident Directory Management System.
 * Renders the AppShell wrapped with the AuthProvider for auth state management.
 * This is a client component since the app uses static export (output: "export").
 */

import { AuthProvider } from "@/context/AuthContext";
import AppShell from "@/components/AppShell";

// PUBLIC_INTERFACE
/**
 * Home page component - entry point for the application.
 * Wraps the app shell with authentication context provider.
 */
export default function Home() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
