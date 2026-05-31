import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, dataUrl } = body as { filename: string; dataUrl: string };
    if (!filename || !dataUrl) {
      return NextResponse.json(
        { success: false, error: { message: "filename and dataUrl required" } },
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

    const contentType = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    // allow multiple env var names (some devs mistakenly add NEXT_PUBLIC_ prefix)
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
      "";
    if (!supabaseUrl || !serviceRoleKey) {
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

    const serverClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public";

    const { error: uploadError } = await serverClient.storage
      .from(bucket)
      .upload(filename, buffer, { contentType, upsert: true });

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
