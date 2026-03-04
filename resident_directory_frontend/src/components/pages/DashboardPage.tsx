"use client";

/**
 * Admin Dashboard page.
 * Shows overview statistics and quick access to key features.
 */

import React from "react";
import { Resident, Announcement } from "@/lib/types";

interface DashboardPageProps {
  residents: Resident[];
  announcements: Announcement[];
  onNavigate: (path: string) => void;
}

// PUBLIC_INTERFACE
/**
 * DashboardPage displays admin overview with stats cards and quick actions.
 * @param residents - List of all residents
 * @param announcements - List of announcements
 * @param onNavigate - Navigation callback
 */
export default function DashboardPage({ residents, announcements, onNavigate }: DashboardPageProps) {
  const activeResidents = residents.filter((r) => r.is_active).length;
  const inactiveResidents = residents.filter((r) => !r.is_active).length;
  const activeAnnouncements = announcements.length;

  const stats = [
    { label: "Total Residents", value: residents.length, icon: "👥", color: "#3b82f6" },
    { label: "Active Residents", value: activeResidents, icon: "✅", color: "#06b6d4" },
    { label: "Inactive Residents", value: inactiveResidents, icon: "⏸️", color: "#64748b" },
    { label: "Announcements", value: activeAnnouncements, icon: "📢", color: "#f59e0b" },
  ];

  const quickActions = [
    { label: "Add New Resident", icon: "➕", path: "/admin/residents", color: "#3b82f6" },
    { label: "View Directory", icon: "📋", path: "/directory", color: "#06b6d4" },
    { label: "New Announcement", icon: "📢", path: "/announcements", color: "#f59e0b" },
    { label: "Import CSV", icon: "📁", path: "/admin/csv", color: "#10b981" },
    { label: "View Audit Log", icon: "📝", path: "/admin/audit-log", color: "#64748b" },
    { label: "Emergency Contacts", icon: "🚨", path: "/emergency-contacts", color: "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Welcome back! Here&apos;s an overview of your community.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#111827" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "#64748b" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#111827" }}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.path)}
              className="card flex flex-col items-center gap-2 py-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium text-center" style={{ color: "#111827" }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent announcements */}
      <div>
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#111827" }}>Recent Announcements</h2>
        {announcements.length === 0 ? (
          <div className="card text-center py-8">
            <p style={{ color: "#64748b" }}>No announcements yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{
                          backgroundColor:
                            ann.priority === "high" ? "#EF4444" :
                            ann.priority === "medium" ? "#f59e0b" : "#06b6d4",
                        }}
                      >
                        {ann.priority}
                      </span>
                      <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>
                        {ann.title}
                      </h3>
                    </div>
                    <p className="text-sm" style={{ color: "#64748b" }}>{ann.content}</p>
                    <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>
                      {new Date(ann.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
