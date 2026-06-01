"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { FileText, Users, Award, Image as ImageIcon } from "lucide-react";
import type { LucideProps } from "lucide-react";
import {
  fetchArticles,
  fetchMembers,
  fetchPrestasi,
  fetchGaleri,
} from "@/lib/supabaseClient";

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

  useEffect(() => {
    let mounted = true;

    async function loadCounts() {
      try {
        const { data: articles } = await fetchArticles();
        if (mounted)
          setArticlesCount(Array.isArray(articles) ? articles.length : 0);
      } catch (e) {
        if (mounted) setArticlesCount(0);
      }

      try {
        const { data: members } = await fetchMembers();
        if (mounted)
          setMembersCount(Array.isArray(members) ? members.length : 0);
      } catch (e) {
        if (mounted) setMembersCount(0);
      }

      try {
        const { data: prestasi } = await fetchPrestasi();
        if (mounted)
          setPrestasiCount(Array.isArray(prestasi) ? prestasi.length : 0);
      } catch (e) {
        if (mounted) setPrestasiCount(0);
      }

      try {
        const { data: galeri } = await fetchGaleri();
        if (mounted) setGaleriCount(Array.isArray(galeri) ? galeri.length : 0);
      } catch (e) {
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
        const payload = json?.payload || {};
        setDisplayName(payload?.name ?? payload?.email ?? null);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

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
