"use client";

/**
 * Admin Residents management page.
 * Allows admins to add, edit, and remove resident profiles.
 */

import React, { useState } from "react";
import { Resident, ResidentFormData } from "@/lib/types";

interface AdminResidentsPageProps {
  residents: Resident[];
  onAddResident: (data: ResidentFormData) => void;
  onUpdateResident: (id: string, data: ResidentFormData) => void;
  onDeleteResident: (id: string) => void;
}

const emptyForm: ResidentFormData = {
  name: "",
  unit: "",
  phone: "",
  email: "",
  photo_url: "",
  move_in_date: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  is_active: true,
};

// PUBLIC_INTERFACE
/**
 * AdminResidentsPage provides full CRUD functionality for resident management.
 * @param residents - Current list of residents
 * @param onAddResident - Callback to add a new resident
 * @param onUpdateResident - Callback to update an existing resident
 * @param onDeleteResident - Callback to delete a resident
 */
export default function AdminResidentsPage({
  residents,
  onAddResident,
  onUpdateResident,
  onDeleteResident,
}: AdminResidentsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResidentFormData>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredResidents = residents.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(query) ||
      r.unit.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query)
    );
  });

  const handleEdit = (resident: Resident) => {
    setFormData({
      name: resident.name,
      unit: resident.unit,
      phone: resident.phone,
      email: resident.email,
      photo_url: resident.photo_url || "",
      move_in_date: resident.move_in_date || "",
      emergency_contact_name: resident.emergency_contact_name || "",
      emergency_contact_phone: resident.emergency_contact_phone || "",
      is_active: resident.is_active,
    });
    setEditingId(resident.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateResident(editingId, formData);
    } else {
      onAddResident(formData);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = (id: string) => {
    onDeleteResident(id);
    setDeleteConfirmId(null);
  };

  const handleInputChange = (field: keyof ResidentFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Manage Residents</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Add, edit, or remove resident profiles
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <span>➕</span> Add Resident
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#111827" }}>
              {editingId ? "Edit Resident" : "Add New Resident"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="res-name" className="label">Full Name *</label>
                <input
                  id="res-name"
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="res-unit" className="label">Unit *</label>
                  <input
                    id="res-unit"
                    type="text"
                    className="input-field"
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="res-phone" className="label">Phone *</label>
                  <input
                    id="res-phone"
                    type="tel"
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="res-email" className="label">Email *</label>
                <input
                  id="res-email"
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="res-move-in" className="label">Move-in Date</label>
                <input
                  id="res-move-in"
                  type="date"
                  className="input-field"
                  value={formData.move_in_date}
                  onChange={(e) => handleInputChange("move_in_date", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="res-ec-name" className="label">Emergency Contact Name</label>
                  <input
                    id="res-ec-name"
                    type="text"
                    className="input-field"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="res-ec-phone" className="label">Emergency Contact Phone</label>
                  <input
                    id="res-ec-phone"
                    type="tel"
                    className="input-field"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="res-active"
                  type="checkbox"
                  checked={formData.is_active !== false}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="res-active" className="text-sm" style={{ color: "#111827" }}>
                  Active Resident
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingId ? "Update Resident" : "Add Resident"}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <input
          type="text"
          className="input-field"
          placeholder="🔍 Search residents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search residents"
        />
      </div>

      {/* Residents table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              <th className="text-left p-3 font-medium" style={{ color: "#64748b" }}>Resident</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell" style={{ color: "#64748b" }}>Unit</th>
              <th className="text-left p-3 font-medium hidden md:table-cell" style={{ color: "#64748b" }}>Phone</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell" style={{ color: "#64748b" }}>Email</th>
              <th className="text-left p-3 font-medium" style={{ color: "#64748b" }}>Status</th>
              <th className="text-right p-3 font-medium" style={{ color: "#64748b" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: resident.is_active ? "#3b82f6" : "#9ca3af" }}
                    >
                      {resident.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#111827" }}>{resident.name}</p>
                      <p className="text-xs sm:hidden" style={{ color: "#64748b" }}>Unit {resident.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden sm:table-cell" style={{ color: "#111827" }}>{resident.unit}</td>
                <td className="p-3 hidden md:table-cell" style={{ color: "#64748b" }}>{resident.phone}</td>
                <td className="p-3 hidden lg:table-cell" style={{ color: "#64748b" }}>{resident.email}</td>
                <td className="p-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: resident.is_active ? "#06b6d4" : "#9ca3af" }}
                  >
                    {resident.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(resident)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-sm"
                      title="Edit resident"
                    >
                      ✏️
                    </button>
                    {deleteConfirmId === resident.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(resident.id)}
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: "#EF4444" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded text-xs bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(resident.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-sm"
                        title="Delete resident"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredResidents.length === 0 && (
          <div className="text-center py-8">
            <p style={{ color: "#64748b" }}>No residents found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
