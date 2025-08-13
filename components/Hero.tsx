"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // Parallax
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => setOffset(window.scrollY * 0.2);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  // Typewriter — slice-based (no "undefined"), StrictMode-safe
  const L1 = "su çok güzel,";
  const L2 = "gelsene!";
  const [i1, setI1] = useState(0);
  const [i2, setI2] = useState(0);
  const [phase, setPhase] = useState<"l1" | "pause" | "l2" | "done">("l1");
  const timers = useRef<number[]>([]);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // prevent double-run in React StrictMode (dev)
    started.current = true;

    if (prefersReducedMotion) {
      setI1(L1.length);
      setI2(L2.length);
      setPhase("done");
      return;
    }

    const typeLine1 = () => {
      const tick = () => {
        setI1((n) => {
          if (n < L1.length) {
            // variable tempo for a more "daktilo" feel
            const delay = n % 5 === 0 ? 120 : 70;
            timers.current.push(window.setTimeout(tick, delay));
            return n + 1;
          }
          setPhase("pause");
          timers.current.push(
            window.setTimeout(() => {
              setPhase("l2");
              typeLine2();
            }, 400)
          );
          return n;
        });
      };
      timers.current.push(window.setTimeout(tick, 250));
    };

    const typeLine2 = () => {
      const tick = () => {
        setI2((n) => {
          if (n < L2.length) {
            const delay = n % 4 === 1 ? 110 : 80;
            timers.current.push(window.setTimeout(tick, delay));
            return n + 1;
          }
          setPhase("done");
          return n;
        });
      };
      timers.current.push(window.setTimeout(tick, 200));
    };

    typeLine1();

    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
  }, [prefersReducedMotion, L1, L2]);

  const line1Text = L1.slice(0, i1);
  const line2Text = L2.slice(0, i2);

  return (
    <div
      className="relative flex h-screen items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/seashoreMain.jpg')",
        backgroundPositionY: prefersReducedMotion
          ? undefined
          : `calc(50% + ${offset}px)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="px-4 text-center"
      >
        {/* Line 1 */}
        <h1 className="text-4xl font-bold tracking-widest lg:text-6xl">
          {line1Text}
          {/* caret while typing line 1 */}
          {!prefersReducedMotion && phase === "l1" && (
            <span
              className="ml-1 inline-block align-baseline"
              aria-hidden
              style={{ width: "0.6ch" }}
            >
              <span className="inline-block h-[1em] translate-y-[2px] border-l-2 border-white/80" />
            </span>
          )}
        </h1>

        {/* Line 2 + blinking ! when done */}
        <p className="mt-4 text-lg font-light tracking-widest lg:text-3xl">
          <span>{line2Text}</span>
          {phase === "l2" && !prefersReducedMotion && (
            <span
              className="ml-1 inline-block align-baseline"
              aria-hidden
              style={{ width: "0.6ch" }}
            >
              <span className="inline-block h-[1em] translate-y-[2px] border-l-2 border-white/80" />
            </span>
          )}
        </p>
      </motion.div>

      {/* readability overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
}
