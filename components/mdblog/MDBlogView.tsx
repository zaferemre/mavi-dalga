"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { client } from "../../sanity/lib/client";
import { BODY_PREVIEW_BY_SLUG } from "../../sanity/lib/queries";
import DiscoveryBar from "./DiscoveryBar";
import PostCard from "./PostCard";
import PreviewModal from "./PreviewModal";
import ShareModal from "./ShareModal";

/* ====== Types & constants ====== */
export type Post = {
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

const PAGE_SIZE = 24;

/* ====== Helpers ====== */
const clampBodyPreview = (text: string) => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length > 600 ? trimmed.slice(0, 600) + "…" : trimmed;
};

const monthTR = (d: Date) =>
  d.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });

function buildGroqParts(opts: {
  category: string;
  tags: string[];
  q: string;
  cursor?: string | null;
  sort: "new" | "old";
}) {
  const base = `_type == "post" && defined(publishedAt)`;
  const cat = opts.category !== "Hepsi" ? `&& $cat in categories[]->title` : ``;
  const tg =
    opts.tags.length > 0
      ? `&& length((array::compact(coalesce(tags[]->title, tags)))[@ in $tags]) > 0`
      : ``;
  const search =
    opts.q.length > 0
      ? `&& (title match $q || description match $q || author->name match $q)`
      : ``;
  const cursorPart =
    opts.cursor && opts.sort === "new"
      ? `&& publishedAt < $cursor`
      : opts.cursor && opts.sort === "old"
        ? `&& publishedAt > $cursor`
        : ``;
  const order = opts.sort === "new" ? "desc" : "asc";
  return { base, cat, tg, search, cursorPart, order };
}

function buildParams(opts: {
  category: string;
  tags: string[];
  q: string;
  cursor?: string | null;
}) {
  const params: Record<string, any> = {};
  if (opts.category !== "Hepsi") params.cat = opts.category;
  if (opts.tags.length > 0) params.tags = opts.tags;
  if (opts.q.length > 0) params.q = `*${opts.q}*`; // only add if present
  if (opts.cursor) params.cursor = opts.cursor;
  return params;
}

/* ====== Component ====== */
export default function MDBlogView({ posts: initialPosts = [] as Post[] }) {
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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Post | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [bodyPreview, setBodyPreview] = useState("");
  const [loadingBody, setLoadingBody] = useState(false);
  const [bodyError, setBodyError] = useState("");

  // share
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [shareImg, setShareImg] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");

  // --- Categories: fetch ALL from Sanity so they’re always visible ---
  const [allCategories, setAllCategories] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const catTitles: string[] = await client.fetch(
          `array::unique(*[_type == "category" && defined(title)].title)`
        );
        setAllCategories((catTitles || []).filter(Boolean));
      } catch {
        // ignore; we’ll fall back to categoriesFromPosts
      }
    })();
  }, []);

  // derive categories/tags from loaded posts
  const categoriesFromPosts = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) =>
      p.categories?.forEach((c) => c?.title && set.add(c.title))
    );
    return Array.from(set);
  }, [posts]);

  // final categories to show: all from Sanity (preferred), else from posts
  const categories = useMemo(
    () => (allCategories.length ? allCategories : categoriesFromPosts),
    [allCategories, categoriesFromPosts]
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => t && set.add(t)));
    return Array.from(set);
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
  }, [hasMore, loadingMore]);

  // GROQ fetch: next page
  const fetchMore = async () => {
    try {
      setLoadingMore(true);
      const last = posts[posts.length - 1];
      const cursor = last?.publishedAt || null;

      const parts = buildGroqParts({
        category: selectedCategory,
        tags: selectedTags,
        q: debouncedQ,
        cursor,
        sort,
      });

      const groq = `
        *[${parts.base} ${parts.cat} ${parts.tg} ${parts.search} ${parts.cursorPart}]
          | order(publishedAt ${parts.order})[0...${PAGE_SIZE}]{
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

      const params = buildParams({
        category: selectedCategory,
        tags: selectedTags,
        q: debouncedQ,
        cursor,
      });

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

  // Reset list when filters/search/sort change — fetch first page
  useEffect(() => {
    (async () => {
      setLoadingMore(true);
      setHasMore(true);
      try {
        const parts = buildGroqParts({
          category: selectedCategory,
          tags: selectedTags,
          q: debouncedQ,
          sort,
        });

        const groq = `
          *[${parts.base} ${parts.cat} ${parts.tg} ${parts.search}]
            | order(publishedAt ${parts.order})[0...${PAGE_SIZE}]{
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

        const params = buildParams({
          category: selectedCategory,
          tags: selectedTags,
          q: debouncedQ,
        });

        const first: Post[] = await client.fetch(groq, params);
        setPosts(first);
        setHasMore(first.length === PAGE_SIZE);
      } catch (e) {
        console.error("reset fetch error", e);
      } finally {
        setLoadingMore(false);
      }
    })();
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
    setOpen(true);
    if (slug) void fetchBodyPreview(slug);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setOpen(false);
    setSelected(null);
    setSelectedSlug(null);
    setSelectedImg(null);
    setBodyPreview("");
    setBodyError("");
    setLoadingBody(false);
    document.body.style.overflow = "";
  };

  // share helpers
  const openShare = (post?: Post | null) => {
    const p = post ?? selected;
    if (!p) return;
    const slug = p.slug?.current ?? "";
    const url =
      (typeof window !== "undefined" ? window.location.origin : "") +
      `/mdblog/${slug}`;
    setSharePost(p);
    setShareImg(p.mainImage?.asset?.url ?? "/logoBig.webp");
    setShareUrl(url);
    setShareOpen(true);
  };

  const closeShare = () => {
    setShareOpen(false);
    setSharePost(null);
    setShareImg(null);
    setShareUrl("");
  };

  // month divider helper
  const monthOf = (p?: Post) =>
    p?.publishedAt ? monthTR(new Date(p.publishedAt)) : "";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-3xl font-bold">MDBlog</h1>

      <DiscoveryBar
        query={query}
        setQuery={setQuery}
        sort={sort}
        setSort={setSort}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

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

            return (
              <React.Fragment key={post._id}>
                {showDivider && <MonthDivider label={thisMonth} />}
                <PostCard post={post} onOpen={openPreview} />
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

      {/* preview */}
      <AnimatePresence>
        {open && selected && (
          <PreviewModal
            open={open}
            selected={selected}
            selectedImg={selectedImg}
            loadingBody={loadingBody}
            bodyError={bodyError}
            bodyPreview={bodyPreview}
            onClose={closePreview}
            onShare={() => openShare(selected)}
          />
        )}
      </AnimatePresence>

      {/* share */}
      <AnimatePresence>
        {shareOpen && sharePost && (
          <ShareModal
            open={shareOpen}
            post={sharePost}
            imgUrl={shareImg || "/logoBig.webp"}
            permalink={shareUrl}
            onClose={closeShare}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MonthDivider({ label }: { label: string }) {
  return (
    <div className="col-span-full mt-2 flex items-center gap-3">
      <hr className="h-px w-full border-gray-200" />
      <div className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {label}
      </div>
      <hr className="h-px w-full border-gray-200" />
    </div>
  );
}
