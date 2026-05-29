"use client";

import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export default function VisiMisiPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <motion.h1
          className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Visi dan Misi
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
          className="mt-14 md:mt-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
        >
          <h3 className="font-montserrat text-5xl font-extrabold text-center text-black uppercase">
            Visi
          </h3>
          <p className="font-poppins mt-4 md:mt-5 text-center text-black text-xl leading-[1.35] tracking-tight max-w-200 mx-auto">
            Menjadi UKM terpercaya dan dinamis dalam melaksanakan penelitian dan
            pengembangan kapasitas di bidang akuntansi dan keuangan publik.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 md:mt-16 max-w-200 mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
        >
          <h3 className="font-montserrat text-5xl font-extrabold text-center text-black uppercase">
            Misi
          </h3>

          <motion.ul
            className="font-poppins mt-6 md:mt-7 list-disc pl-10 md:pl-12 text-black text-xl leading-[1.35] tracking-tight space-y-1"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.09, delayChildren: 0.05 },
              },
            }}
          >
            {[
              "Merumuskan analisis terkait isu-isu akuntansi dan keuangan publik.",
              "Melaksanakan dan mengembangkan penelitian dan atau kajian di bidang akuntansi dan keuangan publik.",
              "Mewujudkan SDM yang berprestasi di bidang akuntansi dan keuangan publik.",
              "Mewujudkan SDM yang memiliki integritas dan kompetensi tinggi di bidang akuntansi dan keuangan publik dengan didukung teknologi informasi dan komunikasi yang andal serta kinerja perencanaan dan penganggaran yang suportif.",
              "Mewujudkan sistem Teknologi dan Informasi yang andal dan maju.",
              "Merumuskan dan melaksanakan pengembangan organisasi secara responsif dan saksama.",
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
}
