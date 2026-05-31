import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-lg text-[#333] mb-6">Halaman tidak ditemukan.</p>
        <Link
          href="/"
          className="inline-block bg-[#1aa9a2] text-white px-6 py-2 rounded-full font-medium hover:brightness-95"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
