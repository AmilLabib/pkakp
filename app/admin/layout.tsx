"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    try {
      document.body.classList.add("no-navbar");
    } catch {}
    return () => {
      try {
        document.body.classList.remove("no-navbar");
      } catch {}
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("pkakp_admin_auth");
    } catch {}
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded shadow p-4 sticky top-28 h-[80vh]">
            <div className="mb-6">
              <h2 className="font-bold text-lg">Admin</h2>
              <p className="text-sm text-gray-600">Kelola konten situs</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                href="/admin"
                className="text-left px-3 py-2 rounded bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/artikel"
                className="px-3 py-2 rounded hover:bg-gray-100"
              >
                Artikel
              </Link>
              <Link
                href="/admin/pengurus"
                className="px-3 py-2 rounded hover:bg-gray-100"
              >
                Pengurus
              </Link>
              <Link
                href="/admin/prestasi"
                className="px-3 py-2 rounded hover:bg-gray-100"
              >
                Prestasi
              </Link>
              <button
                onClick={handleLogout}
                className="mt-4 text-sm bg-red-50 text-red-700 px-3 py-2 rounded"
              >
                Logout
              </button>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
