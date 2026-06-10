"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import FooterSection from "../../components/FooterSection";
import {
  fetchMembers,
  fetchArticles,
  fetchArticleLikeCount,
  fetchArticleCommentCount,
} from "../../../lib/supabaseClient";

export default function MemberProfilePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [member, setMember] = useState<any | null>(null);
  const [articlesCount, setArticlesCount] = useState<number>(0);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);

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
      try {
        // fetch only articles authored by this member (uses supabase `author` column)
        const { data: articles } = await fetchArticles({
          onlyOwnedBy: member.name,
        });
        const authored = Array.isArray(articles) ? articles : [];
        setArticlesCount(authored.length);

        // Sum likes and comments across authored articles
        let totalLikes = 0;
        let totalComments = 0;

        await Promise.all(
          authored.map(async (a: any) => {
            const id = String(a.id ?? "");
            if (!id) return;
            const likeRes = await fetchArticleLikeCount(id);
            const commentRes = await fetchArticleCommentCount(id);
            totalLikes += Number(likeRes?.count ?? 0);
            totalComments += Number(commentRes?.count ?? 0);
          }),
        );

        setLikesCount(totalLikes);
        setCommentsCount(totalComments);
      } catch (e) {
        // ignore
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
            <div className="border-b mb-6">
              <nav className="flex gap-6">
                <button className="py-2">Articles ({articlesCount})</button>
                <button className="py-2">Liked ({likesCount})</button>
                <button className="py-2">Comments ({commentsCount})</button>
              </nav>
            </div>

            {/* Placeholder area - list of user's articles could be rendered here */}
            <div className="text-center text-gray-600">
              Daftar artikel penulis akan ditampilkan di sini.
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
