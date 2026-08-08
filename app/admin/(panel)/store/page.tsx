"use client";

import TableEditor from "@/components/admin/TableEditor";

export default function AdminStore() {
  return (
    <>
      <h1 className="admin-title">Digital Store</h1>
      <p className="admin-muted">
        Manage your digital products (PDFs, planners, templates).{" "}
        <strong>Price</strong> and <strong>Original Price</strong> are in paise — ₹99 = 9900.{" "}
        <strong>File URL</strong> is the download link delivered after payment (use a signed/private URL).{" "}
        <strong>Featured</strong> = shown on home page. Changes live within 60 seconds.
      </p>
      <TableEditor
        table="aivexa_digital_products"
        orderBy="sort_order"
        columns={[
          { key: "slug", label: "Slug", readOnlyOnEdit: true, hint: "URL: /store/<slug>" },
          { key: "name", label: "Name" },
          { key: "tagline", label: "Tagline", hint: "Short one-liner shown on cards" },
          { key: "category", label: "Category", hint: "e.g. PDF, Planner, Template" },
          { key: "price", label: "Price (paise)", type: "number", hint: "₹99 → 9900" },
          { key: "original_price", label: "MRP (paise)", type: "number", hint: "Strike-through price, 0 = hide" },
          { key: "preview_image", label: "Preview Image", type: "image", hint: "Upload or paste URL — shown as product thumbnail" },
          { key: "file_url", label: "Download File URL", hint: "Secure/signed URL — sent after payment" },
          { key: "sort_order", label: "Order", type: "number" },
          { key: "is_featured", label: "Featured (Home)", type: "boolean" },
          { key: "is_active", label: "Active", type: "boolean" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
      />

      <div style={{ marginTop: "3rem" }}>
        <h2 className="admin-title" style={{ fontSize: "1.1rem" }}>Orders</h2>
        <p className="admin-muted">
          All Razorpay orders are recorded here. Status: <code>created</code> → <code>paid</code> (after successful payment) → <code>failed</code>.
        </p>
        <TableEditor
          table="aivexa_orders"
          orderBy="created_at"
          allowAdd={false}
          allowDelete={false}
          columns={[
            { key: "id", label: "ID" },
            { key: "buyer_name", label: "Buyer Name" },
            { key: "buyer_email", label: "Email" },
            { key: "buyer_phone", label: "Phone" },
            { key: "product_slug", label: "Product" },
            { key: "amount_paise", label: "Amount (paise)" },
            { key: "status", label: "Status" },
            { key: "razorpay_order_id", label: "Razorpay Order ID" },
            { key: "razorpay_payment_id", label: "Payment ID" },
            { key: "created_at", label: "Date" },
          ]}
        />
      </div>
    </>
  );
}
