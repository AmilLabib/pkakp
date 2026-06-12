"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { insertArticle, updateArticle } from "../../../../lib/supabaseClient";
import Toast from "../../../components/Toast";
import MotionButton from "../../../components/MotionButton";

const CustomEditor = dynamic(
  () => import("../../../components/admin/artikel/CustomEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 border rounded bg-gray-50 text-gray-500">
        Memuat Editor...
      </div>
    ),
  },
);

type DraftPayload = {
  id?: string;
  title: string;
  author?: string;
  content: string;
};

export default function AdminArtikelEditorPage() {
  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthorReadonly, setIsAuthorReadonly] = useState(false);
  const router = useRouter();
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("admin-article-draft");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as DraftPayload;
      setArticleId(parsed.id || null);
      setTitle(parsed.title || "");
      setAuthor(parsed.author || "");
      setContent(parsed.content || "");
    } catch {
      // ignore invalid draft format
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) return;
        const json = await res.json();
        const payload = json?.payload || {};
        const role = payload?.role;
        const name = payload?.name || payload?.email || "";
        if (role === "staf") {
          setAuthor(name);
          setIsAuthorReadonly(true);
        }
        setUserRole(role ?? null);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "admin-article-preview-live",
      JSON.stringify({
        title,
        author,
        content,
      }),
    );
  }, [title, author, content]);

  const openPreview = () => {
    window.open("/admin/artikel/preview", "_blank", "noopener,noreferrer");
  };

  const saveAndPublish = async () => {
    if (!title.trim()) return;

    if (articleId) {
      const { error } = await updateArticle(articleId, {
        title: title.trim(),
        desc: content || "",
        author: author || undefined,
      });

      if (error) {
        console.error("Supabase update error:", error);
        setToast({
          message: `Gagal memperbarui artikel: ${String(error)}`,
          type: "error",
        });
        return;
      }

      sessionStorage.removeItem("admin-article-draft");
      localStorage.removeItem("admin-article-preview-live");
      // show published modal
      setShowPublishedModal(true);
      return;
    }

    const { data, error } = await insertArticle({
      title: title.trim(),
      desc: content || "",
      image: "",
      author: author || undefined,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      setToast({
        message: `Gagal menyimpan artikel: ${String(error)}`,
        type: "error",
      });
      return;
    }

    const inserted = (data as { id?: string | number }[] | null)?.[0];
    if (inserted?.id !== undefined && inserted?.id !== null) {
      setArticleId(String(inserted.id));
    }

    sessionStorage.removeItem("admin-article-draft");
    localStorage.removeItem("admin-article-preview-live");
    setShowPublishedModal(true);
    setToast({ message: "Artikel berhasil dipublikasikan", type: "success" });
  };

  return (
    <section className="py-12 px-6 md:px-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Editor Artikel</h1>
        <div className="flex gap-2">
          <MotionButton
            onClick={openPreview}
            className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-50 transition"
          >
            Preview Artikel
          </MotionButton>
          <MotionButton
            onClick={saveAndPublish}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Simpan & Publish
          </MotionButton>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul artikel"
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Nama penulis"
          className="w-full border px-3 py-2 rounded"
          readOnly={isAuthorReadonly}
        />
      </div>

      <CustomEditor content={content} onChange={setContent} />

      {showPublishedModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold mb-2">Artikel sudah di publish</h2>
            <p className="text-sm text-gray-600 mb-4">
              Artikel berhasil dipublikasikan.
            </p>
            <div className="flex justify-end">
              <MotionButton
                onClick={() => {
                  setShowPublishedModal(false);
                  router.push("/admin/artikel");
                }}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Tutup
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
