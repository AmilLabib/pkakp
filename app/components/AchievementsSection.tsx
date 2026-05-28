"use client";

import { useRef } from "react";
import AchievementCard from "./AchievementCard";

type Achievement = {
  title: string;
  imageSrc: string;
};

const achievements: Achievement[] = [
  { title: "Juara 1 Lomba Akuntansi Nasional", imageSrc: "/prestasi/1.png" },
  { title: "Finalis Kompetisi Inovasi Siswa", imageSrc: "/prestasi/2.png" },
  { title: "Best Team Project Kewirausahaan", imageSrc: "/prestasi/3.png" },
  { title: "Juara 2 Olimpiade Ekonomi", imageSrc: "/prestasi/4.png" },
  { title: "Penerima Penghargaan Kepemimpinan", imageSrc: "/prestasi/5.png" },
  {
    title: "Delegasi Seminar Nasional Pendidikan",
    imageSrc: "/prestasi/6.png",
  },
];

export default function AchievementsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

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
        <h2 className="font-montserrat text-center text-3xl md:text-4xl font-extrabold text-[#0b2f2f]">
          Prestasi
        </h2>
        <p className="font-poppins text-center text-[#2f4747] mt-1 mb-7">
          Berkontribusi melalui Prestasi, Inovasi, dan Dedikasi
        </p>

        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeaveOrUp}
          onMouseUp={onMouseLeaveOrUp}
          onMouseMove={onMouseMove}
        >
          <div className="flex gap-4 snap-x snap-mandatory">
            {achievements.map((item, idx) => (
              <AchievementCard
                key={idx}
                title={item.title}
                imageSrc={item.imageSrc}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full bg-[#1aa9a2] text-white px-6 py-2.5 font-semibold hover:opacity-95 transition">
            Selengkapnya <span aria-hidden="true">➜</span>
          </button>
        </div>
      </div>
    </section>
  );
}
