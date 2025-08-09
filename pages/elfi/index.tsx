"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Wave from "react-wavify";
import {
  Sparkles,
  Music4,
  CloudSun,
  Settings2,
  Zap,
  Stars,
  Phone,
  Rainbow,
  CloudRain,
  Speaker,
  Trees,
  MountainSnow,
  SunMoon,
} from "lucide-react";

// --- THEME ---
const discoColors = [
  "#ff00ff",
  "#00ffff",
  "#ffff00",
  "#ff5200",
  "#00ff00",
  "#ff0000",
] as const;
const farmGreens = ["#1b5e20", "#2e7d32", "#43a047"] as const;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export default function StardewDiscoHome() {
  const [accent, setAccent] = useState(discoColors[0]);
  const [boogie, setBoogie] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const [showStars, setShowStars] = useState(true);
  const [showCritters, setShowCritters] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [eclipse, setEclipse] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  // Responsive flags
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const set = () => setIsMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Accent color cycler
  useEffect(() => {
    const id = setInterval(() => {
      setAccent(discoColors[Math.floor(Math.random() * discoColors.length)]);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Keyboard toggles
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "b") setBoogie((v) => !v);
      if (k === "p") setShowParticles((v) => !v);
      if (k === "c") setShowClouds((v) => !v);
      if (k === "r") setShowRain((v) => !v);
      if (k === "s") setShowStars((v) => !v);
      if (k === "x") setShowCritters((v) => !v);
      if (k === "m") toggleMusic();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Periodic lunar eclipse for extra drama
  useEffect(() => {
    const id = setInterval(() => setEclipse((v) => !v), 14000);
    return () => clearInterval(id);
  }, []);

  // Music control
  const toggleMusic = () => {
    const el = audioRef.current;
    if (!el) return;
    if (musicOn) {
      el.pause();
      setMusicOn(false);
    } else {
      el.play().catch(() => {});
      setMusicOn(true);
    }
  };

  // Densities tuned for mobile
  const starCount = isMobile ? 70 : 150;
  const fireflyCount = isMobile ? 10 : 24;
  const fenceCount = isMobile ? 12 : 26;
  const cropCols = isMobile ? 10 : 18;
  const cropRows = isMobile ? 2 : 3;

  const stars = useMemo(
    () =>
      range(starCount).map((i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 55,
        size: Math.random() * 1.8 + 0.8,
        delay: Math.random() * 5,
      })),
    [starCount]
  );

  const fireflies = useMemo(
    () =>
      range(fireflyCount).map((i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 20 + 6,
        size: Math.random() * 5 + 3,
        duration: Math.random() * 6 + 5,
        delay: Math.random() * 4,
      })),
    [fireflyCount]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0b0c1a] via-[#17132a] to-[#091015] text-white">
      {/* ACCESSIBILITY: hidden audio (optional chiptune). Put /chiptune.mp3 in public/ to enable */}
      <audio ref={audioRef} src="/chiptune.mp3" loop preload="none" />

      {/* Scanlines + vignette */}
      <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(transparent_0_2px,rgba(255,255,255,0.03)_3px,transparent_4px)] mix-blend-soft-light opacity-30" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_50px_rgba(0,0,0,0.9)]" />

      {/* Dynamic aurora sky */}
      <Aurora accent={accent} reduced={!!prefersReducedMotion} />

      {/* Radial sky glow */}
      <div
        className="absolute -top-40 left-1/2 h-[65vw] max-h-[640px] w-[65vw] max-w-[640px] -translate-x-1/2 rounded-full blur-3xl opacity-40"
        style={{
          background: `radial-gradient(closest-side, ${accent}, transparent 70%)`,
        }}
      />

      {/* Parallax backdrops */}
      {showClouds && (
        <ParallaxClouds color={accent} speedScale={isMobile ? 0.7 : 1} />
      )}
      <ParallaxMountains reduced={!!prefersReducedMotion} />

      {/* Stars & Shooting stars */}
      {showStars && (
        <StarField stars={stars} reduced={!!prefersReducedMotion} />
      )}
      {showStars && <ShootingStars reduced={!!prefersReducedMotion} />}

      {/* Moon + occasional eclipse overlay */}
      <Moon eclipse={eclipse} reduced={!!prefersReducedMotion} />

      {/* Title sign */}
      <HeaderSign isMobile={isMobile} />

      {/* Tap-to-boogie overlayer (mobile) */}
      <button
        aria-label="Toggle Boogie"
        className="absolute inset-0 z-10 block h-full w-full cursor-default touch-manipulation sm:hidden"
        onClick={() => setBoogie((v) => !v)}
      />

      {/* Center stage (your image stays the star) */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-3 sm:px-6">
        <motion.div
          className="relative"
          animate={
            boogie && !prefersReducedMotion
              ? { scale: [1, 1.06, 0.98, 1.05, 1] }
              : {}
          }
          transition={
            boogie ? { duration: 2.1, repeat: Infinity, ease: "easeInOut" } : {}
          }
        >
          {/* Kaleidoscope halo */}
          <motion.div
            className="absolute -inset-6 sm:-inset-10 -z-10 rounded-[1.4rem] sm:rounded-[2rem] opacity-70 blur-2xl"
            style={{
              background: `conic-gradient(from 0deg, ${discoColors.join(", ")})`,
            }}
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />

          {/* Frame + Image */}
          <div
            className="rounded-[1.2rem] sm:rounded-[2rem] border-4 sm:border-8"
            style={{
              borderColor: accent,
              boxShadow: `0 0 30px ${accent}, inset 0 0 18px ${accent}66`,
            }}
          >
            <motion.img
              src="/fakir.jpeg"
              alt="Party Image"
              className="max-h-[56vh] sm:max-h-[70vh] max-w-[94vw] rounded-[0.9rem] sm:rounded-[1.4rem] object-cover shadow-2xl"
              style={{
                imageRendering: "pixelated",
                filter: "saturate(1.2) contrast(1.06)",
              }}
              animate={prefersReducedMotion ? {} : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Confetti pixels when boogie */}
          <PixelConfetti
            active={boogie && showParticles}
            reduced={!!prefersReducedMotion}
            light={accent}
            mobile={isMobile}
          />

          {/* Butterflies & Critters */}
          {showCritters && (
            <Butterflies mobile={isMobile} reduced={!!prefersReducedMotion} />
          )}
        </motion.div>
      </div>

      {/* Rainbow arc */}
      {boogie && (
        <RainbowArc accent={accent} reduced={!!prefersReducedMotion} />
      )}

      {/* Meadow waves + crops */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <Wave
          fill={farmGreens[0]}
          paused={false}
          options={{
            height: isMobile ? 14 : 20,
            amplitude: 10,
            speed: 0.25,
            points: 3,
          }}
          className="opacity-90"
        />
        <Wave
          fill={farmGreens[1]}
          paused={false}
          options={{
            height: isMobile ? 12 : 18,
            amplitude: 9,
            speed: 0.35,
            points: 4,
          }}
          className="-mt-2 opacity-80"
        />
        <Wave
          fill={farmGreens[2]}
          paused={false}
          options={{
            height: isMobile ? 10 : 16,
            amplitude: 8,
            speed: 0.45,
            points: 5,
          }}
          className="-mt-4 opacity-70"
        />
        <div className="h-16 sm:h-24 w-full bg-gradient-to-t from-[#061206] to-transparent" />
      </div>

      {/* Fences */}
      <Fences count={fenceCount} />

      {/* Crop tiles grid (Stardew vibe) */}
      <CropTiles
        cols={cropCols}
        rows={cropRows}
        reduced={!!prefersReducedMotion}
      />

      {/* Critters: chickens + scarecrow + bouncing junimo */}
      {showCritters && (
        <>
          <Chickens mobile={isMobile} />
          <Scarecrow boogie={boogie} />
          <Junimo reduced={!!prefersReducedMotion} />
        </>
      )}

      {/* Pixel rain (hearts) */}
      {showRain && <PixelRain reduced={!!prefersReducedMotion} />}

      {/* Control dock */}
      <ControlDock
        boogie={boogie}
        setBoogie={setBoogie}
        showParticles={showParticles}
        setShowParticles={setShowParticles}
        showClouds={showClouds}
        setShowClouds={setShowClouds}
        showRain={showRain}
        setShowRain={setShowRain}
        showStars={showStars}
        setShowStars={setShowStars}
        showCritters={showCritters}
        setShowCritters={setShowCritters}
        musicOn={musicOn}
        toggleMusic={toggleMusic}
      />

      {/* Status chip (desktop) */}
      <motion.div
        className="absolute bottom-6 right-4 z-20 hidden sm:block rounded-2xl border-2 border-white/20 bg-white/10 p-4 backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      >
        <div className="flex items-center gap-2">
          <CloudSun className="size-5" />
          <span className="text-sm font-medium">Boogie Mode:</span>
          <span
            className={`ml-1 rounded px-2 py-0.5 text-xs ${boogie ? "bg-green-500/30" : "bg-red-500/30"}`}
          >
            {boogie ? "ON" : "OFF"}
          </span>
        </div>
        <p className="mt-1 text-xs opacity-80">
          Scanlines • aurora • parallax mountains • rainbow • crops • critters
        </p>
      </motion.div>
    </div>
  );
}

// --- Components ---
function HeaderSign({ isMobile }: { isMobile: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-6 z-20 w-[min(92vw,760px)] -translate-x-1/2 select-none px-3 sm:px-0"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
    >
      <div className="mx-auto rounded-xl sm:rounded-2xl border-4 border-[#6b4f2a] bg-[linear-gradient(135deg,#c79652_0%,#a9743f_40%,#8b5e34_100%)] p-2 shadow-[0_8px_0_#3e2a14,0_16px_32px_rgba(0,0,0,0.5)]">
        <div className="rounded-lg sm:rounded-xl border-4 border-[#3e2a14] bg-[repeating-linear-gradient(45deg,#b6864d_0_10px,#a16f3c_10px_20px)] p-2 sm:p-3">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Sparkles className="size-5 sm:size-6" />
            <h1
              className="font-mono text-center text-xl sm:text-4xl tracking-[0.08em] sm:tracking-[0.12em] drop-shadow-[0_2px_0_#3e2a14]"
              style={{ imageRendering: "pixelated" }}
            >
              Stardew Disco Night ++
            </h1>
            <Music4 className="size-5 sm:size-6" />
          </div>
          <p className="mt-1 text-center text-xs opacity-90">
            {isMobile ? (
              <>
                Tap anywhere to <b>Boogie</b> •{" "}
                <Phone className="inline size-3" />
              </>
            ) : (
              <>
                Press <kbd className="rounded bg-black/30 px-1">B</kbd> = Boogie
                • <kbd className="rounded bg-black/30 px-1">M</kbd> = Music
              </>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ControlDock(props: {
  boogie: boolean;
  setBoogie: (v: boolean | ((v: boolean) => boolean)) => void;
  showParticles: boolean;
  setShowParticles: (v: boolean | ((v: boolean) => boolean)) => void;
  showClouds: boolean;
  setShowClouds: (v: boolean | ((v: boolean) => boolean)) => void;
  showRain: boolean;
  setShowRain: (v: boolean | ((v: boolean) => boolean)) => void;
  showStars: boolean;
  setShowStars: (v: boolean | ((v: boolean) => boolean)) => void;
  showCritters: boolean;
  setShowCritters: (v: boolean | ((v: boolean) => boolean)) => void;
  musicOn: boolean;
  toggleMusic: () => void;
}) {
  const {
    boogie,
    setBoogie,
    showParticles,
    setShowParticles,
    showClouds,
    setShowClouds,
    showRain,
    setShowRain,
    showStars,
    setShowStars,
    showCritters,
    setShowCritters,
    musicOn,
    toggleMusic,
  } = props;
  return (
    <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4">
        <button
          onClick={() => setBoogie((v: any) => !v)}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs sm:text-sm ${boogie ? "bg-green-500/30" : "bg-black/30"}`}
        >
          <Zap className="size-3 sm:size-4" /> Boogie
        </button>
        <button
          onClick={() => setShowParticles((v: any) => !v)}
          className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs sm:text-sm"
        >
          <Stars className="size-3 sm:size-4" /> Particles
        </button>
        <button
          onClick={() => setShowClouds((v: any) => !v)}
          className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs sm:text-sm"
        >
          <Settings2 className="size-3 sm:size-4" /> Clouds
        </button>
        <button
          onClick={() => setShowRain((v: any) => !v)}
          className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs sm:text-sm"
        >
          <CloudRain className="size-3 sm:size-4" /> Hearts
        </button>
        <button
          onClick={() => setShowStars((v: any) => !v)}
          className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs sm:text-sm"
        >
          <SunMoon className="size-3 sm:size-4" /> Stars
        </button>
        <button
          onClick={() => setShowCritters((v: any) => !v)}
          className="hidden sm:flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs sm:text-sm"
        >
          <Trees className="size-3 sm:size-4" /> Critters
        </button>
        <button
          onClick={toggleMusic}
          className={`hidden sm:flex items-center gap-1 rounded-lg px-2 py-1 text-xs sm:text-sm ${musicOn ? "bg-green-500/30" : "bg-black/30"}`}
        >
          <Speaker className="size-3 sm:size-4" />{" "}
          {musicOn ? "Music On" : "Music Off"}
        </button>
      </div>
    </div>
  );
}

function ParallaxClouds({
  color,
  speedScale = 1,
}: {
  color: string;
  speedScale?: number;
}) {
  return (
    <>
      {[0, 1, 2].map((layer) => (
        <motion.svg
          key={layer}
          className="absolute left-0 top-0 h-[40vh] sm:h-[50vh] w-[250vw] -translate-y-6 opacity-[0.15]"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          style={{
            filter: `drop-shadow(0 0 24px ${color}44)`,
            imageRendering: "pixelated",
          }}
          animate={{ x: [0, -800] }}
          transition={{
            duration: (60 - layer * 10) / speedScale,
            repeat: Infinity,
            ease: "linear",
            delay: layer * 2,
          }}
        >
          <defs>
            <linearGradient
              id={`cloudGrad-${layer}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#d1e9ff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {range(12).map((i) => (
            <rect
              key={i}
              x={i * 70 + (layer % 2 === 0 ? 30 : 0)}
              y={(i % 3) * 30 + layer * 8}
              width={80}
              height={24}
              rx={4}
              fill={`url(#cloudGrad-${layer})`}
            />
          ))}
        </motion.svg>
      ))}
    </>
  );
}

function ParallaxMountains({ reduced }: { reduced: boolean }) {
  return (
    <>
      {[0, 1].map((layer) => (
        <motion.svg
          key={layer}
          className={`absolute bottom-[26vh] sm:bottom-[22vh] left-0 w-[200vw] ${layer === 0 ? "opacity-30" : "opacity-45"}`}
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          animate={reduced ? {} : { x: [0, -400] }}
          transition={{
            duration: 80 - layer * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M0 90 L100 40 L180 90 L260 55 L340 95 L420 50 L500 92 L580 60 L660 95 L740 70 L800 100 L800 120 L0 120 Z"
            fill={layer === 0 ? "#22324a" : "#2b3e5a"}
          />
        </motion.svg>
      ))}
    </>
  );
}

function StarField({
  stars,
  reduced,
}: {
  stars: {
    id: number;
    left: number;
    top: number;
    size: number;
    delay: number;
  }[];
  reduced: boolean;
}) {
  return (
    <>
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
          }}
          animate={reduced ? {} : { opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function ShootingStars({ reduced }: { reduced: boolean }) {
  return (
    <>
      {range(3).map((i) => (
        <motion.div
          key={i}
          className="absolute left-[10%] top-[12%] h-[2px] w-24"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff 60%, rgba(255,255,255,0) 100%)",
          }}
          animate={
            reduced ? {} : { x: [0, 900], y: [0, 120], opacity: [0, 1, 0] }
          }
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function Moon({ eclipse, reduced }: { eclipse: boolean; reduced: boolean }) {
  return (
    <>
      <motion.div
        className="absolute right-4 top-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#f7f2bf] shadow-[0_0_24px_8px_rgba(247,242,191,0.3)]"
        animate={
          reduced
            ? {}
            : {
                boxShadow: [
                  "0 0 12px 2px rgba(247,242,191,0.2)",
                  "0 0 28px 10px rgba(247,242,191,0.45)",
                  "0 0 12px 2px rgba(247,242,191,0.2)",
                ],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ imageRendering: "pixelated" }}
      />
      {/* Eclipse overlay */}
      <AnimatePresence>
        {eclipse && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function PixelConfetti({
  active,
  reduced,
  light,
  mobile,
}: {
  active: boolean;
  reduced: boolean;
  light: string;
  mobile: boolean;
}) {
  if (!active) return null;
  const count = mobile ? 36 : 72;
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {range(count).map((i) => (
        <motion.span
          key={i}
          className="absolute block h-2 w-2 rounded-[4px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: discoColors[i % discoColors.length],
            boxShadow: `0 0 10px ${discoColors[i % discoColors.length]}`,
            imageRendering: "pixelated",
          }}
          animate={
            reduced
              ? {}
              : {
                  y: [0, -40 - Math.random() * 50, 0],
                  rotate: [0, 45, -45, 0],
                  opacity: [0.7, 1, 0.7],
                  filter: [
                    "brightness(1)",
                    `brightness(1.6) drop-shadow(0_0_10px_${light})`,
                    "brightness(1)",
                  ],
                }
          }
          transition={{
            duration: 3.6 + Math.random() * 2.6,
            repeat: Infinity,
            delay: Math.random() * 1.6,
          }}
        />
      ))}
    </motion.div>
  );
}

function Butterflies({
  mobile,
  reduced,
}: {
  mobile: boolean;
  reduced: boolean;
}) {
  const count = mobile ? 4 : 8;
  return (
    <>
      {range(count).map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-3 w-4 sm:h-4 sm:w-6 -translate-x-1/2 -translate-y-1/2"
          style={{ imageRendering: "pixelated" }}
          initial={{
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 120,
            opacity: 0.7,
          }}
          animate={
            reduced
              ? {}
              : {
                  x: [null as any, (Math.random() - 0.5) * 260],
                  y: [null as any, (Math.random() - 0.5) * 160],
                  rotate: [0, 10, -10, 0],
                }
          }
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200" />
            <motion.div
              className="absolute right-\[90%] top-1/2 h-3 w-2 -translate-y-1/2 rounded-l-full bg-pink-300"
              animate={reduced ? {} : { rotateY: [0, 180, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute left-\[90%] top-1/2 h-3 w-2 -translate-y-1/2 rounded-r-full bg-pink-400"
              animate={reduced ? {} : { rotateY: [180, 0, 180] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      ))}
    </>
  );
}

function Fences({ count = 24 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[64px] sm:bottom-[72px] z-10 flex items-end justify-center gap-1.5 px-3 sm:gap-2.5 sm:px-6">
      {range(count).map((i) => (
        <motion.div
          key={i}
          className="h-16 sm:h-24 w-2.5 sm:w-3 origin-bottom rounded-t-sm"
          style={{
            background:
              "linear-gradient(180deg,#a7743b 0%,#8a5f31 60%,#6b4a26 100%)",
            boxShadow: "inset 0 -6px 0 #3e2a14",
          }}
          animate={{ rotate: [0, (i % 3) - 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
}

function CropTiles({
  cols,
  rows,
  reduced,
}: {
  cols: number;
  rows: number;
  reduced: boolean;
}) {
  const tiles = useMemo(() => range(cols * rows), [cols, rows]);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[74px] sm:bottom-[88px] z-10 grid place-content-center">
      <div
        className="mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(10px, 32px))`,
          gap: 4,
        }}
      >
        {tiles.map((i) => (
          <motion.div
            key={i}
            className="h-5 w-5 sm:h-8 sm:w-8 rounded-[3px]"
            style={{
              background:
                "repeating-linear-gradient(45deg,#5a3d22 0 6px,#6e4a28 6px 12px)",
            }}
            animate={
              reduced
                ? {}
                : {
                    filter: [
                      "brightness(0.9)",
                      "brightness(1.2)",
                      "brightness(0.9)",
                    ],
                  }
            }
            transition={{ duration: 4 + (i % 5), repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

function Chickens({ mobile }: { mobile: boolean }) {
  const count = mobile ? 2 : 4;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex w-full justify-center gap-4 sm:gap-6">
      {range(count).map((i) => (
        <motion.div
          key={i}
          className="relative h-6 w-8 sm:h-8 sm:w-10"
          animate={{ y: [0, -2, 0] }}
          transition={{
            duration: 1.6 + Math.random(),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-yellow-200 shadow-[0_2px_0_rgba(0,0,0,0.2)]" />
          <div className="absolute right-[-6px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-4 border-l-8 border-y-transparent border-l-orange-400" />
          <div className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black" />
        </motion.div>
      ))}
    </div>
  );
}

function Scarecrow({ boogie }: { boogie: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-6 bottom-24 z-10 hidden select-none sm:block"
      animate={boogie ? { rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="h-14 w-12 rounded bg-gradient-to-b from-[#8b5e34] to-[#6b4a26] shadow-[0_2px_0_rgba(0,0,0,0.3)]" />
      <div className="-mt-10 ml-2 h-4 w-8 rounded-full bg-yellow-300 shadow" />
      <div className="-mt-8 ml-[-4px] h-1 w-20 bg-[#6b4a26]" />
    </motion.div>
  );
}

function Junimo({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute right-8 bottom-28 z-10 hidden select-none sm:block"
      animate={reduced ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="h-8 w-8 rounded-xl bg-fuchsia-400 shadow-[0_0_10px_rgba(255,0,255,0.6)]" />
    </motion.div>
  );
}

function PixelRain({ reduced }: { reduced: boolean }) {
  return (
    <>
      {range(24).map((i) => (
        <motion.div
          key={i}
          className="absolute left-[5%] top-0 h-3 w-3 rotate-45 rounded-[2px]"
          style={{
            background: i % 2 ? "#ff7ab6" : "#ffcfde",
            boxShadow: "0 0 8px rgba(255,122,182,0.8)",
          }}
          animate={
            reduced
              ? {}
              : { x: [i * 8, i * 18], y: [0, 900], opacity: [0.8, 0.8, 0] }
          }
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: (i % 6) * 0.4,
            ease: "easeIn",
          }}
        />
      ))}
    </>
  );
}

function RainbowArc({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-[18vh] z-0 h-64 w-[120vw] -translate-x-1/2"
      animate={reduced ? {} : { rotate: [0, 360] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      style={{
        background: `conic-gradient(${discoColors.join(", ")})`,
        maskImage:
          "radial-gradient(circle at center, transparent 40%, black 42%, black 58%, transparent 60%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, transparent 40%, black 42%, black 58%, transparent 60%)",
        opacity: 0.25,
        filter: `drop-shadow(0 0 12px ${accent})`,
      }}
    />
  );
}

function Aurora({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[48vh]"
      style={{
        background: `radial-gradient(120%_60% at 50% 0%, ${accent}22 0%, transparent 60%)`,
      }}
      animate={
        reduced
          ? {}
          : {
              filter: [
                "hue-rotate(0deg)",
                "hue-rotate(60deg)",
                "hue-rotate(0deg)",
              ],
            }
      }
      transition={{ duration: 18, repeat: Infinity }}
    />
  );
}
