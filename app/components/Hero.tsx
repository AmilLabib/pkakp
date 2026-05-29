"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="beranda" className="hero-bg relative w-full min-h-screen">
      <div className="absolute inset-0 bg-[#0b7f81]/50" />
      <motion.img
        src="/overlay.png"
        alt="overlay"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.1, ease: easeOut, delay: 0.05 }}
      />

      <div className="relative z-10 w-full min-h-[85vh] flex items-center justify-center px-6 md:px-8 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0 }}
          >
            <Image
              src="/logo-2.png"
              alt="PKAKP logo"
              width={200}
              height={170}
              priority
            />
          </motion.div>

          <motion.h1
            className="font-montserrat text-white text-xl md:text-6xl font-extrabold tracking-wide"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
          >
            PKAKP PKN STAN
          </motion.h1>

          <motion.p
            className="font-helvetica mt-2 text-white text-base md:text-[1.7rem] font-bold"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
          >
            Pusat Kajian Akuntansi dan Keuangan Publik
          </motion.p>

          <motion.p
            className="font-poppins text-white text-sm md:text-2xl font-base"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.28 }}
          >
            Politeknik Keuangan Negara STAN
          </motion.p>
        </div>

        <motion.p
          className="absolute bottom-6 md:bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[92vw] px-4 font-helvetica text-white text-lg md:text-3xl italic font-bold text-center whitespace-normal md:whitespace-nowrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.35 }}
        >
          “ Responsif, Kontributif, Solutif ”
        </motion.p>
      </div>
    </section>
  );
}
