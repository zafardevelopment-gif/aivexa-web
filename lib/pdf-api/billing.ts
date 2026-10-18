/** Human-friendly receipt number, e.g. AVX-PDF-202610-00012 */
export function receiptNo(id: number, paidAt: string | null): string {
  const d = paidAt ? new Date(paidAt) : new Date();
  const ym = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  return `AVX-PDF-${ym}-${String(id).padStart(5, "0")}`;
}

/** GST added on top of plan prices (prices in the plans table are before GST). */
export const GST_RATE = 18;

export function withGst(basePaise: number) {
  const gst = Math.round((basePaise * GST_RATE) / 100);
  return { base: basePaise, gst, total: basePaise + gst, rate: GST_RATE };
}

/** AIVEXA LLP is registered in Bihar (state code 10): same state → CGST + SGST, else IGST. */
export const SELLER_STATE_CODE = "10";
