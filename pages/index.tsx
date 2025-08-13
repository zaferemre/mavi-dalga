"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@sanity/client";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import BlogPreview from "../components/BlogPreview";
import FeatureSec from "../components/FeatureSec";
import CTA from "../components/CTA";
import Content from "../components/Content";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";

type WelcomeText = { title?: string; body?: any };

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: "2024-02-10",
});

const DISMISS_KEY = "md_welcome_dismissed_v1";

export default function Home() {
  const [welcomeText, setWelcomeText] = useState<WelcomeText | null>(null);
  const [showToast, setShowToast] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const autoTimer = useRef<number | null>(null);

  // fetch content
  useEffect(() => {
    (async () => {
      try {
        const data = await client.fetch<WelcomeText>(
          `*[_type == "welcomeText"][0]{title, body}`
        );
        const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
        if (data?.body && !dismissed) {
          setWelcomeText(data);
          setShowToast(true);
        }
      } catch (e) {
        console.error("Error fetching welcomeText:", e);
      }
    })();
  }, []);

  const closeToast = useCallback(() => {
    setShowToast(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    if (autoTimer.current) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
  }, []);

  // accessibility + auto-dismiss
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeToast();
    if (showToast) {
      document.addEventListener("keydown", onKey);
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      if (!prefersReducedMotion && !autoTimer.current) {
        autoTimer.current = window.setTimeout(closeToast, 10000); // auto-hide after 10s
      }
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      if (autoTimer.current) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }
    };
  }, [showToast, closeToast, prefersReducedMotion]);

  const portableTextComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-sm font-semibold text-white">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-sm font-semibold text-white">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-sm font-medium text-white">{children}</h3>
      ),
      normal: ({ children }) => (
        <p className="text-sm text-white/95">{children}</p>
      ),
    },
    marks: {
      em: ({ children }) => <em className="italic">{children}</em>,
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-4 space-y-1">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-4 space-y-1">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="text-white/95">{children}</li>,
      number: ({ children }) => <li className="text-white/95">{children}</li>,
    },
  };

  return (
    <div>
      <Header />

      {/* Bottom-right toast */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {showToast && welcomeText?.body && (
            <motion.aside
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: prefersReducedMotion ? 0 : 50,
                opacity: prefersReducedMotion ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pointer-events-auto max-w-xs overflow-hidden rounded-xl bg-[#fe5200] text-white shadow-lg ring-1 ring-white/20 backdrop-blur"
              role="status"
              aria-label="Duyuru"
            >
              <div className="flex items-start gap-3 px-4 py-3">
                {/* small dot accent */}
                <span
                  className="mt-1.5 hidden h-2.5 w-2.5 flex-none rounded-full bg-white/90 sm:block"
                  aria-hidden
                />
                <div className="min-w-0 flex-1 leading-tight">
                  <PortableText
                    value={welcomeText.body}
                    components={portableTextComponents}
                  />
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={closeToast}
                  aria-label="Duyuruyu kapat"
                  className="ml-1 rounded p-1 text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-white/70"
                >
                  <FiX size={18} />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <Hero />
      <BlogPreview />
      <Content />
      <FeatureSec />
      <CTA />
      <Footer />
    </div>
  );
}
