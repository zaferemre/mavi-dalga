import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const spring = { type: "spring", stiffness: 300, damping: 28 };

const KatkiYap = () => {
  const [lang, setLang] = useState("tr"); // "tr" | "en"
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const email = "info@mavidalga.org";
  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {}
  };

  return (
    <div className="relative">
      {/* Background */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-blue-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-64 bg-gradient-to-r from-fuchsia-300/40 via-purple-300/40 to-blue-300/40 blur-3xl"
      />

      <main className="mx-auto my-10 max-w-3xl px-4 sm:px-6">
        <motion.section
          ref={cardRef}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: spring }}
          className="rounded-2xl border border-purple-100 bg-white/70 p-6 sm:p-8 shadow-xl backdrop-blur-md"
        >
          {/* Top bar: language switch + quick actions */}
          <div className="mb-6 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-1 py-1">
              <button
                onClick={() => setLang("tr")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  lang === "tr"
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Türkçe
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  lang === "en"
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                English
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-800 active:translate-y-0"
              >
                {lang === "tr" ? "E‑posta Gönder" : "Send Email"}
              </a>
              <button
                onClick={onCopyEmail}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                {copied
                  ? lang === "tr"
                    ? "Kopyalandı"
                    : "Copied"
                  : lang === "tr"
                    ? "E‑postayı Kopyala"
                    : "Copy Email"}
              </button>
            </div>
          </div>

          <header className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
                {lang === "tr" ? "Katkı Yap" : "Contribute"}
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-gray-700">
              {lang === "tr"
                ? "Yazılarınızın dergide veya sitede yer almasını istiyorsanız Mavi Dalga’ya katkı yapın."
                : "If you want your writing to be featured in the magazine or on our site, contribute to Mavi Dalga."}
            </p>
          </header>

          {/* Animated content switch */}
          <AnimatePresence mode="wait">
            {lang === "tr" ? (
              <motion.div
                key="tr"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  filter: "blur(4px)",
                  transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                }}
                className="space-y-6 text-gray-800"
              >
                <SectionTitle>Nasıl katkı gönderebilirim?</SectionTitle>
                <p>
                  Öncelikle ürettiklerini bizimle paylaşmak istediğin için çok
                  mutluyuz. Katkı değerlendirmeleri{" "}
                  <strong>Yayın İlkelerimize</strong> uygun olarak yapılır.
                  Gönderimle birlikte bu ilkeleri okuduğunu ve kabul ettiğini
                  varsayarız.
                </p>

                <CardList
                  items={[
                    "Tüm katkılar ve iletiler info@mavidalga.org adresine gönderilmelidir.",
                    "Sitemize gönderilen katkılar sosyal medya hesaplarımızda tanıtılabilir. Yıllık sayılar için tanıtım editör inisiyatifindedir.",
                    "Kaynakça gereken yazılar, APA formatında bir kaynakça ile gönderilmelidir.",
                    "E‑postada isim, soyisim, fakülte ve tahmini mezuniyet tarihi yer almalıdır. Anonim/pseudonym talebi için bize yazabilirsiniz.",
                    "Katkılar Word veya Google Docs formatında olmalıdır. E‑posta gövdesine yapıştırılan metinler kabul edilmez.",
                    "Uzunluk, bir blog/dergi yazısı ölçüsünü aşmamalıdır.",
                    "Yazım ve noktalama kurallarına uygunluk gönderenden sorumludur.",
                    "Sorular ve geri bildirimler için info@mavidalga.org adresine yazabilirsiniz.",
                  ]}
                />
              </motion.div>
            ) : (
              <motion.div
                key="en"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  filter: "blur(4px)",
                  transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                }}
                className="space-y-6 text-gray-800"
              >
                <SectionTitle>How can I send contributions?</SectionTitle>
                <p>
                  We’re thrilled you’d like to share your work. Submissions are
                  evaluated in line with our{" "}
                  <strong>Publishing Guidelines</strong>. By submitting, you
                  confirm you’ve read and accepted them.
                </p>

                <CardList
                  items={[
                    "Send all contributions and messages to info@mavidalga.org.",
                    "Website submissions may be promoted on social media. Yearly issue promotions are at the editorial team’s discretion.",
                    "Works requiring references must include an APA‑formatted bibliography.",
                    "Include your name, surname, faculty, and expected graduation year. For anonymity/pseudonyms, email us.",
                    "Submit in Word or Google Docs format. Pasted email body text won’t be accepted.",
                    "Keep the length suitable for a blog/magazine article.",
                    "Check spelling and punctuation before submitting.",
                    "For questions/feedback, email info@mavidalga.org.",
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
};

/* ---------- Small UI helpers ---------- */

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-purple-800">{children}</h2>
);

const CardList = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
          transition={{ duration: 0.25, delay: i * 0.03 }}
          className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white/70 p-4 shadow-sm"
        >
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-white text-purple-700">
            ✓
          </span>
          <p className="text-[15px] leading-relaxed text-gray-800">{t}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default KatkiYap;
