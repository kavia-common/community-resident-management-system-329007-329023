import type { Metadata } from "next";
import "./globals.css";

/**
 * Root layout for the Resident Directory Management System.
 * Wraps the entire application with the authentication provider.
 */

export const metadata: Metadata = {
  title: "Resident Hub - Community Directory",
  description: "Mobile-responsive web application for managing residents in a building or community",
};

// PUBLIC_INTERFACE
/**
 * RootLayout provides the HTML shell and global providers for the app.
 * @param children - Page content rendered within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
