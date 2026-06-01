"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AchievementCard from "./AchievementCard";
import { fetchPrestasi } from "../../lib/supabaseClient";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Achievement = {
  title: string;
  imageSrc: string;
};

// load from Supabase and show newest first (fetchPrestasi orders by created_at desc)
const defaultAchievements: Achievement[] = [];

export default function AchievementsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [achievements, setAchievements] =
    useState<Achievement[]>(defaultAchievements);

  useEffect(() => {
    (async () => {
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
      }
    })();
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeaveOrUp = () => {
    isDownRef.current = false;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startXRef.current;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section id="prestasi" className="bg-white py-10 md:py-12">
      <div className="mx-auto px-5 md:px-24">
        <motion.h2
          className="font-montserrat text-center text-3xl md:text-4xl font-extrabold text-[#0b2f2f]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          Prestasi
        </motion.h2>
        <motion.p
          className="font-poppins text-center text-[#2f4747] mt-1 mb-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.06 }}
        >
          Berkontribusi melalui Prestasi, Inovasi, dan Dedikasi
        </motion.p>

        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeaveOrUp}
          onMouseUp={onMouseLeaveOrUp}
          onMouseMove={onMouseMove}
        >
          <motion.div
            className="flex gap-4 snap-x snap-mandatory"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.08 }}
          >
            {achievements.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  ease: easeOut,
                  delay: 0.06 * (idx + 1),
                }}
              >
                <AchievementCard title={item.title} imageSrc={item.imageSrc} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
        >
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-2 rounded-full bg-[#1aa9a2] text-white px-6 py-2.5 font-semibold hover:opacity-95 transition cursor-pointer"
          >
            Selengkapnya <span aria-hidden="true">➜</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
