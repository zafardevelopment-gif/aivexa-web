"use client";

import { useEffect, useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  TabGroup,
} from "@/components/tools/ToolUI";

type Experience = {
  role: string;
  company: string;
  dates: string;
  bullets: string; // one bullet per line
};

type Education = {
  degree: string;
  institution: string;
  dates: string;
  detail: string;
};

type Project = {
  name: string;
  description: string;
  link: string;
};

type ResumeData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
};

const EMPTY: ResumeData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  summary: "",
  experience: [{ role: "", company: "", dates: "", bullets: "" }],
  education: [{ degree: "", institution: "", dates: "", detail: "" }],
  skills: "",
  projects: [],
};

const LS_KEY = "aivexa-cv-builder-v1";
const ACCENT = "#4f46e5";

function splitLines(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
}

function splitSkills(s: string): string[] {
  return s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

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

export default function CvResumeBuilderTool() {
  const [data, setData] = useState<ResumeData>(EMPTY);
  const [template, setTemplate] = useState("ats");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ResumeData>;
        setData({ ...EMPTY, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, loaded]);

  function set<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function setExp(i: number, patch: Partial<Experience>) {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e, j) => (j === i ? { ...e, ...patch } : e)),
    }));
  }
  function setEdu(i: number, patch: Partial<Education>) {
    setData((d) => ({
      ...d,
      education: d.education.map((e, j) => (j === i ? { ...e, ...patch } : e)),
    }));
  }
  function setProj(i: number, patch: Partial<Project>) {
    setData((d) => ({
      ...d,
      projects: d.projects.map((e, j) => (j === i ? { ...e, ...patch } : e)),
    }));
  }

  const skills = useMemo(() => splitSkills(data.skills), [data.skills]);
  const canDownload = data.name.trim().length > 0;

  async function downloadPdf() {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210;
      const M = 18;
      const contentW = W - M * 2;
      let y = 20;

      const modern = template === "modern";

      function ensure(space: number) {
        if (y + space > 282) {
          doc.addPage();
          y = 20;
        }
      }
      function wrapText(
        text: string,
        x: number,
        maxW: number,
        size: number,
        style: "normal" | "bold" | "italic" = "normal",
        lineH = size * 0.48,
        color: [number, number, number] = [30, 30, 30],
      ) {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxW) as string[];
        for (const line of lines) {
          ensure(lineH + 2);
          doc.text(line, x, y);
          y += lineH;
        }
      }
      function heading(label: string) {
        ensure(14);
        y += 4;
        if (modern) {
          doc.setFillColor(79, 70, 229);
          doc.rect(M, y - 3.6, 1.6, 5, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11.5);
          doc.setTextColor(79, 70, 229);
          doc.text(label.toUpperCase(), M + 4, y);
        } else {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11.5);
          doc.setTextColor(20, 20, 20);
          doc.text(label.toUpperCase(), M, y);
        }
        y += 2;
        doc.setDrawColor(modern ? 199 : 120, modern ? 210 : 120, modern ? 254 : 120);
        doc.setLineWidth(0.3);
        doc.line(M, y, W - M, y);
        y += 5.5;
      }

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      if (modern) doc.setTextColor(79, 70, 229);
      else doc.setTextColor(10, 10, 10);
      doc.text(data.name.trim(), M, y);
      y += 7;
      if (data.title.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(70, 70, 70);
        doc.text(data.title.trim(), M, y);
        y += 6;
      }
      const contact = [data.email, data.phone, data.location, data.links]
        .map((s) => s.trim())
        .filter(Boolean)
        .join("  |  ");
      if (contact) {
        wrapText(contact, M, contentW, 9.5, "normal", 4.6, [80, 80, 80]);
      }
      y += 1;
      doc.setDrawColor(modern ? 79 : 40, modern ? 70 : 40, modern ? 229 : 40);
      doc.setLineWidth(modern ? 0.8 : 0.4);
      doc.line(M, y, W - M, y);
      y += 6;

      if (data.summary.trim()) {
        heading("Professional Summary");
        wrapText(data.summary.trim(), M, contentW, 10, "normal", 4.9);
      }

      const exps = data.experience.filter(
        (e) => e.role.trim() || e.company.trim() || e.bullets.trim(),
      );
      if (exps.length) {
        heading("Work Experience");
        for (const e of exps) {
          ensure(14);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(20, 20, 20);
          doc.text(e.role.trim() || "Role", M, y);
          if (e.dates.trim()) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(90, 90, 90);
            doc.text(e.dates.trim(), W - M, y, { align: "right" });
          }
          y += 5;
          if (e.company.trim()) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.setTextColor(70, 70, 70);
            doc.text(e.company.trim(), M, y);
            y += 5;
          }
          for (const b of splitLines(e.bullets)) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(35, 35, 35);
            const lines = doc.splitTextToSize(b, contentW - 5) as string[];
            for (let li = 0; li < lines.length; li++) {
              ensure(6);
              if (li === 0) doc.text("-", M + 1, y);
              doc.text(lines[li], M + 5, y);
              y += 4.8;
            }
          }
          y += 2.5;
        }
      }

      const edus = data.education.filter(
        (e) => e.degree.trim() || e.institution.trim(),
      );
      if (edus.length) {
        heading("Education");
        for (const e of edus) {
          ensure(12);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(20, 20, 20);
          doc.text(e.degree.trim() || "Degree", M, y);
          if (e.dates.trim()) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(90, 90, 90);
            doc.text(e.dates.trim(), W - M, y, { align: "right" });
          }
          y += 5;
          if (e.institution.trim()) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.setTextColor(70, 70, 70);
            doc.text(e.institution.trim(), M, y);
            y += 5;
          }
          if (e.detail.trim()) {
            wrapText(e.detail.trim(), M, contentW, 9.5, "normal", 4.6, [70, 70, 70]);
          }
          y += 2;
        }
      }

      if (skills.length) {
        heading("Skills");
        wrapText(skills.join(", "), M, contentW, 10, "normal", 4.9);
      }

      const projs = data.projects.filter((p) => p.name.trim() || p.description.trim());
      if (projs.length) {
        heading("Projects");
        for (const p of projs) {
          ensure(10);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(20, 20, 20);
          doc.text(p.name.trim() || "Project", M, y);
          y += 5;
          if (p.description.trim()) {
            wrapText(p.description.trim(), M, contentW, 10, "normal", 4.8);
          }
          if (p.link.trim()) {
            wrapText(p.link.trim(), M, contentW, 9, "normal", 4.4, [79, 70, 229]);
          }
          y += 2;
        }
      }

      const fileName =
        (data.name.trim().replace(/\s+/g, "-") || "resume") + "-resume.pdf";
      doc.save(fileName);
    } finally {
      setBusy(false);
    }
  }

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0 1rem",
  };
  const entryBox: React.CSSProperties = {
    border: "1px solid var(--border-2, #e2e8f0)",
    borderRadius: "12px",
    padding: "1rem 1rem .2rem",
    marginBottom: "1rem",
  };

  return (
    <ToolPageLayout
      title="CV/Resume Builder"
      description="Build a professional resume with live preview and download it as a PDF. ATS-friendly and modern templates — everything stays in your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <SectionHeading>Personal Information</SectionHeading>
        <div style={rowStyle}>
          <Field label="Full Name *">
            <TextInput value={data.name} placeholder="e.g. Priya Sharma" onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Professional Title">
            <TextInput value={data.title} placeholder="e.g. Senior Software Engineer" onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={data.email} placeholder="you@example.com" onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={data.phone} placeholder="+91 98765 43210" onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Location">
            <TextInput value={data.location} placeholder="e.g. Mumbai, India" onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Links (LinkedIn, portfolio…)">
            <TextInput value={data.links} placeholder="linkedin.com/in/priya" onChange={(e) => set("links", e.target.value)} />
          </Field>
        </div>

        <SectionHeading>Professional Summary</SectionHeading>
        <Field label="Summary (2-4 sentences)">
          <TextArea
            value={data.summary}
            style={{ minHeight: 90 }}
            placeholder="Results-driven engineer with 6+ years of experience…"
            onChange={(e) => set("summary", e.target.value)}
          />
        </Field>

        <SectionHeading>Work Experience</SectionHeading>
        {data.experience.map((exp, i) => (
          <div key={i} style={entryBox}>
            <div style={rowStyle}>
              <Field label="Role / Job Title">
                <TextInput value={exp.role} placeholder="e.g. Product Manager" onChange={(e) => setExp(i, { role: e.target.value })} />
              </Field>
              <Field label="Company">
                <TextInput value={exp.company} placeholder="e.g. Infosys" onChange={(e) => setExp(i, { company: e.target.value })} />
              </Field>
            </div>
            <Field label="Dates">
              <TextInput value={exp.dates} placeholder="e.g. Jan 2021 – Present" onChange={(e) => setExp(i, { dates: e.target.value })} />
            </Field>
            <Field label="Achievements / responsibilities (one per line)">
              <TextArea
                value={exp.bullets}
                style={{ minHeight: 90 }}
                placeholder={"Led a team of 5 engineers\nReduced page load time by 40%"}
                onChange={(e) => setExp(i, { bullets: e.target.value })}
              />
            </Field>
            {data.experience.length > 1 && (
              <button
                type="button"
                className="btn-secondary sm"
                style={{ marginBottom: "1rem" }}
                onClick={() =>
                  setData((d) => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))
                }
              >
                Remove entry
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary sm"
          onClick={() =>
            setData((d) => ({
              ...d,
              experience: [...d.experience, { role: "", company: "", dates: "", bullets: "" }],
            }))
          }
        >
          + Add experience
        </button>

        <SectionHeading>Education</SectionHeading>
        {data.education.map((edu, i) => (
          <div key={i} style={entryBox}>
            <div style={rowStyle}>
              <Field label="Degree / Qualification">
                <TextInput value={edu.degree} placeholder="e.g. B.Tech, Computer Science" onChange={(e) => setEdu(i, { degree: e.target.value })} />
              </Field>
              <Field label="Institution">
                <TextInput value={edu.institution} placeholder="e.g. IIT Delhi" onChange={(e) => setEdu(i, { institution: e.target.value })} />
              </Field>
              <Field label="Dates">
                <TextInput value={edu.dates} placeholder="e.g. 2015 – 2019" onChange={(e) => setEdu(i, { dates: e.target.value })} />
              </Field>
              <Field label="Detail (GPA, honors — optional)">
                <TextInput value={edu.detail} placeholder="e.g. CGPA 8.9/10" onChange={(e) => setEdu(i, { detail: e.target.value })} />
              </Field>
            </div>
            {data.education.length > 1 && (
              <button
                type="button"
                className="btn-secondary sm"
                style={{ marginBottom: "1rem" }}
                onClick={() =>
                  setData((d) => ({ ...d, education: d.education.filter((_, j) => j !== i) }))
                }
              >
                Remove entry
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary sm"
          onClick={() =>
            setData((d) => ({
              ...d,
              education: [...d.education, { degree: "", institution: "", dates: "", detail: "" }],
            }))
          }
        >
          + Add education
        </button>

        <SectionHeading>Skills</SectionHeading>
        <Field label="Skills (comma-separated)">
          <TextArea
            value={data.skills}
            style={{ minHeight: 70 }}
            placeholder="JavaScript, React, Node.js, SQL, Team leadership"
            onChange={(e) => set("skills", e.target.value)}
          />
        </Field>
        {skills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", marginBottom: "1rem" }}>
            {skills.map((s, i) => (
              <span
                key={i}
                style={{
                  background: "var(--indigo-light, #eef2ff)",
                  color: ACCENT,
                  borderRadius: "999px",
                  padding: ".2rem .7rem",
                  fontSize: ".82rem",
                  fontWeight: 600,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <SectionHeading>Projects (optional)</SectionHeading>
        {data.projects.map((p, i) => (
          <div key={i} style={entryBox}>
            <div style={rowStyle}>
              <Field label="Project Name">
                <TextInput value={p.name} onChange={(e) => setProj(i, { name: e.target.value })} />
              </Field>
              <Field label="Link (optional)">
                <TextInput value={p.link} placeholder="github.com/…" onChange={(e) => setProj(i, { link: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <TextArea value={p.description} style={{ minHeight: 70 }} onChange={(e) => setProj(i, { description: e.target.value })} />
            </Field>
            <button
              type="button"
              className="btn-secondary sm"
              style={{ marginBottom: "1rem" }}
              onClick={() => setData((d) => ({ ...d, projects: d.projects.filter((_, j) => j !== i) }))}
            >
              Remove project
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary sm"
          onClick={() =>
            setData((d) => ({ ...d, projects: [...d.projects, { name: "", description: "", link: "" }] }))
          }
        >
          + Add project
        </button>

        <SectionHeading>Template & Download</SectionHeading>
        <TabGroup
          options={[
            { value: "ats", label: "ATS-friendly" },
            { value: "modern", label: "Modern" },
          ]}
          value={template}
          onChange={setTemplate}
        />
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-primary"
            disabled={!canDownload || busy}
            style={{ opacity: !canDownload || busy ? 0.5 : 1 }}
            onClick={downloadPdf}
          >
            {busy ? "Generating…" : "Download PDF"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (confirm("Clear all resume data?")) {
                setData(EMPTY);
                try {
                  localStorage.removeItem(LS_KEY);
                } catch {
                  /* ignore */
                }
              }
            }}
          >
            Clear form
          </button>
        </div>
        {!canDownload && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter at least your name to enable the PDF download.
          </p>
        )}
        <p style={{ fontSize: ".82rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
          The ATS template uses a clean single-column layout with real selectable text —
          ideal for applicant tracking systems. Your data is saved in this browser only.
        </p>
      </Card>

      {/* Live preview */}
      <div style={{ marginTop: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
            Live Preview {template === "ats" ? "(ATS-friendly)" : "(Modern)"}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--border-2, #e2e8f0)",
                borderRadius: 8,
                padding: "1.6rem",
                minWidth: 300,
                fontFamily: template === "ats" ? "Arial, Helvetica, sans-serif" : "inherit",
                fontSize: ".85rem",
                lineHeight: 1.5,
                color: "#1e1e1e",
              }}
            >
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: template === "modern" ? ACCENT : "#111",
                }}
              >
                {data.name || "Your Name"}
              </div>
              {data.title && <div style={{ color: "#555" }}>{data.title}</div>}
              <div style={{ fontSize: ".78rem", color: "#666", margin: ".3rem 0 .6rem" }}>
                {[data.email, data.phone, data.location, data.links].filter((x) => x.trim()).join("  |  ")}
              </div>
              <hr style={{ border: 0, borderTop: template === "modern" ? `2px solid ${ACCENT}` : "1px solid #999", margin: ".4rem 0 .8rem" }} />
              {data.summary.trim() && (
                <PreviewSection modern={template === "modern"} label="Professional Summary">
                  <p>{data.summary}</p>
                </PreviewSection>
              )}
              {data.experience.some((e) => e.role || e.company || e.bullets) && (
                <PreviewSection modern={template === "modern"} label="Work Experience">
                  {data.experience
                    .filter((e) => e.role || e.company || e.bullets)
                    .map((e, i) => (
                      <div key={i} style={{ marginBottom: ".6rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                          <strong>{e.role || "Role"}</strong>
                          <span style={{ color: "#777", fontSize: ".78rem", whiteSpace: "nowrap" }}>{e.dates}</span>
                        </div>
                        {e.company && <em style={{ color: "#555" }}>{e.company}</em>}
                        <ul style={{ margin: ".2rem 0 0 1.1rem" }}>
                          {splitLines(e.bullets).map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </PreviewSection>
              )}
              {data.education.some((e) => e.degree || e.institution) && (
                <PreviewSection modern={template === "modern"} label="Education">
                  {data.education
                    .filter((e) => e.degree || e.institution)
                    .map((e, i) => (
                      <div key={i} style={{ marginBottom: ".45rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                          <strong>{e.degree || "Degree"}</strong>
                          <span style={{ color: "#777", fontSize: ".78rem", whiteSpace: "nowrap" }}>{e.dates}</span>
                        </div>
                        {e.institution && <em style={{ color: "#555" }}>{e.institution}</em>}
                        {e.detail && <div style={{ color: "#666", fontSize: ".78rem" }}>{e.detail}</div>}
                      </div>
                    ))}
                </PreviewSection>
              )}
              {skills.length > 0 && (
                <PreviewSection modern={template === "modern"} label="Skills">
                  <p>{skills.join(", ")}</p>
                </PreviewSection>
              )}
              {data.projects.some((p) => p.name || p.description) && (
                <PreviewSection modern={template === "modern"} label="Projects">
                  {data.projects
                    .filter((p) => p.name || p.description)
                    .map((p, i) => (
                      <div key={i} style={{ marginBottom: ".45rem" }}>
                        <strong>{p.name || "Project"}</strong>
                        {p.description && <div>{p.description}</div>}
                        {p.link && <div style={{ color: ACCENT, fontSize: ".78rem" }}>{p.link}</div>}
                      </div>
                    ))}
                </PreviewSection>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}

function PreviewSection({
  label,
  modern,
  children,
}: {
  label: string;
  modern: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: ".9rem" }}>
      <div
        style={{
          fontWeight: 800,
          fontSize: ".82rem",
          letterSpacing: ".05em",
          textTransform: "uppercase",
          color: modern ? ACCENT : "#111",
          borderBottom: modern ? "1px solid #c7d2fe" : "1px solid #999",
          paddingBottom: ".15rem",
          marginBottom: ".4rem",
        }}
      >
        {modern && (
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 12,
              background: ACCENT,
              marginRight: 6,
              verticalAlign: "-1px",
            }}
          />
        )}
        {label}
      </div>
      {children}
    </div>
  );
}
