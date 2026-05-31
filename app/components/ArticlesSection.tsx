"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ArticleCard, { type Article } from "./ArticleCard";

const easeOut = [0.22, 1, 0.36, 1] as const;

const articles: Article[] = [
  {
    title:
      "Pemerintah Targetkan Pertumbuhan Ekonomi 8 Persen Melalui Hilirisasi",
    desc: "Strategi hilirisasi sektor pertambangan dan pertanian diproyeksikan menjadi motor utama penggerak ekonomi nasional dalam lima tahun ke depan.",
    date: "14 Mei 2026",
    image: "/artikel/1.jpg",
  },
  {
    title:
      "Analisis Sentimen Publik: Kepercayaan Terhadap Investasi IKN Meningkat",
    desc: "Survei terbaru menunjukkan tren positif respons masyarakat terhadap masuknya sejumlah investor asing pada megaproyek Ibu Kota Nusantara.",
    date: "19 Apr 2025",
    image: "/artikel/2.jpeg",
  },
  {
    title:
      "Proyek KPBU Perkeretaapian Dimulai, Kemenhub Gandeng Investor Asing",
    desc: "Langkah strategis pembiayaan melalui skema KPBU ini diharapkan dapat mempercepat penyelesaian infrastruktur kereta api antarprovinsi secara signifikan.",
    date: "20 Okt 2024",
    image: "/artikel/3.jpeg",
  },
  {
    title:
      "Transformasi Digital Transportasi 2025: Integrasi Layanan Publik Diperluas",
    desc: "Pemerintah mulai mengimplementasikan sistem tiket elektronik terpadu di berbagai daerah guna meningkatkan mobilitas dan efisiensi masyarakat.",
    date: "02 Mei 2025",
    image: "/artikel/4.jpg",
  },
  {
    title:
      "Evaluasi Kebijakan Pembiayaan Infrastruktur, Mayoritas PSN Selesai Tepat Waktu",
    desc: "Tinjauan Bappenas menegaskan bahwa inovasi instrumen pembiayaan terbukti efektif mengakselerasi penyelesaian deretan Proyek Strategis Nasional.",
    date: "18 Jan 2025",
    image: "/artikel/5.jpeg",
  },
  {
    title:
      "Era Baru Infrastruktur: Kolaborasi Pemerintah dan Swasta Jadi Kunci Utama",
    desc: "Menghadapi keterbatasan APBN, pemerintah mendorong skema blended finance untuk menjamin keberlanjutan proyek-proyek strategis daerah.",
    date: "07 Des 2024",
    image: "/artikel/6.jpg",
  },
  {
    title:
      "Tren Investasi Kuartal IV Menguat, Sektor Logistik dan EBT Jadi Primadona",
    desc: "Data BKPM mencatat adanya lonjakan aliran modal masuk secara tajam pada sektor energi hijau dan rantai pasok logistik menjelang akhir tahun.",
    date: "25 Nov 2024",
    image: "/artikel/7.jpg",
  },
  {
    title:
      "Mitigasi Pembengkakan Biaya, Manajemen Risiko Proyek Strategis Diperketat",
    desc: "Penerapan standar pengawasan berbasis mitigasi dini diyakini mampu menekan potensi kerugian dan keterlambatan pada infrastruktur berskala besar.",
    date: "11 Sep 2024",
    image: "/artikel/8.jpeg",
  },
  {
    title:
      "Transformasi Pembiayaan Hijau Dipercepat, Proyek Berbasis ESG Semakin Diminati",
    desc: "Pendekatan pembiayaan berkelanjutan mendorong peningkatan minat investor pada proyek infrastruktur hijau di berbagai wilayah strategis nasional.",
    date: "03 Agu 2024",
    image: "/artikel/9.jpeg",
  },
];

export default function ArticlesSection() {
  const router = useRouter();
  const [itemsPerView, setItemsPerView] = useState(1);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        // PC: 3 items
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        // Tablet: 2 items
        setItemsPerView(2);
      } else {
        // Mobile: 1 item
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, articles.length - itemsPerView);

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [index, maxIndex]);

  const nextPage = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevPage = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="artikel" className="bg-[#3b8e82] py-10 md:py-12 px-8">
      <div className="mx-auto px-4 md:px-12">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-[#171b23] mb-6 ml-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          Artikel
        </motion.h2>

        <div className="relative px-5">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-out"
              animate={{ x: `-${index * (100 / itemsPerView)}%` }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
            >
              {articles.map((article) => (
                <div
                  key={article.title}
                  className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 md:px-4 first:pl-0 last:pr-0"
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </motion.div>
          </div>

          {articles.length > itemsPerView && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
              <button
                type="button"
                onClick={prevPage}
                className="pointer-events-auto ml-2 md:-ml-5 h-10 w-10 rounded-full bg-white/95 text-[#143434] shadow-md hover:brightness-95 transition flex items-center justify-center"
                aria-label="Artikel sebelumnya"
              >
                <ArrowLeft size={35} />
              </button>
              <button
                type="button"
                onClick={nextPage}
                className="pointer-events-auto mr-2 md:-mr-5 h-10 w-10 rounded-full bg-white/95 text-[#143434] shadow-md hover:brightness-95 transition flex items-center justify-center"
                aria-label="Artikel selanjutnya"
              >
                <ArrowLeft size={35} className="rotate-180" />
              </button>
            </div>
          )}
        </div>

        <motion.div
          className="mt-7 flex justify-center w-full"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
        >
          <motion.button
            type="button"
            onClick={() => router.push("/artikel")}
            className="font-poppins rounded-full bg-[#f2c22e] text-[#143434] font-bold w-full sm:w-10/12 md:w-1/2 px-4 md:px-10 py-2.5 hover:brightness-95 transition cursor-pointer max-w-[420px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: easeOut }}
          >
            LIHAT SELENGKAPNYA
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
