import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  // Auth check
  const cookie = req.cookies.get("aivexa_admin")?.value ?? "";
  if (!verifyToken(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key)
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "No file provided." }, { status: 400 });

    // Allow common digital product file types
    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream",
      "application/pdf",
      "application/epub+zip",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
    ];

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const allowedExts = ["zip", "pdf", "epub", "xlsx", "xls", "docx", "doc", "txt", "csv", "rar", "7z"];

    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} not allowed. Allowed: ${allowedExts.join(", ")}` },
        { status: 400 }
      );
    }

    // Max 100MB
    if (file.size > 100 * 1024 * 1024)
      return NextResponse.json({ error: "File must be under 100MB." }, { status: 400 });

    const sb = createClient(url, key);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const path = `downloads/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb.storage
      .from("digital-products")
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (upErr) {
      // Bucket may not exist — create and retry
      if (upErr.message?.includes("not found") || upErr.message?.includes("does not exist")) {
        await sb.storage.createBucket("digital-products", { public: false });
        const { error: upErr2 } = await sb.storage
          .from("digital-products")
          .upload(path, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (upErr2)
          return NextResponse.json({ error: upErr2.message }, { status: 500 });
      } else {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
    }

    // Return public URL (bucket should be private for real security,
    // but for simplicity using public URL — can sign later)
    const { data } = sb.storage.from("digital-products").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, filename: safeName, size: file.size });
  } catch (err) {
    console.error("upload-product-file error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
