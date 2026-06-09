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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
      const author = (data?.author || "").toString();
      const matches =
        (name && author === name) ||
        (email && author === email) ||
        (name && author.toLowerCase().includes(name.toLowerCase())) ||
        (email && author.toLowerCase().includes(email.toLowerCase()));
      if (!data || !matches) {
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
      const author = (existing?.author || "").toString();
      const matches =
        (name && author === name) ||
        (email && author === email) ||
        (name && author.toLowerCase().includes(name.toLowerCase())) ||
        (email && author.toLowerCase().includes(email.toLowerCase()));
      if (!existing || !matches) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 },
        );
      }
      body.author = name || email;
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
      const author = (existing?.author || "").toString();
      const matches =
        (name && author === name) ||
        (email && author === email) ||
        (name && author.toLowerCase().includes(name.toLowerCase())) ||
        (email && author.toLowerCase().includes(email.toLowerCase()));
      if (!existing || !matches) {
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
