"use client";

import Link from "next/link";

export default function AdminIndex() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">Halo, Admin</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/admin/artikel"
          className="p-4 bg-white rounded shadow text-center"
        >
          Kelola Artikel
        </Link>
        <Link
          href="/admin/pengurus"
          className="p-4 bg-white rounded shadow text-center"
        >
          Daftar Pengurus
        </Link>
        <Link
          href="/admin/prestasi"
          className="p-4 bg-white rounded shadow text-center"
        >
          Daftar Prestasi
        </Link>
      </div>
    </section>
  );
}
