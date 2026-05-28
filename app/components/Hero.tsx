import Image from "next/image";

export default function Hero() {
  return (
    <section id="beranda" className="hero-bg relative w-full min-h-screen">
      <div className="absolute inset-0 bg-[#0b7f81]/50" />
      <img
        src="/overlay.png"
        alt="overlay"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full min-h-[85vh] flex items-center justify-center px-6 md:px-8 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="mb-4">
            <Image
              src="/logo-2.png"
              alt="PKAKP logo"
              width={200}
              height={170}
              priority
            />
          </div>

          <h1 className="font-montserrat text-white text-xl md:text-6xl font-extrabold tracking-wide">
            PKAKP PKN STAN
          </h1>

          <p className="font-helvetica mt-2 text-white text-base md:text-[1.7rem] font-bold">
            Pusat Kajian Akuntansi dan Keuangan Publik
          </p>

          <p className="font-poppins text-white text-sm md:text-2xl font-base">
            Politeknik Keuangan Negara STAN
          </p>
        </div>

        <p className="absolute bottom-6 md:bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[92vw] px-4 font-helvetica text-white text-lg md:text-3xl italic font-bold text-center whitespace-normal md:whitespace-nowrap">
          “ Responsif, Kontributif, Solutif ”
        </p>
      </div>
    </section>
  );
}
