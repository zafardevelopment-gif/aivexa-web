// Vercel Blob client-upload handshake: browser uploads the .aab DIRECTLY
// to Vercel Blob (no serverless body limits, no Supabase 50MB cap).
// Requires BLOB_READ_WRITE_TOKEN env (auto-set when a Blob store is
// connected to the project in Vercel → Storage).
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";

export async function POST(request: Request): Promise<NextResponse> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["application/octet-stream", "application/x-authorware-bin"],
        maximumSizeInBytes: 500 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // aab_path is registered by the client via the registerAab server action.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch {
    return NextResponse.json({ error: "Could not authorize upload." }, { status: 400 });
  }
}
