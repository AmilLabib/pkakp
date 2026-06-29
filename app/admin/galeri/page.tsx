"use client";

import { useState, useEffect } from "react";
import {
  fetchGaleri,
  insertGaleri,
  deleteGaleri,
  uploadGaleriImage,
  updateGaleri,
} from "../../../lib/supabaseClient";
import Toast from "../../components/Toast";
import MotionButton from "../../components/MotionButton";
import LoadingOverlay from "../../components/LoadingOverlay";

type Galeri = { id: string; title: string; desc?: string; image?: string };

export default function AdminGaleri() {
  const [items, setItems] = useState<Galeri[]>([
    {
      id: "1",
      title: "Kegiatan Contoh",
      desc: "Ringkasan kegiatan",
      image: "",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDesc("");
    setImage("");
  };

  const add = () => {
    if (!title.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      title,
      desc,
      image,
    };

    setItems((s) => [newItem, ...s]);
    closeModal();
    setIsProcessing(true);

    (async () => {
      try {
        let finalImage = newItem.image;
        if (newImageFile) {
          setStatus("Mengunggah gambar...");
          const up = await uploadGaleriImage(newImageFile);
          if (up.error) {
            console.error("uploadGaleriImage error", up.error);
            setStatus("Gagal mengunggah gambar: " + String(up.error));
            setToast({
              message: `Gagal mengunggah gambar: ${String(up.error)}`,
              type: "error",
            });
            setItems((s) => s.filter((x) => x.id !== newItem.id));
            setIsProcessing(false);
            return;
          }
          finalImage = up.data?.publicUrl ?? "";
        }

        setStatus("Menyimpan galeri...");
        const { data, error } = await insertGaleri({
          title: newItem.title,
          desc: newItem.desc || "",
          image: finalImage,
        });
        if (error) {
          console.error("insertGaleri error", error, "data:", data);
          const errAny = error as any;
          const errCode = (errAny && (errAny.code || errAny.message)) || null;
          if (
            (errCode && String(errCode).includes("PGRST205")) ||
            (errAny &&
              (errAny.message || "").includes("Could not find the table"))
          ) {
            setStatus(
              "Gagal menyimpan: tabel 'galeri' tidak ditemukan di Supabase. Jalankan `scripts/supabase_schema.sql` di SQL Editor Supabase untuk membuat tabel.",
            );
          } else {
            setStatus(
              "Gagal menyimpan galeri ke Supabase: " + JSON.stringify(error),
            );
            setToast({
              message: `Gagal menyimpan galeri: ${JSON.stringify(error)}`,
              type: "error",
            });
          }
          setItems((s) => s.filter((x) => x.id !== newItem.id));
        } else {
          setStatus(null);
          setToast({ message: "Galeri berhasil disimpan", type: "success" });
          // Update optimistic item with final image
          if (finalImage !== newItem.image) {
            setItems((s) =>
              s.map((x) =>
                x.id === newItem.id ? { ...x, image: finalImage } : x,
              ),
            );
          }
        }
      } catch (e) {
        console.error("insertGaleri exception", e);
        setStatus("Exception saat menyimpan: " + String(e));
        setToast({
          message: `Exception saat menyimpan: ${String(e)}`,
          type: "error",
        });
        setItems((s) => s.filter((x) => x.id !== newItem.id));
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  const startEdit = (p: Galeri) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setDesc(p.desc || "");
    setImage(p.image || "");
    setNewImageFile(null);
    setIsModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    let finalImage = image;
    setIsProcessing(true);
    try {
      if (newImageFile) {
        setStatus("Mengunggah gambar...");
        const up = await uploadGaleriImage(newImageFile);
        if (up.error) {
          console.error("uploadGaleriImage error", up.error);
          setToast({
            message: `Gagal mengunggah gambar: ${String(up.error)}`,
            type: "error",
          });
          setIsProcessing(false);
          return;
        }
        finalImage = up.data?.publicUrl ?? finalImage;
      }

      setStatus("Menyimpan perubahan...");
      const { data, error } = await updateGaleri(editingId, {
        title,
        desc,
        image: finalImage,
      });
      if (error) {
        console.error("updateGaleri error", error);
        setToast({
          message: `Gagal menyimpan perubahan: ${String(error)}`,
          type: "error",
        });
      } else {
        setToast({ message: "Perubahan galeri disimpan", type: "success" });
        setItems((s) =>
          s.map((x) =>
            x.id === editingId ? { ...x, title, desc, image: finalImage } : x,
          ),
        );
      }
    } catch (e) {
      console.error("saveEdit exception", e);
      setToast({
        message: `Gagal menyimpan perubahan: ${String(e)}`,
        type: "error",
      });
    } finally {
      setEditingId(null);
      setNewImageFile(null);
      setImage("");
      setTitle("");
      setDesc("");
      setIsModalOpen(false);
      setIsProcessing(false);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setNewImageFile(file);
  };

  const remove = (id: string) => setItems((s) => s.filter((x) => x.id !== id));

  const removeRemote = (id: string) => {
    setIsProcessing(true);
    (async () => {
      const { data, error } = await deleteGaleri(id);
      if (error) {
        console.error("deleteGaleri error", error);
        setToast({
          message: `Hapus galeri gagal: ${String(error)}`,
          type: "error",
        });
      } else {
        setToast({ message: "Galeri berhasil dihapus", type: "success" });
      }
      setIsProcessing(false);
    })();
  };

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchGaleri();
        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id?.toString() || Date.now().toString(),
            title: d.title,
            desc: d.desc,
            image: d.image,
          }));
          setItems(mapped);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <section className="py-12">
      <LoadingOverlay isLoading={isProcessing} message="Memproses galeri..." />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Daftar Galeri Kegiatan</h1>
        <MotionButton
          onClick={openModal}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Tambah
        </MotionButton>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <ul>
          {items.map((p) => (
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
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {p.desc}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MotionButton
                  onClick={() => startEdit(p)}
                  className="text-sm text-blue-600"
                >
                  Edit
                </MotionButton>
                <MotionButton
                  onClick={() => setDeleteTarget(p.id)}
                  className="text-sm text-red-600"
                >
                  Hapus
                </MotionButton>
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Galeri" : "Tambah Galeri"}
            </h2>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Kegiatan"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Deskripsi kegiatan"
                className="w-full border px-3 py-2 rounded h-28"
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
              <MotionButton
                onClick={closeModal}
                className="px-3 py-1 rounded border border-gray-300"
              >
                Batal
              </MotionButton>
              {editingId ? (
                <MotionButton
                  onClick={saveEdit}
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  Simpan Perubahan
                </MotionButton>
              ) : (
                <MotionButton
                  onClick={add}
                  className="px-3 py-1 rounded bg-black text-white"
                >
                  Simpan
                </MotionButton>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <h3 className="text-lg font-bold mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menghapus item galeri ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <MotionButton
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1 rounded border"
              >
                Batal
              </MotionButton>
              <MotionButton
                onClick={() => {
                  remove(deleteTarget!);
                  removeRemote(deleteTarget!);
                  setDeleteTarget(null);
                }}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Hapus
              </MotionButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
