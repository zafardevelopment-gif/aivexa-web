"use client";

import TableEditor from "@/components/admin/TableEditor";

export default function AdminHomepage() {
  return (
    <>
      <h1 className="admin-title">Homepage Content</h1>
      <p className="admin-muted">
        Sections of the homepage: how-it-works steps, statistic cards and testimonials.
      </p>
      <TableEditor
        title="How It Works — Steps"
        table="aivexa_steps"
        orderBy="step_no"
        columns={[
          { key: "step_no", label: "Step #", type: "number" },
          { key: "title", label: "Title" },
          { key: "icon", label: "Icon key" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
      />
      <TableEditor
        title="Statistic Cards (Why AIVEXA)"
        table="aivexa_stats"
        orderBy="sort_order"
        columns={[
          { key: "value", label: "Value", hint: "e.g. 3× / 60%" },
          { key: "label", label: "Label" },
          { key: "sort_order", label: "Order", type: "number" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
      />
      <TableEditor
        title="Testimonials"
        table="aivexa_testimonials"
        orderBy="sort_order"
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "company", label: "Company" },
          { key: "sort_order", label: "Order", type: "number" },
          { key: "quote", label: "Quote", type: "textarea" },
        ]}
      />
    </>
  );
}
