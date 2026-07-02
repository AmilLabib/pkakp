"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MotionButton from "../components/MotionButton";
import FooterSection from "../components/FooterSection";
import { useEffect, useState } from "react";

type Member = {
  id?: string;
  role: string;
  name: string;
  photo?: string;
  role_group?: string | null;
  staff_category?: string | null;
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
  { role: "Head Media & Visual Communication", name: "nama" },
  { role: "Head Organization & Project", name: "nama" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export default function StrukturOrganisasiPage() {
  const [members, setMembers] = useState<Member[]>(fallback);
  const [loading, setLoading] = useState<boolean>(true);
  const [staffFilter, setStaffFilter] = useState<string>("all");

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
            const roleGroup =
              typeof r.role_group === "string" && r.role_group
                ? String(r.role_group)
                : typeof r.role === "string" && /^head/i.test(String(r.role))
                  ? "head_of_division"
                  : "board_of_director";
            return {
              id: r.id ? String(r.id) : undefined,
              name: typeof r.name === "string" ? r.name : "",
              role: typeof r.role === "string" ? r.role : "",
              photo: typeof r.photo === "string" ? r.photo : undefined,
              role_group: roleGroup,
              staff_category:
                typeof r.staff_category === "string" && r.staff_category
                  ? String(r.staff_category)
                  : null,
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

        <div className="mt-10 md:mt-35 max-w-500 mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="w-full h-44 md:h-52 rounded-2xl bg-gray-200/80 animate-pulse mt-8"
                />
              ))}
            </div>
          ) : (
            <div>
              {/* Board of Directors */}
              <section className="mb-10">
                <h2 className="text-center font-montserrat text-4xl font-extrabold tracking-tight text-black">
                  Board of Directors
                </h2>
                <div className="w-32 h-1 bg-black mx-auto mt-3 mb-6" />
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-y-50 gap-x-6 md:gap-x-12">
                  {members
                    .filter((m) => m.role_group === "board_of_director")
                    .map((item, index) => (
                      <motion.article
                        key={item.id ?? `${item.role}-${index}`}
                        className="w-full"
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.55,
                          delay: Math.min(index * 0.08, 0.5),
                          ease: "easeOut",
                        }}
                      >
                        {item.id ? (
                          <Link href={`/struktur-organisasi/${item.id}`}>
                            <MemberCard item={item} />
                          </Link>
                        ) : (
                          <MemberCard item={item} />
                        )}
                      </motion.article>
                    ))}
                </div>
              </section>

              {/* Head of Division */}
              <section className="mb-10 mt-16 md:mt-24">
                <h2 className="text-center font-montserrat text-4xl font-extrabold tracking-tight text-black">
                  Head of Division
                </h2>
                <div className="w-32 h-1 bg-black mx-auto mt-3 mb-6" />
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-y-36 gap-x-6 md:gap-x-12">
                  {members
                    .filter((m) => m.role_group === "head_of_division")
                    .map((item, index) => (
                      <motion.article
                        key={item.id ?? `${item.role}-${index}`}
                        className="w-full"
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.55,
                          delay: Math.min(index * 0.08, 0.5),
                          ease: "easeOut",
                        }}
                      >
                        {item.id ? (
                          <Link href={`/struktur-organisasi/${item.id}`}>
                            <MemberCard item={item} />
                          </Link>
                        ) : (
                          <MemberCard item={item} />
                        )}
                      </motion.article>
                    ))}
                </div>
              </section>

              {/* Staff */}
              <section className="mb-10 mt-16 md:mt-24">
                <h2 className="text-center font-montserrat text-4xl font-extrabold tracking-tight text-black">
                  Staff
                </h2>
                <div className="w-32 h-1 bg-black mx-auto mt-3 mb-6" />
                <div className="mt-6 flex flex-wrap justify-center gap-3 mb-10">
                  {[
                    { key: "all", label: "All" },
                    {
                      key: "accounting_olympiad",
                      label: "Accounting Olympiad",
                    },
                    {
                      key: "research_and_writing",
                      label: "Research & Writing",
                    },
                    {
                      key: "organization_and_project",
                      label: "Organization & Project",
                    },
                    { key: "media_and_visual", label: "Media & Visual communication" },
                  ].map((f) => (
                    <MotionButton
                      key={f.key}
                      onClick={() => setStaffFilter(f.key)}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${
                        staffFilter === f.key ? "bg-black text-white" : "border border-gray-300"
                      }`}
                    >
                      {f.label}
                    </MotionButton>
                  ))}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-y-36 gap-x-6 md:gap-x-12">
                  {members
                    .filter(
                      (m) =>
                        m.role_group === "staff" &&
                        (staffFilter === "all" ||
                          m.staff_category === staffFilter),
                    )
                    .map((item, index) => (
                      <motion.article
                        key={item.id ?? `${item.role}-${index}`}
                        className="w-full"
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.55,
                          delay: Math.min(index * 0.08, 0.5),
                          ease: "easeOut",
                        }}
                      >
                        {item.id ? (
                          <Link href={`/struktur-organisasi/${item.id}`}>
                            <MemberCard item={item} />
                          </Link>
                        ) : (
                          <MemberCard item={item} />
                        )}
                      </motion.article>
                    ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

function MemberCard({ item }: { item: Member }) {
  const [errored, setErrored] = useState(false);
  const validSrc = item.photo && String(item.photo).trim() !== "" ? item.photo : null;
  const finalSrc = !errored && validSrc ? validSrc : "/profil-organisasi/1.png";

  return (
    <div className="w-full flex justify-center items-center">
      {/* Container utama, diatur posisinya secara relative untuk memuat dekorasi latar */}
      <div className="relative w-full h-44 md:h-64 max-w-[95%] md:max-w-xl mx-auto">
        
        
        {/* KOTAK LATAR KUNING UTAMA */}
        <div className="absolute inset-0 bg-[#F4CF5D] rounded-[2rem] z-10"></div>

        <div className="absolute -top-20 -left-10 inset-0 z-15">
          <img src="/block.png" alt="" />
        </div>

        {/* KONTEN (FOTO & TEKS BERADA DI ATAS KOTAK KUNING) */}
        <div className="absolute inset-0 z-20 flex">
          {/* Bagian Foto Profil (Kiri) */}
          <div className="w-5/12 h-full relative">
            {/* Dibuat melampaui container kuning (overflow atas) */}
            <div className="absolute bottom-0 left-[-15%] md:left-[-10%] w-[140%] h-[140%]">
              <Image
                src={finalSrc}
                alt={item.name}
                fill
                onError={() => setErrored(true)}
                unoptimized={!!validSrc && String(validSrc).includes("supabase.co")}
                className="object-contain object-bottom drop-shadow-md"
              />
            </div>
          </div>
          
          {/* Bagian Teks (Kanan) */}
          <div className="w-7/12 flex flex-col justify-center items-center text-center pr-4 md:pr-6">
            <h3 className="font-poppins font-bold italic text-xl md:text-[26px] leading-tight text-[#00a99d] mb-1">
              {item.staff_category
                ? formatCategory(item.staff_category)
                : item.role}
            </h3>
            <p className="font-poppins font-medium text-lg md:text-xl text-black">
              {item.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCategory(cat?: string | null) {
  if (!cat) return "";
  const map: Record<string, string> = {
    accounting_olympiad: "Accounting Olympiad",
    research_and_writing: "Research & Writing",
    organization_and_project: "Organization & Project",
    media_and_visual: "Media & Visual Communication",
  };
  return (
    map[cat] ||
    String(cat)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}