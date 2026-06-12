"use client";

import { useState, useEffect } from "react";
import {
  fetchMembers,
  insertMember,
  deleteMember,
  uploadMemberPhoto,
  updateMember,
} from "../../../lib/supabaseClient";
import Toast from "../../components/Toast";
import MotionButton from "../../components/MotionButton";

type Pengurus = {
  id: string;
  name: string;
  role: string;
  role_group?: string | null;
  staff_category?: string | null;
  image?: string;
};

export default function AdminPengurus() {
  const [pengurus, setPengurus] = useState<Pengurus[]>([
    { id: "1", name: "Ketua - Ahmad", role: "Ketua" },
    { id: "2", name: "Sekretaris - Siti", role: "Sekretaris" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [roleGroup, setRoleGroup] = useState<string>("board_of_director");
  const [staffCategory, setStaffCategory] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setRole("");
    setImage("");
    setUploadError(null);
    setNewImageFile(null);
    setRoleGroup("board_of_director");
    setStaffCategory("");
  };

  const add = () => {
    if (!name.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name,
      role: role || "Anggota",
      role_group: roleGroup,
      staff_category: staffCategory || null,
      image,
    };
    setPengurus((s) => [newItem, ...s]);
    closeModal();

    (async () => {
      try {
        let photoUrl = newItem.image;
        setUploadError(null);
        if (newImageFile) {
          const up = await uploadMemberPhoto(newImageFile);
          if (up.error) {
            const eAny = up.error as any;
            const msg = String(eAny?.message ?? String(up.error));
            console.error("uploadMemberPhoto error:", msg);
            setUploadError(msg);
            setToast({ message: `Upload failed: ${msg}`, type: "error" });
          } else {
            photoUrl = up.data?.publicUrl ?? photoUrl;
            setToast({ message: "Gambar berhasil diunggah", type: "success" });
          }
        }
        const res = await fetch("/api/members/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newItem.name,
            role: newItem.role,
            role_group: newItem.role_group,
            staff_category: newItem.staff_category,
            photo: photoUrl,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          const err = json?.error?.message ?? json?.error ?? "Unknown error";
          console.error("server addMember error", err);
          setToast({ message: `Tambah pengurus gagal: ${err}`, type: "error" });
        } else {
          setToast({
            message: "Pengurus berhasil ditambahkan",
            type: "success",
          });
          // refresh the list from server so ordering/ids/positions are accurate
          try {
            const { data: fetched, error: fetchErr } = await fetchMembers();
            if (!fetchErr && fetched && fetched.length > 0) {
              const mapped = fetched.map((d: unknown) => {
                const r = d as Record<string, unknown>;
                return {
                  id: r.id ? String(r.id) : Date.now().toString(),
                  name: typeof r.name === "string" ? r.name : "",
                  role: typeof r.role === "string" ? r.role : "",
                  role_group:
                    typeof r.role_group === "string" ? r.role_group : null,
                  staff_category:
                    typeof r.staff_category === "string"
                      ? r.staff_category
                      : null,
                  image: typeof r.photo === "string" ? r.photo : "",
                } as Pengurus;
              });
              setPengurus(mapped);
            }
          } catch (e) {
            // ignore refresh errors
          }
        }
      } catch (e) {
        console.error("insertMember exception", e);
        setToast({
          message: `Tambah pengurus gagal: ${String(e)}`,
          type: "error",
        });
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
    setPengurus((s) => s.filter((x) => x.id !== id));

  const removeRemote = (id: string) => {
    (async () => {
      try {
        const res = await fetch("/api/members/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const json = await res.json();
        if (!res.ok) {
          const err = json?.error?.message ?? json?.error ?? "Unknown error";
          console.error("server deleteMember error", err);
          setToast({ message: `Hapus pengurus gagal: ${err}`, type: "error" });
        } else {
          setToast({ message: "Pengurus berhasil dihapus", type: "success" });
          // refresh list so positions/order are consistent
          try {
            const { data: fetched, error: fetchErr } = await fetchMembers();
            if (!fetchErr && fetched && fetched.length > 0) {
              const mapped = fetched.map((d: unknown) => {
                const r = d as Record<string, unknown>;
                return {
                  id: r.id ? String(r.id) : Date.now().toString(),
                  name: typeof r.name === "string" ? r.name : "",
                  role: typeof r.role === "string" ? r.role : "",
                  image: typeof r.photo === "string" ? r.photo : "",
                } as Pengurus;
              });
              setPengurus(mapped);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        console.error("deleteMember exception", e);
        setToast({
          message: `Hapus pengurus gagal: ${String(e)}`,
          type: "error",
        });
      }
    })();
  };

  const startEdit = (p: Pengurus) => {
    setEditingId(p.id);
    setName(p.name || "");
    setRole(p.role || "");
    setRoleGroup(p.role_group || "board_of_director");
    setStaffCategory(p.staff_category || "");
    setImage(p.image || "");
    setIsModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    let photoUrl = image;
    try {
      setUploadError(null);
      if (newImageFile) {
        const up = await uploadMemberPhoto(newImageFile);
        if (up.error) {
          const eAny = up.error as any;
          const msg = String(eAny?.message ?? String(up.error));
          console.error("uploadMemberPhoto error:", msg);
          setUploadError(msg);
        } else photoUrl = up.data?.publicUrl ?? photoUrl;
      }

      const res = await fetch("/api/members/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          role,
          role_group: roleGroup,
          staff_category: staffCategory,
          photo: photoUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok)
        console.error("server updateMember error", json?.error || json);

      // optimistic update local state
      setPengurus((s) =>
        s.map((x) =>
          x.id === editingId
            ? {
                ...x,
                name,
                role,
                role_group: roleGroup,
                staff_category: staffCategory,
                image: photoUrl,
              }
            : x,
        ),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setEditingId(null);
      setNewImageFile(null);
      setImage("");
      setName("");
      setRole("");
      setIsModalOpen(false);
      // refresh list to ensure server ordering/positions are reflected
      try {
        const { data: fetched, error: fetchErr } = await fetchMembers();
        if (!fetchErr && fetched && fetched.length > 0) {
          const mapped = fetched.map((d: unknown) => {
            const r = d as Record<string, unknown>;
            return {
              id: r.id ? String(r.id) : Date.now().toString(),
              name: typeof r.name === "string" ? r.name : "",
              role: typeof r.role === "string" ? r.role : "",
              image: typeof r.photo === "string" ? r.photo : "",
            } as Pengurus;
          });
          setPengurus(mapped);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchMembers();
        if (!error && data && data.length > 0) {
          const mapped = data.map((d: unknown) => {
            const r = d as Record<string, unknown>;
            return {
              id: r.id ? String(r.id) : Date.now().toString(),
              name: typeof r.name === "string" ? r.name : "",
              role: typeof r.role === "string" ? r.role : "",
              role_group:
                typeof r.role_group === "string" ? r.role_group : null,
              staff_category:
                typeof r.staff_category === "string" ? r.staff_category : null,
              image: typeof r.photo === "string" ? r.photo : "",
            };
          });
          setPengurus(mapped);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const persistOrder = async (ordered: Pengurus[]) => {
    try {
      const ids = ordered.map((x) => x.id);
      const res = await fetch("/api/members/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: ids }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const err = json?.error?.message ?? json?.error ?? "Unknown error";
        console.error("reorder error", err);
        setToast({ message: "Gagal menyimpan urutan", type: "error" });
      }
    } catch (e) {
      console.error("persistOrder error", e);
      setToast({ message: "Gagal menyimpan urutan", type: "error" });
    }
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setPengurus((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      persistOrder(next);
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= pengurus.length - 1) return;
    setPengurus((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      persistOrder(next);
      return next;
    });
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Daftar Pengurus</h1>
        <MotionButton
          onClick={openModal}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Tambah
        </MotionButton>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <ul>
          {pengurus.map((p, idx) => (
            <li
              key={p.id}
              className="flex items-center justify-between p-3 border-t"
            >
              <div className="flex items-center gap-3">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 border" />
                )}

                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <MotionButton
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    title="Naikkan"
                    className="text-sm text-gray-600 disabled:opacity-40"
                  >
                    ▲
                  </MotionButton>
                  <MotionButton
                    onClick={() => moveDown(idx)}
                    disabled={idx === pengurus.length - 1}
                    title="Turunkan"
                    className="text-sm text-gray-600 disabled:opacity-40"
                  >
                    ▼
                  </MotionButton>
                </div>
                <MotionButton
                  onClick={() => startEdit(p)}
                  className="text-sm text-blue-600"
                >
                  Edit
                </MotionButton>
                <MotionButton
                  onClick={() => {
                    // ask for confirmation
                    setDeleteTarget(p.id);
                  }}
                  className="text-sm text-red-600"
                >
                  Hapus
                </MotionButton>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Pengurus</h2>

            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Jabatan"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="mt-2">
                <label className="block text-sm mb-1">Role Group</label>
                <select
                  value={roleGroup}
                  onChange={(e) => setRoleGroup(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="board_of_director">Board of Directors</option>
                  <option value="head_of_division">Head of Division</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              {roleGroup === "staff" && (
                <div className="mt-2">
                  <label className="block text-sm mb-1">Staff Category</label>
                  <select
                    value={staffCategory}
                    onChange={(e) => setStaffCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="accounting_olympiad">
                      Accounting Olympiad
                    </option>
                    <option value="research_and_writing">
                      Research & Writing
                    </option>
                    <option value="organization_and_project">
                      Organization & Project
                    </option>
                    <option value="media_and_visual">Media & Visual</option>
                  </select>
                </div>
              )}
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
              {uploadError && (
                <div className="mt-2 text-sm text-red-600">{uploadError}</div>
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
      {/* delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <h3 className="text-lg font-bold mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menghapus pengurus ini? Tindakan ini tidak
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
                  // optimistic remove locally, then call server
                  remove(deleteTarget);
                  removeRemote(deleteTarget);
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

      {/* toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
