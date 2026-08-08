import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key)
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "No file provided." }, { status: 400 });

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type))
      return NextResponse.json({ error: "Only JPG, PNG, WebP, GIF allowed." }, { status: 400 });

    // Max 5MB
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: "File must be under 5MB." }, { status: 400 });

    const sb = createClient(url, key);
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `products/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb.storage
      .from("digital-products")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (upErr) {
      // Bucket may not exist — try creating it then retry
      if (upErr.message?.includes("not found") || upErr.message?.includes("does not exist")) {
        await sb.storage.createBucket("digital-products", { public: true });
        const { error: upErr2 } = await sb.storage
          .from("digital-products")
          .upload(path, buffer, { contentType: file.type, upsert: false });
        if (upErr2)
          return NextResponse.json({ error: upErr2.message }, { status: 500 });
      } else {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
    }

    const { data } = sb.storage.from("digital-products").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("upload-image error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
