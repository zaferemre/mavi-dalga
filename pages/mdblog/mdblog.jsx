"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { FiX } from "react-icons/fi";
import { Card, CardContent } from "../../components/ui/Card";
import { client } from "../../sanity/lib/client"; // ← make sure this is a public/readonly client
import { BODY_PREVIEW_BY_SLUG } from "../../sanity/lib/queries"; // ← path matches where you saved it

const spring = { type: "spring", stiffness: 320, damping: 30 };

// Helper to clamp ~3–4 lines visually; we still clamp chars as a safety
const clampBodyPreview = (text) => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length > 600 ? trimmed.slice(0, 600) + "…" : trimmed;
};

export default function MDBlog({ posts = [] }) {
  const [selected, setSelected] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  // preview body states
  const [bodyPreview, setBodyPreview] = useState("");
  const [loadingBody, setLoadingBody] = useState(false);
  const [bodyError, setBodyError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!Array.isArray(posts)) return;
    const unique = Array.from(
      new Set(posts.flatMap((p) => p.categories?.map((c) => c.title) || []))
    );
    setCategories(unique);
  }, [posts]);

  const counts = useMemo(() => {
    const map = {};
    for (const p of posts) {
      const list = p.categories?.map((c) => c.title) || [];
      for (const t of list) map[t] = (map[t] || 0) + 1;
    }
    return { Hepsi: posts.length, ...map };
  }, [posts]);

  const filtered =
    selectedCategory === "Hepsi"
      ? posts
      : posts.filter((p) =>
          p.categories?.some((c) => c.title === selectedCategory)
        );

  const allCats = useMemo(() => ["Hepsi", ...categories], [categories]);

  // Esc + scroll‑lock
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closePreview();
    if (selected) document.addEventListener("keydown", onKey);
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const fetchBodyPreview = async (slug) => {
    try {
      setLoadingBody(true);
      setBodyError("");
      const data = await client.fetch(BODY_PREVIEW_BY_SLUG, { slug });
      const text = clampBodyPreview(data?.bodyText || "");
      setBodyPreview(text);
    } catch (err) {
      setBodyError("Gövde yüklenemedi.");
      setBodyPreview("");
    } finally {
      setLoadingBody(false);
    }
  };

  const openPreview = (post) => {
    const slug = post?.slug?.current;
    setSelected(post);
    setSelectedSlug(slug);
    setSelectedImg(post?.mainImage?.asset?.url || "/logoBig.webp");
    setBodyPreview("");
    setBodyError("");
    if (slug) fetchBodyPreview(slug); // lazy fetch real body
  };

  const closePreview = () => {
    setSelected(null);
    setSelectedSlug(null);
    setSelectedImg(null);
    setBodyPreview("");
    setBodyError("");
    setLoadingBody(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">MDBlog</h1>

      {/* filter pills */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent md:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />
        <div className="overflow-x-auto md:overflow-visible">
          <div className="flex md:flex-wrap gap-2 items-center pr-4">
            {allCats.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={[
                    "whitespace-nowrap px-4 py-2 rounded-full border transition shadow-sm text-sm",
                    active
                      ? "bg-orange-600 text-white border-orange-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600/40",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {cat}
                  <span
                    className={[
                      "ml-2 inline-flex items-center justify-center text-[11px] font-semibold rounded-full px-2 py-0.5",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                  >
                    {counts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* grid with equal-height cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filtered.map((post) => {
            const slug = post?.slug?.current;
            const title = post?.title || "Untitled Post";
            const img = post?.mainImage?.asset?.url;
            const alt = post?.mainImage?.alt || title;
            const postCategories = post.categories?.map((c) => c.title) || [];
            const authorName = post?.author?.name || "Mavi Dalga Dergi";
            const authorImage = post?.author?.image?.asset?.url;
            const date = post?.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : "Unknown Date";

            return (
              <motion.div
                key={slug}
                layoutId={`post-${slug}`}
                onClick={() => openPreview(post)}
                className="cursor-pointer h-full"
                transition={spring}
              >
                <Card className="flex flex-col h-full rounded-2xl overflow-hidden shadow-sm">
                  <motion.div
                    layoutId={`img-${slug}`}
                    className="relative w-full aspect-[16/9] bg-gray-100"
                    transition={spring}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={alt}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {postCategories.length > 0 && (
                      <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                        {postCategories.map((category, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs font-medium text-white bg-orange-600/90 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <CardContent className="flex flex-col flex-1">
                    <h3 className="font-semibold text-lg leading-6 line-clamp-2">
                      {title}
                    </h3>

                    {/* Keep DESCRIPTION on the card */}
                    {post.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 flex items-center gap-x-3">
                      {authorImage ? (
                        <Image
                          src={authorImage}
                          alt={authorName}
                          className="rounded-full"
                          width={28}
                          height={28}
                        />
                      ) : (
                        <div className="h-7 w-7 bg-gray-300 rounded-full grid place-items-center text-xs text-gray-500">
                          ?
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="font-medium">{authorName}</p>
                        <time
                          dateTime={post.publishedAt}
                          className="text-gray-500"
                        >
                          {date}
                        </time>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* preview overlay */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closePreview}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Kapat"
            />

            {/* Centering wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                layoutId={`post-${selectedSlug}`}
                className="pointer-events-auto w-[min(92vw,950px)] max-h-[88vh] rounded-3xl overflow-hidden
                           bg-white shadow-2xl relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
                transition={spring}
                role="dialog"
                aria-modal="true"
                aria-labelledby="preview-title"
              >
                {/* Shared image */}
                <motion.div
                  layoutId={`img-${selectedSlug}`}
                  className="relative w-full aspect-[16/9] bg-gray-100"
                  transition={spring}
                >
                  <Image
                    src={selectedImg || "/logoBig.webp"}
                    alt={selected?.title || "Post"}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Title slab */}
                  <motion.div
                    className="absolute left-4 top-4 md:left-6 md:top-6"
                    initial={{ y: -12, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { delay: 0.25, ...spring },
                    }}
                    exit={{
                      y: -12,
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    <div className="rounded-2xl bg-white/85 backdrop-blur px-4 py-3 shadow-sm">
                      <h2
                        id="preview-title"
                        className="text-xl md:text-2xl font-bold tracking-tight text-gray-900"
                      >
                        {selected?.title}
                      </h2>
                    </div>
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    onClick={closePreview}
                    className="absolute right-3 top-3 md:right-4 md:top-4 rounded-full bg-white/90 hover:bg-white w-9 h-9 grid place-items-center shadow"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { delay: 0.08 },
                    }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    aria-label="Kapat"
                  >
                    <FiX className="text-xl text-gray-700" />
                  </motion.button>
                </motion.div>

                {/* Real BODY preview (3–4 lines worth) */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: "auto",
                    transition: { delay: 0.35, ...spring },
                  }}
                  exit={{ height: 0, transition: { duration: 0.25 } }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.45, duration: 0.3 },
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="p-6 md:p-8"
                  >
                    {loadingBody ? (
                      <p className="text-gray-400 italic">Yükleniyor…</p>
                    ) : bodyError ? (
                      <p className="text-red-600">{bodyError}</p>
                    ) : (
                      <p className="text-gray-700 leading-7 line-clamp-4">
                        {bodyPreview || "—"}
                      </p>
                    )}

                    <div className="mt-6 flex items-center gap-3">
                      <Link
                        href={`/mdblog/${selectedSlug}`}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition"
                        onClick={closePreview}
                      >
                        Hepsini oku
                      </Link>
                      <button
                        className="text-sm text-gray-600 hover:text-gray-800"
                        onClick={closePreview}
                      >
                        Kapat
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
