import Image from "next/image";
import FooterSection from "../components/FooterSection";

type Member = {
  role: string;
  name: string;
};

const strukturOrganisasi: Member[] = [
  { role: "President", name: "Rona Alifah" },
  { role: "Vice President", name: "Novinka Anggraini" },
  { role: "Secretary 1", name: "nama" },
  { role: "Secretary 2", name: "nama" },
  { role: "Treasurer 1", name: "nama" },
  { role: "Treasurer 2", name: "nama" },
  { role: "Head Accounting Olympiad", name: "nama" },
  { role: "Head Research & Writing", name: "nama" },
  { role: "Head Media & Visual", name: "nama" },
  { role: "Head Organization & Project", name: "nama" },
];

export default function StrukturOrganisasiPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white pt-24 md:pt-28">
      <section className="max-w-500 mx-auto px-5 md:px-8 pb-16 md:pb-20">
        <div>
          <h1 className="font-montserrat text-5xl md:text-5xl font-extrabold tracking-tight text-black uppercase">
            Struktur Organisasi
          </h1>
          <h2 className="mt-2 font-montserrat text-xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
            Pusat Kajian Akuntansi dan Keuangan Publik
          </h2>
        </div>

        <div className="mt-10 md:mt-35 max-w-250 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-0">
            {strukturOrganisasi.map((item) => (
              <article key={item.role} className="text-center">
                <div className="mx-auto w-3/4 max-w-130 h-48 md:h-54 rounded-[18px] bg-[#f7d761] relative overflow-visible">
                  <Image
                    src="/profil-organisasi/1.png"
                    alt={item.role}
                    fill
                    className="object-contain object-bottom scale-[1.15] md:scale-[1.25] -translate-y-2 md:-translate-y-7"
                  />
                </div>

                <h3 className="mt-2 font-poppins font-semibold italic text-3xl leading-[0.95] text-[#ff971d]">
                  {item.role}
                </h3>
                <p className="-mt-1 font-poppins text-2xl leading-[0.95] text-black">
                  {item.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
