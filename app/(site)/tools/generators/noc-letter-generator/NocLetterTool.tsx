"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  TabGroup,
  CopyButton,
} from "@/components/tools/ToolUI";

type NocType = "landlord" | "employer" | "vehicle";

function fmtDate(d: string): string {
  if (!d) return "__________";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NocLetterTool() {
  const [type, setType] = useState<NocType>("landlord");
  const [letter, setLetter] = useState("");
  const [busy, setBusy] = useState(false);

  // Landlord NOC
  const [llName, setLlName] = useState("");
  const [llAddress, setLlAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propAddress, setPropAddress] = useState("");
  const [tenancyStart, setTenancyStart] = useState("");
  const [purpose, setPurpose] = useState("address proof / registration purposes");

  // Employer NOC
  const [empCompany, setEmpCompany] = useState("");
  const [empCompanyAddress, setEmpCompanyAddress] = useState("");
  const [empName, setEmpName] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [empSince, setEmpSince] = useState("");
  const [travelCountry, setTravelCountry] = useState("");
  const [travelFrom, setTravelFrom] = useState("");
  const [travelTo, setTravelTo] = useState("");
  const [signatory, setSignatory] = useState("");

  // Vehicle NOC
  const [ownerName, setOwnerName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [fromRto, setFromRto] = useState("");
  const [toState, setToState] = useState("");

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const canGenerate =
    type === "landlord"
      ? llName.trim() !== "" && tenantName.trim() !== "" && propAddress.trim() !== ""
      : type === "employer"
        ? empCompany.trim() !== "" && empName.trim() !== "" && travelCountry.trim() !== ""
        : ownerName.trim() !== "" && vehicleNo.trim() !== "";

  function generate() {
    let parts: string[] = [];
    if (type === "landlord") {
      parts = [
        today,
        "",
        "TO WHOMSOEVER IT MAY CONCERN",
        "",
        "Subject: No Objection Certificate",
        "",
        `I, ${llName.trim()}${llAddress.trim() ? `, residing at ${llAddress.trim().replace(/\n+/g, ", ")}` : ""}, am the lawful owner of the property located at ${propAddress.trim().replace(/\n+/g, ", ")}.`,
        "",
        `I hereby declare that I have no objection to my tenant, ${tenantName.trim()}, residing at the above-mentioned property${tenancyStart ? ` since ${fmtDate(tenancyStart)}` : ""}, using this address for ${purpose.trim() || "official purposes"}.`,
        "",
        "This certificate is issued at the request of the tenant and is valid for the stated purpose. I confirm that the information provided above is true to the best of my knowledge.",
        "",
        "Yours faithfully,",
        "",
        "____________________",
        `${llName.trim()} (Landlord)`,
        "Contact: __________",
      ];
    } else if (type === "employer") {
      parts = [
        empCompany.trim(),
        empCompanyAddress.trim(),
        "",
        today,
        "",
        "TO WHOMSOEVER IT MAY CONCERN",
        "",
        "Subject: No Objection Certificate for Travel",
        "",
        `This is to certify that ${empName.trim()} is a full-time employee of ${empCompany.trim()}${empDesignation.trim() ? `, working as ${empDesignation.trim()}` : ""}${empSince ? ` since ${fmtDate(empSince)}` : ""}.`,
        "",
        `${empCompany.trim()} has no objection to ${empName.trim()} travelling to ${travelCountry.trim()}${travelFrom ? ` from ${fmtDate(travelFrom)}` : ""}${travelTo ? ` to ${fmtDate(travelTo)}` : ""} for personal/tourism purposes. The employee has been granted leave for this period and is expected to resume duties upon return.`,
        "",
        `During this period, the employee will remain on the payroll of ${empCompany.trim()} and all travel expenses will be borne by the employee.`,
        "",
        "This certificate is issued at the employee's request for visa/travel purposes.",
        "",
        "Yours faithfully,",
        "",
        "____________________",
        signatory.trim() || "Authorised Signatory",
        empCompany.trim(),
      ];
    } else {
      parts = [
        today,
        "",
        `To,`,
        `The Regional Transport Officer`,
        fromRto.trim() ? fromRto.trim() : "__________ RTO",
        "",
        "Subject: Application for No Objection Certificate for vehicle transfer",
        "",
        "Respected Sir/Madam,",
        "",
        `I, ${ownerName.trim()}${ownerAddress.trim() ? `, residing at ${ownerAddress.trim().replace(/\n+/g, ", ")}` : ""}, am the registered owner of the following vehicle:`,
        "",
        `Registration Number: ${vehicleNo.trim().toUpperCase()}`,
        vehicleModel.trim() ? `Make / Model: ${vehicleModel.trim()}` : "",
        chassisNo.trim() ? `Chassis Number: ${chassisNo.trim().toUpperCase()}` : "",
        engineNo.trim() ? `Engine Number: ${engineNo.trim().toUpperCase()}` : "",
        "",
        `I intend to shift the above vehicle to ${toState.trim() || "another state"} and therefore request you to kindly issue a No Objection Certificate for re-registration of the vehicle there.`,
        "",
        "I declare that there are no pending dues, taxes, or legal cases against the above vehicle, and it is not involved in any theft or criminal record.",
        "",
        "Kindly issue the NOC at the earliest. I shall be grateful.",
        "",
        "Yours faithfully,",
        "",
        "____________________",
        ownerName.trim(),
        "Contact: __________",
      ];
    }
    setLetter(parts.filter((p) => p !== undefined).join("\n").replace(/\n{3,}/g, "\n\n"));
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
      doc.save(`noc-letter-${type}.pdf`);
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
      title="NOC Letter Generator"
      description="Generate a No Objection Certificate — landlord, employer (visa/travel) or vehicle transfer — as editable text and a PDF. 100% in your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <TabGroup
          options={[
            { value: "landlord", label: "Landlord NOC" },
            { value: "employer", label: "Employer NOC (visa/travel)" },
            { value: "vehicle", label: "Vehicle NOC" },
          ]}
          value={type}
          onChange={(v) => {
            setType(v as NocType);
            setLetter("");
          }}
        />

        {type === "landlord" && (
          <>
            <div style={grid}>
              <Field label="Landlord Name *">
                <TextInput value={llName} onChange={(e) => setLlName(e.target.value)} />
              </Field>
              <Field label="Tenant Name *">
                <TextInput value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
              </Field>
              <Field label="Tenancy Start Date">
                <TextInput type="date" value={tenancyStart} onChange={(e) => setTenancyStart(e.target.value)} />
              </Field>
              <Field label="Purpose">
                <TextInput value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </Field>
            </div>
            <Field label="Landlord Address">
              <TextArea value={llAddress} style={{ minHeight: 55 }} onChange={(e) => setLlAddress(e.target.value)} />
            </Field>
            <Field label="Rented Property Address *">
              <TextArea value={propAddress} style={{ minHeight: 55 }} onChange={(e) => setPropAddress(e.target.value)} />
            </Field>
          </>
        )}

        {type === "employer" && (
          <>
            <div style={grid}>
              <Field label="Company Name *">
                <TextInput value={empCompany} onChange={(e) => setEmpCompany(e.target.value)} />
              </Field>
              <Field label="Company Address">
                <TextInput value={empCompanyAddress} onChange={(e) => setEmpCompanyAddress(e.target.value)} />
              </Field>
              <Field label="Employee Name *">
                <TextInput value={empName} onChange={(e) => setEmpName(e.target.value)} />
              </Field>
              <Field label="Designation">
                <TextInput value={empDesignation} onChange={(e) => setEmpDesignation(e.target.value)} />
              </Field>
              <Field label="Employed Since">
                <TextInput type="date" value={empSince} onChange={(e) => setEmpSince(e.target.value)} />
              </Field>
              <Field label="Travel Destination (country) *">
                <TextInput value={travelCountry} placeholder="e.g. United Kingdom" onChange={(e) => setTravelCountry(e.target.value)} />
              </Field>
              <Field label="Travel From">
                <TextInput type="date" value={travelFrom} onChange={(e) => setTravelFrom(e.target.value)} />
              </Field>
              <Field label="Travel To">
                <TextInput type="date" value={travelTo} onChange={(e) => setTravelTo(e.target.value)} />
              </Field>
              <Field label="Signatory (name, title)">
                <TextInput value={signatory} placeholder="e.g. Neha Singh, HR Manager" onChange={(e) => setSignatory(e.target.value)} />
              </Field>
            </div>
          </>
        )}

        {type === "vehicle" && (
          <>
            <div style={grid}>
              <Field label="Owner Name *">
                <TextInput value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </Field>
              <Field label="Vehicle Registration No. *">
                <TextInput value={vehicleNo} placeholder="e.g. MH12AB1234" onChange={(e) => setVehicleNo(e.target.value)} />
              </Field>
              <Field label="Make / Model">
                <TextInput value={vehicleModel} placeholder="e.g. Maruti Swift VXi" onChange={(e) => setVehicleModel(e.target.value)} />
              </Field>
              <Field label="Chassis Number">
                <TextInput value={chassisNo} onChange={(e) => setChassisNo(e.target.value)} />
              </Field>
              <Field label="Engine Number">
                <TextInput value={engineNo} onChange={(e) => setEngineNo(e.target.value)} />
              </Field>
              <Field label="Current RTO (name/city)">
                <TextInput value={fromRto} placeholder="e.g. RTO Pune" onChange={(e) => setFromRto(e.target.value)} />
              </Field>
              <Field label="Transferring To (state)">
                <TextInput value={toState} placeholder="e.g. Karnataka" onChange={(e) => setToState(e.target.value)} />
              </Field>
            </div>
            <Field label="Owner Address">
              <TextArea value={ownerAddress} style={{ minHeight: 55 }} onChange={(e) => setOwnerAddress(e.target.value)} />
            </Field>
          </>
        )}

        <button
          type="button"
          className="btn-primary"
          disabled={!canGenerate}
          style={{ opacity: canGenerate ? 1 : 0.5 }}
          onClick={generate}
        >
          Generate NOC Letter
        </button>
        {!canGenerate && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Fill the required (*) fields to generate.
          </p>
        )}

        {letter && (
          <div style={{ marginTop: "1.5rem" }}>
            <Field label="NOC letter (edit freely before downloading)">
              <TextArea
                value={letter}
                style={{ minHeight: 380, fontFamily: "Georgia, 'Times New Roman', serif" }}
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
