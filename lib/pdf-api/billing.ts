/** Human-friendly receipt number, e.g. AVX-PDF-202610-00012 */
export function receiptNo(id: number, paidAt: string | null): string {
  const d = paidAt ? new Date(paidAt) : new Date();
  const ym = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  return `AVX-PDF-${ym}-${String(id).padStart(5, "0")}`;
}
