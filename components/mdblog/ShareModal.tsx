"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FiDownload,
  FiLink,
  FiShare2,
  FiX,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import type { Post } from "./MDBlogView";

const spring = { type: "spring", stiffness: 360, damping: 32 };

type PosterVariant =
  | "story-dark"
  | "story-light"
  | "story-royal"
  | "story-orange"
  | "story-maroon"
  | "story-navy"
  | "story-ice";

const VARIANTS: PosterVariant[] = [
  "story-dark",
  "story-light",
  "story-royal",
  "story-orange",
  "story-maroon",
  "story-navy",
  "story-ice",
];

const VARIANT_LABEL: Record<PosterVariant, string> = {
  "story-dark": "Story • Dark",
  "story-light": "Story • Light",
  "story-royal": "Story • Royal",
  "story-orange": "Story • Orange",
  "story-maroon": "Story • Maroon",
  "story-navy": "Story • Navy",
  "story-ice": "Story • Ice",
};

const BASE_SIZES: Record<PosterVariant, { W: number; H: number; ar: "9/16" }> =
  Object.fromEntries(
    VARIANTS.map((v) => [v, { W: 1080, H: 1920, ar: "9/16" }])
  ) as any;

type Theme = {
  bgTop: string;
  bgBottom: string;
  text: string;
  subText: string;
  vignette: string;
  textShadow: string;
  isDark: boolean;
};

const mkTheme = (top: string, bottom: string, isDark: boolean): Theme => ({
  bgTop: top,
  bgBottom: bottom,
  text: isDark ? "#ffffff" : "#0b1220",
  subText: isDark ? "rgba(255,255,255,0.9)" : "rgba(11,18,32,0.85)",
  vignette: isDark ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.3)",
  textShadow: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",
  isDark,
});

const THEMES: Record<PosterVariant, Theme> = {
  "story-dark": mkTheme("#0f172a", "#111827", true),
  "story-light": mkTheme("#ffffff", "#f3f4f6", false),
  "story-royal": mkTheme("#482579", "#2d164b", true),
  "story-orange": mkTheme("#fe5200", "#b83b00", true),
  "story-maroon": mkTheme("#6e0000", "#3c0000", true),
  "story-navy": mkTheme("#052941", "#021622", true),
  "story-ice": mkTheme("#d9eef3", "#89b0bf", false),
};

/* ===== Helpers ===== */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = (text || "").trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? current + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function guessFocalPoint(img: HTMLImageElement) {
  try {
    const grid = 6;
    const cw = Math.max(1, Math.floor(img.width / grid));
    const ch = Math.max(1, Math.floor(img.height / grid));
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0);
    let bestI = 3,
      bestJ = 3,
      bestVar = -1;
    for (let j = 0; j < grid; j++) {
      for (let i = 0; i < grid; i++) {
        const x = i * cw;
        const y = j * ch;
        const d = g.getImageData(x, y, cw, ch).data;
        let sum = 0,
          sumSq = 0,
          n = cw * ch;
        for (let p = 0; p < d.length; p += 4) {
          const L = 0.2126 * d[p] + 0.7152 * d[p + 1] + 0.0722 * d[p + 2];
          sum += L;
          sumSq += L * L;
        }
        const mean = sum / n;
        const variance = sumSq / n - mean * mean;
        if (variance > bestVar) {
          bestVar = variance;
          bestI = i;
          bestJ = j;
        }
      }
    }
    return { fx: (bestI + 0.5) / grid, fy: (bestJ + 0.5) / grid };
  } catch {
    return { fx: 0.5, fy: 0.5 };
  }
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dW: number,
  dH: number,
  fx = 0.5,
  fy = 0.5
) {
  const sR = img.width / img.height;
  const dR = dW / dH;
  let sW = img.width,
    sH = img.height;
  if (sR > dR) sW = img.height * dR;
  else sH = img.width / dR;
  const sX = Math.max(0, Math.min(img.width - sW, img.width * fx - sW / 2));
  const sY = Math.max(0, Math.min(img.height - sH, img.height * fy - sH / 2));
  ctx.drawImage(img, sX, sY, sW, sH, dx, dy, dW, dH);
}

/* ===== Poster Renderer ===== */
async function drawPosterVariant({
  imgUrl,
  title,
  author,
  description,
  brand,
  logoUrl,
  variant,
  scale = 2,
}: {
  imgUrl: string;
  title: string;
  author?: string;
  description?: string;
  brand: string;
  logoUrl: string;
  variant: PosterVariant;
  scale?: number;
}) {
  const { W, H } = BASE_SIZES[variant];
  const theme = THEMES[variant];

  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, theme.bgTop);
  bg.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  let img: HTMLImageElement | null = null;
  let logo: HTMLImageElement | null = null;
  try {
    img = await loadImage(imgUrl);
  } catch {}
  try {
    logo = await loadImage(logoUrl);
  } catch {}

  if (img) {
    const { fx, fy } = await guessFocalPoint(img);
    const topH = Math.floor(H * 0.55);
    drawImageCover(ctx, img, 0, 0, W, topH, fx, fy);

    const fade = ctx.createLinearGradient(0, topH * 0.7, 0, topH);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, theme.isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, topH * 0.7, W, topH * 0.3);

    const radial = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.2,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.65
    );
    radial.addColorStop(0, "rgba(0,0,0,0)");
    radial.addColorStop(1, theme.vignette);
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);
  }

  const padX = 72;
  let y = Math.floor(H * 0.55) + 72;

  ctx.font = `800 64px "Chronica Pro", sans-serif`;
  ctx.fillStyle = theme.text;
  ctx.textBaseline = "top";
  ctx.shadowColor = theme.textShadow;
  ctx.shadowBlur = theme.isDark ? 6 : 0;
  for (const line of wrapText(ctx, title, W - padX * 2, 76, 4)) {
    ctx.fillText(line, padX, y);
    y += 76;
  }
  ctx.shadowBlur = 0;

  if (author) {
    ctx.font = `600 36px "Chronica Pro", sans-serif`;
    ctx.fillStyle = theme.subText;
    ctx.fillText(author, padX, y + 8);
    y += 56;
  }

  if (description) {
    ctx.font = `400 36px "Chronica Pro", sans-serif`;
    ctx.fillStyle = theme.subText;
    for (const line of wrapText(ctx, description, W - padX * 2, 50, 6)) {
      ctx.fillText(line, padX, y);
      y += 50;
    }
  }

  if (logo) {
    const targetHeight = 64;
    const aspect = logo.width / logo.height;
    const logoWidth = targetHeight * aspect;
    const padY = 72;
    const yPos = H - padY - targetHeight;

    ctx.drawImage(logo, padX, yPos, logoWidth, targetHeight);

    ctx.font = `700 28px "Chronica Pro", sans-serif`;
    ctx.fillStyle = theme.text;
    const textY = yPos + targetHeight / 2 - 14;
    ctx.fillText(brand, padX + logoWidth + 20, textY);
  }

  return canvas.toDataURL("image/png");
}

/* ===== Component ===== */
export default function ShareModal({
  open,
  post,
  imgUrl,
  permalink,
  onClose,
  brand = "MDBlog",
  logoUrl = "/logologo.png",
}: {
  open: boolean;
  post: Post;
  imgUrl: string;
  permalink: string;
  onClose: () => void;
  brand?: string;
  logoUrl?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [images, setImages] = useState<Record<PosterVariant, string>>(
    Object.fromEntries(VARIANTS.map((v) => [v, ""])) as any
  );

  const touchStartX = useRef<number | null>(null);

  const title = post?.title ?? "Başlık";
  const author = post?.author?.name ?? "";
  const description = post?.description ?? "";

  const changeStory = (dir: "prev" | "next") => {
    setActiveIdx((prev) => {
      if (dir === "prev") return prev === 0 ? VARIANTS.length - 1 : prev - 1;
      return prev === VARIANTS.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    let mounted = true;
    if (!open) return;
    (async () => {
      setBusy(true);
      const results = await Promise.all(
        VARIANTS.map((v) =>
          drawPosterVariant({
            imgUrl,
            title,
            author,
            description,
            brand,
            logoUrl,
            variant: v,
          }).catch(() => "")
        )
      );
      if (mounted) {
        const next = { ...images };
        VARIANTS.forEach((v, i) => (next[v] = results[i]));
        setImages(next);
        setBusy(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open, imgUrl, title, author, description, brand, logoUrl]);

  const activeVariant = VARIANTS[activeIdx];
  const activeUrl = images[activeVariant];
  const ar = BASE_SIZES[activeVariant].ar;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            layout
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring" as const,
                stiffness: 360,
                damping: 32,
              },
            }}
            exit={{ y: 20, opacity: 0 }}
            className="relative z-[71] w-full sm:w-[720px] overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-semibold flex items-center gap-2">
                <FiImage className="opacity-70" />
                Paylaş — Hikâyeleri Oluştur
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div
              className="p-4 space-y-4"
              onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX.current !== null) {
                  const diff =
                    e.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(diff) > 50) {
                    changeStory(diff > 0 ? "prev" : "next");
                  }
                }
                touchStartX.current = null;
              }}
            >
              {/* Active Preview */}
              <div className="relative rounded-xl overflow-hidden border bg-gray-50">
                <div
                  className={`w-full ${
                    ar === "9/16" ? "aspect-[9/16]" : "aspect-square"
                  } max-h-[50vh] mx-auto bg-black/5`}
                >
                  {busy ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-12 h-12 border-4 border-[#fe5200] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : activeUrl ? (
                    <>
                      <img
                        src={activeUrl}
                        alt={VARIANT_LABEL[activeVariant]}
                        className="h-full w-full object-contain"
                      />
                      {/* Mobile nav arrows */}
                      <div className="absolute inset-y-0 left-0 flex sm:hidden items-center">
                        <button
                          className="p-2 bg-black/40 text-white rounded-full ml-2"
                          onClick={() => changeStory("prev")}
                        >
                          <FiChevronLeft />
                        </button>
                      </div>
                      <div className="absolute inset-y-0 right-0 flex sm:hidden items-center">
                        <button
                          className="p-2 bg-black/40 text-white rounded-full mr-2"
                          onClick={() => changeStory("next")}
                        >
                          <FiChevronRight />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-red-500">
                      Görsel oluşturulamadı.
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails — desktop only */}
              <div className="hidden sm:grid grid-cols-7 gap-2">
                {VARIANTS.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setActiveIdx(i)}
                    className={`rounded-lg border overflow-hidden bg-white ${
                      i === activeIdx ? "ring-2 ring-black" : "hover:shadow"
                    }`}
                    title={VARIANT_LABEL[v]}
                  >
                    <div
                      className={
                        BASE_SIZES[v].ar === "9/16"
                          ? "aspect-[9/16]"
                          : "aspect-square"
                      }
                    >
                      {images[v] ? (
                        <img
                          src={images[v]}
                          alt={VARIANT_LABEL[v]}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Link + actions */}
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={permalink}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(permalink)}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FiLink /> Kopyala
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = activeUrl;
                    a.download = `${post.slug?.current ?? "mdblog"}-${activeVariant}.png`;
                    a.click();
                  }}
                  disabled={!activeUrl || busy}
                  className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
                >
                  <FiDownload /> Aktif PNG’i indir
                </button>
                <button
                  onClick={() =>
                    VARIANTS.forEach((v, i) => {
                      const url = images[v];
                      if (!url) return;
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${post.slug?.current ?? "mdblog"}-${v}.png`;
                      setTimeout(() => a.click(), i * 60);
                    })
                  }
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <FiDownload /> Tüm PNG’leri indir
                </button>
                <button
                  onClick={() => {
                    if ((navigator as any).share) {
                      (navigator as any).share({
                        title,
                        text: description || title,
                        url: permalink,
                      });
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <FiShare2 /> Sistem Paylaş
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
