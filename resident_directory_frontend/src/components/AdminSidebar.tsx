"use client";

/**
 * Admin sidebar navigation component.
 * Displays a vertical sidebar with navigation links for admin users.
 * Includes mobile responsive hamburger menu.
 */

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Directory", href: "/directory", icon: "📋" },
  { label: "Residents", href: "/admin/residents", icon: "👥" },
  { label: "Announcements", href: "/announcements", icon: "📢" },
  { label: "Emergency Contacts", href: "/emergency-contacts", icon: "🚨" },
  { label: "CSV Import/Export", href: "/admin/csv", icon: "📁" },
  { label: "Audit Log", href: "/admin/audit-log", icon: "📝" },
];

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

// PUBLIC_INTERFACE
/**
 * AdminSidebar renders a vertical sidebar navigation for admin users.
 * @param currentPath - Currently active route path
 * @param onNavigate - Callback when a nav item is clicked
 */
export default function AdminSidebar({ currentPath, onNavigate }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (href: string) => {
    onNavigate(href);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-bold" style={{ color: "#3b82f6" }}>
            🏢 Resident Hub
          </h1>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNav(item.href)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${isActive
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                    style={isActive ? { backgroundColor: "#3b82f6" } : undefined}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: "#3b82f6" }}
            >
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs" style={{ color: "#64748b" }}>Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
