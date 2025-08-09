"use client";

import React from "react";
import { motion } from "motion/react";

const spring = { type: "spring", stiffness: 320, damping: 32 };
const appear = { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

export default function Example() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2"
        >
          {/* Katkı Yap */}
          <CardLink
            href="/katkiyap"
            title="Katkı Yap"
            desc="Yazı, çizim, tasarım veya farklı içeriklerle Mavi Dalga’ya katkı sunabilirsin. Kapımız tüm öğrencilere açık!"
            big
            leftRounded
          />

          {/* Destek Ol */}
          <CardLink
            href="/destek-ol"
            title="Destek Ol"
            desc="Basım ve dağıtımı sürdürebilmemiz için desteğin çok değerli. Maddi/manevi her katkı bizi güçlendirir."
            topRounded
          />

          {/* İletişime Geç */}
          <CardLink
            href="/iletisim"
            title="İletişime Geç"
            desc="Soruların mı var? Bize sosyal medya hesaplarımızdan veya e‑posta ile kolayca ulaşabilirsin."
          />

          {/* Hakkımızda */}
          <CardLink
            href="/hakkimizda"
            title="Hakkımızda"
            desc="Mavi Dalga; bağımsız, gönüllü ve çok sesli bir öğrenci dergisidir. Marmara Üniversitesi Tıp Fakültesi öğrencileri tarafından çıkarılır."
            big
            rightRounded
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ----------------- Minimal Card ----------------- */

function CardLink({
  href,
  title,
  desc,
  big = false,
  leftRounded = false,
  rightRounded = false,
  topRounded = false,
}) {
  const bgRound = leftRounded
    ? "lg:rounded-l-2xl"
    : rightRounded
      ? "lg:rounded-r-2xl"
      : topRounded
        ? "max-lg:rounded-t-2xl"
        : "rounded-2xl";

  const innerRound = leftRounded
    ? "lg:rounded-l-2xl"
    : rightRounded
      ? "lg:rounded-r-2xl"
      : topRounded
        ? "max-lg:rounded-t-2xl"
        : "rounded-2xl";

  return (
    <motion.a
      href={href}
      variants={{
        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: appear },
      }}
      whileHover={{ y: -2, scale: 1.01, transition: spring }}
      className={`group relative ${big ? "lg:row-span-2" : ""}`}
    >
      {/* Base card */}
      <div
        className={`relative flex h-full flex-col overflow-hidden ${innerRound} bg-white shadow-sm ring-1 ring-gray-200 transition`}
      >
        <div className={`px-8 ${big ? "pb-4 pt-8" : "pt-8"} sm:px-10 sm:pt-10`}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-lg font-semibold tracking-tight text-gray-900">
              {title}
            </p>

            {/* Arrow chevron (no emoji, no image) */}
            <svg
              className="mt-0.5 h-5 w-5 stroke-gray-400 transition group-hover:translate-x-0.5 group-hover:stroke-gray-900"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">{desc}</p>
        </div>

        {/* Divider */}
        <div className="mx-8 my-4 h-px bg-gray-100 sm:mx-10" />

        {/* Body placeholder (kept simple & neutral) */}
        <div className="px-8 pb-6 sm:px-10 sm:pb-8">
          <div
            className="h-28 w-full rounded-xl border border-dashed border-gray-200 bg-gray-50"
            aria-hidden
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-end gap-2 px-8 pb-6 sm:px-10">
          <span className="text-xs font-medium text-gray-500">
            {href.replace("/", "")}
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300 group-hover:bg-gray-800 transition" />
        </div>
      </div>

      {/* Outer ring to keep asymmetric rounding from your original layout */}
      <div
        className={`pointer-events-none absolute inset-0 ${bgRound} ring-1 ring-black/5`}
      />
    </motion.a>
  );
}
