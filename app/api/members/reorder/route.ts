import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order } = body as { order?: string[] };
    if (!Array.isArray(order)) {
      return NextResponse.json(
        { success: false, error: { message: "order array required" } },
        { status: 400 },
      );
    }

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

    // Update each member's position based on the provided order array
    for (let i = 0; i < order.length; i++) {
      const id = order[i];
      // attempt update; continue on individual failures
      // set position as descending so newer/first item has smaller index? We'll store numeric index (0-based)
      await serverClient.from("members").update({ position: i }).match({ id });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: { message: e?.message ?? String(e) } },
      { status: 500 },
    );
  }
}
