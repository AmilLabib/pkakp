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

    const name = (payload.name || "").toString().trim();
    const email = (payload.email || "").toString().trim();

    // Build OR filter: exact matches or case-insensitive contains
    const clauses: string[] = [];
    const safe = (v: string) => v.replace(/,/g, "");
    if (name) {
      clauses.push(`author.eq.${safe(name)}`);
      clauses.push(`author.ilike.%${safe(name)}%`);
    }
    if (email) {
      clauses.push(`author.eq.${safe(email)}`);
      clauses.push(`author.ilike.%${safe(email)}%`);
    }

    if (clauses.length === 0) {
      return NextResponse.json({ ok: true, data: [], error: null });
    }

    const filter = clauses.join(",");
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .or(filter)
      .order("created_at", { ascending: false });
    return NextResponse.json({ ok: true, data, error });
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
