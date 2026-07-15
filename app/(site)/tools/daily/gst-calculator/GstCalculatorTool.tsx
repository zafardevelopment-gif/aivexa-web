"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  SelectInput,
  ResultBox,
  ResultRow,
  TabGroup,
} from "@/components/tools/ToolUI";

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

const GST_PRESETS = ["5", "12", "18", "28", "custom"];

export default function GstCalculatorTool() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("1000");
  const [preset, setPreset] = useState("18");
  const [customRate, setCustomRate] = useState("18");

  const rate = preset === "custom" ? Math.max(0, toNumber(customRate)) : toNumber(preset);

  const { base, gstAmount, cgst, sgst, total } = useMemo(() => {
    const amt = Math.max(0, toNumber(amount));
    const r = Math.max(0, rate);

    if (amt <= 0) {
      return { base: 0, gstAmount: 0, cgst: 0, sgst: 0, total: 0 };
    }

    if (mode === "add") {
      const gst = (amt * r) / 100;
      return { base: amt, gstAmount: gst, cgst: gst / 2, sgst: gst / 2, total: amt + gst };
    }

    const baseAmount = amt / (1 + r / 100);
    const gst = amt - baseAmount;
    return { base: baseAmount, gstAmount: gst, cgst: gst / 2, sgst: gst / 2, total: amt };
  }, [amount, rate, mode]);

  return (
    <ToolPageLayout
      title="GST Calculator"
      description="Add or remove GST from any amount and see the CGST, SGST, and total GST breakdown instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "add", label: "Add GST" },
            { value: "remove", label: "Remove GST" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as "add" | "remove")}
        />

        <Field label={mode === "add" ? "Amount (excluding GST)" : "Amount (including GST)"}>
          <TextInput
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1000"
          />
        </Field>

        <Field label="GST Rate">
          <SelectInput value={preset} onChange={(e) => setPreset(e.target.value)}>
            {GST_PRESETS.map((p) =>
              p === "custom" ? (
                <option key={p} value={p}>
                  Custom
                </option>
              ) : (
                <option key={p} value={p}>
                  {p}%
                </option>
              )
            )}
          </SelectInput>
        </Field>

        {preset === "custom" && (
          <Field label="Custom GST Rate (%)">
            <TextInput
              type="number"
              min={0}
              step="0.01"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              placeholder="e.g. 18"
            />
          </Field>
        )}

        <ResultBox>
          <ResultRow label="Base Amount" value={base.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
          <ResultRow label="CGST" value={cgst.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
          <ResultRow label="SGST" value={sgst.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
          <ResultRow
            label="Total GST"
            value={gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
          <ResultRow label="Total Amount" value={total.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
