"use client";

import { useState, useEffect } from "react";
import {
  fetchPrestasi,
  insertPrestasi,
  deletePrestasi,
  uploadPrestasiImage,
} from "../../../lib/supabaseClient";

type Prestasi = { id: string; title: string; year: string; image?: string };

export default function AdminPrestasi() {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([
    { id: "1", title: "Juara 1 Lomba X", year: "2024" },
    { id: "2", title: "Penghargaan Y", year: "2023" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setYear("");
    setImage("");
  };

  const add = () => {
    if (!title.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      title,
      year: year || new Date().getFullYear().toString(),
      image,
    };

    setPrestasi((s) => [newItem, ...s]);
    closeModal();

    (async () => {
      try {
        // if a file was selected, upload it first
        let finalImage = newItem.image;
        if (newImageFile) {
          setStatus("Mengunggah gambar...");
          const up = await uploadPrestasiImage(newImageFile);
          if (up.error) {
            console.error("uploadPrestasiImage error", up.error);
            setStatus("Gagal mengunggah gambar: " + String(up.error));
            // revert optimistic update
            setPrestasi((s) => s.filter((x) => x.id !== newItem.id));
            return;
          }
          finalImage = up.data?.publicUrl ?? "";
        }

        setStatus("Menyimpan prestasi...");
        const { data, error } = await insertPrestasi({
          title: newItem.title,
          year: newItem.year,
          image: finalImage,
        });
        if (error) {
          console.error("insertPrestasi error", error, "data:", data);
          const errAny = error as any;
          const errCode = (errAny && (errAny.code || errAny.message)) || null;
          if (
            (errCode && String(errCode).includes("PGRST205")) ||
            (errAny &&
              (errAny.message || "").includes("Could not find the table"))
          ) {
            setStatus(
              "Gagal menyimpan: tabel 'prestasi' tidak ditemukan di Supabase. Jalankan `scripts/supabase_schema.sql` di SQL Editor Supabase untuk membuat tabel.",
            );
          } else {
            setStatus(
              "Gagal menyimpan prestasi ke Supabase: " + JSON.stringify(error),
            );
          }
          // revert optimistic update
          setPrestasi((s) => s.filter((x) => x.id !== newItem.id));
        } else {
          setStatus("Berhasil menyimpan prestasi.");
          // refresh list
          try {
            const fetched = await fetchPrestasi();
            if (!fetched.error && fetched.data) {
              const mapped = fetched.data.map((d: unknown) => {
                const r = d as Record<string, unknown>;
                return {
                  id: r.id ? String(r.id) : Date.now().toString(),
                  title: typeof r.title === "string" ? r.title : "",
                  year:
                    typeof r.year === "string" ? r.year : String(r.year ?? ""),
                  image: typeof r.image === "string" ? r.image : "",
                };
              });
              setPrestasi(mapped);
            }
          } catch (_) {}
        }
      } catch (e) {
        console.error("insertPrestasi exception", e);
        setStatus("Exception saat menyimpan: " + String(e));
        setPrestasi((s) => s.filter((x) => x.id !== newItem.id));
      }
    })();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setNewImageFile(file);
  };

  const remove = (id: string) =>
    setPrestasi((s) => s.filter((x) => x.id !== id));

  const removeRemote = (id: string) => {
    // attempt delete on supabase
    (async () => {
      const { data, error } = await deletePrestasi(id);
      if (error) console.error("deletePrestasi error", error);
    })();
  };

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchPrestasi();
        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id?.toString() || Date.now().toString(),
            title: d.title,
            year: d.year,
            image: d.image,
          }));
          setPrestasi(mapped);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Daftar Prestasi</h1>
        <button
          onClick={openModal}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Tambah
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <ul>
          {prestasi.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between p-3 border-t"
            >
              <div className="flex items-center gap-3">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 rounded object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-200 border" />
                )}

                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.year}</div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => {
                    remove(p.id);
                    removeRemote(p.id);
                  }}
                  className="text-sm text-red-600"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {status && (
        <div className="mt-3 text-sm">
          <div className="inline-block bg-yellow-50 text-yellow-800 px-3 py-2 rounded">
            {status}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Prestasi</h2>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Prestasi"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Tahun"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full border px-3 py-2 rounded"
              />

              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-20 h-20 rounded object-cover border"
                />
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 rounded border border-gray-300"
              >
                Batal
              </button>
              <button
                onClick={add}
                className="px-3 py-1 rounded bg-black text-white"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
