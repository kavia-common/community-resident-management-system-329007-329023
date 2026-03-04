"use client";

/**
 * Top navigation bar for resident (non-admin) users.
 * Horizontal nav with links to directory, announcements, emergency contacts.
 */

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Directory", href: "/directory", icon: "📋" },
  { label: "Announcements", href: "/announcements", icon: "📢" },
  { label: "Emergency Contacts", href: "/emergency-contacts", icon: "🚨" },
];

interface ResidentTopNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

// PUBLIC_INTERFACE
/**
 * ResidentTopNav renders a horizontal top navigation bar for resident users.
 * @param currentPath - Currently active route path
 * @param onNavigate - Callback when a nav item is clicked
 */
export default function ResidentTopNav({ currentPath, onNavigate }: ResidentTopNavProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (href: string) => {
    onNavigate(href);
    setMobileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav("/directory")}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold" style={{ color: "#3b82f6" }}>
              🏢 Resident Hub
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  style={isActive ? { backgroundColor: "#3b82f6" } : undefined}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: "#06b6d4" }}
              >
                {user?.name?.charAt(0) || "R"}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors
                    ${isActive
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  style={isActive ? { backgroundColor: "#3b82f6" } : undefined}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: "#06b6d4" }}
                >
                  {user?.name?.charAt(0) || "R"}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
