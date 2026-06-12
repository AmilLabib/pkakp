"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MotionButton from "../components/MotionButton";
import FooterSection from "../components/FooterSection";
import { useEffect, useState } from "react";

type Member = {
  id?: string;
  role: string; // legacy display title
  name: string;
  photo?: string;
  role_group?: string | null; // 'board_of_director' | 'head_of_division' | 'staff'
  staff_category?: string | null; // for staff categories
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
            <div>
              {/* Board of Directors */}
              <section className="mb-10">
                <h2 className="text-center font-montserrat text-4xl font-extrabold tracking-tight text-black">
                  Board of Directors
                </h2>
                <div className="w-32 h-1 bg-black mx-auto mt-3 mb-6" />
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-0">
                  {members
                    .filter((m) => m.role_group === "board_of_director")
                    .map((item, index) => (
                      <motion.article
                        key={item.id ?? `${item.role}-${index}`}
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
                        <div>
                          {item.id ? (
                            <Link
                              href={`/struktur-organisasi/${item.id}`}
                              className="block"
                            >
                              <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                                <MemberImage src={item.photo} alt={item.role} />
                              </div>

                              <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                                {item.role}
                              </h3>
                              <p className="mt-1 font-poppins text-2xl leading-[0.95] text-black">
                                {item.name}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                                <MemberImage src={item.photo} alt={item.role} />
                              </div>

                              <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                                {item.role}
                              </h3>
                              <p className="mt-1 font-poppins text-2xl leading-[0.95] text-black">
                                {item.name}
                              </p>
                            </>
                          )}
                        </div>
                      </motion.article>
                    ))}
                </div>
              </section>

              {/* Head of Division */}
              <section className="mb-10">
                <h2 className="text-center font-montserrat text-4xl font-extrabold tracking-tight text-black">
                  Head of Division
                </h2>
                <div className="w-32 h-1 bg-black mx-auto mt-3 mb-6" />
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-0">
                  {members
                    .filter((m) => m.role_group === "head_of_division")
                    .map((item, index) => (
                      <motion.article
                        key={item.id ?? `${item.role}-${index}`}
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
                        <div>
                          {item.id ? (
                            <Link
                              href={`/struktur-organisasi/${item.id}`}
                              className="block"
                            >
                              <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                                <MemberImage src={item.photo} alt={item.role} />
                              </div>

                              <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                                {item.role}
                              </h3>
                              <p className="mt-1 font-poppins text-2xl leading-[0.95] text-black">
                                {item.name}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                                <MemberImage src={item.photo} alt={item.role} />
                              </div>

                              <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                                {item.role}
                              </h3>
                              <p className="mt-1 font-poppins text-2xl leading-[0.95] text-black">
                                {item.name}
                              </p>
                            </>
                          )}
                        </div>
                      </motion.article>
                    ))}
                </div>
              </section>

              {/* Staff */}
              <section className="mb-10">
                <h2 className="text-center font-montserrat text-4xl font-extrabold tracking-tight text-black">
                  Staff
                </h2>
                <div className="w-32 h-1 bg-black mx-auto mt-3 mb-6" />
                <div className="mt-6 flex justify-center gap-3 mb-6 ">
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
                        staffFilter === f.key ? "bg-black text-white" : "border"
                      }`}
                    >
                      {f.label}
                    </MotionButton>
                  ))}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-0">
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
                        <div>
                          {item.id ? (
                            <Link
                              href={`/struktur-organisasi/${item.id}`}
                              className="block"
                            >
                              <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                                <MemberImage src={item.photo} alt={item.role} />
                              </div>

                              <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                                {item.staff_category
                                  ? formatCategory(item.staff_category)
                                  : item.role}
                              </h3>
                              <p className="mt-1 font-poppins text-2xl leading-[0.95] text-black">
                                {item.name}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                                <MemberImage src={item.photo} alt={item.role} />
                              </div>

                              <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                                {item.staff_category
                                  ? formatCategory(item.staff_category)
                                  : item.role}
                              </h3>
                              <p className="mt-1 font-poppins text-2xl leading-[0.95] text-black">
                                {item.name}
                              </p>
                            </>
                          )}
                        </div>
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
