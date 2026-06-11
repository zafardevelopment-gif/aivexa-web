"use client";

import TableEditor from "@/components/admin/TableEditor";

export default function AdminProducts() {
  return (
    <>
      <h1 className="admin-title">Products</h1>
      <p className="admin-muted">
        Changes appear on the website within 60 seconds. Icon keys: munim, voice, hospital, camp, chat, brain, shield, check, layers, doc, users, spark.
      </p>
      <TableEditor
        table="aivexa_products"
        orderBy="sort_order"
        columns={[
          { key: "slug", label: "Slug", readOnlyOnEdit: true, hint: "URL: /products/<slug>" },
          { key: "name", label: "Name" },
          { key: "tagline", label: "Tagline" },
          { key: "badge", label: "Badge", hint: "e.g. New / Flagship — empty for none" },
          { key: "icon", label: "Icon key" },
          { key: "sort_order", label: "Order", type: "number" },
          { key: "is_active", label: "Active", type: "boolean" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "features", label: "Features", type: "lines", hint: "one per line" },
        ]}
      />
    </>
  );
}
