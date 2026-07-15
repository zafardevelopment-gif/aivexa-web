"use client";

import { useState } from "react";
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius, 16px)",
        padding: "1.75rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label style={{ display: "block", marginBottom: "1.1rem" }}>
      <span
        style={{
          display: "block",
          fontSize: ".85rem",
          fontWeight: 600,
          marginBottom: ".4rem",
          color: "var(--text)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: ".7rem .9rem",
        borderRadius: "10px",
        border: "1px solid var(--border-2)",
        fontSize: ".95rem",
        fontFamily: "inherit",
        ...props.style,
      }}
    />
  );
}

export function ResultBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: "1.5rem",
        background: "var(--indigo-light)",
        border: "1px solid #e0e7ff",
        borderRadius: "12px",
        padding: "1.3rem 1.5rem",
      }}
    >
      {children}
    </div>
  );
}

export function ResultRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: ".45rem 0",
        borderBottom: "1px dashed #c7d2fe",
        fontSize: ".92rem",
      }}
    >
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: ".7rem .9rem",
        borderRadius: "10px",
        border: "1px solid var(--border-2)",
        fontSize: ".95rem",
        fontFamily: "inherit",
        background: "#fff",
        ...props.style,
      }}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: ".7rem .9rem",
        borderRadius: "10px",
        border: "1px solid var(--border-2)",
        fontSize: ".95rem",
        fontFamily: "inherit",
        resize: "vertical",
        minHeight: "140px",
        ...props.style,
      }}
    />
  );
}

export function TabGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: ".5rem",
        marginBottom: "1.1rem",
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={active ? "btn-primary sm" : "btn-secondary sm"}
            style={{ fontWeight: 600 }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-secondary sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
