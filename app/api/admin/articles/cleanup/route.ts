import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("pkakp_admin_token")?.value;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!token || !secret) return null;
  try {
    const payload = jwt.verify(token, secret) as Record<string, any>;
    if (payload.role !== "admin") return null;
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * GET: List all articles and show which ones don't have author
 * POST: Bulk update articles to set author field
 */
export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json(
      { ok: false, error: "Unauthorized - admin only" },
      { status: 401 },
    );

  try {
    const { data: articles } = await supabaseAdmin
      .from("articles")
      .select("id, title, author, created_at")
      .order("created_at", { ascending: false });

    const withoutAuthor = (articles || []).filter(
      (a: any) => !a.author || a.author.trim() === "",
    );
    const withAuthor = (articles || []).filter(
      (a: any) => a.author && a.author.trim() !== "",
    );

    return NextResponse.json({
      ok: true,
      summary: {
        total: articles?.length ?? 0,
        withAuthor: withAuthor.length,
        withoutAuthor: withoutAuthor.length,
      },
      articlesWithoutAuthor: withoutAuthor.map((a: any) => ({
        id: a.id,
        title: a.title,
        author: a.author,
        created_at: a.created_at,
      })),
      sampleWithAuthor: withAuthor.slice(0, 3).map((a: any) => ({
        id: a.id,
        title: a.title,
        author: a.author,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}

/**
 * POST: Bulk set author for articles
 * Body: { authorName: string, articleIds?: string[] }
 *
 * If articleIds not provided, sets author for ALL articles without author
 */
export async function POST(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json(
      { ok: false, error: "Unauthorized - admin only" },
      { status: 401 },
    );

  try {
    const body = await req.json();
    const { authorName, articleIds } = body;

    if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
      return NextResponse.json(
        { ok: false, error: "authorName is required and must be non-empty" },
        { status: 400 },
      );
    }

    const trimmedAuthor = authorName.trim();

    // Build query
    let query = supabaseAdmin
      .from("articles")
      .update({ author: trimmedAuthor });

    if (articleIds && Array.isArray(articleIds) && articleIds.length > 0) {
      // Update specific articles
      query = query.in("id", articleIds);
    } else {
      // Update all articles without author
      query = query.or("author.is.null,author.eq.").throwOnError();
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Updated ${count} articles with author="${trimmedAuthor}"`,
      count,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
