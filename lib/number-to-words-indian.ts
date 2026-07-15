const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? " " + ONES[o] : "");
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let out = "";
  if (h) out += ONES[h] + " Hundred";
  if (rest) out += (out ? " " : "") + twoDigits(rest);
  return out;
}

/**
 * Convert an integer (0 – 99,99,99,99,999) to words using the Indian
 * numbering system (thousand, lakh, crore).
 */
export function numberToWordsIndian(num: number): string {
  if (!Number.isFinite(num)) return "";
  num = Math.floor(Math.abs(num));
  if (num === 0) return "Zero";

  const parts: string[] = [];
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  if (crore) {
    parts.push(
      (crore > 99 ? numberToWordsIndian(crore) : twoDigits(crore)) + " Crore",
    );
  }
  if (lakh) parts.push(twoDigits(lakh) + " Lakh");
  if (thousand) parts.push(twoDigits(thousand) + " Thousand");
  if (rest) parts.push(threeDigits(rest));

  return parts.join(" ");
}

/** Format a rupee amount as words, e.g. "Rupees One Lakh Twenty Thousand and Fifty Paise Only". */
export function rupeesInWords(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  const abs = Math.abs(amount);
  const rupees = Math.floor(abs);
  const paise = Math.round((abs - rupees) * 100);
  let out = "Rupees " + (rupees === 0 ? "Zero" : numberToWordsIndian(rupees));
  if (paise > 0) out += " and " + twoDigits(paise) + " Paise";
  return out + " Only";
}

/** Indian-grouped number string, e.g. 123456.5 -> "1,23,456.50" */
export function formatINR(amount: number, decimals = 2): string {
  if (!Number.isFinite(amount)) return "0.00";
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
