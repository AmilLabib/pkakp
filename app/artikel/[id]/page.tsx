"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageWithPlaceholder from "../../components/shared/ImageWithPlaceholder";
import FooterSection from "../../components/FooterSection";
import {
  fetchArticles,
  fetchArticleLikeCount,
  fetchCommentsByArticle,
  addArticleComment,
  toggleArticleLike,
} from "../../../lib/supabaseClient";
import {
  extractFirstImageSrc,
  removeFirstImageTag,
} from "../../../lib/excerpt";

type Article = {
  title: string;
  desc: string;
  date: string;
  image: string;
  author?: string;
  id?: string;
};

export default function ArticleDetailPage() {
  const params = useParams();
  const idStr = params?.id as string | undefined;
  const id = idStr ? Number(idStr) : NaN;

  const [articles, setArticles] = useState<Article[]>([]);
  // article list
  const [likesCount, setLikesCount] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchArticles();
        if (!error && data) {
          const mapped = data.map((d: any) => {
            const descHtml = d.desc || "";
            const imageFromField = d.image && d.image !== "" ? d.image : null;
            const imageFromContent = !imageFromField
              ? extractFirstImageSrc(descHtml)
              : null;

            const usedImage = imageFromField || imageFromContent || "";
            // if we used imageFromContent, strip the first image tag from the desc so it doesn't show twice
            const finalDesc = imageFromContent
              ? removeFirstImageTag(descHtml)
              : descHtml;

            return {
              title: d.title || "",
              desc: finalDesc,
              author: d.author || "",
              id: d.id,
              date: d.created_at
                ? new Date(d.created_at).toLocaleDateString()
                : "",
              image: usedImage,
            };
          });
          setArticles(mapped);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const article = useMemo(() => {
    if (!Number.isFinite(id)) return undefined;
    return articles[id];
  }, [id, articles]);
  // compute recent and fetch likes/comments for the article
  const recent = articles.slice(0, 5).filter((_, i) => i !== id);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (article?.id) {
          const l = await fetchArticleLikeCount(String(article.id));
          const c = await fetchCommentsByArticle(String(article.id));
          if (mounted) {
            setLikesCount(l.count ?? 0);
            setComments(Array.isArray(c.data) ? c.data : []);
          }
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [article?.id]);

  if (!article) {
    return (
      <main className="w-full pt-24 md:pt-28">
        <div className="max-w-500 mx-auto px-5 md:px-8 py-12">
          <h2 className="text-xl font-bold mb-2">Artikel tidak ditemukan</h2>
          <p className="text-sm text-gray-600">
            ID yang diminta: {String(idStr)}
          </p>
          <p className="mt-2">Jumlah artikel tersedia: {articles.length}</p>
        </div>
      </main>
    );
  }

  const handleLike = async () => {
    if (!article?.id) return;
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const json = await res.json();
      const payload = json?.payload || {};
      const name = payload?.name || payload?.email || "";
      const email = payload?.email || undefined;

      const out: any = await toggleArticleLike({
        article_id: String(article.id),
        user_name: name,
        user_email: email,
      });
      if (out && out.count !== undefined) setLikesCount(out.count);
    } catch (e) {
      // ignore
    }
  };

  const submitComment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!article?.id || !commentText.trim()) return;
    try {
      setPosting(true);
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const json = await res.json();
      const payload = json?.payload || {};
      const name = payload?.name || payload?.email || "";
      const email = payload?.email || undefined;

      const out = await addArticleComment({
        article_id: String(article.id),
        user_name: name,
        user_email: email,
        content: commentText.trim(),
      });
      if (!out.error) {
        // reload comments
        const c = await fetchCommentsByArticle(String(article.id));
        setComments(Array.isArray(c.data) ? c.data : []);
        setCommentText("");
      }
    } catch (e) {
      // ignore
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-900 mx-auto px-5 md:px-8 pb-12 md:pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-3">
            {article.title}
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            {article.author ? article.author : "Ini diisi nama penulis"}
            <br />
            {article.date}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleLike}
              className="px-3 py-2 rounded-md bg-white border flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{likesCount}</span>
            </button>

            <div className="px-3 py-2 rounded-md bg-white border flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{comments.length}</span>
            </div>
          </div>

          <div className="w-full rounded-md overflow-hidden mb-6 relative h-120">
            {article.image ? (
              <ImageWithPlaceholder
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-md" />
            )}
          </div>

          <div className="prose max-w-none">
            {article.desc ? (
              <div dangerouslySetInnerHTML={{ __html: article.desc }} />
            ) : (
              <p>
                <em>Konten artikel masih kosong.</em>
              </p>
            )}
          </div>

          <div className="mt-8">
            <h4 className="font-semibold mb-3">Komentar</h4>
            <form onSubmit={submitComment} className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border p-2 rounded mb-2"
                rows={3}
                placeholder="Tulis komentar..."
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={posting}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Kirim
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {comments.length === 0 && (
                <div className="text-sm text-gray-500">Belum ada komentar.</div>
              )}
              {comments.map((c, idx) => (
                <div
                  key={String(c.id) + idx}
                  className="border rounded p-3 bg-white"
                >
                  <div className="text-sm font-semibold">
                    {c.user_name || c.user_email || "Anon"}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm">{c.content}</div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:col-span-1">
          <h3 className="font-montserrat text-xl font-bold mb-4">
            Artikel Terkini
          </h3>
          <div className="space-y-4">
            {recent.map((a, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-20 h-14 overflow-hidden rounded-md shrink-0 relative">
                  {a.image ? (
                    <ImageWithPlaceholder
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div>
                  <Link
                    href={`/artikel/${articles.indexOf(a)}`}
                    className="text-sm font-semibold text-[#000878] line-clamp-2 block"
                  >
                    {a.title}
                  </Link>
                  <p className="text-xs text-gray-600">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <FooterSection />
    </main>
  );
}
