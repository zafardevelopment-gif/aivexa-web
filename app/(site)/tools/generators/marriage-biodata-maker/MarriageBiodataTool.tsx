"use client";

import { useEffect, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  SelectInput,
  TabGroup,
} from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";

type Biodata = {
  name: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  complexion: string;
  religion: string;
  caste: string;
  motherTongue: string;
  education: string;
  profession: string;
  income: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  expectations: string;
  horoscopeEnabled: boolean;
  rashi: string;
  nakshatra: string;
  manglik: string;
};

const EMPTY: Biodata = {
  name: "",
  dob: "",
  birthTime: "",
  birthPlace: "",
  height: "",
  complexion: "",
  religion: "",
  caste: "",
  motherTongue: "",
  education: "",
  profession: "",
  income: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  siblings: "",
  familyType: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
  expectations: "",
  horoscopeEnabled: false,
  rashi: "",
  nakshatra: "",
  manglik: "",
};

const LS_KEY = "aivexa-biodata-maker-v1";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "1rem",
        fontWeight: 700,
        margin: "1.4rem 0 .8rem",
        paddingBottom: ".35rem",
        borderBottom: "2px solid var(--indigo-light, #eef2ff)",
      }}
    >
      {children}
    </h3>
  );
}

export default function MarriageBiodataTool() {
  const [d, setD] = useState<Biodata>(EMPTY);
  const [template, setTemplate] = useState("traditional");
  const [photo, setPhoto] = useState<string | null>(null); // dataURL
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setD({ ...EMPTY, ...(JSON.parse(raw) as Partial<Biodata>) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(d));
    } catch {
      /* ignore */
    }
  }, [d, loaded]);

  function set<K extends keyof Biodata>(k: K, v: Biodata[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  function onPhoto(files: File[]) {
    const f = files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  }

  const canDownload = d.name.trim().length > 0;

  async function downloadPdf() {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210;
      const H = 297;
      const traditional = template === "traditional";
      const M = 20;
      const maroon: [number, number, number] = traditional ? [128, 32, 32] : [79, 70, 229];

      let pageNum = 1;
      function drawBorder() {
        if (traditional) {
          doc.setDrawColor(...maroon);
          doc.setLineWidth(1.2);
          doc.rect(8, 8, W - 16, H - 16);
          doc.setLineWidth(0.35);
          doc.rect(11, 11, W - 22, H - 22);
          // corner accents
          doc.setLineWidth(0.6);
          const c = 10;
          for (const [cx, cy, dx, dy] of [
            [11, 11, 1, 1],
            [W - 11, 11, -1, 1],
            [11, H - 11, 1, -1],
            [W - 11, H - 11, -1, -1],
          ] as const) {
            doc.line(cx, cy + dy * c, cx + dx * c, cy);
          }
        } else {
          doc.setFillColor(...maroon);
          doc.rect(0, 0, W, 6, "F");
          doc.rect(0, H - 6, W, 6, "F");
        }
      }

      let y = 0;
      function newPage() {
        doc.addPage();
        pageNum++;
        drawBorder();
        y = traditional ? 24 : 22;
      }
      function ensure(space: number) {
        if (y + space > H - (traditional ? 20 : 16)) newPage();
      }

      drawBorder();
      y = traditional ? 26 : 24;

      // Title
      if (traditional) {
        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...maroon);
        doc.text("|| Shree Ganeshaya Namah ||", W / 2, y, { align: "center" });
        y += 9;
        doc.setFontSize(19);
        doc.text("MARRIAGE BIODATA", W / 2, y, { align: "center" });
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(19);
        doc.setTextColor(...maroon);
        doc.text("MARRIAGE BIODATA", W / 2, y, { align: "center" });
      }
      y += 4;
      doc.setDrawColor(...maroon);
      doc.setLineWidth(0.4);
      doc.line(W / 2 - 30, y, W / 2 + 30, y);
      y += 9;

      // Photo
      if (photo) {
        const pw = 38;
        const ph = 46;
        try {
          const fmt = photo.startsWith("data:image/png") ? "PNG" : "JPEG";
          doc.addImage(photo, fmt, W / 2 - pw / 2, y, pw, ph);
          doc.setDrawColor(...maroon);
          doc.setLineWidth(0.5);
          doc.rect(W / 2 - pw / 2, y, pw, ph);
          y += ph + 8;
        } catch {
          /* unsupported image format — skip */
        }
      }

      // Name centered
      doc.setFont(traditional ? "times" : "helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(30, 30, 30);
      doc.text(d.name.trim(), W / 2, y, { align: "center" });
      y += 10;

      const labelW = 52;
      function sectionTitle(t: string) {
        ensure(16);
        y += 3;
        doc.setFont(traditional ? "times" : "helvetica", "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(...maroon);
        doc.text(t, M, y);
        y += 1.8;
        doc.setDrawColor(...maroon);
        doc.setLineWidth(0.3);
        doc.line(M, y, W - M, y);
        y += 6;
      }
      function row(label: string, value: string) {
        if (!value.trim()) return;
        doc.setFont(traditional ? "times" : "helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(60, 60, 60);
        const vLines = doc.splitTextToSize(value.trim(), W - M * 2 - labelW - 4) as string[];
        ensure(vLines.length * 5 + 3);
        doc.text(label, M, y);
        doc.setFont(traditional ? "times" : "helvetica", "normal");
        doc.setTextColor(25, 25, 25);
        doc.text(":", M + labelW - 3, y);
        for (let i = 0; i < vLines.length; i++) {
          doc.text(vLines[i], M + labelW + 1, y);
          y += 5;
        }
        y += 0.8;
      }

      sectionTitle("Personal Details");
      row("Date of Birth", d.dob);
      if (d.horoscopeEnabled) {
        row("Time of Birth", d.birthTime);
        row("Place of Birth", d.birthPlace);
      }
      row("Height", d.height);
      row("Complexion", d.complexion);
      row("Religion", d.religion);
      row("Caste / Community", d.caste);
      row("Mother Tongue", d.motherTongue);
      row("Education", d.education);
      row("Profession", d.profession);
      row("Annual Income", d.income);

      if (d.horoscopeEnabled && (d.rashi || d.nakshatra || d.manglik)) {
        sectionTitle("Horoscope Details");
        row("Rashi", d.rashi);
        row("Nakshatra", d.nakshatra);
        row("Manglik", d.manglik);
      }

      sectionTitle("Family Details");
      row("Father's Name", d.fatherName);
      row("Father's Occupation", d.fatherOccupation);
      row("Mother's Name", d.motherName);
      row("Mother's Occupation", d.motherOccupation);
      row("Siblings", d.siblings);
      row("Family Type", d.familyType);

      if (d.expectations.trim()) {
        sectionTitle("Partner Expectations");
        doc.setFont(traditional ? "times" : "helvetica", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(25, 25, 25);
        const lines = doc.splitTextToSize(d.expectations.trim(), W - M * 2) as string[];
        for (const line of lines) {
          ensure(6);
          doc.text(line, M, y);
          y += 5;
        }
      }

      sectionTitle("Contact Details");
      row("Phone", d.contactPhone);
      row("Email", d.contactEmail);
      row("Address", d.address);

      doc.save((d.name.trim().replace(/\s+/g, "-") || "biodata") + "-biodata.pdf");
    } finally {
      setBusy(false);
    }
  }

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0 1rem",
  };

  return (
    <ToolPageLayout
      title="Marriage Biodata Maker"
      description="Create an elegant Indian matrimonial biodata as a PDF — traditional or modern template, optional photo and horoscope section. 100% private, in your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <SectionHeading>Personal Details</SectionHeading>
        <div style={rowStyle}>
          <Field label="Full Name *">
            <TextInput value={d.name} placeholder="e.g. Rahul Verma" onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Date of Birth">
            <TextInput value={d.dob} placeholder="e.g. 15 August 1996" onChange={(e) => set("dob", e.target.value)} />
          </Field>
          <Field label="Height">
            <TextInput value={d.height} placeholder={'e.g. 5\'8"'} onChange={(e) => set("height", e.target.value)} />
          </Field>
          <Field label="Complexion (optional)">
            <TextInput value={d.complexion} placeholder="e.g. Fair" onChange={(e) => set("complexion", e.target.value)} />
          </Field>
          <Field label="Religion">
            <TextInput value={d.religion} placeholder="e.g. Hindu" onChange={(e) => set("religion", e.target.value)} />
          </Field>
          <Field label="Caste / Community (optional)">
            <TextInput value={d.caste} onChange={(e) => set("caste", e.target.value)} />
          </Field>
          <Field label="Mother Tongue">
            <TextInput value={d.motherTongue} placeholder="e.g. Hindi" onChange={(e) => set("motherTongue", e.target.value)} />
          </Field>
        </div>

        <SectionHeading>Education & Profession</SectionHeading>
        <div style={rowStyle}>
          <Field label="Education">
            <TextInput value={d.education} placeholder="e.g. MBA, Delhi University" onChange={(e) => set("education", e.target.value)} />
          </Field>
          <Field label="Profession">
            <TextInput value={d.profession} placeholder="e.g. Software Engineer at TCS" onChange={(e) => set("profession", e.target.value)} />
          </Field>
          <Field label="Annual Income">
            <TextInput value={d.income} placeholder="e.g. ₹12 LPA" onChange={(e) => set("income", e.target.value)} />
          </Field>
        </div>

        <SectionHeading>Family Details</SectionHeading>
        <div style={rowStyle}>
          <Field label="Father's Name">
            <TextInput value={d.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
          </Field>
          <Field label="Father's Occupation">
            <TextInput value={d.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} />
          </Field>
          <Field label="Mother's Name">
            <TextInput value={d.motherName} onChange={(e) => set("motherName", e.target.value)} />
          </Field>
          <Field label="Mother's Occupation">
            <TextInput value={d.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} />
          </Field>
          <Field label="Siblings">
            <TextInput value={d.siblings} placeholder="e.g. 1 elder sister (married)" onChange={(e) => set("siblings", e.target.value)} />
          </Field>
          <Field label="Family Type">
            <SelectInput value={d.familyType} onChange={(e) => set("familyType", e.target.value)}>
              <option value="">— select —</option>
              <option>Nuclear Family</option>
              <option>Joint Family</option>
            </SelectInput>
          </Field>
        </div>

        <SectionHeading>Horoscope / Astrology (optional)</SectionHeading>
        <label style={{ display: "flex", alignItems: "center", gap: ".55rem", marginBottom: "1rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={d.horoscopeEnabled}
            onChange={(e) => set("horoscopeEnabled", e.target.checked)}
          />
          <span style={{ fontSize: ".92rem", fontWeight: 600 }}>Include horoscope section in the biodata</span>
        </label>
        {d.horoscopeEnabled && (
          <div style={rowStyle}>
            <Field label="Time of Birth">
              <TextInput value={d.birthTime} placeholder="e.g. 6:45 AM" onChange={(e) => set("birthTime", e.target.value)} />
            </Field>
            <Field label="Place of Birth">
              <TextInput value={d.birthPlace} placeholder="e.g. Jaipur, Rajasthan" onChange={(e) => set("birthPlace", e.target.value)} />
            </Field>
            <Field label="Rashi (Moon Sign)">
              <TextInput value={d.rashi} placeholder="e.g. Mesh (Aries)" onChange={(e) => set("rashi", e.target.value)} />
            </Field>
            <Field label="Nakshatra">
              <TextInput value={d.nakshatra} placeholder="e.g. Rohini" onChange={(e) => set("nakshatra", e.target.value)} />
            </Field>
            <Field label="Manglik">
              <SelectInput value={d.manglik} onChange={(e) => set("manglik", e.target.value)}>
                <option value="">— select —</option>
                <option>No</option>
                <option>Yes</option>
                <option>Anshik (Partial)</option>
                <option>Don&apos;t Know</option>
              </SelectInput>
            </Field>
          </div>
        )}

        <SectionHeading>Partner Expectations</SectionHeading>
        <Field label="What are you looking for in a partner? (free text)">
          <TextArea
            value={d.expectations}
            style={{ minHeight: 90 }}
            placeholder="e.g. Looking for a well-educated, family-oriented partner…"
            onChange={(e) => set("expectations", e.target.value)}
          />
        </Field>

        <SectionHeading>Contact Details</SectionHeading>
        <div style={rowStyle}>
          <Field label="Phone">
            <TextInput value={d.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={d.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <TextArea value={d.address} style={{ minHeight: 60 }} onChange={(e) => set("address", e.target.value)} />
        </Field>

        <SectionHeading>Photo (optional)</SectionHeading>
        <FileDropzone accept="image/*" onFiles={onPhoto} label="Upload a photo (JPG/PNG)" />
        {photo && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Biodata preview"
              style={{ width: 90, height: 110, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border-2)" }}
            />
            <button type="button" className="btn-secondary sm" onClick={() => setPhoto(null)}>
              Remove photo
            </button>
          </div>
        )}

        <SectionHeading>Template & Download</SectionHeading>
        <TabGroup
          options={[
            { value: "traditional", label: "Traditional (decorative)" },
            { value: "modern", label: "Modern (clean)" },
          ]}
          value={template}
          onChange={setTemplate}
        />
        <button
          type="button"
          className="btn-primary"
          disabled={!canDownload || busy}
          style={{ opacity: !canDownload || busy ? 0.5 : 1 }}
          onClick={downloadPdf}
        >
          {busy ? "Generating…" : "Download Biodata PDF"}
        </button>
        {!canDownload && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter at least the full name to enable the download.
          </p>
        )}
        <p style={{ fontSize: ".82rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
          Empty fields are automatically left out of the PDF. Your details are saved
          only in this browser (photo is not saved).
        </p>
      </Card>
    </ToolPageLayout>
  );
}
