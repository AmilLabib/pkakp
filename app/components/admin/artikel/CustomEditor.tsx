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
