import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

function verifyToken(req: NextRequest) {
  const token = req.cookies.get("pkakp_admin_token")?.value;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!token || !secret) return null;
  try {
    return jwt.verify(token, secret) as Record<string, any>;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const payload = verifyToken(req);
  if (!payload)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  try {
    if (payload.role === "admin") {
      const { data, error } = await supabaseAdmin
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      return NextResponse.json({ ok: true, data, error });
    }

    // For staff: filter articles by their name or email
    const staffName = (payload.name || "").toString().trim();
    const staffEmail = (payload.email || "").toString().trim();

    // Get all articles and filter client-side since Supabase filter can be tricky
    const { data: allData, error: allError } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (allError) {
      return NextResponse.json({ ok: false, data: null, error: allError });
    }

    // Filter to only articles authored by this staff
    const filtered = Array.isArray(allData)
      ? allData.filter((art: any) => {
          const author = String(art.author || "").trim();
          return (
            author === staffName ||
            author === staffEmail ||
            author.toLowerCase() === staffName.toLowerCase() ||
            author.toLowerCase() === staffEmail.toLowerCase()
          );
        })
      : [];

    return NextResponse.json({ ok: true, data: filtered, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const payload = verifyToken(req);
  if (!payload)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  try {
    const body = await req.json();
    let author = body.author ?? null;

    // non-admin users must have their own name enforced as author
    if (payload.role !== "admin") {
      author = payload.name || payload.email || null;
    }

    const { data, error } = await supabaseAdmin.from("articles").insert([
      {
        title: body.title,
        desc: body.desc,
        image: body.image || "",
        author,
      },
    ]);

    return NextResponse.json({ ok: true, data, error });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
