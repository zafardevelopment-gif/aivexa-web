"use client";

import TableEditor from "@/components/admin/TableEditor";

export default function AdminPdfPlans() {
  return (
    <>
      <h1 className="admin-title">PDF API Plans</h1>
      <p className="admin-muted">
        Prices are in rupees (₹). Changes show on the PDF API home, Pricing and Billing pages within a minute.
        New prices apply to new payments only — customers who already paid keep their plan until it expires.
        Keep the Plan ID as it is (free, starter, growth, pro); set Active off to hide a plan.
      </p>
      <TableEditor
        table="pdfapi_plans"
        pk="id"
        orderBy="sort_order"
        allowAdd={false}
        allowDelete={false}
        columns={[
          { key: "id", label: "Plan ID", readOnlyOnEdit: true },
          { key: "name", label: "Name" },
          { key: "price_monthly", label: "Monthly price (₹)", type: "rupees" },
          { key: "price_yearly", label: "Yearly price (₹)", type: "rupees", hint: "Total for 12 months" },
          { key: "credits", label: "PDFs per month", type: "number" },
          { key: "rate_limit_rpm", label: "Requests per minute", type: "number" },
          { key: "max_pdf_bytes", label: "Max PDF size (bytes)", type: "number", hint: "1 MB = 1048576" },
          { key: "sort_order", label: "Order", type: "number" },
          { key: "is_active", label: "Active", type: "boolean" },
          { key: "features", label: "Features", type: "lines", hint: "one per line — shown on plan cards" },
        ]}
      />
    </>
  );
}
