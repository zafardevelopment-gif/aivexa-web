"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmt(n: number) { return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// 2024/25 UK rates
const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT   = 50270;
const HIGHER_RATE_LIMIT  = 125140;

// NI 2024/25 (Class 1 employee)
const NI_PRIMARY_THRESHOLD   = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_BASIC_RATE  = 0.08;  // 8% on earnings between PT and UEL
const NI_UPPER_RATE  = 0.02;  // 2% above UEL

function calcIncomeTax(gross: number): number {
  // Personal allowance tapered above £100k
  let allowance = PERSONAL_ALLOWANCE;
  if (gross > 100000) allowance = Math.max(0, PERSONAL_ALLOWANCE - (gross - 100000) / 2);

  const taxable = Math.max(0, gross - allowance);
  let tax = 0;

  const basicBand = Math.max(0, BASIC_RATE_LIMIT - allowance);
  const basic = Math.min(taxable, basicBand);
  tax += basic * 0.20;

  const higher = Math.min(Math.max(0, taxable - basicBand), HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT);
  tax += higher * 0.40;

  const additional = Math.max(0, taxable - (HIGHER_RATE_LIMIT - allowance));
  tax += additional * 0.45;

  return tax;
}

function calcNI(gross: number): number {
  if (gross <= NI_PRIMARY_THRESHOLD) return 0;
  const basic  = Math.min(gross, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD;
  const upper  = Math.max(0, gross - NI_UPPER_EARNINGS_LIMIT);
  return basic * NI_BASIC_RATE + upper * NI_UPPER_RATE;
}

export default function UkSalaryCalculatorTool() {
  const [salary, setSalary]   = useState("40000");
  const [period, setPeriod]   = useState("annual");
  const [studentLoan, setStudentLoan] = useState("none");

  const result = useMemo(() => {
    let annual = Math.max(0, toNum(salary));
    if (period === "monthly")   annual *= 12;
    if (period === "weekly")    annual *= 52;
    if (period === "hourly")    annual *= 2080;

    const incomeTax = calcIncomeTax(annual);
    const ni        = calcNI(annual);

    // Student Loan repayments (2024/25)
    let studentLoanRepayment = 0;
    if (studentLoan === "plan1")
      studentLoanRepayment = Math.max(0, annual - 24990) * 0.09;
    else if (studentLoan === "plan2")
      studentLoanRepayment = Math.max(0, annual - 27295) * 0.09;
    else if (studentLoan === "plan4")
      studentLoanRepayment = Math.max(0, annual - 31395) * 0.09;
    else if (studentLoan === "plan5")
      studentLoanRepayment = Math.max(0, annual - 25000) * 0.09;
    else if (studentLoan === "postgrad")
      studentLoanRepayment = Math.max(0, annual - 21000) * 0.06;

    const totalDeductions = incomeTax + ni + studentLoanRepayment;
    const takeHome = annual - totalDeductions;
    const effectiveRate = annual > 0 ? (totalDeductions / annual) * 100 : 0;

    return {
      grossAnnual: annual,
      incomeTax,
      ni,
      studentLoanRepayment,
      totalDeductions,
      takeHome,
      takeHomeMonthly: takeHome / 12,
      takeHomeWeekly: takeHome / 52,
      effectiveRate,
    };
  }, [salary, period, studentLoan]);

  return (
    <ToolPageLayout
      title="UK Salary Calculator"
      description="Calculate your UK take-home pay after income tax, National Insurance and student loan repayments for 2024/25."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Gross Salary / Wage">
          <TextInput type="number" min={0} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 40000" />
        </Field>

        <Field label="Pay Period">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly (×2,080 hrs/yr)</option>
          </select>
        </Field>

        <Field label="Student Loan Plan">
          <select value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="none">None</option>
            <option value="plan1">Plan 1 (pre-2012 England/Wales or Scotland)</option>
            <option value="plan2">Plan 2 (post-2012 England/Wales)</option>
            <option value="plan4">Plan 4 (Scotland post-2021)</option>
            <option value="plan5">Plan 5 (England from 2023)</option>
            <option value="postgrad">Postgraduate Loan</option>
          </select>
        </Field>

        <ResultBox>
          <ResultRow label="Annual Gross Salary"     value={fmt(result.grossAnnual)} />
          <ResultRow label="Income Tax"              value={`-${fmt(result.incomeTax)}`} />
          <ResultRow label="National Insurance"      value={`-${fmt(result.ni)}`} />
          {result.studentLoanRepayment > 0 &&
            <ResultRow label="Student Loan"          value={`-${fmt(result.studentLoanRepayment)}`} />}
          <ResultRow label="Annual Take-Home Pay"    value={fmt(result.takeHome)}/>
          <ResultRow label="Monthly Take-Home"       value={fmt(result.takeHomeMonthly)} />
          <ResultRow label="Weekly Take-Home"        value={fmt(result.takeHomeWeekly)} />
          <ResultRow label="Effective Tax Rate"      value={`${result.effectiveRate.toFixed(1)}%`} />
        </ResultBox>
      </Card>

      <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
        <strong>Disclaimer:</strong> Based on 2024/25 HMRC rates. Assumes standard personal allowance and no other adjustments.
        Results are estimates. Consult a qualified accountant or use HMRC's official calculator for precise figures.
      </p>
    </ToolPageLayout>
  );
}
