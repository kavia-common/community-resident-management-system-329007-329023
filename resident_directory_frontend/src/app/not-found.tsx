import React from "react";
import Link from "next/link";

/**
 * 404 Not Found page.
 * Displayed when the user navigates to a non-existent route.
 */

// PUBLIC_INTERFACE
/**
 * NotFound renders a user-friendly 404 error page.
 */
export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <section
        className="text-center max-w-md"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-6xl mb-4">🏢</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>
          404 – Page Not Found
        </h1>
        <p className="text-sm mb-6" style={{ color: "#64748b" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-lg text-white font-medium text-sm"
          style={{ backgroundColor: "#3b82f6" }}
        >
          Go to Home
        </Link>
      </section>
    </main>
  );
}
