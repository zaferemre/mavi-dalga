"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiX } from "react-icons/fi";
import TeamCard from "../../components/TeamCard";
import { getTeamMembers } from "../../sanity/lib/getTeam";

const spring = { type: "spring", stiffness: 320, damping: 30 };

export default function Ekibimiz() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTeamMembers();
        setMembers(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Esc + scroll-lock
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    if (selected) document.addEventListener("keydown", onKey);
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Ekibimiz</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-200 h-72 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <motion.div
              key={m._id}
              layoutId={`card-${m._id}`}
              onClick={() => setSelected(m)}
              className="cursor-pointer"
              transition={spring}
            >
              <TeamCard member={m} />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Kapat"
            />

            {/* Fixed, centered modal wrapper */}
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center px-4"
              initial={false}
              role="dialog"
              aria-modal="true"
              aria-labelledby="member-title"
              onClick={() => setSelected(null)}
            >
              <motion.div
                layoutId={`card-${selected._id}`}
                className="w-[min(92vw,900px)] max-h-[88vh] rounded-3xl overflow-hidden bg-white shadow-2xl relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
                transition={spring}
              >
                {/* Image */}
                <motion.div
                  layoutId={`img-${selected._id}`}
                  className="relative w-full aspect-[16/10] md:aspect-[16/8] bg-gray-100"
                  transition={spring}
                >
                  <img
                    src={selected.image?.asset?.url || "/logoBig.webp"}
                    alt={selected.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Name/Role */}
                  <motion.div
                    className="absolute left-4 top-4 md:left-6 md:top-6"
                    initial={{ y: -12, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { delay: 0.25, ...spring },
                    }}
                    exit={{
                      y: -12,
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    <div className="rounded-2xl bg-white/85 backdrop-blur px-4 py-3 shadow-sm">
                      <h2
                        id="member-title"
                        className="text-lg md:text-2xl font-bold tracking-tight text-gray-900"
                      >
                        {selected.name}
                      </h2>
                      <p className="text-xs md:text-sm text-gray-600">
                        {selected.role}
                      </p>
                    </div>
                  </motion.div>

                  {/* Close */}
                  <motion.button
                    onClick={() => setSelected(null)}
                    className="absolute right-3 top-3 md:right-4 md:top-4 rounded-full bg-white/90 hover:bg-white w-9 h-9 grid place-items-center shadow"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { delay: 0.08 },
                    }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    aria-label="Kapat"
                  >
                    <FiX className="text-xl text-gray-700" />
                  </motion.button>
                </motion.div>

                {/* Bio grows with card */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: { delay: 0.35, ...spring },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <p className="text-gray-700 leading-7">{selected.bio}</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
