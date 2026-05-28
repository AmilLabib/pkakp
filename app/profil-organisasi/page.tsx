import FooterSection from "../components/FooterSection";

export default function ProfilOrganisasiPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8">
        <h1 className="font-montserrat text-5xl md:text-6xl font-extrabold tracking-tight text-black">
          PROFIL
        </h1>
        <h2 className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          Pusat Kajian Akuntansi dan Keuangan Publik
        </h2>

        <div className="mt-6 md:mt-8 w-full overflow-hidden rounded-[28px] bg-black">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/hRCRxhpLACA?si=irGWl23ccKUNKYKX"
            title="YouTube video player"
            frameBorder="0"
            className="h-[260px] w-full md:h-[580px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-8 pb-12">
          <div className="space-y-5">
            <div className="h-52 md:h-64 rounded-md bg-[linear-gradient(180deg,#DDF3FF_0%,#EAF8FF_45%,#C8E892_45%,#7FA80A_100%)]" />
            <div className="h-52 md:h-64 rounded-md bg-[linear-gradient(180deg,#DDF3FF_0%,#EAF8FF_45%,#C8E892_45%,#7FA80A_100%)]" />
          </div>

          <article className="font-poppins text-black">
            <h3 className="font-montserrat text-3xl md:text-5xl font-extrabold leading-tight">
              Selayang Pandang PKAKP
            </h3>

            <div className="font-poppins mt-4 space-y-4 text-base md:text-lg leading-relaxed tracking-tight text-justify">
              <p>
                Pusat Kajian Akuntansi dan Keuangan Publik (PKAKP) merupakan
                organisasi kemahasiswaan di PKN STAN yang berdiri sejak tahun
                2007. PKAKP hadir sebagai wadah bagi mahasiswa untuk
                mengembangkan minat, pengetahuan, dan keterampilan di bidang
                akuntansi serta keuangan publik.
              </p>

              <p>
                Dengan mengusung motto “Responsif, Kontributif, Solutif,” PKAKP
                berkomitmen untuk mendorong mahasiswa agar mampu berpikir
                kritis, menghasilkan karya yang berdampak, serta berkontribusi
                dalam pengembangan keilmuan akuntansi dan keuangan publik.
              </p>

              <p>
                Dalam menjalankan berbagai program dan kegiatannya, PKAKP
                memiliki beberapa departemen utama, yaitu:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Accounting Olympiad Department – berfokus pada pengembangan
                  kompetensi akademik dan persiapan kompetisi di bidang
                  akuntansi.
                </li>
                <li>
                  Research & Writing Department – mengembangkan kemampuan riset
                  dan penulisan ilmiah mahasiswa.
                </li>
                <li>
                  Organization & Project Department – mengelola pengembangan
                  organisasi serta pelaksanaan berbagai program dan kegiatan.
                </li>
                <li>
                  Media & Visual Communication Department – bertanggung jawab
                  dalam pengelolaan media, publikasi, dan komunikasi visual
                  organisasi.
                </li>
              </ul>

              <p>
                Melalui berbagai program pengembangan, kajian, serta kolaborasi,
                PKAKP terus berupaya menjadi ruang belajar dan berkontribusi
                bagi mahasiswa yang memiliki ketertarikan pada bidang akuntansi
                dan keuangan publik.
              </p>
            </div>
          </article>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
