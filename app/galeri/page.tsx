"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import { fetchGaleri } from "../../lib/supabaseClient";
import { excerptFromHtml, extractFirstImageSrc } from "../../lib/excerpt";

type GalleryItem = { title: string; desc: string; date: string; image: string };

export default function GaleriPage() {
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchGaleri();
        if (!error && data) {
          const mapped = data.map((d: any) => {
            const descHtml = d.desc || "";
            const imageFromField = d.image && d.image !== "" ? d.image : null;
            const imageFromContent = !imageFromField
              ? extractFirstImageSrc(descHtml)
              : null;

            return {
              title: d.title || "",
              desc: excerptFromHtml(descHtml, 2),
              date: d.created_at
                ? new Date(d.created_at).toLocaleDateString()
                : "",
              image: imageFromField || imageFromContent || "",
            };
          });
          setItems(mapped);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, items]);

  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <motion.h1
          className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Galeri Kegiatan
        </motion.h1>
        <motion.h2
          className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        >
          Pusat Kajian Akuntansi dan Keuangan Publik
        </motion.h2>

        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <article
                  key={`gallery-skeleton-${idx}`}
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
              ))
            : currentItems.map((item, idx) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                return (
                  <motion.div
                    key={`${item.title}-${globalIndex}`}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.98 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    whileHover={{ y: -4 }}
                  >
                    <ArticleCard article={item} />
                  </motion.div>
                );
              })}
        </motion.div>

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      <FooterSection />
    </main>
  );
}
