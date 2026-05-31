"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";
import { useEffect, useState } from "react";

type Member = {
  id?: string;
  role: string;
  name: string;
  photo?: string;
};

const fallback: Member[] = [
  { role: "President", name: "Rona Alifah" },
  { role: "Vice President", name: "Novinka Anggraini" },
  { role: "Secretary 1", name: "nama" },
  { role: "Secretary 2", name: "nama" },
  { role: "Treasurer 1", name: "nama" },
  { role: "Treasurer 2", name: "nama" },
  { role: "Head Accounting Olympiad", name: "nama" },
  { role: "Head Research & Writing", name: "nama" },
  { role: "Head Media & Visual", name: "nama" },
  { role: "Head Organization & Project", name: "nama" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export default function StrukturOrganisasiPage() {
  const [members, setMembers] = useState<Member[]>(fallback);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/members/list");
        const json = await res.json();
        if (
          res.ok &&
          json?.success &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          const mapped = json.data.map((d: unknown) => {
            const r = d as Record<string, unknown>;
            return {
              id: r.id ? String(r.id) : undefined,
              name: typeof r.name === "string" ? r.name : "",
              role: typeof r.role === "string" ? r.role : "",
              photo: typeof r.photo === "string" ? r.photo : undefined,
            } as Member;
          });
          setMembers(mapped);
        }
      } catch (e) {
        // keep fallback
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-16 md:pb-20">
        <div>
          <motion.h1
            className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Struktur Organisasi
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
        </div>

        <div className="mt-10 md:mt-35 max-w-250 mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="text-center animate-pulse"
                >
                  <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-gray-200/80 relative overflow-hidden" />
                  <div className="mt-3 h-6 w-3/4 mx-auto bg-gray-200/80 rounded" />
                  <div className="mt-2 h-5 w-1/2 mx-auto bg-gray-200/80 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-0">
              {members.map((item, index) => (
                <motion.article
                  key={item.id ?? item.role}
                  className="text-center"
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.08, 0.5),
                    ease: "easeOut",
                  }}
                >
                  <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                    <MemberImage src={item.photo} alt={item.role} />
                  </div>

                  <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                    {item.role}
                  </h3>
                  <p className="-mt-1 font-poppins text-2xl leading-[0.95] text-black">
                    {item.name}
                  </p>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

function MemberImage({ src, alt }: { src?: string; alt?: string }) {
  const [errored, setErrored] = useState(false);
  const validSrc = src && String(src).trim() !== "" ? src : null;
  const finalSrc = !errored && validSrc ? validSrc : "/profil-organisasi/1.png";

  return (
    <Image
      src={finalSrc}
      alt={alt ?? "member"}
      fill
      onError={() => setErrored(true)}
      unoptimized={!!validSrc && String(validSrc).includes("supabase.co")}
      className="object-contain object-bottom scale-[1.15] md:scale-[1.25] -translate-y-2 md:-translate-y-7"
    />
  );
}
