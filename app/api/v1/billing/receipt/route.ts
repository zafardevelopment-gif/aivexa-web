/**
 * GET /api/v1/billing/receipt?id=<payment id>
 * Returns a PDF payment receipt, rendered with our own PDF engine.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generatePdf } from "@/lib/pdf-api/pdf-engine";
import { siteConfig } from "@/lib/seo/config";
import { receiptNo, SELLER_STATE_CODE } from "@/lib/pdf-api/billing";

export const runtime = "nodejs";
export const maxDuration = 60;

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const inr = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const day = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Receipt id required" }, { status: 400 });

  const { data: p } = await db
    .from("pdfapi_payment_orders")
    .select("id, order_id, plan_id, cycle, amount, base_amount, gst_amount, gst_rate, status, payment_id, paid_at, pdfapi_plans(name, credits)")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "paid")
    .maybeSingle();
  if (!p) return NextResponse.json({ error: "Receipt not found" }, { status: 404 });

  const { data: u } = await db
    .from("pdfapi_users")
    .select("billing_name, billing_company, billing_gstin, billing_address")
    .eq("id", user.id)
    .single();

  const plan = (p.pdfapi_plans as unknown) as { name?: string; credits?: number } | null;
  const start = new Date(p.paid_at ?? Date.now());
  const end = new Date(start);
  if (p.cycle === "yearly") end.setFullYear(end.getFullYear() + 1); else end.setMonth(end.getMonth() + 1);
  const no = receiptNo(p.id, p.paid_at);
  // GST split (orders before GST was introduced have no split → no tax lines)
  const base = p.base_amount ?? p.amount;
  const gst = p.gst_amount ?? 0;
  const rate = Number(p.gst_rate ?? 0);
  const buyerGstin = (u?.billing_gstin ?? "").toUpperCase();
  const intraState = buyerGstin.startsWith(SELLER_STATE_CODE);
  const taxRows = gst > 0
    ? (intraState
        ? `<tr><td colspan="2" class="r">CGST @ ${rate / 2}%</td><td class="r">${inr(Math.floor(gst / 2))}</td></tr><tr><td colspan="2" class="r">SGST @ ${rate / 2}%</td><td class="r">${inr(gst - Math.floor(gst / 2))}</td></tr>`
        : `<tr><td colspan="2" class="r">IGST @ ${rate}%</td><td class="r">${inr(gst)}</td></tr>`)
    : "";
  const title = gst > 0 ? "TAX INVOICE" : "PAYMENT RECEIPT";
  const e = siteConfig.entity;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    @page { size: A4; margin: 18mm 16mm; }
    * { box-sizing: border-box; } body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; font-size: 12px; margin: 0; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #6366f1; padding-bottom: 14px; }
    .brand { font-size: 22px; font-weight: 800; color: #111827; } .brand span { color: #6366f1; }
    .muted { color: #6b7280; } h2 { margin: 0; font-size: 18px; letter-spacing: 1px; color: #6366f1; text-align: right; }
    .grid { display: flex; gap: 24px; margin: 22px 0; } .grid > div { flex: 1; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding: 8px 6px; }
    td { padding: 10px 6px; border-bottom: 1px solid #f3f4f6; vertical-align: top; } .r { text-align: right; }
    .total td { font-weight: 700; font-size: 14px; border-bottom: 0; border-top: 2px solid #111827; }
    .paid { display: inline-block; background: #dcfce7; color: #166534; font-weight: 700; padding: 3px 10px; border-radius: 999px; font-size: 11px; }
    .foot { margin-top: 30px; font-size: 10px; color: #6b7280; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 10px; }
  </style></head><body>
    <div class="top">
      <div><div class="brand">AIVEXA <span>PDF API</span></div>
        <div class="muted" style="margin-top:6px;line-height:1.6">${esc(e.legalName)}<br>${esc(e.address.locality)}, ${esc(e.address.region)}, India<br>GSTIN: ${esc(e.gstin)}<br>${esc(e.email)}</div></div>
      <div><h2>${title}</h2>
        <div class="muted" style="text-align:right;margin-top:8px;line-height:1.7">Invoice no: <b style="color:#111827">${esc(no)}</b><br>Date: ${esc(day(start))}<br><span class="paid">PAID</span></div></div>
    </div>
    <div class="grid">
      <div><div class="label">Billed to</div>
        <div style="line-height:1.6"><b>${esc(u?.billing_name || user.email)}</b>${u?.billing_company ? `<br>${esc(u.billing_company)}` : ""}${u?.billing_address ? `<br>${esc(u.billing_address).replace(/\n/g, "<br>")}` : ""}${u?.billing_gstin ? `<br>GSTIN: ${esc(u.billing_gstin)}` : ""}<br>${esc(user.email)}</div></div>
      <div><div class="label">Payment</div>
        <div style="line-height:1.6">Method: Razorpay<br>Payment ID: ${esc(p.payment_id)}<br>Order ID: ${esc(p.order_id)}</div></div>
    </div>
    <table>
      <tr><th>Description</th><th>Period</th><th class="r">Amount</th></tr>
      <tr><td><b>AIVEXA PDF API — ${esc(plan?.name ?? p.plan_id)} plan (${p.cycle === "yearly" ? "yearly" : "monthly"})</b><br><span class="muted">${(plan?.credits ?? 0).toLocaleString("en-IN")} PDFs per month</span></td>
        <td>${esc(day(start))} – ${esc(day(end))}</td><td class="r">${inr(base)}</td></tr>
      ${gst > 0 ? `<tr><td colspan="2" class="r">Taxable value</td><td class="r">${inr(base)}</td></tr>` : ""}
      ${taxRows}
      <tr class="total"><td colspan="2">Total paid</td><td class="r">${inr(p.amount)}</td></tr>
    </table>
    <div class="foot">This is a computer-generated document and does not need a signature. Place of supply: ${intraState ? "Bihar" : buyerGstin ? "as per buyer GSTIN" : "as per billing address"}.
      For any billing question, write to ${esc(e.email)} with the invoice number.</div>
  </body></html>`;

  const result = await generatePdf({ html, format: "A4", printBackground: true, waitUntil: "load", margin: { top: "0", right: "0", bottom: "0", left: "0" } });
  if (!result.ok) return NextResponse.json({ error: "Could not create the receipt. Please try again." }, { status: 500 });

  return new Response(new Uint8Array(result.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${no}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
