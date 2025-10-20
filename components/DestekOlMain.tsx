"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiX } from "react-icons/fi";

// Removed custom spring transition to avoid type error with motion/react
// const spring = { type: "spring", stiffness: 280, damping: 26 };

const ACCOUNTS = [
  {
    bank: "Yapı ve Kredi Bankası",
    holder: "Edanur Koçbıyık",
    ibanDisplay: "Iban için bize yaz.",
    notes: [
      "Anonim bağışçıysanız: Bağış tarihi",
      "Anonim değilseniz: İsim Soyisim – Bağış tarihi",
    ],
  },
  {
    bank: "Ziraat Bankası",
    holder: "Zeynep Duru Kuzu",
    ibanDisplay: "Iban için bize yaz.",
    notes: [
      "Anonim bağışçıysanız: Bağış tarihi",
      "Anonim değilseniz: İsim Soyisim – Bağış tarihi",
    ],
  },
];

const DestekOl = () => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null); // e.g., "iban-0", "holder-1"
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Lock scroll + ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setShowModal(false);
    if (showModal) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // no-op
    }
  };

  // Close on click outside
  useEffect(() => {
    if (!showModal) return;
    const onClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showModal]);

  return (
    <div className="relative">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-blue-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-64 bg-gradient-to-r from-fuchsia-300/40 via-purple-300/40 to-blue-300/40 blur-3xl"
      />

      <main className="mx-auto my-10 max-w-3xl px-4 sm:px-6">
        <motion.section
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl border border-purple-100 bg-white/70 p-6 sm:p-8 shadow-xl backdrop-blur-md"
        >
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
                Destek Ol
              </span>
            </h1>
            <p className="mt-3 leading-relaxed text-gray-700">
              Mavi Dalga kâr amacı gütmeyen bir öğrenci dergisidir.
              Çalışmalarımıza destek olmak isterseniz, aşağıdaki bilgilerle
              bağışta bulunabilirsiniz.
            </p>
          </header>

          <div className="mb-8 rounded-xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/30 p-4 sm:p-6">
            <h2 className="mb-3 text-2xl font-semibold text-purple-800">
              Bağışçı Hakları
            </h2>
            <ul className="grid grid-cols-1 gap-2 text-gray-700 sm:grid-cols-2">
              {[
                "Bağış yaparken soru sorma; anında doğru ve açık yanıt alma hakkı.",
                "Yönetim ekibimiz hakkında bilgi alma hakkı.",
                "Misyon, vizyon ve bağışın kullanım amacı hakkında bilgi edinme.",
                "Yıllık finansal bilgilere ulaşma hakkı.",
                "Bağışın amacı doğrultusunda kullanılacağı güvencesi.",
                "Uygun bir şekilde teşekkür edilmesi.",
                "Bağışlarının gizliliğini talep etme hakkı.",
                "Yapılan bağışları istediği zaman görme hakkı.",
                "İletişim bilgilerinin silinmesini talep etme hakkı.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-white text-purple-700">
                    ✓
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowModal(true)}
              className="group inline-flex items-center gap-3 rounded-xl bg-purple-700 px-5 py-3 font-medium text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:bg-purple-800 active:translate-y-0"
            >
              <span>MD Hesap Bilgileri’ne Ulaş</span>
              <span className="translate-x-0 transition group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </motion.div>

          <footer className="text-gray-700">
            <p className="italic">Sevgiyle,</p>
            <p className="font-semibold text-gray-900">
              Mavi Dalga Editör Ekibi
            </p>
          </footer>
        </motion.section>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.28, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              onClick={() => setShowModal(false)}
            />

            {/* Dialog wrapper (centers on desktop, bottom sheet on mobile) */}
            <motion.div
              key="dialog-wrap"
              role="dialog"
              aria-modal="true"
              aria-labelledby="donation-title"
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.28, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
            >
              {/* Panel */}
              <motion.div
                ref={modalRef}
                initial={{
                  y: 28,
                  scale: 1,
                  opacity: 0,
                  filter: "blur(6px)",
                }}
                animate={{
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={{
                  y: 18,
                  scale: 1,
                  opacity: 0,
                  filter: "blur(4px)",
                  transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
                }}
                className={
                  // Bottom sheet on mobile; centered card on ≥sm
                  "relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border border-purple-100 bg-white shadow-2xl " +
                  "p-4 sm:p-6 " +
                  // Height/scroll handling
                  "max-h-[85vh] sm:max-h-[80vh] overflow-y-auto overscroll-contain " +
                  // Safe areas on mobile
                  "pb-[max(1rem,env(safe-area-inset-bottom))]"
                }
              >
                {/* Close */}
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="Kapat"
                  className="absolute right-2.5 top-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-800"
                >
                  <FiX className="h-5 w-5" />
                </button>

                <div className="mb-4 sm:mb-6 pr-10">
                  <h3
                    id="donation-title"
                    className="text-lg sm:text-xl font-semibold text-purple-800"
                  >
                    MD Hesap Bilgileri
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Aşağıdan uygun hesabı seçip IBAN veya alıcı adını tek tıkla
                    kopyalayabilirsiniz.
                  </p>
                </div>

                {/* Accounts */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ACCOUNTS.map((acc, idx) => (
                    <div
                      key={acc.ibanDisplay}
                      className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 sm:p-4"
                    >
                      <Field label="Banka" value={acc.bank} />
                      <Field
                        label="Alıcı"
                        value={acc.holder}
                        onCopy={() => copy(`holder-${idx}`, acc.holder)}
                        copied={copied === `holder-${idx}`}
                      />
                      <a
                        href="https://instagram.com/mavidalga"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Field
                          label="IBAN"
                          value={acc.ibanDisplay}
                          mono
                          helper="IBAN almak için Instagram'dan bize yazın."
                        />
                      </a>

                      <div className="mt-3 rounded-lg border border-gray-100 bg-white p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Açıklama
                        </div>
                        <ul className="mt-2 list-disc pl-5 text-[15px] leading-relaxed text-gray-800">
                          {acc.notes.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Field = ({
  label,
  value,
  mono,
  onCopy,
  copied,
  helper,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  helper?: string;
}) => {
  return (
    <div className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white p-3">
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div
          className={`mt-1 text-gray-900 ${
            mono
              ? "font-mono text-[13.5px] tracking-tight break-all"
              : "text-[15px]"
          }`}
        >
          {value}
        </div>
        {helper ? (
          <div className="mt-1 text-xs text-gray-500">{helper}</div>
        ) : null}
      </div>
      {onCopy && (
        <button
          onClick={onCopy}
          className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      )}
    </div>
  );
};

export default DestekOl;
