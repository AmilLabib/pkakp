"use client";

import { useState, useEffect } from "react";
import {
  fetchPrestasi,
  insertPrestasi,
  deletePrestasi,
  uploadPrestasiImage,
  updatePrestasi,
} from "../../../lib/supabaseClient";
import Toast from "../../components/Toast";
import MotionButton from "../../components/MotionButton";
import LoadingOverlay from "../../components/LoadingOverlay";

type Member = { name: string; role: string };

type Prestasi = {
  id: string;
  title: string;
  place: string;
  image?: string;
  members: Member[];
};

const EMPTY_MEMBER: Member = { name: "", role: "" };

export default function AdminPrestasi() {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [image, setImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [members, setMembers] = useState<Member[]>([{ ...EMPTY_MEMBER }]);

  const [status, setStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── member helpers ──────────────────────────────────────────────
  const updateMemberField = (
    idx: number,
    field: keyof Member,
    value: string,
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  };

  const addMemberRow = () => {
    if (members.length >= 3) return;
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
  };

  const removeMemberRow = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── modal helpers ───────────────────────────────────────────────
  const resetForm = () => {
    setTitle("");
    setPlace("");
    setImage("");
    setNewImageFile(null);
    setMembers([{ ...EMPTY_MEMBER }]);
    setEditingId(null);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setNewImageFile(file);
  };

  // ── add ─────────────────────────────────────────────────────────
  const add = () => {
    if (!title.trim()) return;
    const validMembers = members.filter((m) => m.name.trim());
    const newItem: Prestasi = {
      id: Date.now().toString(),
      title,
      place,
      image,
      members: validMembers,
    };

    setPrestasi((s) => [newItem, ...s]);
    closeModal();
    setIsProcessing(true);

    (async () => {
      try {
        let finalImage = newItem.image;
        if (newImageFile) {
          setStatus("Mengunggah gambar...");
          const up = await uploadPrestasiImage(newImageFile);
          if (up.error) {
            setToast({
              message: `Gagal mengunggah gambar: ${String(up.error)}`,
              type: "error",
            });
            setPrestasi((s) => s.filter((x) => x.id !== newItem.id));
            setIsProcessing(false);
            return;
          }
          finalImage = up.data?.publicUrl ?? "";
        }

        setStatus("Menyimpan prestasi...");
        const { error } = await insertPrestasi({
          title: newItem.title,
          place: newItem.place,
          image: finalImage,
          members: validMembers,
        });

        if (error) {
          setToast({
            message: `Gagal menyimpan prestasi: ${JSON.stringify(error)}`,
            type: "error",
          });
          setPrestasi((s) => s.filter((x) => x.id !== newItem.id));
        } else {
          setStatus(null);
          setToast({ message: "Prestasi berhasil disimpan", type: "success" });
          if (finalImage !== newItem.image) {
            setPrestasi((s) =>
              s.map((x) =>
                x.id === newItem.id ? { ...x, image: finalImage } : x,
              ),
            );
          }
        }
      } catch (e) {
        setToast({
          message: `Exception saat menyimpan: ${String(e)}`,
          type: "error",
        });
        setPrestasi((s) => s.filter((x) => x.id !== newItem.id));
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  // ── edit ─────────────────────────────────────────────────────────
  const startEdit = (p: Prestasi) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setPlace(p.place || "");
    setImage(p.image || "");
    setNewImageFile(null);
    setMembers(
      p.members && p.members.length > 0
        ? p.members.map((m) => ({ ...m }))
        : [{ ...EMPTY_MEMBER }],
    );
    setIsModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const validMembers = members.filter((m) => m.name.trim());
    let finalImage = image;
    setIsProcessing(true);

    try {
      if (newImageFile) {
        setStatus("Mengunggah gambar...");
        const up = await uploadPrestasiImage(newImageFile);
        if (up.error) {
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
      const { error } = await updatePrestasi(editingId, {
        title,
        place,
        image: finalImage,
        members: validMembers,
      });

      if (error) {
        setToast({
          message: `Gagal menyimpan perubahan: ${String(error)}`,
          type: "error",
        });
      } else {
        setToast({ message: "Perubahan prestasi disimpan", type: "success" });
        setPrestasi((s) =>
          s.map((x) =>
            x.id === editingId
              ? { ...x, title, place, image: finalImage, members: validMembers }
              : x,
          ),
        );
      }
    } catch (e) {
      setToast({
        message: `Gagal menyimpan perubahan: ${String(e)}`,
        type: "error",
      });
    } finally {
      setIsModalOpen(false);
      resetForm();
      setIsProcessing(false);
    }
  };

  // ── delete ───────────────────────────────────────────────────────
  const remove = (id: string) =>
    setPrestasi((s) => s.filter((x) => x.id !== id));

  const removeRemote = (id: string) => {
    setIsProcessing(true);
    (async () => {
      const { error } = await deletePrestasi(id);
      if (error) {
        setToast({
          message: `Hapus prestasi gagal: ${String(error)}`,
          type: "error",
        });
      } else {
        setToast({ message: "Prestasi berhasil dihapus", type: "success" });
      }
      setIsProcessing(false);
    })();
  };

  // ── fetch on mount ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchPrestasi();
        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id?.toString() || Date.now().toString(),
            title: d.title || "",
            place: d.place || "",
            image: d.image || "",
            members: Array.isArray(d.members) ? d.members : [],
          }));
          setPrestasi(mapped);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const filtered = prestasi.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.place.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="py-12">
      <LoadingOverlay isLoading={isProcessing} message="Memproses prestasi..." />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Daftar Prestasi</h1>
        <MotionButton
          onClick={openModal}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Tambah
        </MotionButton>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari prestasi berdasarkan judul atau peringkat..."
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <ul>
          {filtered.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between p-3 border-t"
            >
              <div className="flex items-center gap-3">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-14 h-14 rounded object-cover border flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded bg-gray-200 border flex-shrink-0" />
                )}

                <div>
                  <div className="font-semibold">{p.title}</div>
                  {p.place && (
                    <div className="text-sm text-teal-600 font-medium">
                      {p.place}
                    </div>
                  )}
                  {p.members && p.members.length > 0 && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {p.members.map((m) => m.name).join(", ")}
                    </div>
                  )}
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

          {filtered.length === 0 && (
            <li className="p-6 text-center text-gray-400 text-sm">
              Belum ada prestasi.
            </li>
          )}
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

      {/* ── Add / Edit Modal ───────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Prestasi" : "Tambah Prestasi"}
            </h2>

            <div className="space-y-3">
              {/* Nama kejuaraan */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Kejuaraan
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: International Competition of Accounting"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Peringkat */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Peringkat
                </label>
                <input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Contoh: 1st Place, Juara 2, Finalis"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Foto */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Foto Dokumentasi
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-2 w-full h-40 rounded object-cover border"
                  />
                )}
              </div>

              {/* Anggota */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">
                    Anggota yang Memenangkan{" "}
                    <span className="text-gray-400 font-normal">
                      (maks. 3)
                    </span>
                  </label>
                  {members.length < 3 && (
                    <button
                      type="button"
                      onClick={addMemberRow}
                      className="text-xs text-teal-600 hover:underline"
                    >
                      + Tambah anggota
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {members.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <input
                          value={m.name}
                          onChange={(e) =>
                            updateMemberField(idx, "name", e.target.value)
                          }
                          placeholder={`Nama anggota ${idx + 1}`}
                          className="w-full border px-3 py-1.5 rounded text-sm"
                        />
                        <input
                          value={m.role}
                          onChange={(e) =>
                            updateMemberField(idx, "role", e.target.value)
                          }
                          placeholder="Jabatan / divisi"
                          className="w-full border px-3 py-1.5 rounded text-sm"
                        />
                      </div>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMemberRow(idx)}
                          className="text-red-400 hover:text-red-600 mt-1 text-lg leading-none"
                          aria-label="Hapus anggota"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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

      {/* ── Delete Confirmation ─────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <h3 className="text-lg font-bold mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menghapus prestasi ini? Tindakan ini tidak
              dapat dibatalkan.
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
