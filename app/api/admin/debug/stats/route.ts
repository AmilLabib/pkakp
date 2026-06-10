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
    const staffName = (payload.name || "").toString().trim();
    const staffEmail = (payload.email || "").toString().trim();

    // Get all articles
    const { data: allArticles } = await supabaseAdmin
      .from("articles")
      .select("id, title, author, created_at")
      .order("created_at", { ascending: false });

    // Get staff's articles
    const staffArticles = (allArticles || []).filter((art: any) => {
      const author = String(art.author || "").trim();
      return (
        author === staffName ||
        author === staffEmail ||
        author.toLowerCase() === staffName.toLowerCase() ||
        author.toLowerCase() === staffEmail.toLowerCase()
      );
    });

    // Get stats for each staff article
    const statsPromises = staffArticles.map(async (art: any) => {
      const { count: likes } = await supabaseAdmin
        .from("article_likes")
        .select("id", { count: "exact" })
        .eq("article_id", art.id);

      const { count: comments } = await supabaseAdmin
        .from("article_comments")
        .select("id", { count: "exact" })
        .eq("article_id", art.id);

      return {
        ...art,
        likes: likes ?? 0,
        comments: comments ?? 0,
      };
    });

    const staffArticlesWithStats = await Promise.all(statsPromises);

    return NextResponse.json({
      ok: true,
      payload: {
        staffName,
        staffEmail,
        totalArticles: staffArticles.length,
        totalLikes: staffArticlesWithStats.reduce((s, a) => s + a.likes, 0),
        totalComments: staffArticlesWithStats.reduce(
          (s, a) => s + a.comments,
          0,
        ),
        articles: staffArticlesWithStats,
        allArticlesCount: allArticles?.length ?? 0,
        sampleArticles: (allArticles || []).slice(0, 3),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
