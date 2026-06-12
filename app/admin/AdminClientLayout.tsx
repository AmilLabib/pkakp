"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import MotionButton from "../components/MotionButton";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isPreviewPage = pathname?.startsWith("/admin/artikel/preview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const hideSidebar = userRole === "staf";

  // preload stored email so name persists across refreshes until logout
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pkakp_admin_email");
      if (stored) setUserName(stored);
    } catch {}
  }, []);

  const linkClass = (href: string, exact = false) => {
    const active = exact ? pathname === href : pathname?.startsWith(href || "");
    return `px-3 py-2 rounded ${active ? "bg-gray-100 font-medium text-gray-900" : "hover:bg-gray-100 text-gray-700"}`;
  };

  useEffect(() => {
    // On admin pages we normally hide global header/footer via body.no-navbar.
    // But for the preview page we want to show the public Navbar/Footer while
    // hiding the admin menu — so skip adding the body class on preview.
    if (isPreviewPage) return;
    try {
      document.body.classList.add("no-navbar");
    } catch {}
    return () => {
      try {
        document.body.classList.remove("no-navbar");
      } catch {}
    };
  }, [isPreviewPage]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) return;
        const json = await res.json();
        const payload = json?.payload || {};
        setUserRole(payload?.role ?? null);
        const nameOrEmail = payload?.name ?? payload?.email ?? null;
        setUserName(nameOrEmail);
        setUserPicture(payload?.picture ?? null);
        try {
          if (payload?.email)
            localStorage.setItem("pkakp_admin_email", payload.email);
        } catch {}
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    try {
      localStorage.removeItem("pkakp_admin_email");
    } catch {}
    router.push("/");
  };

  // If this is the preview page, render a simplified wrapper so the preview
  // layout matches the public article detail page (no admin container or
  // sidebar that shifts content to the right). Navbar and Footer are kept
  // visible because we skipped adding body.no-navbar for preview above.
  if (isPreviewPage) {
    return (
      <div className="w-full min-h-screen bg-white pt-24 md:pt-28">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="md:hidden mb-4 flex items-center justify-between">
          {!hideSidebar && (
            <MotionButton
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded bg-white shadow"
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </MotionButton>
          )}

          <h2 className="font-bold text-lg">Admin</h2>
        </div>

        {/* Desktop user menu (top-right) */}
        <div className="hidden md:flex items-center justify-end mb-4">
          <div className="relative">
            <MotionButton
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="User menu"
              className="flex items-center gap-2 bg-white px-3 py-1 rounded shadow"
            >
              {userPicture ? (
                <img
                  src={userPicture}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center text-white font-medium">
                  {userName ? String(userName).charAt(0).toUpperCase() : "?"}
                </span>
              )}
              <span className="text-sm text-gray-700 max-w-[160px] truncate">
                {userName}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </MotionButton>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <div className="p-3 text-sm text-gray-800 font-medium">
                  {userName}
                </div>
                <div className="border-t" />
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Lihat Profil
                </a>
                <MotionButton
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Logout
                </MotionButton>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {!hideSidebar && (
            <aside className="hidden md:block w-64 bg-white rounded shadow p-4 sticky top-28 h-[80vh]">
              <div className="mb-6">
                <h2 className="font-bold text-lg">Admin</h2>
                <p className="text-sm text-gray-600">Kelola konten situs</p>
                {userPicture ? (
                  <img
                    src={userPicture}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover mt-2"
                  />
                ) : null}
                {userName && (
                  <div className="mt-2 text-sm text-gray-700">{userName}</div>
                )}
              </div>

              <nav className="flex flex-col gap-2">
                <Link href="/admin" className={linkClass("/admin", true)}>
                  Dashboard
                </Link>
                <Link
                  href="/admin/artikel"
                  className={linkClass("/admin/artikel")}
                >
                  Artikel
                </Link>
                {userRole === "admin" && (
                  <>
                    <Link
                      href="/admin/pengurus"
                      className={linkClass("/admin/pengurus")}
                    >
                      Pengurus
                    </Link>
                    <Link
                      href="/admin/galeri"
                      className={linkClass("/admin/galeri")}
                    >
                      Galeri Kegiatan
                    </Link>
                    <Link
                      href="/admin/prestasi"
                      className={linkClass("/admin/prestasi")}
                    >
                      Prestasi
                    </Link>
                  </>
                )}
                <MotionButton
                  onClick={handleLogout}
                  className="mt-4 text-sm bg-red-50 text-red-700 px-3 py-2 rounded"
                >
                  Logout
                </MotionButton>
              </nav>
            </aside>
          )}

          <main className="flex-1">{children}</main>
        </div>
      </div>

      {/* Mobile off-canvas menu (hidden for staff) */}
      {!hideSidebar && (
        <div
          className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        >
          <div
            className={`fixed inset-0 bg-black/40 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMenuOpen(false)}
          />

          <aside
            className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow p-4 transform transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="mb-6">
              <h2 className="font-bold text-lg">Admin</h2>
              <p className="text-sm text-gray-600">Kelola konten situs</p>
              {userPicture ? (
                <img
                  src={userPicture}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover mt-2"
                />
              ) : null}
              {userName && (
                <div className="mt-2 text-sm text-gray-700">{userName}</div>
              )}
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                href="/admin"
                className={linkClass("/admin", true)}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/artikel"
                className={linkClass("/admin/artikel")}
                onClick={() => setMenuOpen(false)}
              >
                Artikel
              </Link>
              {userRole === "admin" && (
                <>
                  <Link
                    href="/admin/pengurus"
                    className={linkClass("/admin/pengurus")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Pengurus
                  </Link>
                  <Link
                    href="/admin/galeri"
                    className={linkClass("/admin/galeri")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Galeri Kegiatan
                  </Link>
                  <Link
                    href="/admin/prestasi"
                    className={linkClass("/admin/prestasi")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Prestasi
                  </Link>
                </>
              )}
              <MotionButton
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="mt-4 text-sm bg-red-50 text-red-700 px-3 py-2 rounded cursor-pointer"
              >
                Logout
              </MotionButton>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
