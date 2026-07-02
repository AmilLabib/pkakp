"use client";

import React, { useEffect, useRef, useState } from "react";

type Member = {
  id: string;
  name: string;
};

type Props = {
  selectedAuthors: string[];
  onChange: (authors: string[]) => void;
  readonly?: boolean;
};

export default function AuthorSearchSelect({
  selectedAuthors,
  onChange,
  readonly = false,
}: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/members/list")
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? [];
        const mapped: Member[] = data.map((d: Record<string, unknown>) => ({
          id: String(d.id ?? ""),
          name: typeof d.name === "string" ? d.name : "",
        }));
        setMembers(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedAuthors.includes(m.name),
  );

  const select = (name: string) => {
    if (selectedAuthors.includes(name)) return;
    onChange([...selectedAuthors, name]);
    setQuery("");
    setIsOpen(false);
  };

  const remove = (name: string) => {
    onChange(selectedAuthors.filter((a) => a !== name));
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected tags */}
      {selectedAuthors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedAuthors.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded"
            >
              {name}
              {!readonly && (
                <button
                  type="button"
                  onClick={() => remove(name)}
                  className="text-gray-500 hover:text-red-600 leading-none"
                  aria-label={`Hapus ${name}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      {!readonly && (
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            loading ? "Memuat pengurus..." : "Cari nama penulis..."
          }
          disabled={loading}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      )}

      {/* Dropdown */}
      {isOpen && !readonly && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-52 overflow-y-auto">
          {filtered.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  // prevent blur from closing before click registers
                  e.preventDefault();
                  select(m.name);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition"
              >
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !readonly && query.length > 0 && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm text-gray-500">
          Tidak ada pengurus ditemukan
        </div>
      )}
    </div>
  );
}
