"use client";

/**
 * Announcements page.
 * Displays community announcements. Admins can create new ones.
 */

import React, { useState } from "react";
import { Announcement, AnnouncementFormData } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface AnnouncementsPageProps {
  announcements: Announcement[];
  onAddAnnouncement: (data: AnnouncementFormData) => void;
  onDeleteAnnouncement: (id: string) => void;
}

// PUBLIC_INTERFACE
/**
 * AnnouncementsPage displays announcements and allows admins to manage them.
 * @param announcements - List of announcements
 * @param onAddAnnouncement - Callback to create a new announcement
 * @param onDeleteAnnouncement - Callback to delete an announcement
 */
export default function AnnouncementsPage({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
}: AnnouncementsPageProps) {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    content: "",
    priority: "medium",
    expires_at: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnnouncement(formData);
    setFormData({ title: "", content: "", priority: "medium", expires_at: "" });
    setShowForm(false);
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#EF4444";
      case "medium": return "#f59e0b";
      default: return "#06b6d4";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Announcements</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Community news and updates
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <span>📢</span> New Announcement
          </button>
        )}
      </div>

      {/* Create announcement modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#111827" }}>
              New Announcement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="ann-title" className="label">Title *</label>
                <input
                  id="ann-title"
                  type="text"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label htmlFor="ann-content" className="label">Content *</label>
                <textarea
                  id="ann-content"
                  className="input-field"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ann-priority" className="label">Priority</label>
                  <select
                    id="ann-priority"
                    className="input-field"
                    value={formData.priority}
                    onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as AnnouncementFormData["priority"] }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ann-expires" className="label">Expires At</label>
                  <input
                    id="ann-expires"
                    type="date"
                    className="input-field"
                    value={formData.expires_at}
                    onChange={(e) => setFormData((p) => ({ ...p, expires_at: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1">
                  Post Announcement
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements list */}
      {announcements.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-3xl mb-2">📢</p>
          <p className="font-medium" style={{ color: "#111827" }}>No announcements</p>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Check back later for community updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: priorityColor(ann.priority) }}
                    >
                      {ann.priority.toUpperCase()}
                    </span>
                    <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
                      {ann.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#9ca3af" }}>
                    <span>By {ann.created_by}</span>
                    <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                    {ann.expires_at && (
                      <span>Expires: {new Date(ann.expires_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-sm shrink-0"
                    title="Delete announcement"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
