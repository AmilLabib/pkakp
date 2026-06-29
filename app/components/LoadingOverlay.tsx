"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

/**
 * Full-screen loading overlay with animated spinner.
 * Uses framer-motion for smooth enter/exit transitions.
 */
export default function LoadingOverlay({
  isLoading,
  message = "Memproses...",
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4 bg-white rounded-2xl px-8 py-6 shadow-2xl"
          >
            {/* Spinner */}
            <div className="relative w-12 h-12">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-gray-200"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-black"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
