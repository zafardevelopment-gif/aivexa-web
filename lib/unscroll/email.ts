/** Sends the sign-in code with Resend (RESEND_API_KEY, already used by the AIVEXA site). */
export async function sendCodeEmail(to: string, code: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const from = process.env.UNSCROLL_EMAIL_FROM || "Unscroll <no-reply@aivexallp.com>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${code} is your Unscroll code`,
      text: `Your Unscroll sign-in code is ${code}.\n\nIt expires in 10 minutes. If you did not ask for it, ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;color:#0B1533"><p>Your Unscroll sign-in code is</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p style="color:#5B6680">It expires in 10 minutes. If you did not ask for it, ignore this email.</p></div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}
