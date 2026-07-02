"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { insertArticle, updateArticle } from "../../../../lib/supabaseClient";
import Toast from "../../../components/Toast";
import MotionButton from "../../../components/MotionButton";
import LoadingOverlay from "../../../components/LoadingOverlay";
import AuthorSearchSelect from "../../../components/admin/artikel/AuthorSearchSelect";

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
  return (
    <Suspense fallback={<div className="py-12 px-6 md:px-10 max-w-5xl mx-auto"><p className="text-gray-500">Memuat Editor...</p></div>}>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  // authors is stored as array; serialized as comma-separated string when saving
  const [authors, setAuthors] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthorReadonly, setIsAuthorReadonly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  // Load article data: from URL query param (edit mode) or sessionStorage (draft)
  useEffect(() => {
    const idFromUrl = searchParams.get("id");

    if (idFromUrl) {
      // Edit mode: fetch article by ID from the API
      setIsLoading(true);
      (async () => {
        try {
          const res = await fetch(`/api/admin/articles/${idFromUrl}`);
          if (res.ok) {
            const json = await res.json();
            const article = json?.data;
            if (article) {
              setArticleId(String(article.id));
              setTitle(article.title || "");
              // author may be comma-separated multi-author string
              const rawAuthor = article.author || "";
              setAuthors(
                rawAuthor
                  ? rawAuthor
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : [],
              );
              setContent(article.desc || "");
            }
          }
        } catch (e) {
          console.error("Failed to fetch article for editing:", e);
        } finally {
          setIsLoading(false);
        }
      })();
      return;
    }

    // Fallback: load from sessionStorage draft
    const raw = sessionStorage.getItem("admin-article-draft");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as DraftPayload;
      setArticleId(parsed.id || null);
      setTitle(parsed.title || "");
      const rawAuthor = parsed.author || "";
      setAuthors(
        rawAuthor
          ? rawAuthor
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      );
      setContent(parsed.content || "");
    } catch {
      // ignore invalid draft format
    }
  }, [searchParams]);

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
          // staff author is locked to their own name, pre-filled if not already set
          setAuthors((prev) => (prev.length > 0 ? prev : name ? [name] : []));
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
        author: authors.join(", "),
        content,
      }),
    );
  }, [title, authors, content]);

  const openPreview = () => {
    window.open("/admin/artikel/preview", "_blank", "noopener,noreferrer");
  };

  const saveAndPublish = async () => {
    if (!title.trim()) return;

    setIsSaving(true);

    // Serialize authors array as comma-separated string
    const authorString = authors.join(", ") || undefined;

    if (articleId) {
      const { error } = await updateArticle(articleId, {
        title: title.trim(),
        desc: content || "",
        author: authorString,
      });

      if (error) {
        console.error("Supabase update error:", error);
        setToast({
          message: `Gagal memperbarui artikel: ${String(error)}`,
          type: "error",
        });
        setIsSaving(false);
        return;
      }

      sessionStorage.removeItem("admin-article-draft");
      localStorage.removeItem("admin-article-preview-live");
      setIsSaving(false);
      // show published modal
      setShowPublishedModal(true);
      setToast({ message: "Artikel berhasil diperbarui", type: "success" });
      return;
    }

    const { data, error } = await insertArticle({
      title: title.trim(),
      desc: content || "",
      image: "",
      author: authorString,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      setToast({
        message: `Gagal menyimpan artikel: ${String(error)}`,
        type: "error",
      });
      setIsSaving(false);
      return;
    }

    const inserted = (data as { id?: string | number }[] | null)?.[0];
    if (inserted?.id !== undefined && inserted?.id !== null) {
      setArticleId(String(inserted.id));
    }

    sessionStorage.removeItem("admin-article-draft");
    localStorage.removeItem("admin-article-preview-live");
    setIsSaving(false);
    setShowPublishedModal(true);
    setToast({ message: "Artikel berhasil dipublikasikan", type: "success" });
  };

  return (
    <section className="py-12 px-6 md:px-10 max-w-5xl mx-auto">
      <LoadingOverlay isLoading={isSaving} message="Menyimpan artikel..." />
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500">Memuat artikel...</p>
        </div>
      ) : (
        <>
      <div className="mb-4">
        <MotionButton
          onClick={() => router.push("/admin/artikel")}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-black transition text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Artikel
        </MotionButton>
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Penulis
        </label>
        <AuthorSearchSelect
          selectedAuthors={authors}
          onChange={setAuthors}
          readonly={isAuthorReadonly}
        />
      </div>

      <CustomEditor content={content} onChange={setContent} />
        </>
      )}

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
