"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageWithPlaceholder from "./shared/ImageWithPlaceholder";
import {
  fetchArticleLikeCount,
  fetchArticleCommentCount,
  toggleArticleLike,
} from "../../lib/supabaseClient";

export type Article = {
  id?: string; // optional DB id (uuid)
  title: string;
  desc: string;
  date: string;
  image: string;
};

export default function ArticleCard({
  article,
  href,
}: {
  article: Article;
  href?: string;
}) {
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [processingLike, setProcessingLike] = useState(false);
  const [liked, setLiked] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (article.id) {
          const l = await fetchArticleLikeCount(String(article.id));
          const c = await fetchArticleCommentCount(String(article.id));
          if (mounted) {
            setLikes(l.count ?? 0);
            setComments(c.count ?? 0);
          }
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [article.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!article.id) return;
    setProcessingLike(true);
    try {
      // ensure user logged in (admin/staf session)
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const json = await res.json();
      const payload = json?.payload || {};
      const name = payload?.name || payload?.email || "";
      const email = payload?.email || null;

      const out = await toggleArticleLike({
        article_id: String(article.id),
        user_name: name,
        user_email: email || undefined,
      });
      if (out && (out as any).count !== undefined) {
        setLikes((out as any).count ?? likes);
        const action = (out as any).action;
        if (action === "added") {
          setLiked(true);
          setAnimateLike(true);
          setTimeout(() => setAnimateLike(false), 400);
        } else if (action === "removed") {
          setLiked(false);
        }
      }
    } catch (err) {
      // ignore
    } finally {
      setProcessingLike(false);
    }
  };

  const card = (
    <article className="bg-white border border-[#d5d5d5] rounded-xl p-3 shadow-sm w-full">
      <div className="w-full overflow-hidden rounded-md h-44 md:h-64 relative">
        {article.image ? (
          <ImageWithPlaceholder
            src={article.image}
            alt={article.title}
            fill
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-full h-44 md:h-64 rounded-md bg-gray-100" />
        )}
      </div>
      <h3 className="mt-3 text-base md:text-lg font-bold text-[#000878] leading-tight line-clamp-2 font-helvetica">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-[#171b23] leading-snug line-clamp-3 font-poppins">
        {article.desc}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-[#171b23] font-poppins">{article.date}</p>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleLike}
            aria-pressed={liked}
            className={`px-3 py-2 rounded-md bg-white border text-sm flex items-center gap-2 ${processingLike ? "opacity-60" : "hover:bg-gray-50"} ${liked ? "ring-1 ring-red-100" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className={`transition-transform duration-200 ${animateLike ? "scale-125" : ""}`}
              fill={liked ? "#ef4444" : "none"}
              stroke={liked ? "#ef4444" : "#000"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span
              className={`${animateLike ? "scale-110 text-red-500" : ""} transition-all`}
            >
              {likes}
            </span>
          </button>

          <div className="px-3 py-2 rounded-md bg-white border text-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:brightness-95">
        {card}
      </Link>
    );
  }

  return card;
}
