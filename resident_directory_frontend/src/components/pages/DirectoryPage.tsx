"use client";

/**
 * Searchable resident directory page.
 * Allows searching and filtering of residents by name, unit, phone, or email.
 */

import React, { useState, useMemo } from "react";
import { Resident } from "@/lib/types";

interface DirectoryPageProps {
  residents: Resident[];
}

// PUBLIC_INTERFACE
/**
 * DirectoryPage displays a searchable, filterable list of residents.
 * @param residents - List of all residents to display
 */
export default function DirectoryPage({ residents }: DirectoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      // Filter by active status
      if (!showInactive && !resident.is_active) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          resident.name.toLowerCase().includes(query) ||
          resident.unit.toLowerCase().includes(query) ||
          resident.phone.toLowerCase().includes(query) ||
          resident.email.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [residents, searchQuery, showInactive]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Resident Directory</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Search and browse community residents
        </p>
      </div>

      {/* Search and filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Search by name, unit, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search residents"
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded"
            />
            <span style={{ color: "#64748b" }}>Show inactive</span>
          </label>
        </div>
        <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>
          Showing {filteredResidents.length} of {residents.length} residents
        </p>
      </div>

      {/* Residents grid */}
      {filteredResidents.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-lg mb-2">🔍</p>
          <p className="font-medium" style={{ color: "#111827" }}>No residents found</p>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResidents.map((resident) => (
            <div key={resident.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: resident.is_active ? "#3b82f6" : "#9ca3af" }}
                >
                  {resident.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
                      {resident.name}
                    </h3>
                    {!resident.is_active && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium mt-0.5" style={{ color: "#3b82f6" }}>
                    Unit {resident.unit}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
                  <span>📞</span>
                  <a href={`tel:${resident.phone}`} className="hover:underline">{resident.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
                  <span>✉️</span>
                  <a href={`mailto:${resident.email}`} className="hover:underline truncate">{resident.email}</a>
                </div>
                {resident.move_in_date && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#9ca3af" }}>
                    <span>📅</span>
                    <span>Since {new Date(resident.move_in_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
