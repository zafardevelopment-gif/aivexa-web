"use client";

import { Field, SelectInput, TextInput } from "@/components/tools/ToolUI";
import type { HeirInput } from "@/lib/faraid";

export default function HeirSelector({
  value,
  onChange,
}: {
  value: HeirInput;
  onChange: (v: HeirInput) => void;
}) {
  function set<K extends keyof HeirInput>(key: K, v: HeirInput[K]) {
    onChange({ ...value, [key]: v });
  }

  function numField(key: keyof HeirInput, label: string) {
    return (
      <Field label={label}>
        <TextInput
          type="number"
          min={0}
          value={value[key] as number}
          onChange={(e) => set(key, Math.max(0, parseInt(e.target.value, 10) || 0) as HeirInput[typeof key])}
        />
      </Field>
    );
  }

  return (
    <div>
      <Field label="Spouse">
        <SelectInput
          value={value.spouseType}
          onChange={(e) => set("spouseType", e.target.value as HeirInput["spouseType"])}
        >
          <option value="none">None</option>
          <option value="husband">Husband (deceased is the wife)</option>
          <option value="wife">Wife/Wives (deceased is the husband)</option>
        </SelectInput>
      </Field>

      {value.spouseType === "wife" && (
        <Field label="Number of surviving wives (1-4)">
          <TextInput
            type="number"
            min={1}
            max={4}
            value={value.wivesCount}
            onChange={(e) => set("wivesCount", Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1)))}
          />
        </Field>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
        {numField("sons", "Sons (count)")}
        {numField("daughters", "Daughters (count)")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
        <Field label="Father alive?">
          <SelectInput
            value={value.fatherAlive ? "yes" : "no"}
            onChange={(e) => set("fatherAlive", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectInput>
        </Field>
        <Field label="Mother alive?">
          <SelectInput
            value={value.motherAlive ? "yes" : "no"}
            onChange={(e) => set("motherAlive", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectInput>
        </Field>
      </div>

      {!value.fatherAlive && (
        <Field label="Paternal grandfather alive? (only relevant since father is deceased)">
          <SelectInput
            value={value.grandfatherAlive ? "yes" : "no"}
            onChange={(e) => set("grandfatherAlive", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectInput>
        </Field>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
        {numField("fullBrothers", "Full brothers (count)")}
        {numField("fullSisters", "Full sisters (count)")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
        {numField("consanguineBrothers", "Consanguine (paternal) brothers")}
        {numField("consanguineSisters", "Consanguine (paternal) sisters")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
        {numField("uterineBrothers", "Uterine (maternal) brothers")}
        {numField("uterineSisters", "Uterine (maternal) sisters")}
      </div>
    </div>
  );
}
