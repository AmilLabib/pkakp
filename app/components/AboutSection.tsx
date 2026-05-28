export default function AboutSection() {
  return (
    <section id="tentang" className="bg-white py-10 md:py-14">
      <div className="mx-auto px-4 md:px-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="text-[#171b23] leading-relaxed text-sm md:text-xl font-poppins font-normal text-justify">
            <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-[#171b23] mb-6">
              Tentang Kami
            </h2>

            <p>
              Pusat Kajian Akuntansi dan Keuangan Publik (PKAKP) merupakan Unit
              Kegiatan Mahasiswa yang mewadahi aktivitas pengembangan minat dan
              bakat mahasiswa serta alumni di bidang akuntansi dan keuangan
              publik. PKAKP telah memiliki aktivitas sejak tahun 2007, namun
              baru didirikan secara resmi pada tahun 2015 dengan motto
              "Responsif, Kontributif, Solutif". PKAKP bersifat kekeluargaan,
              profesional dan keilmuan serta berpegang pada nilai integritas,
              profesionalisme, solidaritas, sinergi, dan kesempurnaan.
            </p>
          </div>

          <div className="w-[full] h-[250px] md:h-[400px] rounded-xl bg-gradient-to-br from-[#88aa2c] to-[#6b9a1f]" />
        </div>

        <div className="mt-20 flex justify-center">
          <button className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#1aa9a2] text-white px-6 py-2.5 font-base hover:opacity-95 transition">
            Selengkapnya{" "}
            <span aria-hidden="true" className="text-3xl">
              ➜
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
