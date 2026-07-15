export type HeirInput = {
  spouseType: "none" | "husband" | "wife";
  wivesCount: number;
  sons: number;
  daughters: number;
  fatherAlive: boolean;
  motherAlive: boolean;
  grandfatherAlive: boolean;
  fullBrothers: number;
  fullSisters: number;
  consanguineBrothers: number;
  consanguineSisters: number;
  uterineBrothers: number;
  uterineSisters: number;
};

export type HeirShare = {
  heir: string;
  count: number;
  numerator: number;
  denominator: number;
  fraction: string;
  percent: number;
};

export type FaraidResult =
  | {
      supported: true;
      shares: HeirShare[];
      denominator: number;
      notes: string[];
    }
  | {
      supported: false;
      reason: string;
    };

function gcd(a: number, b: number): number {
  a = Math.round(Math.abs(a));
  b = Math.round(Math.abs(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function simplify(num: number, den: number): { num: number; den: number } {
  const n = Math.round(num);
  const d = Math.round(den);
  const g = gcd(n, d);
  return { num: n / g, den: d / g };
}

export function defaultHeirInput(): HeirInput {
  return {
    spouseType: "none",
    wivesCount: 1,
    sons: 0,
    daughters: 0,
    fatherAlive: false,
    motherAlive: false,
    grandfatherAlive: false,
    fullBrothers: 0,
    fullSisters: 0,
    consanguineBrothers: 0,
    consanguineSisters: 0,
    uterineBrothers: 0,
    uterineSisters: 0,
  };
}

export function calculateFaraidShares(input: HeirInput): FaraidResult {
  const notes: string[] = [];

  const hasSons = input.sons > 0;
  const hasDaughters = input.daughters > 0;
  const hasDescendants = hasSons || hasDaughters;
  const hasFather = input.fatherAlive;
  const hasMother = input.motherAlive;
  const hasGrandfather = !hasFather && input.grandfatherAlive;

  const hasFullSiblings = input.fullBrothers > 0 || input.fullSisters > 0;
  const hasConsanguineSiblings =
    input.consanguineBrothers > 0 || input.consanguineSisters > 0;
  const hasUterineSiblings =
    input.uterineBrothers > 0 || input.uterineSisters > 0;
  const hasAnySiblings =
    hasFullSiblings || hasConsanguineSiblings || hasUterineSiblings;

  const siblingsBlocked = hasFather || hasSons || hasGrandfather;
  if (hasDaughters && !hasSons && hasAnySiblings && !hasFather && !hasGrandfather) {
    notes.push(
      "Daughters present with no sons and no father/grandfather: full/consanguine brothers and sisters inherit as residuaries (asabah) taking what remains after fixed shares; sisters become residuary alongside daughters."
    );
  }

  const uterineBlocked =
    hasFather || hasGrandfather || hasSons || hasDaughters;

  if (
    (input.fullBrothers > 0 && input.fullSisters > 0 && input.fullBrothers + input.fullSisters > 20) ||
    input.wivesCount > 4
  ) {
    return { supported: false, reason: "Unsupported heir combination — please consult a scholar." };
  }

  if (
    hasGrandfather &&
    (hasFullSiblings || hasConsanguineSiblings)
  ) {
    return {
      supported: false,
      reason:
        "This combination (grandfather inheriting together with full or consanguine siblings) involves classical scholarly disagreement (the 'Akdariyyah'-type and grandfather-with-siblings rulings) that is not fully supported by this simplified tool — please consult a scholar.",
    };
  }

  type Raw = { heir: string; count: number; num: number; den: number };
  const fixed: Raw[] = [];
  let denominator = 1;

  function addFixed(heir: string, count: number, num: number, den: number) {
    denominator = lcm(denominator, den);
    fixed.push({ heir, count, num, den });
  }

  if (input.spouseType === "husband") {
    if (hasDescendants) {
      addFixed("Husband", 1, 1, 4);
    } else {
      addFixed("Husband", 1, 1, 2);
    }
  } else if (input.spouseType === "wife") {
    const wives = Math.max(1, Math.min(4, input.wivesCount || 1));
    if (hasDescendants) {
      addFixed("Wife/Wives", wives, 1, 8);
    } else {
      addFixed("Wife/Wives", wives, 1, 4);
    }
  }

  const bothParentsNoDescendantsWithSpouse =
    hasFather &&
    hasMother &&
    !hasDescendants &&
    !(input.fullBrothers + input.fullSisters + input.consanguineBrothers + input.consanguineSisters + input.uterineBrothers + input.uterineSisters >= 2) &&
    input.spouseType !== "none";

  const siblingCountForMotherBlock =
    input.fullBrothers +
    input.fullSisters +
    input.consanguineBrothers +
    input.consanguineSisters +
    input.uterineBrothers +
    input.uterineSisters;

  let motherFraction: { num: number; den: number } | null = null;
  if (hasMother) {
    if (hasDescendants || siblingCountForMotherBlock >= 2) {
      motherFraction = { num: 1, den: 6 };
    } else if (bothParentsNoDescendantsWithSpouse) {
      const spouseShare =
        input.spouseType === "husband" ? { num: 1, den: 2 } : { num: 1, den: 4 };
      const remAfterSpouse = simplify(spouseShare.den - spouseShare.num, spouseShare.den);
      motherFraction = simplify(remAfterSpouse.num, remAfterSpouse.den * 3);
      notes.push(
        "Gharrawayn/Umariyyatan case applied: mother receives 1/3 of the remainder after the spouse's share (not 1/3 of the whole estate), since both parents and a spouse are present with no children."
      );
    } else {
      motherFraction = { num: 1, den: 3 };
    }
    addFixed("Mother", 1, motherFraction.num, motherFraction.den);
  }

  const fatherGetsResidueOnly = hasFather && !hasDescendants;
  if (hasFather && hasDescendants) {
    addFixed("Father", 1, 1, 6);
  }

  if (hasGrandfather && hasDescendants) {
    addFixed("Grandfather", 1, 1, 6);
  }

  if (!hasFather && !hasSons && input.daughters > 0) {
    if (input.daughters === 1) {
      addFixed("Daughter(s)", input.daughters, 1, 2);
    } else {
      addFixed("Daughter(s)", input.daughters, 2, 3);
    }
  }

  if (!hasSons && !hasFather && !hasGrandfather && !hasDaughters && hasFullSiblings) {
    if (input.fullBrothers === 0 && input.fullSisters === 1) {
      addFixed("Full Sister(s)", input.fullSisters, 1, 2);
    } else if (input.fullBrothers === 0 && input.fullSisters >= 2) {
      addFixed("Full Sister(s)", input.fullSisters, 2, 3);
    }
  }

  if (
    !hasSons &&
    !hasFather &&
    !hasGrandfather &&
    !hasDaughters &&
    !hasFullSiblings &&
    hasConsanguineSiblings
  ) {
    if (input.consanguineBrothers === 0 && input.consanguineSisters === 1) {
      addFixed("Consanguine Sister(s)", input.consanguineSisters, 1, 2);
    } else if (input.consanguineBrothers === 0 && input.consanguineSisters >= 2) {
      addFixed("Consanguine Sister(s)", input.consanguineSisters, 2, 3);
    }
  }

  if (!uterineBlocked && hasUterineSiblings) {
    const uCount = input.uterineBrothers + input.uterineSisters;
    if (uCount === 1) {
      addFixed("Uterine Sibling", uCount, 1, 6);
    } else {
      addFixed("Uterine Siblings", uCount, 1, 3);
    }
  }

  let totalNum = 0;
  const scaledFixed = fixed.map((f) => {
    const scaled = f.num * (denominator / f.den);
    totalNum += scaled;
    return { ...f, scaledNum: scaled };
  });

  const residuaries: { heir: string; count: number; weight: number }[] = [];
  if (hasSons || hasDaughters) {
    if (hasSons) residuaries.push({ heir: "Son(s)", count: input.sons, weight: 2 });
    if (hasDaughters) {
      if (hasSons) {
        residuaries.push({ heir: "Daughter(s)", count: input.daughters, weight: 1 });
        const idx = scaledFixed.findIndex((f) => f.heir === "Daughter(s)");
        if (idx >= 0) {
          scaledFixed.splice(idx, 1);
        }
      }
    }
  } else if (fatherGetsResidueOnly) {
    residuaries.push({ heir: "Father", count: 1, weight: 1 });
  } else if (hasGrandfather && !hasFather && !hasDescendants) {
    residuaries.push({ heir: "Grandfather", count: 1, weight: 1 });
  } else if (!siblingsBlocked && hasFullSiblings && (input.fullBrothers > 0 || (hasDaughters === false))) {
    if (input.fullBrothers > 0) {
      residuaries.push({ heir: "Full Brother(s)", count: input.fullBrothers, weight: 2 });
      if (input.fullSisters > 0) {
        residuaries.push({ heir: "Full Sister(s)", count: input.fullSisters, weight: 1 });
        const idx = scaledFixed.findIndex((f) => f.heir === "Full Sister(s)");
        if (idx >= 0) scaledFixed.splice(idx, 1);
      }
    }
  } else if (
    !siblingsBlocked &&
    !hasFullSiblings &&
    hasConsanguineSiblings &&
    input.consanguineBrothers > 0
  ) {
    residuaries.push({ heir: "Consanguine Brother(s)", count: input.consanguineBrothers, weight: 2 });
    if (input.consanguineSisters > 0) {
      residuaries.push({ heir: "Consanguine Sister(s)", count: input.consanguineSisters, weight: 1 });
      const idx = scaledFixed.findIndex((f) => f.heir === "Consanguine Sister(s)");
      if (idx >= 0) scaledFixed.splice(idx, 1);
    }
  }

  if (hasDaughters && !hasSons && !siblingsBlocked && (hasFullSiblings || hasConsanguineSiblings) && residuaries.length === 0) {
    if (hasFullSiblings) {
      if (input.fullBrothers > 0) {
        residuaries.push({ heir: "Full Brother(s)", count: input.fullBrothers, weight: 2 });
        if (input.fullSisters > 0) {
          residuaries.push({ heir: "Full Sister(s)", count: input.fullSisters, weight: 1 });
          const idx = scaledFixed.findIndex((f) => f.heir === "Full Sister(s)");
          if (idx >= 0) scaledFixed.splice(idx, 1);
        }
      } else {
        const idx = scaledFixed.findIndex((f) => f.heir === "Full Sister(s)");
        if (idx >= 0) {
          scaledFixed.splice(idx, 1);
          residuaries.push({ heir: "Full Sister(s) (residuary with daughters)", count: input.fullSisters, weight: 1 });
        }
      }
    } else if (hasConsanguineSiblings) {
      if (input.consanguineBrothers > 0) {
        residuaries.push({ heir: "Consanguine Brother(s)", count: input.consanguineBrothers, weight: 2 });
        if (input.consanguineSisters > 0) {
          residuaries.push({ heir: "Consanguine Sister(s)", count: input.consanguineSisters, weight: 1 });
          const idx = scaledFixed.findIndex((f) => f.heir === "Consanguine Sister(s)");
          if (idx >= 0) scaledFixed.splice(idx, 1);
        }
      } else {
        const idx = scaledFixed.findIndex((f) => f.heir === "Consanguine Sister(s)");
        if (idx >= 0) {
          scaledFixed.splice(idx, 1);
          residuaries.push({ heir: "Consanguine Sister(s) (residuary with daughters)", count: input.consanguineSisters, weight: 1 });
        }
      }
    }
  }

  totalNum = 0;
  for (const f of scaledFixed) totalNum += f.scaledNum;

  const remaining = Math.round((denominator - totalNum) * 1e6) / 1e6;

  const finalShares: HeirShare[] = [];

  for (const f of scaledFixed) {
    const s = simplify(f.scaledNum, denominator);
    finalShares.push({
      heir: f.heir,
      count: f.count,
      numerator: s.num,
      denominator: s.den,
      fraction: `${s.num}/${s.den}`,
      percent: (f.scaledNum / denominator) * 100,
    });
  }

  if (residuaries.length > 0 && remaining > 0) {
    const totalWeight = residuaries.reduce((sum, r) => sum + r.count * r.weight, 0);
    if (totalWeight > 0) {
      for (const r of residuaries) {
        const share = remaining * ((r.count * r.weight) / totalWeight);
        const s = simplify(share, denominator);
        finalShares.push({
          heir: r.heir,
          count: r.count,
          numerator: s.num,
          denominator: s.den,
          fraction: `${s.num}/${s.den}`,
          percent: (share / denominator) * 100,
        });
      }
    }
  } else if (remaining > 0 && residuaries.length === 0) {
    if (hasFather) {
      const idx = finalShares.findIndex((f) => f.heir === "Father");
      if (idx >= 0) {
        const extra = remaining;
        const combined = (fixed.find((f) => f.heir === "Father")?.num ?? 0) * (denominator / (fixed.find((f) => f.heir === "Father")?.den ?? 1)) + extra;
        const s = simplify(combined, denominator);
        finalShares[idx] = {
          heir: "Father (fixed 1/6 + residue)",
          count: 1,
          numerator: s.num,
          denominator: s.den,
          fraction: `${s.num}/${s.den}`,
          percent: (combined / denominator) * 100,
        };
      } else {
        const s = simplify(remaining, denominator);
        finalShares.push({
          heir: "Father (residue)",
          count: 1,
          numerator: s.num,
          denominator: s.den,
          fraction: `${s.num}/${s.den}`,
          percent: (remaining / denominator) * 100,
        });
      }
    } else if (hasGrandfather) {
      const s = simplify(remaining, denominator);
      finalShares.push({
        heir: "Grandfather (residue)",
        count: 1,
        numerator: s.num,
        denominator: s.den,
        fraction: `${s.num}/${s.den}`,
        percent: (remaining / denominator) * 100,
      });
    } else {
      notes.push(
        "There is leftover estate (radd) with no residuary heir identified among the supported categories in this tool. In classical Faraid, this surplus is normally returned (radd) proportionally to eligible Quranic-share heirs (excluding spouse in most Hanafi views), or escheats to the public treasury (Bayt al-Mal) if no eligible relative exists. This tool does not automatically redistribute the surplus — please consult a scholar for the correct radd distribution."
      );
      const s = simplify(remaining, denominator);
      finalShares.push({
        heir: "Unallocated residue (see note)",
        count: 0,
        numerator: s.num,
        denominator: s.den,
        fraction: `${s.num}/${s.den}`,
        percent: (remaining / denominator) * 100,
      });
    }
  }

  if (finalShares.length === 0) {
    return {
      supported: false,
      reason: "No heirs selected — please select at least one heir.",
    };
  }

  return { supported: true, shares: finalShares, denominator, notes };
}
