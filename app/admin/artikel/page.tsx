"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchArticles, deleteArticle } from "../../../lib/supabaseClient";
import Toast from "../../components/Toast";

type Article = {
  id: string;
  title: string;
  desc: string;
  date: string;
  image: string;
};

type ArticleRow = {
  id?: string | number;
  title?: string;
  desc?: string;
  created_at?: string;
  image?: string;
};

export default function AdminArtikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchArticles();
        if (!error && data && data.length > 0) {
          const mapped = (data as ArticleRow[]).map((d) => ({
            id: String(d.id ?? ""),
            title: d.title || "",
            desc: d.desc || "",
            author: (d as any).author || "",
            date: d.created_at
              ? new Date(d.created_at).toLocaleDateString()
              : "",
            image: d.image || "",
          }));
          setArticles(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat artikel awal:", err);
      }
    })();
  }, []);

  const openEditor = (idx?: number) => {
    if (idx !== undefined) {
      const target = articles[idx];
      if (!target) return;

      // prefer navigation with id param; editor will fetch data by id if needed
      router.push(`/admin/artikel/editor?id=${target.id}`);
      return;
    } else {
      sessionStorage.removeItem("admin-article-draft");
      router.push("/admin/artikel/editor");
      return;
    }
  };

  // show confirmation modal first
  const remove = (idx: number) => {
    const target = articles[idx];
    if (!target) return;
    setDeleteIdx(idx);
    setDeleteTitle(target.title || "");
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIdx(null);
    setDeleteTitle("");
  };

  const confirmDelete = async () => {
    if (deleteIdx === null) return cancelDelete();
    const target = articles[deleteIdx];
    if (!target) return cancelDelete();

    const previous = [...articles];
    // optimistic remove in UI
    setArticles((s) => s.filter((_, i) => i !== deleteIdx));

    // if no id or temp id, skip server delete
    if (!target.id || target.id.startsWith("temp-")) {
      cancelDelete();
      return;
    }

    const { error } = await deleteArticle(target.id);
    if (error) {
      console.error("Supabase delete error:", error);
      setArticles(previous);
      setToast({
        message: `Hapus artikel gagal: ${String(error)}`,
        type: "error",
      });
    } else {
      setToast({ message: "Artikel berhasil dihapus", type: "success" });
    }

    cancelDelete();
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Kelola Artikel</h1>
        <button
          onClick={() => openEditor()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Tambah Artikel
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Judul</th>
              <th className="p-3 font-semibold text-gray-700">Tanggal</th>
              <th className="p-3 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={`${a.id}-${i}`} className="border-b hover:bg-gray-50">
                <td className="p-3">{a.title}</td>
                <td className="p-3 text-sm text-gray-600">{a.date}</td>
                <td className="p-3">
                  <button
                    onClick={() => openEditor(i)}
                    className="text-sm text-blue-600 mr-3 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(i)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {articles.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-bold mb-2">Hapus Artikel</h2>
            <p className="text-sm text-gray-700 mb-4">
              Apakah Anda yakin ingin menghapus artikel{" "}
              <strong>{deleteTitle}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="bg-white border border-gray-300 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Hapus
              </button>
            </div>
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
    </section>
  );
}
