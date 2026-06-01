"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTentangOpen, setIsTentangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileTentangOpen, setIsMobileTentangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const shouldShowBackground = isScrolled || pathname !== "/";
  const closeTentangMenu = () => setIsTentangOpen(false);
  const openTentangMenu = () => setIsTentangOpen(true);
  const toggleTentangMenu = () => setIsTentangOpen((prev) => !prev);
  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsMobileTentangOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full h-16 md:h-20 px-4 md:px-8 transition-all duration-300 ${
        shouldShowBackground ? "shadow-md" : "shadow-none"
      }`}
      style={
        shouldShowBackground
          ? {
              backgroundImage: "url('/navbar-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      <div className="w-full h-full flex items-center justify-between">
        <div className="site-logo flex items-center">
          <Image
            src="/logo-1.png"
            alt="PKAKP"
            width={48}
            height={18}
            className="w-15 md:w-20 h-auto"
            priority
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md bg-white/90 shadow-md"
            onClick={() => setIsMobileOpen((s) => !s)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 18L18 6"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6h18"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12h18"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 18h18"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <nav className="hidden lg:flex items-center gap-4 md:gap-20 font-poppins pr-2 md:pr-12">
            <Link
              href="/#beranda"
              className="relative inline-flex items-center px-2 py-1 text-[#171b23] font-base text-sm md:text-base hover:opacity-90 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-16 md:after:h-20 after:w-[calc(100%+1rem)] after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
              onClick={closeTentangMenu}
            >
              <span className="relative z-10">Beranda</span>
            </Link>

            <div
              className="relative"
              onMouseEnter={openTentangMenu}
              onMouseLeave={closeTentangMenu}
            >
              <button
                type="button"
                onClick={toggleTentangMenu}
                className="relative inline-flex items-center gap-1 px-2 py-1 text-[#171b23] font-base text-sm md:text-base hover:opacity-90 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-16 md:after:h-20 after:w-[calc(100%+1rem)] after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
                aria-haspopup="true"
                aria-expanded={isTentangOpen}
              >
                <span className="relative z-10">Tentang</span>
                <span className="relative z-10 ml-2">
                  <Image src="/down.svg" alt="" width={9} height={9} />
                </span>
              </button>

              {isTentangOpen && (
                <div
                  className="absolute top-full left-0 pt-2"
                  onMouseEnter={openTentangMenu}
                >
                  <div className="w-72 bg-[#fff3cc] shadow-[0_8px_18px_rgba(0,0,0,0.12)] overflow-hidden">
                    <Link
                      href="/profil-organisasi"
                      className="block px-8 py-3 text-sm leading-[1.2] tracking-[-0.03em] text-black hover:bg-[linear-gradient(180deg,#FFF2AE_0%,#FFC31A_100%)]"
                      onClick={closeTentangMenu}
                    >
                      Profil Organisasi
                    </Link>
                    <Link
                      href="/visi-misi"
                      className="block px-8 py-3 text-sm leading-[1.2] tracking-[-0.03em] text-black hover:bg-[linear-gradient(180deg,#FFF2AE_0%,#FFC31A_100%)]"
                      onClick={closeTentangMenu}
                    >
                      Visi dan Misi
                    </Link>
                    <Link
                      href="/struktur-organisasi"
                      className="block px-8 py-3 text-sm leading-[1.2] tracking-[-0.03em] text-black hover:bg-[linear-gradient(180deg,#FFF2AE_0%,#FFC31A_100%)]"
                      onClick={closeTentangMenu}
                    >
                      Struktur Organisasi
                    </Link>
                    <Link
                      href="/galeri"
                      className="block px-8 py-3 text-sm leading-[1.2] tracking-[-0.03em] text-black hover:bg-[linear-gradient(180deg,#FFF2AE_0%,#FFC31A_100%)]"
                      onClick={closeTentangMenu}
                    >
                      Galeri Kegiatan
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/prestasi"
              className="relative inline-flex items-center px-2 py-1 text-[#171b23] font-base text-sm md:text-base hover:opacity-90 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-16 md:after:h-20 after:w-[calc(100%+1rem)] after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
              onClick={closeTentangMenu}
            >
              <span className="relative z-10">Prestasi</span>
            </Link>

            <Link
              href="/artikel"
              className="relative inline-flex items-center px-2 py-1 text-[#171b23] font-base text-sm md:text-base hover:opacity-90 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-16 md:after:h-20 after:w-[calc(100%+1rem)] after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
              onClick={closeTentangMenu}
            >
              <span className="relative z-10">Artikel</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile overlay + sliding sidebar (right) */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeMobileMenu}
        />

        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute top-0 right-0 h-full w-72 max-w-[80%] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-bold text-[#171b23]">Menu</div>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Tutup menu"
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 18L18 6"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <Link
              href="/#beranda"
              className="relative flex items-center w-full px-3 py-2 text-[#171b23] font-poppins overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
              onClick={closeMobileMenu}
            >
              <span className="relative z-10">Beranda</span>
            </Link>

            <div>
              <button
                type="button"
                className="relative flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 justify-between text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
                onClick={() => setIsMobileTentangOpen((s) => !s)}
                aria-expanded={isMobileTentangOpen}
              >
                <span className="relative z-10">Tentang</span>
                <Image src="/down.svg" alt="" width={12} height={12} />
              </button>

              {isMobileTentangOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link
                    href="/profil-organisasi"
                    className="relative flex items-center w-full px-3 py-2 text-sm text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
                    onClick={closeMobileMenu}
                  >
                    <span className="relative z-10">Profil Organisasi</span>
                  </Link>
                  <Link
                    href="/visi-misi"
                    className="relative flex items-center w-full px-3 py-2 text-sm text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
                    onClick={closeMobileMenu}
                  >
                    <span className="relative z-10">Visi dan Misi</span>
                  </Link>
                  <Link
                    href="/struktur-organisasi"
                    className="relative flex items-center w-full px-3 py-2 text-sm text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
                    onClick={closeMobileMenu}
                  >
                    <span className="relative z-10">Struktur Organisasi</span>
                  </Link>
                  <Link
                    href="/galeri"
                    className="relative flex items-center w-full px-3 py-2 text-sm text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
                    onClick={closeMobileMenu}
                  >
                    <span className="relative z-10">Galeri Kegiatan</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/prestasi"
              className="relative inline-flex items-center w-full px-3 py-2 rounded-md text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
              onClick={closeMobileMenu}
            >
              <span className="relative z-10">Prestasi</span>
            </Link>

            <Link
              href="/artikel"
              className="relative inline-flex items-center w-full px-3 py-2 rounded-md text-[#171b23] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-[#f4c42e] after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none"
              onClick={closeMobileMenu}
            >
              <span className="relative z-10">Artikel</span>
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}
