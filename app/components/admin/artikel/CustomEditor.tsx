"use client";

import React from "react";
import dynamic from "next/dynamic";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CustomEditorProps {
  content: string;
  onChange: (data: string) => void;
}

export default function CustomEditor({ content, onChange }: CustomEditorProps) {
  return (
    <div className="prose max-w-none">
      {/* Dynamically loaded CKEditor to avoid SSR/interop issues. */}
      <DynamicCKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(_event: any, editor: { getData: () => string }) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor: any) => {
          // noop for now, but useful for debugging
        }}
        config={{
          extraPlugins: [createUploadAdapterPlugin],
        }}
      />
    </div>
  );
}

// Dynamically import CKEditor and prefer named export 'CKEditor', fallback to default export
const DynamicCKEditor = dynamic(
  async () => {
    const mod = await import("@ckeditor/ckeditor5-react");
    // prefer named export (module authors often export { CKEditor }) else fallback to default
    const comp = (mod as any).CKEditor ?? (mod as any).default;
    // if nothing available, return a placeholder null component to avoid crashes
    return comp ?? (() => null);
  },
  { ssr: false },
) as any;

// Create a plugin that registers a custom upload adapter which sends files
// as base64 data URLs to our server endpoint and returns the public URL.
function createUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    const file: File = await this.loader.file;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const filename = `${Date.now()}_${file.name}`;
          const res = await fetch("/api/upload-member-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, dataUrl }),
          });
          const json = await res.json();
          if (!json?.success) {
            reject(json?.error?.message || "Upload failed");
            return;
          }
          resolve({ default: json.data?.publicUrl || "" });
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  abort() {
    // Not implemented - FileReader can't be aborted cleanly here.
  }
}
