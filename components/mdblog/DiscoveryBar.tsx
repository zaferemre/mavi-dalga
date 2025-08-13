"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

export default function DiscoveryBar({
  query,
  setQuery,
  sort,
  setSort,
  categories,
  selectedCategory,
  setSelectedCategory,
  tags,
  selectedTags,
  setSelectedTags,
}: {
  query: string;
  setQuery: (v: string) => void;
  sort: "new" | "old";
  setSort: (v: "new" | "old") => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  tags: string[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200/70 bg-white/90 p-4 shadow-md backdrop-blur-sm sm:p-5">
      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <label className="relative block w-full sm:max-w-md">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-full border border-gray-300/80 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20"
            placeholder="Ara: başlık, açıklama, yazar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 sm:hidden">
            Sırala:
          </span>
          <select
            className="rounded-full border border-gray-300/80 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 sm:hidden"
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "old")}
          >
            <option value="new">En Yeni</option>
            <option value="old">En Eski</option>
          </select>

          {/* Desktop segmented */}
          <div
            role="group"
            aria-label="Sırala"
            className="hidden overflow-hidden rounded-full border border-gray-300/80 bg-white text-sm sm:inline-flex"
          >
            <button
              onClick={() => setSort("new")}
              aria-pressed={sort === "new"}
              className={`px-4 py-2 transition ${
                sort === "new"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              En Yeni
            </button>
            <button
              onClick={() => setSort("old")}
              aria-pressed={sort === "old"}
              className={`px-4 py-2 transition ${
                sort === "old"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              En Eski
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {["Hepsi", ...categories].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm shadow-sm transition
                  ${
                    active
                      ? "border-orange-600 bg-orange-600 text-white"
                      : "border-gray-300/80 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {tags.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      active ? prev.filter((x) => x !== t) : [...prev, t]
                    )
                  }
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs shadow-sm transition
                    ${
                      active
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300/80 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
