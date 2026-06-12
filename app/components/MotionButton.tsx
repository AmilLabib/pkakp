"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

type MotionButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
};

/**
 * Reusable animated button with hover scale-up and tap scale-down effects.
 * Drop-in replacement for <button> — accepts all the same props.
 */
export default function MotionButton({
  children,
  whileHover,
  whileTap,
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      whileHover={whileHover ?? { scale: 1.05 }}
      whileTap={whileTap ?? { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
