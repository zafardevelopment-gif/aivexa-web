import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "(not set)";

  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set", from });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "AIVEXA Store <store@aivexallp.com>",
        to: ["mdzafareqbal@gmail.com"],
        subject: "AIVEXA Email Test",
        html: "<p>Test email from AIVEXA Store. If you see this, email is working!</p>",
      }),
    });
    const body = await res.json();
    return NextResponse.json({ status: res.status, body, from, keyPreview: apiKey.slice(0, 8) + "..." });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err), from });
  }
}
