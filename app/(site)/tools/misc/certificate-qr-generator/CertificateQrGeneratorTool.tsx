"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup } from "@/components/tools/ToolUI";

export default function CertificateQrGeneratorTool() {
  const [mode, setMode] = useState("details");
  const [url, setUrl] = useState("");
  const [institute, setInstitute] = useState("");
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");
  const [certId, setCertId] = useState("");
  const [date, setDate] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasQr, setHasQr] = useState(false);

  const payload =
    mode === "url"
      ? url.trim()
      : [
          institute && `Institute: ${institute}`,
          student && `Name: ${student}`,
          course && `Course: ${course}`,
          certId && `Certificate No: ${certId}`,
          date && `Issued: ${date}`,
        ]
          .filter(Boolean)
          .join("\n");

  useEffect(() => {
    let cancelled = false;
    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!payload) {
        setHasQr(false);
        return;
      }
      const QRCode = (await import("qrcode")).default;
      if (cancelled) return;
      await QRCode.toCanvas(canvas, payload, { width: 280, margin: 2 });
      setHasQr(true);
    }
    draw();
    return () => {
      cancelled = true;
    };
  }, [payload]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `certificate-qr${certId ? "-" + certId : ""}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  return (
    <ToolPageLayout
      title="Certificate Verification QR Generator"
      description="Generate a QR code for certificates — encode the certificate details or a verification URL, download the PNG and place it on the certificate."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <TabGroup
          value={mode}
          onChange={setMode}
          options={[
            { value: "details", label: "Encode certificate details" },
            { value: "url", label: "Encode verification URL" },
          ]}
        />

        {mode === "url" ? (
          <Field label="Verification URL">
            <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-institute.com/verify/CERT-0042" />
          </Field>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <Field label="Institute / organisation">
              <TextInput value={institute} onChange={(e) => setInstitute(e.target.value)} placeholder="ABC Institute" />
            </Field>
            <Field label="Student / recipient name">
              <TextInput value={student} onChange={(e) => setStudent(e.target.value)} placeholder="Ravi Kumar" />
            </Field>
            <Field label="Course / achievement">
              <TextInput value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Web Development" />
            </Field>
            <Field label="Certificate number">
              <TextInput value={certId} onChange={(e) => setCertId(e.target.value)} placeholder="CERT-2026-0042" />
            </Field>
            <Field label="Issue date">
              <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <canvas
            ref={canvasRef}
            style={{
              display: hasQr ? "inline-block" : "none",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
            }}
          />
          {hasQr && (
            <div style={{ marginTop: "1rem" }}>
              <button className="btn-primary" onClick={download}>
                Download QR (PNG)
              </button>
            </div>
          )}
        </div>

        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Tip: making the certificate itself? Use our{" "}
          <Link href="/tools/generators/certificate-maker" style={{ color: "var(--indigo)", fontWeight: 600 }}>
            Certificate Maker
          </Link>{" "}
          and add this QR to it. Everything runs in your browser — nothing is uploaded.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
