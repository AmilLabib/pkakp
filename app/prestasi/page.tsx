"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";
import Pagination from "../components/Pagination";
import { fetchPrestasi } from "../../lib/supabaseClient";

type Member = { name: string; role: string };

type Achievement = {
  id: string;
  title: string;
  place: string;
  imageSrc: string;
  members: Member[];
};

const ITEMS_PER_PAGE = 6;

// Medal ribbon image (top-left corner of card) — uses /ribbon.png from public
function RibbonIcon() {
  return (
    <img
      src="/ribbon.png"
      alt=""
      aria-hidden="true"
      className="w-12 h-12 drop-shadow-md object-contain"
    />
  );
}

// Trophy image (bottom-right of card) — uses /piala.png from public
function TrophyIcon() {
  return (
    <img
      src="/piala.png"
      alt=""
      aria-hidden="true"
      className="w-12 h-12 object-contain drop-shadow-md"
    />
  );
}

export default function PrestasiPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchPrestasi();
        if (!error && data) {
          const mapped: Achievement[] = data.map((d: any) => ({
            id: d.id?.toString() || "",
            title: d.title || "",
            place: d.place || "",
            imageSrc: d.image || "",
            members: Array.isArray(d.members) ? d.members : [],
          }));
          setAchievements(mapped);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(achievements.length / ITEMS_PER_PAGE));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return achievements.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, achievements]);

  // Auto-advance pages
  useEffect(() => {
    if (loading || totalPages <= 1 || isPaused) return;
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
                  key={`skeleton-${idx}`}
                  className="relative overflow-hidden rounded-2xl bg-gray-200 animate-pulse h-72"
                />
              ))
            : currentItems.map((item, idx) => (
                <AchievementCard key={`${item.id}-${idx}`} item={item} />
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

function AchievementCard({ item }: { item: Achievement }) {
  return (
    <motion.article
      className="relative overflow-hidden rounded-2xl shadow-md"
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* ── Photo / landscape area ─────────────────────────────── */}
      <div className="relative w-full h-36 sm:h-44 md:h-48 bg-sky-200 overflow-hidden">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Placeholder sky + hills illustration */
          <PlaceholderLandscape />
        )}

        {/* ribbon icon top-left */}
        <div className="absolute top-2 left-2 z-10">
          <RibbonIcon />
        </div>
      </div>

      {/* ── Info panel ─────────────────────────────────────────── */}
      <div className="bg-[#2cb0a1] px-3 pt-3 pb-4 flex flex-col gap-1 h-40 relative">
        {/* trophy icon bottom-right inside info panel */}
        <div className="absolute bottom-1 right-1 opacity-50 pointer-events-none">
          <TrophyIcon />
        </div>
        {/* members */}
        {item.members && item.members.length > 0 && (
          <div
            className={`grid gap-x-2 gap-y-1 mb-1 ${
              item.members.length === 1
                ? "grid-cols-1"
                : item.members.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {item.members.map((m, i) => (
              <div key={i} className="text-center">
                <p className="text-white text-[10px] sm:text-xs font-bold leading-tight">
                  {m.name}
                </p>
                {m.role && (
                  <p className="text-white/80 text-[8px] sm:text-[10px] leading-tight mt-0.5">
                    {m.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* divider */}
        {item.members && item.members.length > 0 && (
          <div className="border-t border-white/30 my-1" />
        )}

        {/* place */}
        {item.place && (
          <p className="mt-2 text-white text-[10px] sm:text-xs font-semibold text-center leading-tight">
            {item.place}
          </p>
        )}

        {/* title */}
        <h3 className="text-white text-xs sm:text-sm md:text-xl font-extrabold text-center leading-snug font-montserrat">
          {item.title}
        </h3>
      </div>
    </motion.article>
  );
}

/** Simple SVG placeholder that mimics the sky + green hills look */
function PlaceholderLandscape() {
  return (
    <svg
      viewBox="0 0 320 180"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* sky */}
      <rect width="320" height="180" fill="#b8e4f9" />
      {/* clouds */}
      <ellipse cx="60" cy="40" rx="30" ry="15" fill="white" opacity="0.85" />
      <ellipse cx="85" cy="35" rx="22" ry="13" fill="white" opacity="0.85" />
      <ellipse cx="200" cy="50" rx="25" ry="12" fill="white" opacity="0.8" />
      <ellipse cx="222" cy="44" rx="18" ry="10" fill="white" opacity="0.8" />
      {/* back hill */}
      <ellipse cx="160" cy="155" rx="200" ry="60" fill="#7ec850" />
      {/* front hill */}
      <ellipse cx="80" cy="175" rx="130" ry="55" fill="#5aad2e" />
      <ellipse cx="280" cy="180" rx="120" ry="50" fill="#5aad2e" />
    </svg>
  );
}
