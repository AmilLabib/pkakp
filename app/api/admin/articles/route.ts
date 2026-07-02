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

/**
 * Check if a user (by name or email) is among the article's authors.
 * The author field may be a comma-separated list of names.
 */
function isAuthorMatch(
  authorField: string,
  name: string,
  email: string,
): boolean {
  if (!authorField) return false;
  const authorList = authorField
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const nameLower = name.toLowerCase();
  const emailLower = email.toLowerCase();
  return authorList.some(
    (a) =>
      (nameLower && (a === nameLower || a.includes(nameLower))) ||
      (emailLower && (a === emailLower || a.includes(emailLower))),
  );
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

    // For staff: filter articles where they are one of the authors
    const staffName = (payload.name || "").toString().trim();
    const staffEmail = (payload.email || "").toString().trim();

    const { data: allData, error: allError } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (allError) {
      return NextResponse.json({ ok: false, data: null, error: allError });
    }

    const filtered = Array.isArray(allData)
      ? allData.filter((art: any) =>
          isAuthorMatch(String(art.author || ""), staffName, staffEmail),
        )
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

    // Non-admin: ensure their own name is always included in the author list
    if (payload.role !== "admin") {
      const selfName = payload.name || payload.email || "";
      if (selfName) {
        // Parse the submitted author string and make sure selfName is present
        const authorList = author
          ? author
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];
        if (!authorList.includes(selfName)) {
          authorList.unshift(selfName);
        }
        author = authorList.join(", ");
      }
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
