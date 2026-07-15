"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function parsePositive(v: string): number | null {
  const n = Number(v);
  if (v.trim() === "" || Number.isNaN(n) || n <= 0) return null;
  return n;
}

export default function FuelCostCalculatorTool() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [people, setPeople] = useState("");

  const d = parsePositive(distance);
  const m = parsePositive(mileage);
  const p = parsePositive(price);
  const peopleCount = parsePositive(people);

  const fuelNeeded = d !== null && m !== null ? d / m : null;
  const totalCost = fuelNeeded !== null && p !== null ? fuelNeeded * p : null;
  const perPerson =
    totalCost !== null && peopleCount !== null && peopleCount > 1
      ? totalCost / peopleCount
      : null;

  return (
    <ToolPageLayout
      title="Fuel Cost Calculator"
      description="Estimate fuel needed and total trip fuel cost, with optional per-person split."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <Field label="Trip Distance (km)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 250"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </Field>

        <Field label="Vehicle Mileage (km per litre)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 15"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
        </Field>

        <Field label="Fuel Price (₹ per litre)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>

        <Field label="Number of People (optional, for cost split)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 4"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </Field>

        {fuelNeeded !== null && totalCost !== null && (
          <ResultBox>
            <ResultRow label="Total Fuel Needed" value={`${fuelNeeded.toFixed(2)} L`} />
            <ResultRow label="Total Fuel Cost" value={`₹${totalCost.toFixed(2)}`} />
            {perPerson !== null && (
              <ResultRow
                label={`Cost per Person (${peopleCount})`}
                value={`₹${perPerson.toFixed(2)}`}
              />
            )}
          </ResultBox>
        )}

        {(fuelNeeded === null || totalCost === null) && (
          <p style={{ fontSize: ".88rem", color: "var(--muted-2)" }}>
            Enter distance, mileage and fuel price to see the cost estimate.
          </p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
