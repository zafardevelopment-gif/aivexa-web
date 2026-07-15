"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";

export default function FileDropzone({
  accept = "image/*",
  multiple = false,
  onFiles,
  label = "Drag & drop an image here, or click to browse",
}: {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    onFiles(multiple ? files : files.slice(0, 1));
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragOver ? "var(--indigo, #4f46e5)" : "var(--border-2, #cbd5e1)"}`,
        background: dragOver ? "var(--indigo-light, #eef2ff)" : "#fafafa",
        borderRadius: "12px",
        padding: "2.2rem 1.5rem",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color .15s, background .15s",
        marginBottom: "1.2rem",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div style={{ fontSize: "1.6rem", marginBottom: ".4rem" }} aria-hidden>
        &#8682;
      </div>
      <div style={{ fontWeight: 600, marginBottom: ".35rem" }}>{label}</div>
      <div style={{ fontSize: ".82rem", color: "var(--muted, #64748b)" }}>
        Your files never leave your browser — everything is processed locally.
      </div>
    </div>
  );
}
