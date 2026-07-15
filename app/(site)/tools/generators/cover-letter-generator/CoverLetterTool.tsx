"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  SelectInput,
  CopyButton,
} from "@/components/tools/ToolUI";

function buildLetter(opts: {
  yourName: string;
  contact: string;
  company: string;
  manager: string;
  jobTitle: string;
  skills: string;
  tone: string;
}): string {
  const { yourName, contact, company, manager, jobTitle, skills, tone } = opts;
  const friendly = tone === "friendly";
  const skillList = skills
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const skillPhrase =
    skillList.length === 0
      ? "my relevant skills and experience"
      : skillList.length === 1
        ? skillList[0]
        : skillList.slice(0, -1).join(", ") + " and " + skillList[skillList.length - 1];

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const greeting = manager.trim()
    ? `Dear ${manager.trim()},`
    : "Dear Hiring Manager,";

  const p1 = friendly
    ? `I was excited to come across the ${jobTitle} opening at ${company}. The role feels like a natural fit for what I do best, and I'd love the chance to bring my energy and experience to your team.`
    : `I am writing to express my interest in the position of ${jobTitle} at ${company}. Having reviewed the role requirements, I am confident that my background and skill set make me a strong candidate for this opportunity.`;

  const p2 = friendly
    ? `Over the course of my career I've built real strengths in ${skillPhrase}. I enjoy rolling up my sleeves, learning fast, and delivering work that actually moves the needle — and I'd bring that same approach to ${company} from day one.`
    : `My core strengths include ${skillPhrase}. In my previous roles I have consistently applied these capabilities to deliver measurable results, and I am eager to contribute the same level of dedication and professionalism to ${company}.`;

  const p3 = friendly
    ? `What draws me to ${company} in particular is the chance to grow with a team that values quality work. I'm confident I can get up to speed quickly and start contributing early, while continuing to sharpen my skills along the way.`
    : `I am particularly drawn to ${company} because of its reputation and the scope of this role. I believe the position of ${jobTitle} aligns closely with my career objectives, and I am committed to adding value to your organisation from the outset.`;

  const p4 = friendly
    ? `Thanks so much for taking the time to read this. I'd love to chat about how I can help — feel free to reach me anytime${contact.trim() ? ` at ${contact.trim()}` : ""}. Looking forward to hearing from you!`
    : `Thank you for considering my application. I would welcome the opportunity to discuss how my experience can benefit your team${contact.trim() ? `, and I can be reached at ${contact.trim()}` : ""}. I look forward to your response.`;

  const closing = friendly ? "Warm regards," : "Sincerely,";

  return [
    yourName.trim(),
    contact.trim(),
    "",
    today,
    "",
    `Hiring Team${company ? ", " + company : ""}`,
    "",
    `Subject: Application for the position of ${jobTitle}`,
    "",
    greeting,
    "",
    p1,
    "",
    p2,
    "",
    p3,
    "",
    p4,
    "",
    closing,
    yourName.trim(),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

export default function CoverLetterTool() {
  const [yourName, setYourName] = useState("");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [manager, setManager] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("formal");
  const [letter, setLetter] = useState("");
  const [busy, setBusy] = useState(false);

  const canGenerate =
    yourName.trim().length > 0 && company.trim().length > 0 && jobTitle.trim().length > 0;

  async function downloadPdf() {
    if (!letter.trim() || busy) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const M = 22;
      const maxW = 210 - M * 2;
      let y = 24;
      doc.setFont("times", "normal");
      doc.setFontSize(11.5);
      doc.setTextColor(20, 20, 20);
      for (const para of letter.split("\n")) {
        if (para.trim() === "") {
          y += 4;
          continue;
        }
        const lines = doc.splitTextToSize(para, maxW) as string[];
        for (const line of lines) {
          if (y > 275) {
            doc.addPage();
            y = 24;
          }
          doc.text(line, M, y);
          y += 5.6;
        }
      }
      doc.save("cover-letter.pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Cover Letter Generator"
      description="Answer a few questions and get a polished, editable cover letter — download as PDF or copy the text. Nothing is sent to any server."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
          <Field label="Your Name *">
            <TextInput value={yourName} placeholder="e.g. Ananya Gupta" onChange={(e) => setYourName(e.target.value)} />
          </Field>
          <Field label="Your Contact (email / phone)">
            <TextInput value={contact} placeholder="ananya@email.com | +91 98765 43210" onChange={(e) => setContact(e.target.value)} />
          </Field>
          <Field label="Company *">
            <TextInput value={company} placeholder="e.g. Wipro" onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Hiring Manager Name (optional)">
            <TextInput value={manager} placeholder="e.g. Mr. Rakesh Nair" onChange={(e) => setManager(e.target.value)} />
          </Field>
          <Field label="Job Title *">
            <TextInput value={jobTitle} placeholder="e.g. Data Analyst" onChange={(e) => setJobTitle(e.target.value)} />
          </Field>
          <Field label="Tone">
            <SelectInput value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
            </SelectInput>
          </Field>
        </div>
        <Field label="2-3 Key Skills / Achievements (comma-separated)">
          <TextArea
            value={skills}
            style={{ minHeight: 70 }}
            placeholder="SQL & dashboarding, stakeholder communication, cut reporting time by 50%"
            onChange={(e) => setSkills(e.target.value)}
          />
        </Field>

        <button
          type="button"
          className="btn-primary"
          disabled={!canGenerate}
          style={{ opacity: canGenerate ? 1 : 0.5 }}
          onClick={() =>
            setLetter(buildLetter({ yourName, contact, company, manager, jobTitle, skills, tone }))
          }
        >
          Generate Cover Letter
        </button>
        {!canGenerate && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Fill your name, company and job title to generate.
          </p>
        )}

        {letter && (
          <div style={{ marginTop: "1.5rem" }}>
            <Field label="Your letter (edit freely before downloading)">
              <TextArea
                value={letter}
                style={{ minHeight: 380, fontFamily: "Georgia, 'Times New Roman', serif" }}
                onChange={(e) => setLetter(e.target.value)}
              />
            </Field>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-primary"
                disabled={busy}
                onClick={downloadPdf}
              >
                {busy ? "Generating…" : "Download PDF"}
              </button>
              <CopyButton text={letter} label="Copy text" />
            </div>
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
