"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";
import Pagination from "../components/Pagination";
import { fetchPrestasi } from "../../lib/supabaseClient";

type Achievement = { title: string; imageSrc: string };

const ITEMS_PER_PAGE = 6;

export default function PrestasiPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchPrestasi();
        if (!error && data) {
          const mapped = data.map((d: any) => ({
            title: d.title || "",
            imageSrc: d.image || "/prestasi/1.png",
          }));
          setAchievements(mapped);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(achievements.length / ITEMS_PER_PAGE),
  );

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return achievements.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, achievements]);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (totalPages <= 1) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, totalPages, isPaused]);

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
          Prestasi
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
          className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <article
                  key={`achievement-skeleton-${idx}`}
                  className="relative overflow-hidden rounded-lg achievement-card animate-pulse"
                >
                  <div className="block w-full h-44 sm:h-52 md:h-72 bg-gray-200" />
                  <div className="absolute inset-x-0 top-0 h-16 sm:h-20 md:h-24 pointer-events-none bg-linear-to-b from-white/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <div className="h-5 w-3/4 mx-auto rounded bg-white/70" />
                  </div>
                </article>
              ))
            : currentItems.map((item, idx) => (
                <motion.article
                  key={`${item.title}-${idx}`}
                  className="relative overflow-hidden rounded-lg achievement-card"
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                >
                  <img
                    src={item.imageSrc || "/prestasi/1.png"}
                    alt={item.title || "Prestasi PKA KP"}
                    className="block w-full h-44 sm:h-52 md:h-72 object-cover"
                  />

                  <div className="absolute inset-x-0 top-0 h-16 sm:h-20 md:h-24 pointer-events-none bg-linear-to-b from-[#2cb0a1] to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-linear-to-t from-[#2cb0a1] to-transparent">
                    {item.title ? (
                      <h3 className="relative z-10 font-montserrat text-white text-xs sm:text-2xl md:text-lg leading-tight font-extrabold text-center">
                        {item.title}
                      </h3>
                    ) : null}
                  </div>
                </motion.article>
              ))}
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
