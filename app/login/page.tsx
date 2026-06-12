"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MotionButton from "../components/MotionButton";

export default function LoginPage() {
  const router = useRouter();
  useHideGlobalNav();
  const [mode, setMode] = useState<null | "admin" | "staf">(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // when user clicks "Masuk sebagai Staf", prefer direct access if session exists
  const handleStafClick = async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const json = await res.json();
        const role = json?.payload?.role;
        if (role === "staf") {
          router.push("/admin");
          return;
        }
      }
    } catch {}
    setMode("staf");
  };

  const startGoogleAuth = () => {
    // full navigation so server route can redirect to Google
    window.location.href = "/api/admin/google-auth";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login gagal");
        return;
      }
      // On success, server sets HttpOnly cookie; just navigate to admin
      router.push("/admin");
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-white pt-24 md:pt-28">
      <section className="max-w-md w-full mx-4 p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-extrabold mb-2">Login Admin</h1>
        <p className="text-sm text-gray-600 mb-6">Pilih cara masuk:</p>

        {mode === null && (
          <div className="space-y-3">
            <MotionButton
              onClick={() => setMode("admin")}
              className="w-full bg-black text-white px-4 py-2 rounded font-semibold"
            >
              Masuk sebagai Administrator
            </MotionButton>

            <MotionButton
              type="button"
              onClick={handleStafClick}
              className="w-full border px-4 py-2 rounded hover:bg-gray-50"
            >
              Masuk sebagai Staf
            </MotionButton>
          </div>
        )}

        {mode === "admin" && (
          <div>
            <div className="mb-4">
              <MotionButton
                onClick={() => setMode(null)}
                className="text-sm text-gray-600 underline"
              >
                ← Kembali
              </MotionButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex items-center justify-between">
                <MotionButton
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded font-semibold"
                >
                  Masuk
                </MotionButton>
              </div>
            </form>

            <p className="mt-4 text-xs text-gray-500">
              Gunakan akun admin yang telah dikonfigurasi
            </p>
          </div>
        )}

        {mode === "staf" && (
          <div>
            <div className="mb-4">
              <MotionButton
                onClick={() => setMode(null)}
                className="text-sm text-gray-600 underline"
              >
                ← Kembali
              </MotionButton>
            </div>

            <div className="mt-2">
              <MotionButton
                type="button"
                onClick={startGoogleAuth}
                className="w-full inline-flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-50"
              >
                <img
                  src="/social/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Masuk dengan Google (Email PKN STAN)</span>
              </MotionButton>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Staf hanya dapat masuk menggunakan akun Google institusi
              (@pknstan.ac.id). Nama dari akun akan digunakan sebagai penulis.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

// hide navbar/footer on login page as well
function useHideGlobalNav() {
  useEffect(() => {
    try {
      document.body.classList.add("no-navbar");
    } catch {}
    return () => {
      try {
        document.body.classList.remove("no-navbar");
      } catch {}
    };
  }, []);
}
