import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    "";
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let filename: string;
    let buffer: Buffer;
    let mimeType: string;

    // Support FormData (binary upload — fast) or JSON (base64 — legacy)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const path = formData.get("filename") as string | null;

      if (!file || !path) {
        return NextResponse.json(
          { success: false, error: { message: "file and filename required" } },
          { status: 400 },
        );
      }

      filename = path;
      mimeType = file.type || "application/octet-stream";
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Legacy JSON base64 path
      const body = await req.json();
      const { filename: fname, dataUrl } = body as {
        filename: string;
        dataUrl: string;
      };
      if (!fname || !dataUrl) {
        return NextResponse.json(
          {
            success: false,
            error: { message: "filename and dataUrl required" },
          },
          { status: 400 },
        );
      }

      const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json(
          { success: false, error: { message: "Invalid dataUrl" } },
          { status: 400 },
        );
      }

      mimeType = match[1];
      const base64 = match[2];
      buffer = Buffer.from(base64, "base64");
      filename = fname;
    }

    const serverClient = getServerClient();
    if (!serverClient) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Missing Supabase service role key or URL on server",
          },
        },
        { status: 500 },
      );
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public";

    const { error: uploadError } = await serverClient.storage
      .from(bucket)
      .upload(filename, buffer, { contentType: mimeType, upsert: true });

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          error: { message: uploadError.message || String(uploadError) },
        },
        { status: 500 },
      );
    }

    const { data: urlData } = serverClient.storage
      .from(bucket)
      .getPublicUrl(filename);
    return NextResponse.json({
      success: true,
      data: { publicUrl: urlData?.publicUrl || "" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: { message: e?.message ?? String(e) } },
      { status: 500 },
    );
  }
}
