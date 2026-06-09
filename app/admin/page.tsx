"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { FileText, Users, Award, Image as ImageIcon } from "lucide-react";
import type { LucideProps } from "lucide-react";
import {
  fetchArticles,
  fetchMembers,
  fetchPrestasi,
  fetchGaleri,
  fetchLikesByUser,
  fetchCommentsByUserName,
} from "@/lib/supabaseClient";
import AdminArtikel from "./artikel/page";

type Count = number | null;

const StatCard = ({
  title,
  count,
  Icon,
  iconClass = "text-indigo-500",
}: {
  title: string;
  count: Count;
  Icon?: ComponentType<LucideProps>;
  iconClass?: string;
}) => (
  <div className="p-4 bg-white rounded shadow text-center">
    {Icon && <Icon className={`mx-auto ${iconClass}`} size={34} />}
    <div className="text-sm text-gray-500 mt-2">{title}</div>
    <div className="text-2xl font-extrabold mt-1">
      {count === null ? "—" : count}
    </div>
  </div>
);

export default function AdminIndex() {
  const [articlesCount, setArticlesCount] = useState<Count>(null);
  const [membersCount, setMembersCount] = useState<Count>(null);
  const [prestasiCount, setPrestasiCount] = useState<Count>(null);
  const [galeriCount, setGaleriCount] = useState<Count>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [user, setUser] = useState<Record<string, any> | null>(null);

  const [staffArticlesCount, setStaffArticlesCount] = useState<number | null>(
    null,
  );
  const [staffLikedCount, setStaffLikedCount] = useState<number | null>(null);
  const [staffCommentsCount, setStaffCommentsCount] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    async function loadCounts() {
      try {
        const { data: articles } = await fetchArticles();
        if (mounted)
          setArticlesCount(Array.isArray(articles) ? articles.length : 0);
      } catch {
        if (mounted) setArticlesCount(0);
      }

      try {
        const { data: members } = await fetchMembers();
        if (mounted)
          setMembersCount(Array.isArray(members) ? members.length : 0);
      } catch {
        if (mounted) setMembersCount(0);
      }

      try {
        const { data: prestasi } = await fetchPrestasi();
        if (mounted)
          setPrestasiCount(Array.isArray(prestasi) ? prestasi.length : 0);
      } catch {
        if (mounted) setPrestasiCount(0);
      }

      try {
        const { data: galeri } = await fetchGaleri();
        if (mounted) setGaleriCount(Array.isArray(galeri) ? galeri.length : 0);
      } catch {
        if (mounted) setGaleriCount(0);
      }
    }

    loadCounts();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) return;
        const json = await res.json();
        const payload = json?.payload || null;
        setUser(payload);
        setDisplayName(payload?.name ?? payload?.email ?? null);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!user || user?.role !== "staf") return;

    let mounted = true;
    (async () => {
      try {
        const onlyOwnedBy = user.email ?? user.name ?? null;

        try {
          const { data: arts } = await fetchArticles({ onlyOwnedBy });
          if (!mounted) return;
          setStaffArticlesCount(Array.isArray(arts) ? arts.length : 0);
        } catch {
          if (mounted) setStaffArticlesCount(0);
        }

        try {
          const { data: likes } = await fetchLikesByUser(user.email);
          if (!mounted) return;
          setStaffLikedCount(Array.isArray(likes) ? likes.length : 0);
        } catch {
          if (mounted) setStaffLikedCount(0);
        }

        try {
          const { data: comments } = await fetchCommentsByUserName(user.name);
          if (!mounted) return;
          setStaffCommentsCount(Array.isArray(comments) ? comments.length : 0);
        } catch {
          if (mounted) setStaffCommentsCount(0);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (user?.role === "staf") {
    return (
      <>
        <section className="">
          <div className="container mx-auto px-4">
            <div className="w-full mx-auto">
              <div className="bg-gradient-to-r from-yellow-200 to-emerald-200 rounded-2xl p-8">
                <div className="bg-yellow-200 rounded-xl p-8">
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-white overflow-hidden shadow-lg flex items-center justify-center mb-4">
                      {user?.picture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.picture}
                          alt={user?.name ?? user?.email}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center text-white text-3xl">
                          {String(
                            (user?.name || user?.email || "?").charAt(0),
                          ).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl font-extrabold">
                      {user?.name ?? user?.email}
                    </h2>
                    <div className="mt-2 inline-flex items-center bg-white/90 text-sm text-gray-700 rounded-full px-3 py-1">
                      Member PKAKP
                    </div>

                    <p className="text-sm text-gray-700 mt-4">
                      Staff of Media & Visual - Visual
                    </p>

                    <hr className="w-full border-t border-gray-300 my-6" />

                    <div className="flex gap-4">
                      <div className="p-4 bg-white rounded shadow text-center min-w-[90px]">
                        <div className="text-2xl font-extrabold">
                          {staffArticlesCount === null
                            ? "—"
                            : staffArticlesCount}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Articles
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded shadow text-center min-w-[90px]">
                        <div className="text-2xl font-extrabold">
                          {staffLikedCount === null ? "—" : staffLikedCount}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Liked</div>
                      </div>

                      <div className="p-4 bg-white rounded shadow text-center min-w-[90px]">
                        <div className="text-2xl font-extrabold">
                          {staffCommentsCount === null
                            ? "—"
                            : staffCommentsCount}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Comments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AdminArtikel />
      </>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Halo, {displayName || "Admin"}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Artikel"
          count={articlesCount}
          Icon={FileText}
          iconClass="text-indigo-600"
        />
        <StatCard
          title="Pengurus / Member"
          count={membersCount}
          Icon={Users}
          iconClass="text-teal-600"
        />
        <StatCard
          title="Prestasi"
          count={prestasiCount}
          Icon={Award}
          iconClass="text-amber-500"
        />
        <StatCard
          title="Galeri Kegiatan"
          count={galeriCount}
          Icon={ImageIcon}
          iconClass="text-sky-500"
        />
      </div>
    </section>
  );
}
