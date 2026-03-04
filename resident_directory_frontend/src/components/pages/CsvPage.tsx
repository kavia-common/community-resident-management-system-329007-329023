"use client";

/**
 * CSV Import/Export page for admin users.
 * Allows importing residents from CSV and exporting current residents to CSV.
 */

import React, { useState, useRef } from "react";
import { Resident, ResidentFormData } from "@/lib/types";

interface CsvPageProps {
  residents: Resident[];
  onImportResidents: (residents: ResidentFormData[]) => void;
}

// PUBLIC_INTERFACE
/**
 * CsvPage provides CSV import and export functionality for resident data.
 * @param residents - Current list of residents for export
 * @param onImportResidents - Callback when residents are imported from CSV
 */
export default function CsvPage({ residents, onImportResidents }: CsvPageProps) {
  const [importPreview, setImportPreview] = useState<ResidentFormData[]>([]);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Parse a CSV string into an array of ResidentFormData objects.
   */
  const parseCSV = (text: string): ResidentFormData[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));

    // Validate required headers
    const requiredHeaders = ["name", "unit", "phone", "email"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
    }

    const dataRows = lines.slice(1);
    return dataRows.map((line, index) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

      if (values.length !== headers.length) {
        throw new Error(`Row ${index + 2} has ${values.length} columns, expected ${headers.length}`);
      }

      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || "";
      });

      return {
        name: row["name"] || "",
        unit: row["unit"] || "",
        phone: row["phone"] || "",
        email: row["email"] || "",
        move_in_date: row["move_in_date"] || row["move-in-date"] || "",
        emergency_contact_name: row["emergency_contact_name"] || row["emergency-contact-name"] || "",
        emergency_contact_phone: row["emergency_contact_phone"] || row["emergency-contact-phone"] || "",
        is_active: row["is_active"] !== "false",
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    setImportSuccess("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setImportPreview(parsed);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Failed to parse CSV");
        setImportPreview([]);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (importPreview.length === 0) return;
    onImportResidents(importPreview);
    setImportSuccess(`Successfully imported ${importPreview.length} residents!`);
    setImportPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    const headers = ["name", "unit", "phone", "email", "move_in_date", "emergency_contact_name", "emergency_contact_phone", "is_active"];
    const csvLines = [
      headers.join(","),
      ...residents.map((r) =>
        headers.map((h) => {
          const value = String(r[h as keyof Resident] ?? "");
          // Escape commas and quotes in values
          return value.includes(",") || value.includes('"')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(",")
      ),
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `residents_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>CSV Import / Export</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Bulk import residents from CSV or export current data
        </p>
      </div>

      {/* Export section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>
          📤 Export Residents
        </h2>
        <p className="text-sm mb-4" style={{ color: "#64748b" }}>
          Download all {residents.length} residents as a CSV file.
        </p>
        <button
          onClick={handleExport}
          className="btn-success flex items-center gap-2"
          disabled={residents.length === 0}
        >
          <span>📥</span> Download CSV
        </button>
      </div>

      {/* Import section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>
          📥 Import Residents
        </h2>
        <p className="text-sm mb-2" style={{ color: "#64748b" }}>
          Upload a CSV file with resident data. Required columns: name, unit, phone, email.
        </p>
        <p className="text-xs mb-4 p-2 rounded" style={{ backgroundColor: "#f0f9ff", color: "#3b82f6" }}>
          Optional columns: move_in_date, emergency_contact_name, emergency_contact_phone, is_active
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {importError && (
          <div className="mt-3 p-3 rounded-lg text-sm text-white" style={{ backgroundColor: "#EF4444" }}>
            {importError}
          </div>
        )}

        {importSuccess && (
          <div className="mt-3 p-3 rounded-lg text-sm text-white" style={{ backgroundColor: "#06b6d4" }}>
            {importSuccess}
          </div>
        )}

        {/* Import preview */}
        {importPreview.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>
                Preview ({importPreview.length} residents)
              </h3>
              <button onClick={handleImport} className="btn-primary text-sm">
                Import All
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb" }}>
                    <th className="text-left p-2 font-medium" style={{ color: "#64748b" }}>Name</th>
                    <th className="text-left p-2 font-medium" style={{ color: "#64748b" }}>Unit</th>
                    <th className="text-left p-2 font-medium" style={{ color: "#64748b" }}>Phone</th>
                    <th className="text-left p-2 font-medium" style={{ color: "#64748b" }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.slice(0, 10).map((r, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="p-2" style={{ color: "#111827" }}>{r.name}</td>
                      <td className="p-2" style={{ color: "#111827" }}>{r.unit}</td>
                      <td className="p-2" style={{ color: "#64748b" }}>{r.phone}</td>
                      <td className="p-2" style={{ color: "#64748b" }}>{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importPreview.length > 10 && (
                <p className="p-2 text-xs text-center" style={{ color: "#9ca3af" }}>
                  ...and {importPreview.length - 10} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Template download */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>
          📋 CSV Template
        </h2>
        <p className="text-sm mb-3" style={{ color: "#64748b" }}>
          Download a blank template to fill in with resident data.
        </p>
        <button
          onClick={() => {
            const template = "name,unit,phone,email,move_in_date,emergency_contact_name,emergency_contact_phone,is_active\n";
            const blob = new Blob([template], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "residents_template.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <span>📄</span> Download Template
        </button>
      </div>
    </div>
  );
}
