"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  useHideGlobalNav();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // NOTE: This is a simple client-side mock auth. In production, replace with real API calls.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Assumption: single admin account for demo
    const validUsername = "admin";
    const validPassword = "admin123";

    if (username === validUsername && password === validPassword) {
      try {
        localStorage.setItem("pkakp_admin_auth", "true");
      } catch {
        // ignore storage errors
      }
      router.push("/admin");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-white pt-24 md:pt-28">
      <section className="max-w-md w-full mx-4 p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-extrabold mb-2">Login Admin</h1>
        <p className="text-sm text-gray-600 mb-6">
          Masuk untuk mengelola dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
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
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded font-semibold"
            >
              Masuk
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          Demo akun: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </section>
    </main>
  );
}

// hide navbar/footer on login page as well
export function useHideGlobalNav() {
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
