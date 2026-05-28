import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="pt-10 pb-6 bg-[url('/overlay.png')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col items-center text-center">
        <Image src="/logo-2.png" alt="PKAKP" width={150} height={80} />
        <h3 className="font-montserrat mt-3 text-5xl font-extrabold text-white leading-none">
          PKAKP
        </h3>
        <p className="font-poppins mt-2 text-white font-semibold">
          Politeknik Keuangan Negara
        </p>
        <p className="font-poppins text-white font-bold">STAN</p>

        <div className="mt-5 flex items-center gap-4 text-white">
          <a
            href="https://www.instagram.com/pkakp_pknstan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              src="/social/instagram.svg"
              alt="Instagram"
              width={22}
              height={22}
              className="brightness-0 invert"
            />
          </a>
          <a
            href="https://www.youtube.com/@pkakpstan8041"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <Image
              src="/social/youtube.svg"
              alt="YouTube"
              width={30}
              height={30}
              className="brightness-0 invert"
            />
          </a>
          <a
            href="https://id.linkedin.com/company/pkakp-pkn-stan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Image
              src="/social/linkedin.svg"
              alt="LinkedIn"
              width={22}
              height={22}
              className="brightness-0 invert"
            />
          </a>
        </div>

        <p className="mt-6 text-white/90 text-xs">
          © 2025 PKAKP PKN STAN | Responsif, Kontributif, Solutif
        </p>
      </div>
    </footer>
  );
}
