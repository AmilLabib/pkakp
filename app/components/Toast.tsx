"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "success" | "error";
  onClose?: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const color =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-gray-800";

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded text-white ${color} shadow-lg`}
    >
      {message}
    </div>
  );
}
