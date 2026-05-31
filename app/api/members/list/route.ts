import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
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

    // Try ordering by `position` if the column exists; otherwise fall back to created_at.
    let data = null;
    let error = null;

    try {
      const res = await serverClient
        .from("members")
        .select("*")
        .order("position", { ascending: true });
      data = res.data;
      error = res.error;
      if (error && /column|undefined/i.test(String(error.message || ""))) {
        // fallback
        const res2 = await serverClient
          .from("members")
          .select("*")
          .order("created_at", { ascending: false });
        data = res2.data;
        error = res2.error;
      }
    } catch (err: any) {
      // fallback to created_at ordering
      const res2 = await serverClient
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });
      data = res2.data;
      error = res2.error;
    }

    if (error) {
      return NextResponse.json(
        { success: false, error: { message: error.message || String(error) } },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: { message: e?.message ?? String(e) } },
      { status: 500 },
    );
  }
}
