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

export async function GET(req: NextRequest, { params }: any) {
  const payload = verifyToken(req);
  if (!payload)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  try {
    const id = params.id;
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (payload.role !== "admin") {
      const name = (payload.name || "").toString().trim();
      const email = (payload.email || "").toString().trim();
      if (!data || !isAuthorMatch(String(data?.author || ""), name, email)) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }
    return NextResponse.json({ ok: true, data, error });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  const payload = verifyToken(req);
  if (!payload)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  try {
    const id = params.id;
    const body = await req.json();

    if (payload.role !== "admin") {
      const name = (payload.name || "").toString().trim();
      const email = (payload.email || "").toString().trim();
      const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("articles")
        .select("author")
        .eq("id", id)
        .single();
      if (fetchErr)
        return NextResponse.json(
          { ok: false, error: String(fetchErr) },
          { status: 500 },
        );
      if (
        !existing ||
        !isAuthorMatch(String(existing?.author || ""), name, email)
      ) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 },
        );
      }
      // Non-admin: ensure their own name stays in the author list
      const selfName = name || email;
      if (selfName && body.author !== undefined) {
        const authorList = body.author
          ? body.author
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];
        if (!authorList.includes(selfName)) {
          authorList.unshift(selfName);
        }
        body.author = authorList.join(", ");
      } else if (selfName && body.author === undefined) {
        // keep existing author as-is; don't override
      }
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .update(body)
      .eq("id", id);
    return NextResponse.json({ ok: true, data, error });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  const payload = verifyToken(req);
  if (!payload)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  try {
    const id = params.id;
    if (payload.role !== "admin") {
      const name = (payload.name || "").toString().trim();
      const email = (payload.email || "").toString().trim();
      const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("articles")
        .select("author")
        .eq("id", id)
        .single();
      if (fetchErr)
        return NextResponse.json(
          { ok: false, error: String(fetchErr) },
          { status: 500 },
        );
      if (
        !existing ||
        !isAuthorMatch(String(existing?.author || ""), name, email)
      ) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("id", id);
    return NextResponse.json({ ok: true, data, error });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
