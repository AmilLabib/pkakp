"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageWithPlaceholder from "../../components/shared/ImageWithPlaceholder";
import FooterSection from "../../components/FooterSection";
import { fetchArticles } from "../../../lib/supabaseClient";
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
};

export default function ArticleDetailPage() {
  const params = useParams();
  const idStr = params?.id as string | undefined;
  const id = idStr ? Number(idStr) : NaN;

  const [articles, setArticles] = useState<Article[]>([]);
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

  const recent = articles.slice(0, 5).filter((_, i) => i !== id);

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
