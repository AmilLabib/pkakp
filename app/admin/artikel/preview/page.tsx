"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ImageWithPlaceholder from "../../../components/shared/ImageWithPlaceholder";
import FooterSection from "../../../components/FooterSection";
import { fetchArticles } from "../../../../lib/supabaseClient";

type PreviewPayload = {
  title?: string;
  content?: string;
  image?: string;
  author?: string;
  date?: string;
};

type Article = { title: string; desc: string; date: string; image: string };

export default function AdminArtikelPreviewPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchArticles();
        if (!error && data) {
          const mapped = data.map((d: any) => ({
            title: d.title || "",
            desc: d.desc || "",
            date: d.created_at
              ? new Date(d.created_at).toLocaleDateString("id-ID")
              : "",
            image: d.image || "",
          }));
          setArticles(mapped);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const syncPreview = () => {
      const raw = localStorage.getItem("admin-article-preview-live");
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as PreviewPayload;
        setTitle(parsed.title || "");
        setContent(parsed.content || "");
        setAuthor(parsed.author || "");
        setImage(parsed.image || "");
        setDate(parsed.date || new Date().toLocaleDateString("id-ID"));
      } catch {
        // ignore invalid preview data
      }
    };

    syncPreview();
    const intervalId = window.setInterval(syncPreview, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const article = {
    title: title || "Tanpa Judul",
    desc: content || "",
    author: author || "",
    date: date || new Date().toLocaleDateString("id-ID"),
    image: image || "",
  };

  const recent = articles.slice(0, 5);

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

          {article.image ? (
            <div className="w-full rounded-md overflow-hidden mb-6 relative h-64">
              <ImageWithPlaceholder
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ) : null}

          <div className="prose max-w-none">
            {/* Render preview content as HTML if available */}
            {article.desc ? (
              <div dangerouslySetInnerHTML={{ __html: article.desc }} />
            ) : (
              <p>
                <em>Konten artikel masih kosong.</em>
              </p>
            )}
          </div>
        </article>

        <aside className="lg:col-span-1">
          <h3 className="font-montserrat text-xl font-bold mb-4">
            Artikel Terkini
          </h3>
          <div className="space-y-4">
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada artikel.</p>
            ) : (
              recent.map((a, idx) => (
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
              ))
            )}
          </div>
        </aside>
      </section>

      <FooterSection />
    </main>
  );
}
