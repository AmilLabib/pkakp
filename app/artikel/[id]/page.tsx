"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FooterSection from "../../components/FooterSection";
import { articles } from "../../data/articles";

export default function ArticleDetailPage() {
  const params = useParams();
  const idStr = params?.id as string | undefined;
  const id = idStr ? Number(idStr) : NaN;

  const article = useMemo(() => {
    if (!Number.isFinite(id)) return undefined;
    return articles[id];
  }, [id]);

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
            Ini diisi nama penulis
            <br />
            {article.date}
          </p>

          <div className="w-full rounded-md overflow-hidden mb-6">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-md"
            />
          </div>

          <div className="prose max-w-none">
            <p>{article.desc}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
            <p>
              (Isi artikel lengkap -- Anda bisa mengganti dengan konten nyata
              atau mengambil dari CMS/API.)
            </p>
          </div>
        </article>

        <aside className="lg:col-span-1">
          <h3 className="font-montserrat text-xl font-bold mb-4">
            Artikel Terkini
          </h3>
          <div className="space-y-4">
            {recent.map((a, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-20 h-14 overflow-hidden rounded-md flex-shrink-0">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
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
