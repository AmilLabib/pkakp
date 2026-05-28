"use client";

import { useMemo, useState } from "react";
import FooterSection from "../components/FooterSection";
import Pagination from "../components/Pagination";

type Achievement = {
  title: string;
  imageSrc: string;
};

const achievements: Achievement[] = [
  { title: "Juara 1 Lomba Akuntansi Nasional", imageSrc: "/prestasi/1.png" },
  { title: "Juara 2 Lomba Akuntansi Nasional", imageSrc: "/prestasi/2.png" },
  { title: "Finalis Kompetisi Inovasi Siswa", imageSrc: "/prestasi/3.png" },
  { title: "Best Team Project Kewirausahaan", imageSrc: "/prestasi/4.png" },
  { title: "Juara 2 Olimpiade Ekonomi", imageSrc: "/prestasi/5.png" },
  { title: "Penerima Penghargaan Kepemimpinan", imageSrc: "/prestasi/6.png" },
  {
    title: "Delegasi Seminar Nasional Pendidikan",
    imageSrc: "/prestasi/1.png",
  },
  { title: "Juara 3 Business Case Competition", imageSrc: "/prestasi/2.png" },
  { title: "Best Presenter Accounting Forum", imageSrc: "/prestasi/3.png" },
  { title: "Top 10 Lomba Karya Tulis Ilmiah", imageSrc: "/prestasi/4.png" },
  { title: "Gold Medal Financial Challenge", imageSrc: "/prestasi/5.png" },
  { title: "Best Collaboration Award", imageSrc: "/prestasi/6.png" },
  { title: "Runner Up Audit Simulation", imageSrc: "/prestasi/1.png" },
  { title: "Juara Harapan 1 Debat Ekonomi", imageSrc: "/prestasi/2.png" },
  { title: "Outstanding Volunteer PKAKP", imageSrc: "/prestasi/3.png" },
  { title: "Most Innovative Team", imageSrc: "/prestasi/4.png" },
  { title: "Best Research Proposal", imageSrc: "/prestasi/5.png" },
  { title: "Finalist National Accounting Quiz", imageSrc: "/prestasi/6.png" },
];

const ITEMS_PER_PAGE = 6;

export default function PrestasiPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(achievements.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return achievements.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <h1 className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase">
          Prestasi
        </h1>
        <h2 className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          Pusat Kajian Akuntansi dan Keuangan Publik
        </h2>

        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className="relative overflow-hidden rounded-lg achievement-card"
            >
              <img
                src={item.imageSrc || "/prestasi/1.png"}
                alt={item.title || "Prestasi PKA KP"}
                className="block w-full h-90 object-cover"
              />

              <div className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-linear-to-b from-[#2cb0a1] to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-[#2cb0a1] to-transparent">
                {item.title ? (
                  <h3 className="relative z-10 font-montserrat text-white text-3xl leading-tight font-extrabold text-center">
                    {item.title}
                  </h3>
                ) : null}
              </div>
            </article>
          ))}
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
