import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body as { id: string };
    if (!id)
      return NextResponse.json(
        { success: false, error: { message: "id required" } },
        { status: 400 },
      );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
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

    const { data, error } = await serverClient
      .from("members")
      .delete()
      .match({ id });
    if (error)
      return NextResponse.json(
        { success: false, error: { message: error.message || String(error) } },
        { status: 500 },
      );
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: { message: e?.message ?? String(e) } },
      { status: 500 },
    );
  }
}
