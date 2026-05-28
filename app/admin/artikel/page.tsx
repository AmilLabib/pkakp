"use client";

import { useState, useEffect } from "react";
import { articles as initialArticles, type Article } from "../../data/articles";

export default function AdminArtikel() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [Editor, setEditor] = useState<any>(null);
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    // try dynamic import of CKEditor packages if installed
    (async () => {
      try {
        const ck = await import("@ckeditor/ckeditor5-react");
        const Classic = await import("@ckeditor/ckeditor5-build-classic");
        if (mounted) {
          // Attach Classic build to the component for easier use below
          // we store both the React wrapper and the build on Editor
          (ck as any).Classic = Classic.default || Classic;
          setEditor(ck.default || ck);
        }
      } catch (e) {
        // silently ignore; Editor will remain null and show fallback
        // console.debug(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const add = () => {
    if (!title) return;
    setArticles((s) => [
      {
        title,
        desc: content || "",
        date: new Date().toLocaleDateString(),
        image: "",
      },
      ...s,
    ]);
    setTitle("");
    setContent("");
  };

  const remove = (idx: number) =>
    setArticles((s) => s.filter((_, i) => i !== idx));

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
          onClick={() => setIsEditingIndex(null)}
          className="bg-gray-100 text-black px-3 py-1 rounded"
        >
          Buka Editor
        </button>
        <button onClick={add} className="bg-black text-white px-3 py-1 rounded">
          Tambah & Publish
        </button>
      </div>

      {/* Editor Section */}
      <div className="mb-6">
        {!Editor ? (
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
            <Editor
              editor={Editor?.Classic}
              data={content}
              onChange={(_event: any, editorInstance: any) => {
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
                  <button className="text-sm text-blue-600 mr-2">Edit</button>
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
