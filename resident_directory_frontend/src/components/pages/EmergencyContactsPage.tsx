"use client";

/**
 * Emergency contacts page.
 * Displays important emergency contact information for the building.
 * Admins can manage contacts.
 */

import React, { useState } from "react";
import { EmergencyContact } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface EmergencyContactsPageProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, "id">) => void;
  onDeleteContact: (id: string) => void;
}

// PUBLIC_INTERFACE
/**
 * EmergencyContactsPage displays and manages emergency contact information.
 * @param contacts - List of emergency contacts
 * @param onAddContact - Callback to add a new emergency contact
 * @param onDeleteContact - Callback to delete an emergency contact
 */
export default function EmergencyContactsPage({
  contacts,
  onAddContact,
  onDeleteContact,
}: EmergencyContactsPageProps) {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact(formData);
    setFormData({ name: "", phone: "", type: "", description: "" });
    setShowForm(false);
  };

  // Group contacts by type
  const groupedContacts = contacts.reduce<Record<string, EmergencyContact[]>>((acc, contact) => {
    const type = contact.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(contact);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Emergency Contacts</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Important numbers for emergencies and building services
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <span>➕</span> Add Contact
          </button>
        )}
      </div>

      {/* Emergency banner */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
      >
        <span className="text-2xl">🚨</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: "#991B1B" }}>
            In case of life-threatening emergency, call 911 immediately
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#B91C1C" }}>
            Use the contacts below for building-specific emergencies and services
          </p>
        </div>
      </div>

      {/* Add contact modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#111827" }}>
              Add Emergency Contact
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="ec-name" className="label">Name *</label>
                <input
                  id="ec-name"
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ec-phone" className="label">Phone *</label>
                  <input
                    id="ec-phone"
                    type="tel"
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ec-type" className="label">Type *</label>
                  <input
                    id="ec-type"
                    type="text"
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                    placeholder="e.g., Maintenance"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="ec-desc" className="label">Description</label>
                <input
                  id="ec-desc"
                  type="text"
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Availability, notes, etc."
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Contact
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts grouped by type */}
      {Object.entries(groupedContacts).map(([type, typeContacts]) => (
        <div key={type}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
            {type}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {typeContacts.map((contact) => (
              <div key={contact.id} className="card flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shrink-0"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  📞
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>
                    {contact.name}
                  </h3>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#3b82f6" }}
                  >
                    {contact.phone}
                  </a>
                  {contact.description && (
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                      {contact.description}
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="p-1 rounded hover:bg-red-50 text-sm shrink-0"
                    title="Remove contact"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {contacts.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-3xl mb-2">📞</p>
          <p className="font-medium" style={{ color: "#111827" }}>No emergency contacts</p>
          <p className="text-sm" style={{ color: "#64748b" }}>
            {isAdmin ? "Add emergency contacts for your community." : "Contact your building admin."}
          </p>
        </div>
      )}
    </div>
  );
}
