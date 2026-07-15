"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  CopyButton,
} from "@/components/tools/ToolUI";
import { formatINR, numberToWordsIndian } from "@/lib/number-to-words-indian";

export default function OfferLetterTool() {
  const [company, setCompany] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [candidate, setCandidate] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [ctc, setCtc] = useState("");
  const [ctcBreakup, setCtcBreakup] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [probation, setProbation] = useState("6 months");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("");
  const [letter, setLetter] = useState("");
  const [busy, setBusy] = useState(false);

  const canGenerate =
    company.trim() !== "" && candidate.trim() !== "" && role.trim() !== "" && Number(ctc) > 0;

  function generate() {
    const ctcNum = Number(ctc) || 0;
    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const joinStr = joiningDate
      ? new Date(joiningDate + "T00:00:00").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "(to be confirmed)";

    const parts = [
      company.trim(),
      companyAddress.trim(),
      "",
      today,
      "",
      candidate.trim(),
      candidateAddress.trim(),
      "",
      `Subject: Offer of Employment — ${role.trim()}`,
      "",
      `Dear ${candidate.trim()},`,
      "",
      `We are pleased to offer you the position of ${role.trim()}${department.trim() ? ` in our ${department.trim()} department` : ""} at ${company.trim()}. We were impressed with your background and believe you will be a valuable addition to our team.`,
      "",
      `Your annual Cost to Company (CTC) will be Rs. ${formatINR(ctcNum, 0)} (Rupees ${numberToWordsIndian(ctcNum)} Only).${ctcBreakup.trim() ? ` The indicative breakup is as follows: ${ctcBreakup.trim()}.` : ""} The detailed salary structure will be shared in your appointment letter.`,
      "",
      `Your expected date of joining is ${joinStr}.${location.trim() ? ` Your place of posting will be ${location.trim()}.` : ""}${manager.trim() ? ` You will report to ${manager.trim()}.` : ""} You will be on probation for a period of ${probation.trim() || "6 months"} from your date of joining, during which your performance will be reviewed.`,
      "",
      `This offer is contingent upon successful verification of your documents and background. Please confirm your acceptance of this offer by signing and returning a copy of this letter${joiningDate ? ` on or before your joining date` : ""}.`,
      "",
      `We look forward to welcoming you to ${company.trim()}.`,
      "",
      "Yours sincerely,",
      "",
      "____________________",
      `Authorised Signatory, ${company.trim()}`,
      "",
      "",
      "Accepted by:",
      "",
      "____________________",
      `${candidate.trim()}    Date: __________`,
    ];
    setLetter(parts.join("\n").replace(/\n{3,}/g, "\n\n"));
  }

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
      doc.save("offer-letter.pdf");
    } finally {
      setBusy(false);
    }
  }

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0 1rem",
  };

  return (
    <ToolPageLayout
      title="Offer Letter Generator"
      description="Fill in the role details and get a formal, editable offer letter — download as PDF or copy. Everything happens in your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={grid}>
          <Field label="Company Name *">
            <TextInput value={company} onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Company Address">
            <TextInput value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
          </Field>
          <Field label="Candidate Name *">
            <TextInput value={candidate} onChange={(e) => setCandidate(e.target.value)} />
          </Field>
          <Field label="Candidate Address">
            <TextInput value={candidateAddress} onChange={(e) => setCandidateAddress(e.target.value)} />
          </Field>
          <Field label="Role / Designation *">
            <TextInput value={role} placeholder="e.g. Marketing Executive" onChange={(e) => setRole(e.target.value)} />
          </Field>
          <Field label="Department">
            <TextInput value={department} placeholder="e.g. Marketing" onChange={(e) => setDepartment(e.target.value)} />
          </Field>
          <Field label="Annual CTC (₹) *">
            <TextInput type="number" min={0} value={ctc} placeholder="e.g. 800000" onChange={(e) => setCtc(e.target.value)} />
          </Field>
          <Field label="Joining Date">
            <TextInput type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
          </Field>
          <Field label="Probation Period">
            <TextInput value={probation} onChange={(e) => setProbation(e.target.value)} />
          </Field>
          <Field label="Work Location">
            <TextInput value={location} placeholder="e.g. Bengaluru" onChange={(e) => setLocation(e.target.value)} />
          </Field>
          <Field label="Reporting Manager">
            <TextInput value={manager} placeholder="e.g. Ms. Kavita Rao, VP Marketing" onChange={(e) => setManager(e.target.value)} />
          </Field>
        </div>
        <Field label="CTC Breakup (optional, one line)">
          <TextInput
            value={ctcBreakup}
            placeholder="e.g. Basic ₹4,00,000; HRA ₹1,60,000; Allowances ₹2,40,000"
            onChange={(e) => setCtcBreakup(e.target.value)}
          />
        </Field>

        <button
          type="button"
          className="btn-primary"
          disabled={!canGenerate}
          style={{ opacity: canGenerate ? 1 : 0.5 }}
          onClick={generate}
        >
          Generate Offer Letter
        </button>
        {!canGenerate && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Fill company, candidate, role and a valid CTC to generate.
          </p>
        )}

        {letter && (
          <div style={{ marginTop: "1.5rem" }}>
            <Field label="Offer letter (edit freely before downloading)">
              <TextArea
                value={letter}
                style={{ minHeight: 420, fontFamily: "Georgia, 'Times New Roman', serif" }}
                onChange={(e) => setLetter(e.target.value)}
              />
            </Field>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
              <button type="button" className="btn-primary" disabled={busy} onClick={downloadPdf}>
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
