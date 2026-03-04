"use client";

/**
 * Audit Log page for admin users.
 * Displays a chronological log of all system actions.
 */

import React, { useState, useMemo } from "react";
import { AuditLogEntry } from "@/lib/types";

interface AuditLogPageProps {
  auditLog: AuditLogEntry[];
}

// PUBLIC_INTERFACE
/**
 * AuditLogPage displays a filterable, searchable audit trail.
 * @param auditLog - List of audit log entries
 */
export default function AuditLogPage({ auditLog }: AuditLogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("");

  // Get unique action types for filter dropdown
  const actionTypes = useMemo(() => {
    const types = new Set(auditLog.map((entry) => entry.action));
    return Array.from(types).sort();
  }, [auditLog]);

  const filteredLog = useMemo(() => {
    return auditLog.filter((entry) => {
      if (filterAction && entry.action !== filterAction) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          entry.details.toLowerCase().includes(query) ||
          entry.user_name.toLowerCase().includes(query) ||
          entry.entity_type.toLowerCase().includes(query) ||
          entry.action.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [auditLog, searchQuery, filterAction]);

  const actionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return "#06b6d4";
      case "UPDATE": return "#3b82f6";
      case "DELETE": return "#EF4444";
      case "DEACTIVATE": return "#f59e0b";
      case "IMPORT": return "#10b981";
      default: return "#64748b";
    }
  };

  const actionIcon = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return "➕";
      case "UPDATE": return "✏️";
      case "DELETE": return "🗑️";
      case "DEACTIVATE": return "⏸️";
      case "IMPORT": return "📥";
      default: return "📝";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Audit Log</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Track all changes and actions in the system
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Search audit log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search audit log"
            />
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              aria-label="Filter by action type"
            >
              <option value="">All Actions</option>
              {actionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>
          Showing {filteredLog.length} of {auditLog.length} entries
        </p>
      </div>

      {/* Log entries */}
      {filteredLog.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-3xl mb-2">📝</p>
          <p className="font-medium" style={{ color: "#111827" }}>No audit entries found</p>
          <p className="text-sm" style={{ color: "#64748b" }}>
            {auditLog.length === 0
              ? "The audit log is empty."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLog.map((entry) => (
            <div key={entry.id} className="card flex items-start gap-3 py-3">
              {/* Action icon */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
                style={{ backgroundColor: `${actionColor(entry.action)}15` }}
              >
                {actionIcon(entry.action)}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: actionColor(entry.action) }}
                  >
                    {entry.action}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100" style={{ color: "#64748b" }}>
                    {entry.entity_type}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#111827" }}>{entry.details}</p>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "#9ca3af" }}>
                  <span>By {entry.user_name}</span>
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
