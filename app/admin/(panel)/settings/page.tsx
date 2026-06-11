"use client";

import TableEditor from "@/components/admin/TableEditor";

export default function AdminSettings() {
  return (
    <>
      <h1 className="admin-title">Site Settings</h1>
      <p className="admin-muted">
        Site name, hero text, contact and legal details used across the website.
      </p>
      <TableEditor
        table="aivexa_settings"
        pk="setting_key"
        allowDelete={false}
        columns={[
          { key: "setting_key", label: "Key", readOnlyOnEdit: true },
          { key: "setting_value", label: "Value", type: "textarea" },
        ]}
      />
    </>
  );
}
