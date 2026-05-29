"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export default function ProfilOrganisasiPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8">
        <motion.h1
          className="font-montserrat text-5xl md:text-6xl font-extrabold tracking-tight text-black"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          PROFIL
        </motion.h1>
        <motion.h2
          className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
        >
          Pusat Kajian Akuntansi dan Keuangan Publik
        </motion.h2>

        <motion.div
          className="mt-6 md:mt-8 w-full overflow-hidden rounded-[28px] bg-black"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
        >
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/hRCRxhpLACA?si=irGWl23ccKUNKYKX"
            title="YouTube video player"
            frameBorder="0"
            className="h-[260px] w-full md:h-[580px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </motion.div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-8 pb-12">
          <motion.div
            className="space-y-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.12, delayChildren: 0.1 },
              },
            }}
          >
            <motion.div
              className="relative h-52 md:h-64 rounded-md overflow-hidden"
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <Image
                src="/hero.png"
                alt="Hero PKAKP"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </motion.div>
            <motion.div
              className="relative h-52 md:h-64 rounded-md overflow-hidden"
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <Image
                src="/tentang.png"
                alt="Tentang PKAKP"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </motion.div>
          </motion.div>

          <motion.article
            className="font-poppins text-black"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="font-montserrat text-3xl md:text-5xl font-extrabold leading-tight">
              Selayang Pandang PKAKP
            </h3>

            <div className="font-poppins mt-4 space-y-4 text-base md:text-lg leading-relaxed tracking-tight text-justify">
              <p>
                Pusat Kajian Akuntansi dan Keuangan Publik (PKAKP) merupakan
                organisasi kemahasiswaan di PKN STAN yang berdiri sejak tahun
                2007. PKAKP hadir sebagai wadah bagi mahasiswa untuk
                mengembangkan minat, pengetahuan, dan keterampilan di bidang
                akuntansi serta keuangan publik.
              </p>

              <p>
                Dengan mengusung motto “Responsif, Kontributif, Solutif,” PKAKP
                berkomitmen untuk mendorong mahasiswa agar mampu berpikir
                kritis, menghasilkan karya yang berdampak, serta berkontribusi
                dalam pengembangan keilmuan akuntansi dan keuangan publik.
              </p>

              <p>
                Dalam menjalankan berbagai program dan kegiatannya, PKAKP
                memiliki beberapa departemen utama, yaitu:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Accounting Olympiad Department – berfokus pada pengembangan
                  kompetensi akademik dan persiapan kompetisi di bidang
                  akuntansi.
                </li>
                <li>
                  Research & Writing Department – mengembangkan kemampuan riset
                  dan penulisan ilmiah mahasiswa.
                </li>
                <li>
                  Organization & Project Department – mengelola pengembangan
                  organisasi serta pelaksanaan berbagai program dan kegiatan.
                </li>
                <li>
                  Media & Visual Communication Department – bertanggung jawab
                  dalam pengelolaan media, publikasi, dan komunikasi visual
                  organisasi.
                </li>
              </ul>

              <p>
                Melalui berbagai program pengembangan, kajian, serta kolaborasi,
                PKAKP terus berupaya menjadi ruang belajar dan berkontribusi
                bagi mahasiswa yang memiliki ketertarikan pada bidang akuntansi
                dan keuangan publik.
              </p>
            </div>
          </motion.article>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
