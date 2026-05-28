import FooterSection from "../components/FooterSection";

export default function VisiMisiPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <h1 className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase">
          Visi dan Misi
        </h1>
        <h2 className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          Pusat Kajian Akuntansi dan Keuangan Publik
        </h2>

        <div className="mt-14 md:mt-16">
          <h3 className="font-montserrat text-5xl font-extrabold text-center text-black uppercase">
            Visi
          </h3>
          <p className="font-poppins mt-4 md:mt-5 text-center text-black text-xl leading-[1.35] tracking-tight max-w-200 mx-auto">
            Menjadi UKM terpercaya dan dinamis dalam melaksanakan penelitian dan
            pengembangan kapasitas di bidang akuntansi dan keuangan publik.
          </p>
        </div>

        <div className="mt-14 md:mt-16 max-w-200 mx-auto">
          <h3 className="font-montserrat text-5xl font-extrabold text-center text-black uppercase">
            Misi
          </h3>

          <ul className="font-poppins mt-6 md:mt-7 list-disc pl-10 md:pl-12 text-black text-xl leading-[1.35] tracking-tight space-y-1">
            <li>
              Merumuskan analisis terkait isu-isu akuntansi dan keuangan publik.
            </li>
            <li>
              Melaksanakan dan mengembangkan penelitian dan atau kajian di
              bidang akuntansi dan keuangan publik.
            </li>
            <li>
              Mewujudkan SDM yang berprestasi di bidang akuntansi dan keuangan
              publik.
            </li>
            <li>
              Mewujudkan SDM yang memiliki integritas dan kompetensi tinggi di
              bidang akuntansi dan keuangan publik dengan didukung teknologi
              informasi dan komunikasi yang andal serta kinerja perencanaan dan
              penganggaran yang suportif.
            </li>
            <li>
              Mewujudkan sistem Teknologi dan Informasi yang andal dan maju.
            </li>
            <li>
              Merumuskan dan melaksanakan pengembangan organisasi secara
              responsif dan saksama.
            </li>
          </ul>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
