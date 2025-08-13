"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "HAKKIMIZDA", link: "/hakkimizda" },
    { label: "ARŞİV", link: "/arsiv" },
    { label: "MDBLOG", link: "/mdblog" },
    { label: "DESTEK OL", link: "/destekol" },
    { label: "KATKI YAP", link: "/katkiyap" },
    { label: "İLETİŞİM", link: "/iletisim" },
  ] as const;

  const mobileMainMenuItems = menuItems.slice(0, 3);
  const mobileDropdownItems = menuItems.slice(3);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white text-black shadow-md" : "bg-transparent text-white"
      }`}
    >
      <nav className="relative mx-auto flex w-full flex-col items-center justify-between font-chronica">
        <div className="flex w-full items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className={`leading-none ${scrolled ? "text-black" : "text-white"}`}
            aria-label="Mavi Dalga Ana Sayfa"
          >
            <div className="text-5xl font-bold tracking-[0.5em]">
              <div>mavi</div>
              <div>dalga</div>
            </div>
          </Link>

          {/* Right */}
          <div className="ml-auto flex items-center space-x-4">
            <a
              href="https://twitter.com/mavidalgadergi"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl transition ${
                scrolled
                  ? "text-black hover:opacity-70"
                  : "text-white hover:opacity-80"
              }`}
              aria-label="Twitter"
            >
              <i className="fa fa-twitter" />
            </a>
            <a
              href="https://www.instagram.com/mavidalgadergi/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl transition ${
                scrolled
                  ? "text-black hover:opacity-70"
                  : "text-white hover:opacity-80"
              }`}
              aria-label="Instagram"
            >
              <i className="fa fa-instagram" />
            </a>
            <a
              href="https://www.linkedin.com/company/mavidalga/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl transition ${
                scrolled
                  ? "text-black hover:opacity-70"
                  : "text-white hover:opacity-80"
              }`}
              aria-label="LinkedIn"
            >
              <i className="fa fa-linkedin" />
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`ml-4 md:hidden ${
                scrolled ? "text-black hover:text-gray-700" : "text-white"
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Menüyü aç/kapat"
            >
              <svg
                fill="currentColor"
                height="24"
                width="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M2 4h20a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 7h20a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 7h20a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="w-full border-t border-gray-200">
          <ul className="hidden items-center justify-center px-2 sm:px-0 md:flex">
            {menuItems.map(({ label, link }) => (
              <li key={label} className="mr-4">
                <Link
                  href={link}
                  className={`block py-2 text-sm font-semibold tracking-widest transition ${
                    scrolled
                      ? "text-black hover:text-gray-700"
                      : "text-white hover:opacity-80"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile quick items */}
          <ul className="flex items-center justify-center px-2 sm:px-0 md:hidden">
            {mobileMainMenuItems.map(({ label, link }) => (
              <li key={label} className="mr-4">
                <Link
                  href={link}
                  className={`block py-2 text-sm font-semibold tracking-widest transition ${
                    scrolled
                      ? "text-black hover:text-gray-700"
                      : "text-white hover:opacity-80"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{
                height: prefersReducedMotion ? "auto" : 0,
                opacity: prefersReducedMotion ? 1 : 0,
              }}
              className="absolute top-full w-full bg-white text-black shadow-md md:hidden"
            >
              <ul className="flex flex-col space-y-2 px-6 py-4">
                {mobileDropdownItems.map(({ label, link }) => (
                  <li key={label}>
                    <Link
                      href={link}
                      className="block py-2 text-sm font-semibold transition hover:text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
