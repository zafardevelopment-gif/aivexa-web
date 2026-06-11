"use client";

import TableEditor from "@/components/admin/TableEditor";

export default function AdminPages() {
  return (
    <>
      <h1 className="admin-title">Pages</h1>
      <p className="admin-muted">
        Legal/content pages served at /&lt;slug&gt; (privacy, terms, data-deletion). Content is HTML.
      </p>
      <TableEditor
        table="aivexa_pages"
        orderBy="slug"
        allowDelete={false}
        columns={[
          { key: "slug", label: "Slug", readOnlyOnEdit: true },
          { key: "title", label: "Title" },
          { key: "subtitle", label: "Subtitle" },
          { key: "content", label: "Content (HTML)", type: "textarea" },
        ]}
      />
    </>
  );
}
