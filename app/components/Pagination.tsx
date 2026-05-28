"use client";

import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex items-center justify-center gap-3 font-poppins text-[#171b23]">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        className="w-9 h-9 rounded-xl border border-[#bfc6d1] bg-white text-lg leading-none"
        disabled={currentPage === 1}
      >
        {"<"}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl border ${
            currentPage === p
              ? "border-[#bfc6d1] bg-[#f2f2f2] font-bold"
              : "border-[#bfc6d1] bg-white"
          } text-base`}
          aria-label={`Page ${p}`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        aria-label="Next page"
        className="w-9 h-9 rounded-xl border border-[#bfc6d1] bg-white text-lg leading-none"
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
    </div>
  );
}
