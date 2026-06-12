"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FooterSection from "../../components/FooterSection";
import ArticleCard from "../../components/ArticleCard";
import {
  fetchMembers,
  fetchArticlesByAuthor,
  fetchArticleLikeCount,
  fetchArticleCommentCount,
} from "../../../lib/supabaseClient";
import { excerptFromHtml, extractFirstImageSrc } from "../../../lib/excerpt";

type ArticleDisplay = {
  id?: string;
  title: string;
  desc: string;
  date: string;
  image: string;
  author?: string;
};

export default function MemberProfilePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [member, setMember] = useState<any | null>(null);
  const [articles, setArticles] = useState<ArticleDisplay[]>([]);
  const [articlesCount, setArticlesCount] = useState<number>(0);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [allArticlesRaw, setAllArticlesRaw] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const { data: members } = await fetchMembers();
        if (Array.isArray(members)) {
          const found = members.find((m: any) => String(m.id) === String(id));
          if (found) setMember(found);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!member) return;
      setLoading(true);
      try {
        // Fetch articles by author name directly from Supabase (public, no auth)
        const { data: rawArticles } = await fetchArticlesByAuthor(member.name);
        const authored = Array.isArray(rawArticles) ? rawArticles : [];
        setAllArticlesRaw(authored);
        setArticlesCount(authored.length);

        // Map to display format
        const mapped: ArticleDisplay[] = authored.map((d: any) => {
          const descHtml = d.desc || "";
          const imageFromField = d.image && d.image !== "" ? d.image : null;
          const imageFromContent = !imageFromField
            ? extractFirstImageSrc(descHtml)
            : null;

          return {
            id: d.id,
            title: d.title || "",
            desc: excerptFromHtml(descHtml, 2),
            date: d.created_at
              ? new Date(d.created_at).toLocaleDateString()
              : "",
            image: imageFromField || imageFromContent || "",
            author: d.author || "",
          };
        });
        setArticles(mapped);

        // Sum likes and comments across authored articles
        let totalLikes = 0;
        let totalComments = 0;

        await Promise.all(
          authored.map(async (a: any) => {
            const articleId = String(a.id ?? "");
            if (!articleId) return;
            const likeRes = await fetchArticleLikeCount(articleId);
            const commentRes = await fetchArticleCommentCount(articleId);
            totalLikes += Number(likeRes?.count ?? 0);
            totalComments += Number(commentRes?.count ?? 0);
          }),
        );

        setLikesCount(totalLikes);
        setCommentsCount(totalComments);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [member]);

  if (!member) {
    return (
      <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
        <section className="max-w-700 mx-auto px-5 md:px-8 py-12">
          <div className="text-center">Member tidak ditemukan.</div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-900 mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <div className="rounded-2xl bg-amber-200 p-8 md:p-12 shadow-md">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-28 h-28 rounded-full bg-white mx-auto overflow-hidden border-4 border-white -mt-20 relative">
              <Image
                src={member.photo || "/profil-organisasi/1.png"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-3xl font-bold mt-4">{member.name}</h2>
            <div className="mt-2 inline-block bg-white rounded-full px-3 py-1 text-sm font-semibold">
              Member PKAKP
            </div>
            <p className="mt-4 text-sm text-gray-700">{member.role}</p>

            <hr className="my-6 border-gray-300" />

            <div className="flex justify-center gap-6">
              <div className="bg-white rounded-lg p-4 text-center w-28">
                <div className="text-2xl font-extrabold">{articlesCount}</div>
                <div className="text-xs text-gray-600">Articles</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center w-28">
                <div className="text-2xl font-extrabold">{likesCount}</div>
                <div className="text-xs text-gray-600">Liked</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center w-28">
                <div className="text-2xl font-extrabold">{commentsCount}</div>
                <div className="text-xs text-gray-600">Comments</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-6">
              Artikel oleh {member.name}
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <article
                    key={`skeleton-${idx}`}
                    className="rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200" />
                    <div className="p-4">
                      <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
                      <div className="h-5 w-5/6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                      <div className="h-4 w-4/5 bg-gray-100 rounded" />
                    </div>
                  </article>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Belum ada artikel yang ditulis oleh {member.name}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    href={`/artikel/${article.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
