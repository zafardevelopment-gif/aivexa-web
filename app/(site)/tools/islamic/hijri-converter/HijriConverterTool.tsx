"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, ResultBox, ResultRow, SelectInput, TabGroup, TextInput } from "@/components/tools/ToolUI";
import { HIJRI_MONTHS, gregorianToHijri, hijriToGregorian, hijriMonthName } from "@/lib/hijri";

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function HijriConverterTool() {
  const [mode, setMode] = useState<"g2h" | "h2g">("g2h");

  const [gDate, setGDate] = useState(todayISO());

  const [hDay, setHDay] = useState(1);
  const [hMonth, setHMonth] = useState(1);
  const [hYear, setHYear] = useState(1447);

  const hijriResult = useMemo(() => {
    if (!gDate) return null;
    const [y, m, d] = gDate.split("-").map(Number);
    if (!y || !m || !d) return null;
    try {
      return gregorianToHijri({ year: y, month: m, day: d });
    } catch {
      return null;
    }
  }, [gDate]);

  const gregResult = useMemo(() => {
    if (!hDay || !hMonth || !hYear) return null;
    if (hDay < 1 || hDay > 30 || hMonth < 1 || hMonth > 12 || hYear < 1) return null;
    try {
      return hijriToGregorian({ year: hYear, month: hMonth, day: hDay });
    } catch {
      return null;
    }
  }, [hDay, hMonth, hYear]);

  return (
    <ToolPageLayout
      title="Hijri-Gregorian Converter"
      description="Two-way conversion between the Islamic (Hijri) and Gregorian calendars, calculated instantly in your browser."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "g2h", label: "Gregorian → Hijri" },
            { value: "h2g", label: "Hijri → Gregorian" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as "g2h" | "h2g")}
        />

        {mode === "g2h" ? (
          <>
            <Field label="Gregorian date">
              <TextInput
                type="date"
                value={gDate}
                onChange={(e) => setGDate(e.target.value)}
              />
            </Field>

            {hijriResult ? (
              <ResultBox>
                <ResultRow label="Hijri day" value={hijriResult.day} />
                <ResultRow label="Hijri month" value={hijriMonthName(hijriResult.month)} />
                <ResultRow label="Hijri year" value={`${hijriResult.year} AH`} />
                <ResultRow
                  label="Full date"
                  value={`${hijriResult.day} ${hijriMonthName(hijriResult.month)} ${hijriResult.year} AH`}
                />
              </ResultBox>
            ) : (
              <p style={{ color: "var(--muted-2)", fontSize: ".9rem" }}>Enter a valid date.</p>
            )}
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", gap: ".8rem" }}>
              <Field label="Day">
                <TextInput
                  type="number"
                  min={1}
                  max={30}
                  value={hDay}
                  onChange={(e) => setHDay(Number(e.target.value))}
                />
              </Field>
              <Field label="Month">
                <SelectInput value={hMonth} onChange={(e) => setHMonth(Number(e.target.value))}>
                  {HIJRI_MONTHS.map((name, i) => (
                    <option key={name} value={i + 1}>
                      {i + 1}. {name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Year (AH)">
                <TextInput
                  type="number"
                  min={1}
                  value={hYear}
                  onChange={(e) => setHYear(Number(e.target.value))}
                />
              </Field>
            </div>

            {gregResult ? (
              <ResultBox>
                <ResultRow label="Gregorian day" value={gregResult.day} />
                <ResultRow label="Gregorian month" value={GREGORIAN_MONTHS[gregResult.month - 1]} />
                <ResultRow label="Gregorian year" value={gregResult.year} />
                <ResultRow
                  label="Full date"
                  value={`${gregResult.day} ${GREGORIAN_MONTHS[gregResult.month - 1]} ${gregResult.year}`}
                />
              </ResultBox>
            ) : (
              <p style={{ color: "var(--muted-2)", fontSize: ".9rem" }}>Enter a valid Hijri date.</p>
            )}
          </>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          Based on tabular Islamic calendar calculation; may differ by 1 day from local moon-sighting
          announcements.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
