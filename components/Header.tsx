"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const idleOpen = !scrolled && mobileMenuOpen;

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full"
      aria-label="Site üst menü"
    >
      <nav
        className={[
          "relative mx-auto flex flex-col items-center justify-between font-chronica",
          "w-full  transition-colors duration-300",
          mobileMenuOpen ? "overflow-visible" : "overflow-hidden",
          scrolled || idleOpen
            ? "bg-white text-black shadow-lg"
            : "bg-transparent text-white",
        ].join(" ")}
      >
        {/* Top row - fixed height */}
        <div className="flex w-full items-center justify-between px-6 py-4">
          <Link
            href="/"
            aria-label="Mavi Dalga Ana Sayfa"
            className="leading-none"
          >
            <div className="text-5xl font-bold tracking-[0.5em]">
              <div>mavi</div>
              <div>dalga</div>
            </div>
          </Link>

          {/* Right side */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden items-center space-x-4 md:flex">
              <a
                href="https://twitter.com/mavidalgadergi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:opacity-80"
              >
                <i className="fa fa-twitter" />
              </a>
              <a
                href="https://www.instagram.com/mavidalgadergi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:opacity-80"
              >
                <i className="fa fa-instagram" />
              </a>
              <a
                href="https://www.linkedin.com/company/mavidalga/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:opacity-80"
              >
                <i className="fa fa-linkedin" />
              </a>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="ml-4 md:hidden hover:opacity-80"
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

        {/* Divider */}
        <div
          className={[
            "w-full border-t",
            scrolled || idleOpen ? "border-black/15" : "border-white/20",
          ].join(" ")}
        >
          {/* Desktop nav */}
          <ul className="hidden items-center justify-center px-2 sm:px-0 md:flex">
            {menuItems.map(({ label, link }) => (
              <li key={label} className="mr-4">
                <Link
                  href={link}
                  className="block py-2 text-sm font-semibold tracking-widest hover:opacity-80"
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
                  className="block py-2 text-sm font-semibold tracking-widest hover:opacity-80"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              key="expand"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full md:hidden rounded-b-2xl overflow-hidden bg-white text-black"
            >
              <div className="px-6 py-4 border-t border-black/10">
                <ul className="grid grid-cols-1 gap-2">
                  {mobileDropdownItems.map(({ label, link }) => (
                    <li key={label}>
                      <Link
                        href={link}
                        className="block py-2 text-base font-semibold tracking-widest hover:opacity-80"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Socials in dropdown */}
                <div className="mt-4 border-t border-black/10 pt-4 pb-2">
                  <div className="flex items-center justify-center gap-6 text-2xl">
                    <a
                      href="https://twitter.com/mavidalgadergi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa fa-twitter" />
                    </a>
                    <a
                      href="https://www.instagram.com/mavidalgadergi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa fa-instagram" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/mavidalga/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa fa-linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
