"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAdminArticles,
  deleteArticle,
  fetchArticles,
  fetchArticleLikeCount,
  fetchArticleCommentCount,
} from "../../../lib/supabaseClient";
import Toast from "../../components/Toast";
import MotionButton from "../../components/MotionButton";
import LoadingOverlay from "../../components/LoadingOverlay";

type Article = {
  id: string;
  title: string;
  desc: string;
  author: string;
  date: string;
  image: string;
  likes?: number;
  comments?: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);

  // First effect: Fetch current user
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) return;
        const json = await res.json();
        const payload = json?.payload || {};
        setCurrentUser({
          name: payload?.name || "",
          email: payload?.email || "",
          role: payload?.role,
        });
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Second effect: Fetch articles (depends on currentUser)
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchAdminArticles();
        if (!error && data && data.length > 0) {
          let articles_list = data as ArticleRow[];

          // If current user is staff (not admin), filter to only their articles
          if (currentUser?.role === "staf") {
            const staffId = currentUser.name || currentUser.email || "";
            articles_list = articles_list.filter((d: any) => {
              const author = String(d.author || "").trim();
              return (
                author === staffId ||
                author.toLowerCase() === staffId.toLowerCase()
              );
            });
          }

          const mapped = articles_list.map((d) => ({
            id: String(d.id ?? ""),
            title: d.title || "",
            desc: d.desc || "",
            author: (d as any).author || "",
            date: d.created_at
              ? new Date(d.created_at).toLocaleDateString()
              : "",
            image: d.image || "",
            likes: 0,
            comments: 0,
          }));

          // Fetch likes/comments counts for each article in parallel
          const withCounts = await Promise.all(
            mapped.map(async (m) => {
              if (!m.id) return m;
              try {
                const [l, c] = await Promise.all([
                  fetchArticleLikeCount(String(m.id)),
                  fetchArticleCommentCount(String(m.id)),
                ]);
                return {
                  ...m,
                  likes: Number(l?.count ?? 0),
                  comments: Number(c?.count ?? 0),
                } as Article;
              } catch (e) {
                return m;
              }
            }),
          );

          setArticles(withCounts as Article[]);
        }
      } catch (err) {
        console.error("Gagal memuat artikel awal:", err);
      }
    })();
  }, [currentUser?.role]);

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

  const viewArticle = async (idx: number) => {
    const target = articles[idx];
    if (!target || !target.id) {
      setToast({
        message: "Artikel tidak tersedia untuk dilihat",
        type: "error",
      });
      return;
    }
    try {
      const { data, error } = await fetchArticles();
      if (error || !Array.isArray(data)) {
        setToast({
          message: "Gagal memuat daftar publik artikel",
          type: "error",
        });
        return;
      }
      const foundIndex = (data as any[]).findIndex(
        (d) => String(d.id) === String(target.id),
      );
      if (foundIndex === -1) {
        setToast({
          message: "Artikel tidak ditemukan pada halaman publik",
          type: "error",
        });
        return;
      }
      window.open(`/artikel/${foundIndex}`, "_blank", "noopener,noreferrer");
    } catch (e) {
      setToast({
        message: "Terjadi kesalahan saat membuka artikel",
        type: "error",
      });
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

    setIsProcessing(true);
    const previous = [...articles];
    // optimistic remove in UI
    setArticles((s) => s.filter((_, i) => i !== deleteIdx));

    // if no id or temp id, skip server delete
    if (!target.id || target.id.startsWith("temp-")) {
      setIsProcessing(false);
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

    setIsProcessing(false);
    cancelDelete();
  };

  return (
    <section className="py-12">
      <LoadingOverlay isLoading={isProcessing} message="Menghapus artikel..." />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Kelola Artikel</h1>
        <MotionButton
          onClick={() => openEditor()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Tambah Artikel
        </MotionButton>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari artikel berdasarkan judul..."
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Judul</th>
              <th className="p-3 font-semibold text-gray-700">Tanggal</th>
              {currentUser?.role === "admin" && (
                <th className="p-3 font-semibold text-gray-700">Author</th>
              )}
              <th className="p-3 font-semibold text-gray-700">Likes</th>
              <th className="p-3 font-semibold text-gray-700">Comments</th>
              <th className="p-3 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles
              .filter((a) =>
                a.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((a, i) => {
                const originalIndex = articles.findIndex((orig) => orig.id === a.id);
                return (
              <tr key={`${a.id}-${i}`} className="border-b hover:bg-gray-50">
                <td className="p-3">{a.title}</td>
                <td className="p-3 text-sm text-gray-600">{a.date}</td>
                {currentUser?.role === "admin" && (
                  <td className="p-3 text-sm text-gray-700">{a.author}</td>
                )}
                <td className="p-3 text-sm text-gray-700 text-center">
                  {a.likes ?? 0}
                </td>
                <td className="p-3 text-sm text-gray-700 text-center">
                  {a.comments ?? 0}
                </td>
                <td className="p-3">
                  <MotionButton
                    onClick={() => viewArticle(originalIndex)}
                    className="text-sm text-green-600 mr-3 hover:underline"
                  >
                    Lihat
                  </MotionButton>
                  {(!currentUser ||
                    currentUser.role === "admin" ||
                    a.author === currentUser.name ||
                    a.author === currentUser.email ||
                    (currentUser.name &&
                      (a.author || "")
                        .toLowerCase()
                        .includes(currentUser.name.toLowerCase())) ||
                    (currentUser.email &&
                      (a.author || "")
                        .toLowerCase()
                        .includes(currentUser.email.toLowerCase()))) && (
                    <>
                      <MotionButton
                        onClick={() => openEditor(originalIndex)}
                        className="text-sm text-blue-600 mr-3 hover:underline"
                      >
                        Edit
                      </MotionButton>
                      <MotionButton
                        onClick={() => remove(originalIndex)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Hapus
                      </MotionButton>
                    </>
                  )}
                  {currentUser &&
                    currentUser.role !== "admin" &&
                    a.author !== currentUser.name &&
                    a.author !== currentUser.email &&
                    !(
                      currentUser.name &&
                      (a.author || "")
                        .toLowerCase()
                        .includes(currentUser.name.toLowerCase())
                    ) &&
                    !(
                      currentUser.email &&
                      (a.author || "")
                        .toLowerCase()
                        .includes(currentUser.email.toLowerCase())
                    ) && (
                      <span className="text-sm text-gray-500">
                        (Bukan milik Anda)
                      </span>
                    )}
                </td>
              </tr>
                );
              })}

            {articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <tr>
                <td
                  colSpan={currentUser?.role === "admin" ? 6 : 5}
                  className="p-4 text-center text-gray-500"
                >
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
              <MotionButton
                onClick={cancelDelete}
                className="bg-white border border-gray-300 px-4 py-2 rounded"
              >
                Batal
              </MotionButton>
              <MotionButton
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Hapus
              </MotionButton>
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
