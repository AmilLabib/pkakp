"use client";

import { useMemo, useState } from "react";
import FooterSection from "../components/FooterSection";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import { articles } from "../data/articles";

export default function ArtikelPage() {
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return articles.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <h1 className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase">
          Artikel
        </h1>
        <h2 className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          Pusat Kajian Akuntansi dan Keuangan Publik
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {currentItems.map((article, idx) => {
            const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx;
            return (
              <ArticleCard
                key={`${article.title}-${globalIndex}`}
                article={article}
                href={`/artikel/${globalIndex}`}
              />
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>

      <FooterSection />
    </main>
  );
}
