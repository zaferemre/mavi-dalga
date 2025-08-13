"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { FiX, FiSearch, FiShare2 } from "react-icons/fi";
import { Card, CardContent } from "../../components/ui/Card";
import { client } from "../../sanity/lib/client";
import { BODY_PREVIEW_BY_SLUG } from "../../sanity/lib/queries";

const spring = { type: "spring", stiffness: 320, damping: 30 };
const PAGE_SIZE = 24;

// Helper to clamp ~3–4 lines visually; we still clamp chars as a safety
const clampBodyPreview = (text: string) => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length > 600 ? trimmed.slice(0, 600) + "…" : trimmed;
};

type Post = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  publishedAt?: string;
  description?: string;
  mainImage?: { asset?: { url?: string }; alt?: string };
  author?: { name?: string; image?: { asset?: { url?: string } } };
  categories?: { title: string }[];
  tags?: string[];
};

export default function MDBlog({ posts: initialPosts = [] as Post[] }) {
  // data + paging
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialPosts.length === PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  // filters/search/sort
  const [selectedCategory, setSelectedCategory] = useState<string>("Hepsi");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  // preview
  const [selected, setSelected] = useState<Post | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [bodyPreview, setBodyPreview] = useState("");
  const [loadingBody, setLoadingBody] = useState(false);
  const [bodyError, setBodyError] = useState("");

  // derive categories/tags from loaded posts
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) =>
      p.categories?.forEach((c) => c?.title && set.add(c.title))
    );
    return Array.from(set);
  }, [posts]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => t && set.add(t)));
    return Array.from(set);
  }, [posts]);

  // counts for chips (current list only — fast)
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of posts) {
      const list = p.categories?.map((c) => c.title) || [];
      for (const t of list) map[t] = (map[t] || 0) + 1;
    }
    return { Hepsi: posts.length, ...map };
  }, [posts]);

  // debounce search
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e.isIntersecting && hasMore && !loadingMore) {
          void fetchMore();
        }
      },
      { rootMargin: "160px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, loadingMore, sentinelRef]);

  // month label (Turkish)
  const monthTR = (d: Date) =>
    d.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });

  // --- GROQ fetch (filters/cursor/sort) ---
  const fetchMore = async () => {
    try {
      setLoadingMore(true);

      const last = posts[posts.length - 1];
      const cursor = last?.publishedAt || null;

      const base = `_type == "post" && defined(publishedAt)`;
      const cat =
        selectedCategory !== "Hepsi" ? `&& $cat in categories[]->title` : ``;
      const tg =
        selectedTags.length > 0
          ? `&& length((array::compact(coalesce(tags[]->title, tags)))[@ in $tags]) > 0`
          : ``;
      const search =
        debouncedQ.length > 0
          ? `&& (title match $q || description match $q || author->name match $q)`
          : ``;

      const cursorPart =
        cursor && sort === "new"
          ? `&& publishedAt < $cursor`
          : cursor && sort === "old"
            ? `&& publishedAt > $cursor`
            : ``;

      const order = sort === "new" ? "desc" : "asc";

      const groq = `
        *[${base} ${cat} ${tg} ${search} ${cursorPart}]
          | order(publishedAt ${order})[0...${PAGE_SIZE}]{
          _id,
          title,
          slug,
          publishedAt,
          description,
          mainImage{ asset->{ url }, alt },
          author->{ name, image{ asset->{ url } } },
          categories[]->{ title },
          "tags": coalesce(tags[]->title, tags)
        }
      `;

      const params: Record<string, any> = {
        q: debouncedQ ? `*${debouncedQ}*` : undefined,
        cat: selectedCategory !== "Hepsi" ? selectedCategory : undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        cursor: cursor || undefined,
      };

      const more: Post[] = await client.fetch(groq, params);

      setPosts((prev) => (cursor ? [...prev, ...more] : more));
      setHasMore(more.length === PAGE_SIZE);
    } catch (e) {
      console.error("fetchMore error", e);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // reset when filters/search/sort change — fetch first page
  useEffect(() => {
    // start a fresh query (no cursor)
    (async () => {
      setLoadingMore(true);
      setHasMore(true);
      try {
        const base = `_type == "post" && defined(publishedAt)`;
        const cat =
          selectedCategory !== "Hepsi" ? `&& $cat in categories[]->title` : ``;
        const tg =
          selectedTags.length > 0
            ? `&& length((array::compact(coalesce(tags[]->title, tags)))[@ in $tags]) > 0`
            : ``;
        const search =
          debouncedQ.length > 0
            ? `&& (title match $q || description match $q || author->name match $q)`
            : ``;

        const order = sort === "new" ? "desc" : "asc";

        const groq = `
          *[${base} ${cat} ${tg} ${search}]
            | order(publishedAt ${order})[0...${PAGE_SIZE}]{
            _id,
            title,
            slug,
            publishedAt,
            description,
            mainImage{ asset->{ url }, alt },
            author->{ name, image{ asset->{ url } } },
            categories[]->{ title },
            "tags": coalesce(tags[]->title, tags)
          }
        `;

        const params: Record<string, any> = {
          q: debouncedQ ? `*${debouncedQ}*` : undefined,
          cat: selectedCategory !== "Hepsi" ? selectedCategory : undefined,
          tags: selectedTags.length ? selectedTags : undefined,
        };

        const first: Post[] = await client.fetch(groq, params);
        setPosts(first);
        setHasMore(first.length === PAGE_SIZE);
      } catch (e) {
        console.error("reset fetch error", e);
      } finally {
        setLoadingMore(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedTags.join(","), debouncedQ, sort]);

  // preview helpers
  const fetchBodyPreview = async (slug: string) => {
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

  const openPreview = (post: Post) => {
    const slug = post?.slug?.current || null;
    setSelected(post);
    setSelectedSlug(slug);
    setSelectedImg(post?.mainImage?.asset?.url || "/logoBig.webp");
    setBodyPreview("");
    setBodyError("");
    if (slug) void fetchBodyPreview(slug);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setSelected(null);
    setSelectedSlug(null);
    setSelectedImg(null);
    setBodyPreview("");
    setBodyError("");
    setLoadingBody(false);
    document.body.style.overflow = "";
  };

  const copyShare = async (slug?: string | null) => {
    try {
      const url =
        (typeof window !== "undefined" ? window.location.origin : "") +
        `/mdblog/${slug ?? selectedSlug ?? ""}`;
      await navigator.clipboard.writeText(url);
      // swap alert for a tiny native feel; you can replace with a toast
      alert("Bağlantı kopyalandı.");
    } catch {
      alert("Bağlantı kopyalanamadı.");
    }
  };

  // UI ——————————————————————————————————————————————

  // month divider helper
  const monthOf = (p?: Post) =>
    p?.publishedAt ? monthTR(new Date(p.publishedAt)) : "";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-3xl font-bold">MDBlog</h1>

      {/* Discovery bar */}
      <div className="sticky top-[76px] z-10 mb-6 rounded-xl border bg-white/90 px-3 py-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <label className="relative block w-full md:max-w-sm">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
              placeholder="Ara: başlık, açıklama, yazar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSort("new")}
              className={`rounded-full border px-3 py-1 text-sm ${
                sort === "new"
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
              aria-pressed={sort === "new"}
            >
              En Yeni
            </button>
            <button
              onClick={() => setSort("old")}
              className={`rounded-full border px-3 py-1 text-sm ${
                sort === "old"
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
              aria-pressed={sort === "old"}
            >
              En Eski
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
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
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-pressed={active}
              >
                {cat}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold
                  ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {counts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tags (multi-select) */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
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
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs shadow-sm transition
                  ${
                    active
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-pressed={active}
                >
                  #{t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid with month dividers */}
      {posts.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">İçerik bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const prev = posts[i - 1];
            const thisMonth = monthOf(post);
            const prevMonth = monthOf(prev);
            const showDivider = thisMonth && thisMonth !== prevMonth;

            const slug = post.slug?.current;
            const title = post.title || "Untitled Post";
            const img = post.mainImage?.asset?.url;
            const alt = post.mainImage?.alt || title;
            const postCategories = post.categories?.map((c) => c.title) || [];
            const authorName = post?.author?.name || "Mavi Dalga Dergi";
            const authorImage = post?.author?.image?.asset?.url;
            const date = post?.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("tr-TR")
              : "Tarih yok";

            return (
              <React.Fragment key={post._id}>
                {showDivider && (
                  <div className="col-span-full mt-2 flex items-center gap-3">
                    <hr className="h-px w-full border-gray-200" />
                    <div className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {thisMonth}
                    </div>
                    <hr className="h-px w-full border-gray-200" />
                  </div>
                )}

                <motion.div
                  onClick={() => openPreview(post)}
                  className="h-full cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="flex h-full flex-col overflow-hidden rounded-2xl shadow-sm">
                    <div className="relative aspect-[16/9] w-full bg-gray-100">
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
                        <div className="absolute right-2 top-2 flex flex-wrap gap-1">
                          {postCategories.map((category) => (
                            <span
                              key={category}
                              className="rounded bg-orange-600/90 px-2 py-1 text-xs font-medium text-white"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <CardContent className="flex flex-1 flex-col">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-6">
                        {title}
                      </h3>

                      {post.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {post.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center gap-x-3 pt-4">
                        {authorImage ? (
                          <Image
                            src={authorImage}
                            alt={authorName}
                            className="rounded-full"
                            width={28}
                            height={28}
                          />
                        ) : (
                          <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-300 text-xs text-gray-500">
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
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* infinite scroll sentinel */}
      <div ref={sentinelRef} className="mt-10 h-10 w-full" />
      {loadingMore && (
        <p className="mt-2 text-center text-sm text-gray-500">Yükleniyor…</p>
      )}

      {/* preview overlay (simplified anim) */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closePreview}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Kapat"
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                className="pointer-events-auto max-h-[88vh] w-[min(92vw,950px)] overflow-hidden rounded-3xl bg-white shadow-2xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-[16/9] w-full bg-gray-100">
                  <Image
                    src={selectedImg || "/logoBig.webp"}
                    alt={selected?.title || "Post"}
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={closePreview}
                    aria-label="Kapat"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                    {selected?.title}
                  </h2>

                  <div className="mt-3 min-h-[3.5rem]">
                    {loadingBody ? (
                      <p className="italic text-gray-400">Yükleniyor…</p>
                    ) : bodyError ? (
                      <p className="text-red-600">{bodyError}</p>
                    ) : (
                      <p className="line-clamp-4 leading-7 text-gray-700">
                        {bodyPreview || "—"}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/mdblog/${selectedSlug ?? ""}`}
                      className="inline-flex items-center rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                      onClick={closePreview}
                    >
                      Hepsini oku
                    </Link>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => copyShare(selectedSlug)}
                    >
                      <FiShare2 />
                      Paylaş (kopyala)
                    </button>
                    <button
                      className="text-sm text-gray-600 hover:text-gray-800"
                      onClick={closePreview}
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
