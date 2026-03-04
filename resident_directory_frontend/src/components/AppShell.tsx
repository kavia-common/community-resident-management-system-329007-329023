"use client";

/**
 * Main application shell component.
 * Handles client-side routing, role-based navigation layout,
 * and manages application state with mock data fallbacks.
 */

import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import ResidentTopNav from "@/components/ResidentTopNav";
import LoginPage from "@/components/pages/LoginPage";
import RegisterPage from "@/components/pages/RegisterPage";
import DashboardPage from "@/components/pages/DashboardPage";
import DirectoryPage from "@/components/pages/DirectoryPage";
import AdminResidentsPage from "@/components/pages/AdminResidentsPage";
import AnnouncementsPage from "@/components/pages/AnnouncementsPage";
import EmergencyContactsPage from "@/components/pages/EmergencyContactsPage";
import CsvPage from "@/components/pages/CsvPage";
import AuditLogPage from "@/components/pages/AuditLogPage";
import {
  Resident,
  ResidentFormData,
  Announcement,
  AnnouncementFormData,
  EmergencyContact,
  AuditLogEntry,
} from "@/lib/types";
import {
  mockResidents,
  mockAnnouncements,
  mockEmergencyContacts,
  mockAuditLog,
} from "@/lib/mockData";

// PUBLIC_INTERFACE
/**
 * AppShell is the root UI component that manages navigation, layout,
 * and application state. It renders role-based layouts (admin sidebar vs resident top nav)
 * and handles client-side page routing.
 */
export default function AppShell() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  // Client-side routing
  const [currentPath, setCurrentPath] = useState("/");
  const [authView, setAuthView] = useState<"login" | "register">("login");

  // Application state (using mock data as initial state / fallback)
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog);

  // Navigation handler
  const handleNavigate = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  // Helper to add an audit log entry
  const addAuditEntry = useCallback((action: string, entityType: string, entityId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: String(Date.now()),
      action,
      entity_type: entityType,
      entity_id: entityId,
      user_id: "1",
      user_name: "Admin User",
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLog((prev) => [entry, ...prev]);
  }, []);

  // Resident CRUD handlers
  const handleAddResident = useCallback((data: ResidentFormData) => {
    const newResident: Resident = {
      id: String(Date.now()),
      ...data,
      is_active: data.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setResidents((prev) => [...prev, newResident]);
    addAuditEntry("CREATE", "resident", newResident.id, `Created resident profile for ${data.name} (Unit ${data.unit})`);
  }, [addAuditEntry]);

  const handleUpdateResident = useCallback((id: string, data: ResidentFormData) => {
    setResidents((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...data, is_active: data.is_active !== false, updated_at: new Date().toISOString() }
          : r
      )
    );
    addAuditEntry("UPDATE", "resident", id, `Updated resident profile for ${data.name} (Unit ${data.unit})`);
  }, [addAuditEntry]);

  const handleDeleteResident = useCallback((id: string) => {
    const resident = residents.find((r) => r.id === id);
    setResidents((prev) => prev.filter((r) => r.id !== id));
    addAuditEntry("DELETE", "resident", id, `Removed resident ${resident?.name || "Unknown"} (Unit ${resident?.unit || "?"})`);
  }, [residents, addAuditEntry]);

  const handleImportResidents = useCallback((importedData: ResidentFormData[]) => {
    const newResidents: Resident[] = importedData.map((data, index) => ({
      id: String(Date.now() + index),
      ...data,
      is_active: data.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    setResidents((prev) => [...prev, ...newResidents]);
    addAuditEntry("IMPORT", "resident", `batch-${Date.now()}`, `Imported ${importedData.length} residents via CSV`);
  }, [addAuditEntry]);

  // Announcement handlers
  const handleAddAnnouncement = useCallback((data: AnnouncementFormData) => {
    const newAnn: Announcement = {
      id: String(Date.now()),
      ...data,
      created_by: "Admin User",
      created_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditEntry("CREATE", "announcement", newAnn.id, `Created announcement: ${data.title}`);
  }, [addAuditEntry]);

  const handleDeleteAnnouncement = useCallback((id: string) => {
    const ann = announcements.find((a) => a.id === id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addAuditEntry("DELETE", "announcement", id, `Deleted announcement: ${ann?.title || "Unknown"}`);
  }, [announcements, addAuditEntry]);

  // Emergency contact handlers
  const handleAddEmergencyContact = useCallback((data: Omit<EmergencyContact, "id">) => {
    const newContact: EmergencyContact = {
      id: String(Date.now()),
      ...data,
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
    addAuditEntry("CREATE", "emergency_contact", newContact.id, `Added emergency contact: ${data.name}`);
  }, [addAuditEntry]);

  const handleDeleteEmergencyContact = useCallback((id: string) => {
    const contact = emergencyContacts.find((c) => c.id === id);
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
    addAuditEntry("DELETE", "emergency_contact", id, `Removed emergency contact: ${contact?.name || "Unknown"}`);
  }, [emergencyContacts, addAuditEntry]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f9fafb" }}>
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: "#3b82f6", borderWidth: "3px" }} />
          <p className="mt-3 text-sm" style={{ color: "#64748b" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === "register") {
      return <RegisterPage onSwitchToLogin={() => setAuthView("login")} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView("register")} />;
  }

  // Render the current page based on path
  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return isAdmin ? (
          <DashboardPage
            residents={residents}
            announcements={announcements}
            onNavigate={handleNavigate}
          />
        ) : (
          <DirectoryPage residents={residents} />
        );

      case "/directory":
        return <DirectoryPage residents={residents} />;

      case "/admin/residents":
        return isAdmin ? (
          <AdminResidentsPage
            residents={residents}
            onAddResident={handleAddResident}
            onUpdateResident={handleUpdateResident}
            onDeleteResident={handleDeleteResident}
          />
        ) : (
          <DirectoryPage residents={residents} />
        );

      case "/announcements":
        return (
          <AnnouncementsPage
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );

      case "/emergency-contacts":
        return (
          <EmergencyContactsPage
            contacts={emergencyContacts}
            onAddContact={handleAddEmergencyContact}
            onDeleteContact={handleDeleteEmergencyContact}
          />
        );

      case "/admin/csv":
        return isAdmin ? (
          <CsvPage
            residents={residents}
            onImportResidents={handleImportResidents}
          />
        ) : (
          <DirectoryPage residents={residents} />
        );

      case "/admin/audit-log":
        return isAdmin ? (
          <AuditLogPage auditLog={auditLog} />
        ) : (
          <DirectoryPage residents={residents} />
        );

      default:
        return <DirectoryPage residents={residents} />;
    }
  };

  // Admin layout: sidebar + content
  if (isAdmin) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: "#f9fafb" }}>
        <AdminSidebar currentPath={currentPath} onNavigate={handleNavigate} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-0 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    );
  }

  // Resident layout: top nav + content
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <ResidentTopNav currentPath={currentPath} onNavigate={handleNavigate} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
