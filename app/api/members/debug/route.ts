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

    // Try selecting position explicitly to see if column exists
    const { data: posData, error: posError } = await serverClient
      .from("members")
      .select("id,name,role,photo,position,created_at")
      .order("position", { ascending: true });

    if (posError) {
      // return helpful diagnostics
      const { data: allData, error: allError } = await serverClient
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });
      return NextResponse.json({
        success: true,
        positionColumnExists: false,
        positionError: posError.message || String(posError),
        data: allData ?? [],
        allError: allError ? allError.message || String(allError) : null,
      });
    }

    return NextResponse.json({
      success: true,
      positionColumnExists: true,
      data: posData,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: { message: e?.message ?? String(e) } },
      { status: 500 },
    );
  }
}
