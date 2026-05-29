"use client";

import { useState, useEffect } from "react";
import {
  fetchMembers,
  insertMember,
  deleteMember,
  uploadMemberPhoto,
} from "../../../lib/supabaseClient";

type Pengurus = { id: string; name: string; role: string; image?: string };

export default function AdminPengurus() {
  const [pengurus, setPengurus] = useState<Pengurus[]>([
    { id: "1", name: "Ketua - Ahmad", role: "Ketua" },
    { id: "2", name: "Sekretaris - Siti", role: "Sekretaris" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setRole("");
    setImage("");
  };

  const add = () => {
    if (!name.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name,
      role: role || "Anggota",
      image,
    };
    setPengurus((s) => [newItem, ...s]);
    closeModal();

    (async () => {
      try {
        let photoUrl = newItem.image;
        if (newImageFile) {
          const up = await uploadMemberPhoto(newImageFile);
          if (up.error) {
            console.error("uploadMemberPhoto error", up.error);
          } else {
            photoUrl = up.data?.publicUrl ?? photoUrl;
          }
        }
        const { data, error } = await insertMember({
          name: newItem.name,
          role: newItem.role,
          photo: photoUrl,
        });
        if (error) console.error("insertMember error", error);
      } catch (e) {
        console.error("insertMember exception", e);
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
      const { data, error } = await deleteMember(id);
      if (error) console.error("deleteMember error", error);
    })();
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

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Daftar Pengurus</h1>
        <button
          onClick={openModal}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Tambah
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <ul>
          {pengurus.map((p) => (
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
              <div>
                <button
                  onClick={() => remove(p.id)}
                  className="text-sm text-red-600"
                >
                  Hapus
                </button>
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
