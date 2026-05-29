"use client";

import { useState, useEffect, type ComponentType } from "react";
import {
  insertArticle,
  fetchArticles,
  updateArticle,
  deleteArticle,
} from "../../../lib/supabaseClient";

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

type CKEditorBuild = {
  create: (...args: unknown[]) => unknown;
};

type CKEditorInstance = {
  getData: () => string;
};

type CKEditorProps = {
  editor: CKEditorBuild;
  data: string;
  onChange: (event: unknown, editor: CKEditorInstance) => void;
};

type CKEditorComponent = ComponentType<CKEditorProps>;

export default function AdminArtikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [CKEditor, setCKEditor] = useState<CKEditorComponent | null>(null);
  const [ClassicEditor, setClassicEditor] = useState<CKEditorBuild | null>(
    null,
  );
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    // try dynamic import of CKEditor packages if installed
    (async () => {
      try {
        const ck = await import("@ckeditor/ckeditor5-react");
        const Classic = await import("@ckeditor/ckeditor5-build-classic");
        if (mounted) {
          const CKEditorComponent = (ck as { CKEditor?: CKEditorComponent })
            .CKEditor;
          const ClassicBuild = (Classic.default || Classic) as CKEditorBuild;

          if (CKEditorComponent) {
            setCKEditor(() => CKEditorComponent);
            setClassicEditor(ClassicBuild);
          }
        }
      } catch {
        // silently ignore; Editor will remain null and show fallback
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // try load articles from Supabase; if fails, keep local initialArticles
    (async () => {
      try {
        const { data, error } = await fetchArticles();
        if (!error && data && data.length > 0) {
          // map to local Article shape if necessary
          const mapped = (data as ArticleRow[]).map((d) => ({
            id: String(d.id ?? ""),
            title: d.title || "",
            desc: d.desc || "",
            date: d.created_at
              ? new Date(d.created_at).toLocaleDateString()
              : "",
            image: d.image || "",
          }));
          setArticles(mapped);
        }
      } catch {
        // ignore and keep initial
      }
    })();
  }, []);

  const addOrUpdate = async () => {
    if (!title.trim()) return;

    if (isEditingIndex !== null) {
      const articleToEdit = articles[isEditingIndex];
      if (!articleToEdit?.id) return;

      const previous = [...articles];
      const updated: Article = {
        ...articleToEdit,
        title: title.trim(),
        desc: content || "",
      };

      setArticles((s) => s.map((a, i) => (i === isEditingIndex ? updated : a)));
      setTitle("");
      setContent("");
      setIsEditingIndex(null);

      const { error } = await updateArticle(articleToEdit.id, {
        title: updated.title,
        desc: updated.desc,
        image: updated.image,
      });

      if (error) {
        console.error("Supabase update error:", error);
        setArticles(previous);
      }
      return;
    }

    const optimisticId = `temp-${Date.now()}`;
    const newArticle: Article = {
      id: optimisticId,
      title: title.trim(),
      desc: content || "",
      date: new Date().toLocaleDateString(),
      image: "",
    };

    // optimistically add to UI
    setArticles((s) => [newArticle, ...s]);
    setTitle("");
    setContent("");

    // try to persist to Supabase
    const { data, error } = await insertArticle({
      title: newArticle.title,
      desc: newArticle.desc,
      image: newArticle.image,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      setArticles((s) => s.filter((a) => a.id !== optimisticId));
      return;
    }

    const insertedData = data as ArticleRow[] | null;
    const inserted: ArticleRow | null =
      insertedData && insertedData.length > 0 ? insertedData[0] : null;

    if (inserted && inserted.id !== undefined && inserted.id !== null) {
      setArticles((s) =>
        s.map((a) =>
          a.id === optimisticId
            ? {
                ...a,
                id: String(inserted.id),
                date: inserted.created_at
                  ? new Date(inserted.created_at).toLocaleDateString()
                  : a.date,
              }
            : a,
        ),
      );
    }
  };

  const startEdit = (idx: number) => {
    const target = articles[idx];
    if (!target) return;
    setIsEditingIndex(idx);
    setTitle(target.title);
    setContent(target.desc || "");
  };

  const cancelEdit = () => {
    setIsEditingIndex(null);
    setTitle("");
    setContent("");
  };

  const remove = async (idx: number) => {
    const target = articles[idx];
    if (!target) return;

    const previous = [...articles];
    setArticles((s) => s.filter((_, i) => i !== idx));

    if (!target.id || target.id.startsWith("temp-")) return;

    const { error } = await deleteArticle(target.id);
    if (error) {
      console.error("Supabase delete error:", error);
      setArticles(previous);
    }
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Kelola Artikel</h1>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul artikel"
          className="border px-2 py-1 flex-1"
        />
        <button
          onClick={cancelEdit}
          className="bg-gray-100 text-black px-3 py-1 rounded"
        >
          {isEditingIndex !== null ? "Batal Edit" : "Reset Form"}
        </button>
        <button
          onClick={addOrUpdate}
          className="bg-black text-white px-3 py-1 rounded"
        >
          {isEditingIndex !== null ? "Simpan Perubahan" : "Tambah & Publish"}
        </button>
      </div>

      {/* Editor Section */}
      <div className="mb-6">
        {!CKEditor || !ClassicEditor ? (
          <div className="p-4 border rounded bg-yellow-50">
            <p className="text-sm text-yellow-800">
              Editor belum dimuat. Jika Anda sudah menjalankan{" "}
              <code>
                npm install @ckeditor/ckeditor5-react
                @ckeditor/ckeditor5-build-classic
              </code>
              , refresh halaman.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Atau editor akan dimuat secara dinamis jika tersedia.
            </p>
          </div>
        ) : (
          <div>
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={(_event, editorInstance) => {
                setContent(editorInstance.getData());
              }}
            />
          </div>
        )}

        <div className="mt-3">
          <h3 className="font-semibold">Preview</h3>
          <div
            className="prose max-w-full border p-4 rounded mt-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={`${a.title}-${i}`} className="border-t">
                <td className="p-3">{a.title}</td>
                <td className="p-3">{a.date}</td>
                <td className="p-3">
                  <button
                    onClick={() => startEdit(i)}
                    className="text-sm text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(i)}
                    className="text-sm text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
