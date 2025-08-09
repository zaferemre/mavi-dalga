"use client";

import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Shovel as ShovelIcon,
  Droplets as WaterIcon,
  Sprout as SeedIcon,
  Hand as HarvestIcon,
  Pickaxe as PickaxeIcon,
  Zap as EnergyIcon,
  Coins as CoinIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  CloudRain as RainIcon,
  Gamepad2 as GamepadIcon,
  Store as StoreIcon,
  Bed as BedIcon,
  MoveUpRight as ArrowIcon,
} from "lucide-react";

/**
 * Stardew Lite — Motion/Lucide Enhanced (single-file, drop-in)
 * - Keep /public/fakir.jpeg as the player image
 * - WASD/Arrows to move (grid step), Space to use tool
 * - 1..5 switch tools | E sleep | F buy seeds
 * - Mobile: on-screen D-Pad + Action
 * - Uses motion/react for tasteful animation, lucide-react for icons
 * - No external state libs; autosaves to localStorage
 */

// -------------------- Constants & Types --------------------
const DIRS = {
  up: { dx: 0, dy: -1, face: "up" as const },
  down: { dx: 0, dy: 1, face: "down" as const },
  left: { dx: -1, dy: 0, face: "left" as const },
  right: { dx: 1, dy: 0, face: "right" as const },
};

const TOOL = {
  HOE: "HOE",
  WATER: "WATER",
  SEED: "SEED",
  HARVEST: "HARVEST",
  PICKAXE: "PICKAXE",
} as const;
type Tool = keyof typeof TOOL;

type Tile =
  | { kind: "grass" }
  | { kind: "tilled"; watered?: boolean }
  | { kind: "crop"; stage: number; watered?: boolean }
  | { kind: "rock" }
  | { kind: "water" }
  | { kind: "floor" }
  | { kind: "mailbox" };

type Player = { x: number; y: number; face: keyof typeof DIRS };

type GameState = {
  day: number;
  time: number; // minutes since 0:00
  rainToday: boolean;
  coins: number;
  seeds: number;
  energy: number;
  tool: (typeof TOOL)[keyof typeof TOOL];
  map: Tile[][];
  player: Player;
};

const TILE_W = 32;
const WORLD_W = 28;
const WORLD_H = 18;
const MAX_ENERGY = 100;
const CROP_MAX_STAGE = 3; // 0..3
const SAVE_KEY = "stardew-lite-v2";

// -------------------- Helpers --------------------
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const randi = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + 1)) + a;

const faceRotation: Record<Player["face"], string> = {
  up: "rotate(0deg)",
  right: "rotate(90deg)",
  down: "rotate(180deg)",
  left: "rotate(270deg)",
};

function makeInitialMap(w: number, h: number): Tile[][] {
  const t: Tile[][] = new Array(h)
    .fill(null)
    .map(() => new Array(w).fill(0).map(() => ({ kind: "grass" }) as Tile));

  // Rocks
  for (let i = 0; i < (w * h) / 18; i++) {
    const x = randi(1, w - 2);
    const y = randi(3, h - 2);
    t[y][x] = { kind: "rock" };
  }
  // Pond
  const px = Math.floor(w * 0.7),
    py = Math.floor(h * 0.55);
  for (let yy = -1; yy <= 1; yy++)
    for (let xx = -2; xx <= 2; xx++)
      if (Math.abs(xx) + Math.abs(yy) <= 3)
        t[py + yy][px + xx] = { kind: "water" };

  // Cabin floor + mailbox
  const hx = Math.floor(w * 0.2),
    hy = Math.floor(h * 0.55);
  for (let yy = 0; yy < 3; yy++)
    for (let xx = 0; xx < 5; xx++) t[hy + yy][hx + xx] = { kind: "floor" };
  t[hy - 1][hx + 2] = { kind: "mailbox" };

  return t;
}

function reviveMap(serialized: Tile[][]) {
  return serialized.map((row) => row.map((t) => ({ ...t })));
}

function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GameState;
    return { ...s, map: reviveMap(s.map) };
  } catch {
    return null;
  }
}

function saveGame(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {}
}

function nextDay(s: GameState): GameState {
  const rained = s.rainToday;
  const map = s.map.map((row) =>
    row.map((t) => {
      if (t.kind === "crop") {
        const watered = t.watered || rained;
        const stage = Math.min(CROP_MAX_STAGE, t.stage + (watered ? 1 : 0));
        return { ...t, stage, watered: false };
      }
      if (t.kind === "tilled" && rained) return { ...t, watered: true };
      return { ...t };
    })
  );
  return {
    ...s,
    day: s.day + 1,
    time: 6 * 60,
    rainToday: Math.random() < 0.2,
    energy: MAX_ENERGY,
    map,
  };
}

const canWalk = (t: Tile | undefined) =>
  !!t && ["grass", "tilled", "crop", "floor", "mailbox"].includes(t.kind);

// -------------------- Reducer --------------------

type Action =
  | { type: "LOAD"; payload: GameState | null }
  | { type: "TICK"; minutes?: number }
  | { type: "MOVE"; dx: number; dy: number; face: Player["face"] }
  | { type: "SET_TOOL"; tool: GameState["tool"] }
  | { type: "INTERACT" }
  | { type: "SLEEP" }
  | { type: "BUY_SEEDS" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOAD":
      return action.payload || state;
    case "TICK": {
      const dt = action.minutes ?? 1;
      let time = state.time + dt;
      let s = { ...state, time };
      if (time >= 22 * 60) s = nextDay(s);
      return s;
    }
    case "MOVE": {
      const { dx, dy, face } = action;
      const x = clamp(state.player.x + dx, 0, WORLD_W - 1);
      const y = clamp(state.player.y + dy, 0, WORLD_H - 1);
      const tile = state.map[y][x];
      if (!canWalk(tile) || state.energy <= 0)
        return { ...state, player: { ...state.player, face } };
      const drain = tile.kind === "crop" ? 0.5 : 0.25;
      return {
        ...state,
        player: { x, y, face },
        energy: Math.max(0, state.energy - drain),
        time: state.time + 1,
      };
    }
    case "SET_TOOL":
      return { ...state, tool: action.tool };
    case "INTERACT": {
      const { player, tool, map } = state;
      const dir = DIRS[player.face] ?? DIRS.down;
      const tx = clamp(player.x + dir.dx, 0, WORLD_W - 1);
      const ty = clamp(player.y + dir.dy, 0, WORLD_H - 1);
      const t = map[ty][tx];
      const spend = (amt: number) => Math.max(0, state.energy - amt);

      if (tool === TOOL.HOE) {
        if (t.kind === "grass") {
          const nm = map.map((row) => row.slice());
          nm[ty][tx] = { kind: "tilled" };
          return { ...state, map: nm, energy: spend(2), time: state.time + 2 };
        }
      }
      if (tool === TOOL.SEED) {
        if (
          (t.kind === "tilled" || (t.kind === "crop" && t.stage === 0)) &&
          state.seeds > 0
        ) {
          const nm = map.map((row) => row.slice());
          nm[ty][tx] = { kind: "crop", stage: 0, watered: false };
          return {
            ...state,
            map: nm,
            seeds: state.seeds - 1,
            energy: spend(1),
            time: state.time + 1,
          };
        }
      }
      if (tool === TOOL.WATER) {
        if (t.kind === "crop" || t.kind === "tilled") {
          const nm = map.map((row) => row.slice());
          if (t.kind === "crop") nm[ty][tx] = { ...t, watered: true };
          else nm[ty][tx] = { kind: "tilled", watered: true };
          return { ...state, map: nm, energy: spend(1), time: state.time + 1 };
        }
      }
      if (tool === TOOL.HARVEST) {
        if (t.kind === "crop" && t.stage >= CROP_MAX_STAGE) {
          const nm = map.map((row) => row.slice());
          nm[ty][tx] = { kind: "tilled" };
          return {
            ...state,
            map: nm,
            coins: state.coins + 8,
            seeds: state.seeds + (Math.random() < 0.15 ? 1 : 0),
            energy: spend(1),
            time: state.time + 1,
          };
        }
      }
      if (tool === TOOL.PICKAXE) {
        if (t.kind === "rock") {
          const nm = map.map((row) => row.slice());
          nm[ty][tx] = { kind: "grass" };
          return {
            ...state,
            map: nm,
            coins: state.coins + 1,
            energy: spend(3),
            time: state.time + 3,
          };
        }
      }
      return state;
    }
    case "SLEEP":
      return nextDay(state);
    case "BUY_SEEDS":
      return state.coins >= 10
        ? { ...state, coins: state.coins - 10, seeds: state.seeds + 5 }
        : state;
    default:
      return state;
  }
}

const initialGame = (): GameState => ({
  day: 1,
  time: 8 * 60,
  rainToday: Math.random() < 0.15,
  coins: 50,
  seeds: 10,
  energy: MAX_ENERGY,
  tool: TOOL.HOE,
  map: makeInitialMap(WORLD_W, WORLD_H),
  player: {
    x: Math.floor(WORLD_W / 2),
    y: Math.floor(WORLD_H / 2),
    face: "down",
  },
});

// -------------------- Component --------------------
export default function StardewLiteEnhanced() {
  const [game, dispatch] = useReducer(
    reducer,
    null as unknown as GameState,
    () => (typeof window !== "undefined" && loadSave()) || initialGame()
  );
  const [pressed, setPressed] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const rafRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ vw: 960, vh: 540, scale: 1 });

  // Persist
  const saveRef = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (now - saveRef.current > 500) {
      saveRef.current = now;
      if (typeof window !== "undefined") saveGame(game);
    }
  }, [game]);

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "arrowup"].includes(k)) setPressed((p) => ({ ...p, up: true }));
      if (["s", "arrowdown"].includes(k))
        setPressed((p) => ({ ...p, down: true }));
      if (["a", "arrowleft"].includes(k))
        setPressed((p) => ({ ...p, left: true }));
      if (["d", "arrowright"].includes(k))
        setPressed((p) => ({ ...p, right: true }));
      if (k === " ") {
        e.preventDefault();
        dispatch({ type: "INTERACT" });
      }
      if (k === "1") dispatch({ type: "SET_TOOL", tool: TOOL.HOE });
      if (k === "2") dispatch({ type: "SET_TOOL", tool: TOOL.SEED });
      if (k === "3") dispatch({ type: "SET_TOOL", tool: TOOL.WATER });
      if (k === "4") dispatch({ type: "SET_TOOL", tool: TOOL.HARVEST });
      if (k === "5") dispatch({ type: "SET_TOOL", tool: TOOL.PICKAXE });
      if (k === "f") dispatch({ type: "BUY_SEEDS" });
      if (k === "e") dispatch({ type: "SLEEP" });
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "arrowup"].includes(k))
        setPressed((p) => ({ ...p, up: false }));
      if (["s", "arrowdown"].includes(k))
        setPressed((p) => ({ ...p, down: false }));
      if (["a", "arrowleft"].includes(k))
        setPressed((p) => ({ ...p, left: false }));
      if (["d", "arrowright"].includes(k))
        setPressed((p) => ({ ...p, right: false }));
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // Movement loop
  const stepCooldown = useRef(0);
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      if (now - stepCooldown.current > 110) {
        stepCooldown.current = now;
        if (pressed.up) dispatch({ type: "MOVE", ...DIRS.up });
        else if (pressed.down) dispatch({ type: "MOVE", ...DIRS.down });
        else if (pressed.left) dispatch({ type: "MOVE", ...DIRS.left });
        else if (pressed.right) dispatch({ type: "MOVE", ...DIRS.right });
        else dispatch({ type: "TICK", minutes: 0.1 });
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pressed]);

  // Measure viewport with ResizeObserver for perfect fit
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const vw = Math.min(960, el.clientWidth);
      const vh = Math.min(
        560,
        Math.max(380, Math.floor(window.innerHeight * 0.7))
      );
      const scale = Math.max(
        1,
        Math.floor(Math.min(vw / (WORLD_W * TILE_W), vh / (WORLD_H * TILE_W)))
      );
      setViewport({ vw, vh, scale });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const worldPx = WORLD_W * TILE_W * viewport.scale;
  const worldPy = WORLD_H * TILE_W * viewport.scale;

  // Camera follow
  const cam = useMemo(() => {
    const px = game.player.x * TILE_W * viewport.scale;
    const py = game.player.y * TILE_W * viewport.scale;
    const hw = (viewport.vw / 2) | 0;
    const hh = (viewport.vh / 2) | 0;
    return { x: px - hw, y: py - hh };
  }, [game.player.x, game.player.y, viewport]);

  // -------------- UI helpers --------------
  const minutesToClock = (m: number) => {
    const hh = Math.floor(m / 60) % 24;
    const mm = Math.floor(m % 60);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(hh)}:${pad(mm)}`;
  };

  const ToolBadge: React.FC<{
    t: GameState["tool"];
    active: boolean;
    onClick: () => void;
  }> = ({ t, active, onClick }) => {
    const Icon =
      t === TOOL.HOE
        ? ShovelIcon
        : t === TOOL.SEED
          ? SeedIcon
          : t === TOOL.WATER
            ? WaterIcon
            : t === TOOL.HARVEST
              ? HarvestIcon
              : PickaxeIcon;
    return (
      <motion.button
        onClick={onClick}
        title={t}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center w-11 h-11 rounded-xl border backdrop-blur-sm ${
          active
            ? "border-white/80 bg-white/10 shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]"
            : "border-white/30 bg-black/20"
        }`}
      >
        <Icon size={20} />
      </motion.button>
    );
  };

  const TileView: React.FC<{ t: Tile; x: number; y: number }> = ({
    t,
    x,
    y,
  }) => {
    const size = TILE_W;
    const bg =
      t.kind === "grass"
        ? "#3ba845"
        : t.kind === "tilled"
          ? "#7a4f2a"
          : t.kind === "rock"
            ? "#777"
            : t.kind === "water"
              ? "#58a6ff"
              : t.kind === "floor"
                ? "#8b6f47"
                : t.kind === "mailbox"
                  ? "#8b6f47"
                  : "#3ba845";

    return (
      <motion.div
        style={{
          position: "absolute",
          left: x * size,
          top: y * size,
          width: size,
          height: size,
        }}
        initial={false}
        animate={{ backgroundColor: bg }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="relative border border-black/10"
      >
        {t.kind === "water" && (
          <motion.div
            className="absolute inset-0 rounded-md"
            animate={{ opacity: [0.55, 0.75, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "#8fd0ff" }}
          />
        )}
        {t.kind === "rock" && (
          <div className="absolute left-1.5 top-2 w-5 h-3.5 rounded bg-neutral-300 shadow-inner" />
        )}
        {t.kind === "mailbox" && (
          <div className="absolute left-[10px] top-1 w-3 h-4 rounded bg-rose-600 ring-2 ring-white" />
        )}
        {t.kind === "crop" && (
          <div className="absolute inset-2 grid place-items-center">
            <motion.div
              className="rounded"
              style={{
                background: "#2ecc71",
                width: 6 + t.stage * 4,
                height: 6 + t.stage * 4,
              }}
              animate={{
                boxShadow: t.watered
                  ? "0 0 14px rgba(0,200,255,0.7)"
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.25 }}
            />
          </div>
        )}
      </motion.div>
    );
  };

  // Soft day/night gradient driven by time
  const dayPct = (game.time % (24 * 60)) / (24 * 60);
  const skyFrom = dayPct < 0.25 || dayPct > 0.8 ? "#0b1022" : "#87ceeb"; // night or day
  const skyTo = dayPct < 0.25 || dayPct > 0.8 ? "#1a2344" : "#a0d8ef";

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(${skyFrom}, ${skyTo} 35%, #78b159)`,
      }}
    >
      {/* Sticky HUD */}
      <div className="sticky top-0 z-50 px-3 py-2 flex items-center justify-between gap-2 bg-black/25 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <strong className="text-lg sm:text-xl">Stardew Lite</strong>
          <span className="opacity-90">Day {game.day}</span>
          <span className="opacity-90">• {minutesToClock(game.time)}</span>
          <AnimatePresence initial={false}>
            {game.rainToday && (
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <RainIcon size={18} className="inline ml-1" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" title="Coins">
            <CoinIcon size={18} />
            <span>{Math.floor(game.coins)}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Seeds">
            <SeedIcon size={18} />
            <span>{game.seeds}</span>
          </div>
          <div className="flex items-center gap-2 min-w-[140px]" title="Energy">
            <EnergyIcon size={18} />
            <div className="relative h-2 flex-1 rounded-full bg-white/25 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: game.energy > 30 ? "#5cf26a" : "#f25c5c" }}
                initial={false}
                animate={{ width: `${(game.energy / MAX_ENERGY) * 100}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              />
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => dispatch({ type: "BUY_SEEDS" })}
            className="px-3 py-1.5 rounded-lg border border-white/30 bg-black/25 hover:bg-black/35 flex items-center gap-2"
          >
            <StoreIcon size={16} /> Buy 5 <SeedIcon size={16} /> (10)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => dispatch({ type: "SLEEP" })}
            className="px-3 py-1.5 rounded-lg border border-white/30 bg-black/25 hover:bg-black/35 flex items-center gap-2"
          >
            <BedIcon size={16} /> Sleep
          </motion.button>
        </div>
      </div>

      {/* Tool Row */}
      <div className="sticky top-[44px] z-40 px-3 py-2 flex items-center justify-center gap-2">
        {Object.values(TOOL).map((t) => (
          <ToolBadge
            key={t}
            t={t}
            active={game.tool === t}
            onClick={() => dispatch({ type: "SET_TOOL", tool: t })}
          />
        ))}
        <span className="ml-2 text-xs sm:text-sm opacity-80 hidden sm:inline-flex items-center gap-1">
          <GamepadIcon size={14} /> Space: Action • 1-5 tools • E sleep • F buy
        </span>
      </div>

      {/* Game viewport */}
      <div ref={containerRef} className="flex justify-center p-2">
        <div
          className="relative rounded-xl overflow-hidden border-2 border-black/30 shadow-[0_10px_30px_rgba(0,0,0,0.35)] bg-[#6db14b]"
          style={{ width: viewport.vw, height: viewport.vh }}
        >
          {/* Ambient vignette */}
          <motion.div
            className="absolute inset-[-180px] pointer-events-none"
            animate={{ opacity: [0.25, 0.35, 0.25] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 60%)",
            }}
          />

          {/* World layer (scaled) */}
          <div
            className="absolute"
            style={{
              left: -cam.x,
              top: -cam.y,
              transform: `scale(${viewport.scale})`,
              transformOrigin: "0 0",
              width: worldPx,
              height: worldPy,
            }}
          >
            {/* Tiles */}
            <div
              className="absolute left-0 top-0"
              style={{ width: WORLD_W * TILE_W, height: WORLD_H * TILE_W }}
            >
              {game.map.map((row, y) =>
                row.map((t, x) => (
                  <TileView key={`t-${x}-${y}`} t={t} x={x} y={y} />
                ))
              )}
            </div>

            {/* Player */}
            <motion.div
              className="absolute grid place-items-center"
              style={{
                left: game.player.x * TILE_W,
                top: game.player.y * TILE_W,
                width: TILE_W,
                height: TILE_W,
                imageRendering: "pixelated" as any,
              }}
              animate={{ y: [0, -1, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/fakir.jpeg"
                alt="fakir"
                width={TILE_W}
                height={TILE_W}
                priority
                style={{
                  width: TILE_W,
                  height: TILE_W,
                  objectFit: "cover",
                  borderRadius: 6,
                  transform: faceRotation[game.player.face],
                  boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
                }}
              />
            </motion.div>

            {/* Rain bursts (also brief drizzle at :00 every few in-game hours) */}
            {(game.rainToday || Math.floor(game.time) % 200 < 20) && (
              <RainOverlay width={WORLD_W * TILE_W} height={WORLD_H * TILE_W} />
            )}
          </div>

          {/* Mobile controls */}
          <div className="absolute left-2 bottom-2 flex gap-3 select-none">
            <DPad
              onUp={(v) => setPressed((p) => ({ ...p, up: v }))}
              onDown={(v) => setPressed((p) => ({ ...p, down: v }))}
              onLeft={(v) => setPressed((p) => ({ ...p, left: v }))}
              onRight={(v) => setPressed((p) => ({ ...p, right: v }))}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onMouseDown={() => dispatch({ type: "INTERACT" })}
              onTouchStart={(e) => {
                e.preventDefault();
                dispatch({ type: "INTERACT" });
              }}
              className="w-[70px] h-[70px] rounded-full border-2 border-white/80 bg-black/35 text-white text-sm grid place-items-center"
            >
              Action
            </motion.button>
          </div>

          {/* Sun/Moon indicator */}
          <div className="absolute right-2 top-2 opacity-90">
            <motion.div
              initial={false}
              animate={{ rotate: dayPct * 360 }}
              transition={{ type: "spring", stiffness: 80, damping: 14 }}
              className="w-8 h-8 grid place-items-center rounded-full bg-black/25 border border-white/30"
              title="Day cycle"
            >
              {dayPct < 0.25 || dayPct > 0.8 ? (
                <MoonIcon size={16} />
              ) : (
                <SunIcon size={16} />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-center px-3 pb-3 opacity-85">
        <p>
          Tips: Hoe → tilled • Seed on tilled • Water daily • Harvest when big •
          Pickaxe breaks rocks • Sleep to pass the day • Rain waters everything.
        </p>
      </div>
    </div>
  );
}

// -------------------- Subcomponents --------------------
function DPad({
  onUp,
  onDown,
  onLeft,
  onRight,
}: {
  onUp: (v: boolean) => void;
  onDown: (v: boolean) => void;
  onLeft: (v: boolean) => void;
  onRight: (v: boolean) => void;
}) {
  const Btn: React.FC<{
    label: string;
    onPress: (v: boolean) => void;
    aria: string;
  }> = ({ label, onPress, aria }) => (
    <motion.button
      aria-label={aria}
      whileTap={{ scale: 0.96 }}
      onMouseDown={() => onPress(true)}
      onMouseUp={() => onPress(false)}
      onMouseLeave={() => onPress(false)}
      onTouchStart={(e) => {
        e.preventDefault();
        onPress(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onPress(false);
      }}
      className="w-10 h-10 rounded-xl border border-white/60 bg-black/25"
    >
      {label}
    </motion.button>
  );

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
      <div />
      <Btn label="▲" aria="Move up" onPress={onUp} />
      <div />
      <Btn label="◀" aria="Move left" onPress={onLeft} />
      <div className="w-10 h-10" />
      <Btn label="▶" aria="Move right" onPress={onRight} />
      <div />
      <Btn label="▼" aria="Move down" onPress={onDown} />
      <div />
    </div>
  );
}

function RainOverlay({ width, height }: { width: number; height: number }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: ((i * 97) % width) + randi(-10, 10),
        y: ((i * 67) % height) + randi(-10, 10),
        d: 12 + (i % 6),
      })),
    [width, height]
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            width: 1,
            height: d.d,
            background: "#9fdcff",
            transform: "rotate(15deg)",
          }}
          animate={{ y: [0, 6, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={{
            duration: 1.4 + (i % 10) * 0.04,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
