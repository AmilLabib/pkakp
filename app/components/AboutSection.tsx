"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function AboutSection() {
  return (
    <section id="tentang" className="bg-white py-10 md:py-14">
      <div className="mx-auto px-4 md:px-12">
        <motion.div
          className="grid lg:grid-cols-2 gap-10 items-start"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <div className="order-1 lg:col-start-1 lg:row-start-1 w-full">
            <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-[#171b23] mb-6">
              Tentang Kami
            </h2>
          </div>

          <motion.div
            className="order-2 lg:col-start-2 lg:row-span-2 relative w-full h-[250px] lg:h-[400px] rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.1 }}
          >
            <Image
              src="/hero.png"
              alt="Hero PKAKP"
              width={1200}
              height={800}
              className="w-full h-full object-cover rounded-xl"
            />
          </motion.div>

          <div className="order-3 lg:col-start-1 lg:row-start-2 w-full text-[#171b23] leading-relaxed text-sm lg:text-xl font-poppins font-normal text-justify">
            <p>
              Pusat Kajian Akuntansi dan Keuangan Publik (PKAKP) merupakan Unit
              Kegiatan Mahasiswa yang mewadahi aktivitas pengembangan minat dan
              bakat mahasiswa serta alumni di bidang akuntansi dan keuangan
              publik. PKAKP telah memiliki aktivitas sejak tahun 2007, namun
              baru didirikan secara resmi pada tahun 2015 dengan motto
              "Responsif, Kontributif, Solutif". PKAKP bersifat kekeluargaan,
              profesional dan keilmuan serta berpegang pada nilai integritas,
              profesionalisme, solidaritas, sinergi, dan kesempurnaan.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: easeOut }}
          >
            <Link
              href="/profil-organisasi"
              className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#1aa9a2] text-white px-6 py-2.5 font-base hover:opacity-95 transition cursor-pointer"
            >
              Selengkapnya{" "}
              <span aria-hidden="true" className="text-3xl">
                ➜
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
