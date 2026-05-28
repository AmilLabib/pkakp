"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTentangOpen, setIsTentangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeTentangMenu = () => setIsTentangOpen(false);
  const openTentangMenu = () => setIsTentangOpen(true);
  const toggleTentangMenu = () => setIsTentangOpen((prev) => !prev);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full h-16 md:h-20 px-4 md:px-8 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
      style={
        isScrolled
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
        <nav className="flex items-center gap-4 md:gap-20 font-poppins pr-2 md:pr-12">
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
                    href="/#artikel"
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
    </header>
  );
}
