export type LandUnit = "katha" | "bigha" | "acre" | "sqft" | "sqm";

export const LAND_UNIT_LABELS: Record<LandUnit, string> = {
  katha: "Katha",
  bigha: "Bigha",
  acre: "Acre",
  sqft: "Square Feet",
  sqm: "Square Meter",
};

const SQFT_PER_UNIT: Record<LandUnit, number> = {
  katha: 1361,
  bigha: 27220,
  acre: 43560,
  sqft: 1,
  sqm: 10.7639,
};

export function toSqFt(value: number, unit: LandUnit): number {
  return value * SQFT_PER_UNIT[unit];
}

export function fromSqFt(sqft: number, unit: LandUnit): number {
  return sqft / SQFT_PER_UNIT[unit];
}
