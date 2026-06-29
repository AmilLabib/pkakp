"use client";

import { useEffect } from "react";
import { toast as sonnerToast } from "sonner";

/**
 * Legacy Toast bridge — keeps existing API but routes to Sonner.
 * Usage stays the same: <Toast message="..." type="success" onClose={() => ...} />
 * But now rendered by the global <Toaster /> in admin layout.
 */
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
    if (type === "success") {
      sonnerToast.success(message);
    } else if (type === "error") {
      sonnerToast.error(message);
    } else {
      sonnerToast(message);
    }

    // Auto-dismiss the parent state after a short delay
    const t = setTimeout(() => onClose && onClose(), 500);
    return () => clearTimeout(t);
  }, [message, type, onClose]);

  // Don't render anything — Sonner handles the UI
  return null;
}

/**
 * Imperative toast helper for direct usage without the component.
 * e.g.: showToast("Berhasil!", "success")
 */
export function showToast(
  message: string,
  type: "info" | "success" | "error" = "info",
) {
  if (type === "success") {
    sonnerToast.success(message);
  } else if (type === "error") {
    sonnerToast.error(message);
  } else {
    sonnerToast(message);
  }
}
