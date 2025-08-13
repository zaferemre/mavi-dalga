"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { FiX, FiShare2 } from "react-icons/fi";
import type { Post } from "./MDBlogView";

const spring: { type: "spring"; stiffness: number; damping: number } = {
  type: "spring",
  stiffness: 360,
  damping: 32,
};

// Panel delay ~0.25s after image starts expanding
const PANEL_DELAY = 0.25;

export default function PreviewModal({
  open,
  selected,
  selectedImg,
  loadingBody,
  bodyError,
  bodyPreview,
  onClose,
  onShare,
}: {
  open: boolean;
  selected: Post | null;
  selectedImg: string | null;
  loadingBody: boolean;
  bodyError: string;
  bodyPreview: string;
  onClose: () => void;
  onShare: () => void;
}) {
  if (!open || !selected) return null;
  const id = selected._id || selected.slug?.current || "";
  const slug = selected.slug?.current ?? "";

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.button
        type="button"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.18 } }}
        exit={{ opacity: 0, transition: { duration: 0.14 } }}
        aria-label="Kapat"
      />

      {/* Centered modal shell */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.18, ease: "easeOut" },
          }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.14 } }}
          className="pointer-events-auto w-[min(92vw,950px)] max-h-[88vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shared element: expands from the card */}
          <motion.div
            layoutId={`post-${id}-image`}
            transition={spring}
            className="relative w-full"
          >
            <div className="relative aspect-[16/9] w-full bg-gray-100">
              <Image
                src={selectedImg || "/logoBig.webp"}
                alt={selected?.title || "Post"}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Close button floats over image */}
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
            >
              <FiX className="text-xl" />
            </button>
          </motion.div>

          {/* White info panel: slides up after ~0.25s, nudges image up a bit */}
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                delay: PANEL_DELAY,
                duration: 0.28,
                ease: "easeOut",
              },
            }}
            exit={{ y: 16, opacity: 0, transition: { duration: 0.15 } }}
            className="p-6 md:p-8"
          >
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
              {selected?.title}
            </h2>

            <div className="mt-3 min-h-[3.5rem]">
              {loadingBody ? (
                <p className="italic text-gray-400">Yükleniyor…</p>
              ) : bodyError ? (
                <p className="text-red-600">{bodyError}</p>
              ) : (
                <p className="leading-7 text-gray-700 line-clamp-4">
                  {bodyPreview || "—"}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/mdblog/${slug}`}
                className="inline-flex items-center rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                onClick={onClose}
              >
                Hepsini oku
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={onShare}
              >
                <FiShare2 />
                Paylaş (hikâye görseli)
              </button>
              <button
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={onClose}
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
