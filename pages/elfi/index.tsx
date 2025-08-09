"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sprout,
  Shovel,
  Droplets,
  Hand,
  Sun,
  Moon,
  Coins,
  FlameKindling,
  RefreshCw,
  CloudSun,
  Zap,
  Pickaxe,
  Gamepad2,
  PackageOpen,
  Store,
} from "lucide-react";

/**
 * Stardew Village Lite — single-file mini game
 * - Small overworld: house, chest, farm patch, shop stand, trees, river+bridge
 * - WASD / Arrows to move, E/Space to interact, mobile D‑Pad
 * - Tools: Hoe, Water, Seed, Harvest, Pickaxe
 * - Day/Night, parallax, stars, autosave
 * - HUD fixed (high z-index), time slowed, day‑1 no energy drain
 */

/* ------------------------- Helpers & Types ------------------------- */
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const farmGreens = ["#1b5e20", "#2e7d32", "#43a047"] as const;

type Tool = "hoe" | "water" | "seed" | "harvest" | "pickaxe";
type Facing = "up" | "down" | "left" | "right";

type Crop = {
  stage: 0 | 1 | 2 | 3; // 3 = ready
  plantedAt: number;
  wateredToday: boolean;
};

type Tile = {
  tilled: boolean;
  wateredAt: number | null;
  crop: Crop | null;
  blocked?: boolean;
  type:
    | "grass"
    | "dirt"
    | "tree"
    | "water"
    | "bridge"
    | "house"
    | "door"
    | "stand"
    | "chest"
    | "path";
};

type GameState = {
  coins: number;
  energy: number;
  day: number;
  tool: Tool;
  seeds: number;
  rainToday: boolean;
};

const NEW_GAME: GameState = {
  coins: 25,
  energy: 100,
  day: 1,
  tool: "hoe",
  seeds: 12, // more forgiving start
  rainToday: false,
};

/* ----------------------------- Map ----------------------------- */
/** G=grass, P=path, T=trees (border), water row will be stamped later */
const MAP: string[] = [
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TGGGGGGGGGGGGGGGGGGGGGGGGGGT",
  "TGGGGGGGGGGGGGGGGGGGGGGGGGGT",
  "TGGGGGGGGGGGGGGGGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPPGGGGGGGGGGT",
  "TGGGGGGGGGPPPPPPPGGGGGGGGGGT",
  "TGGGGGGGGGPPPPPPPGGGGGGGGGGT", // <-- water row (will override)
  "TGGGGGGGGGPPPPPPPGGGGGGGGGGT",
  "TGGGGGGGGGPPPPPPPGGGGGGGGGGT",
  "TGGGGGGGGGPPPPPPPGGGGGGGGGGT",
  "TGGGGGGGGGPPPPPPPGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
  "TGGGGGGGGGGPPPPPGGGGGGGGGGGT",
];

const WORLD_ROWS = MAP.length;
const WORLD_COLS = MAP[0].length;

const FEATURES: Array<{ x: number; y: number; type: Tile["type"] }> = [
  // Bridge across the river (row 6)
  { x: 10, y: 6, type: "bridge" },
  { x: 11, y: 6, type: "bridge" },
  // House (3x3) + door + chest to the right
  { x: 6, y: 10, type: "house" },
  { x: 7, y: 10, type: "house" },
  { x: 8, y: 10, type: "house" },
  { x: 6, y: 11, type: "house" },
  { x: 7, y: 11, type: "door" },
  { x: 8, y: 11, type: "house" },
  { x: 6, y: 12, type: "house" },
  { x: 7, y: 12, type: "house" },
  { x: 8, y: 12, type: "house" },
  { x: 9, y: 11, type: "chest" },
  // Shop stand near center
  { x: 15, y: 9, type: "stand" },
];

export default function StardewVillage() {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const set = () => setIsMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const VIEW_COLS = isMobile ? 11 : 17;
  const VIEW_ROWS = isMobile ? 9 : 11;
  const TILE_PX = isMobile ? 40 : 48;

  /* ------------------------ Tiles (load/build/save) ------------------------ */
  const [tiles, setTiles] = useState<Tile[]>(() => {
    try {
      const saved = localStorage.getItem("sv-lite-tiles");
      if (saved) return JSON.parse(saved) as Tile[];
    } catch {}
    const base: Tile[] = [];
    for (let y = 0; y < WORLD_ROWS; y++) {
      for (let x = 0; x < WORLD_COLS; x++) {
        const c = MAP[y][x];
        let type: Tile["type"] =
          c === "T" ? "tree" : c === "P" ? "path" : "grass";
        base.push({
          tilled: false,
          wateredAt: null,
          crop: null,
          blocked: type === "tree",
          type,
        });
      }
    }
    // river on row 6
    for (let x = 0; x < WORLD_COLS; x++) {
      const idx = 6 * WORLD_COLS + x;
      base[idx].type = "water";
      base[idx].blocked = true;
    }
    // features
    for (const f of FEATURES) {
      const idx = f.y * WORLD_COLS + f.x;
      base[idx].type = f.type;
      base[idx].blocked =
        f.type === "tree" ||
        f.type === "house" ||
        f.type === "water" ||
        f.type === "stand" ||
        f.type === "chest"; // keep chest/stand blocked so you interact adjacent
    }
    // bridge unblocks water
    for (const f of FEATURES.filter((f) => f.type === "bridge")) {
      const idx = f.y * WORLD_COLS + f.x;
      base[idx].type = "bridge";
      base[idx].blocked = false;
    }
    // farm patch dirt
    for (let y = 13; y < 17; y++) {
      for (let x = 12; x < 20; x++) {
        const idx = y * WORLD_COLS + x;
        base[idx].type = "dirt";
        base[idx].blocked = false;
      }
    }
    return base;
  });

  useEffect(() => {
    try {
      localStorage.setItem("sv-lite-tiles", JSON.stringify(tiles));
    } catch {}
  }, [tiles]);

  /* -------------------------- Game state (save) --------------------------- */
  const [game, setGame] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem("sv-lite-game");
      if (saved) return JSON.parse(saved) as GameState;
    } catch {}
    return NEW_GAME;
  });
  useEffect(() => {
    try {
      localStorage.setItem("sv-lite-game", JSON.stringify(game));
    } catch {}
  }, [game]);

  /* ---------------------------- Time & Day ---------------------------- */
  const [time, setTime] = useState(6 * 60); // 06:00
  const [speed, setSpeed] = useState(100); // slower default (ms per minute)
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTime((t) => t + 1), speed);
    return () => clearInterval(id);
  }, [speed, paused]);

  useEffect(() => {
    if (time < 24 * 60) return;
    setTime(6 * 60);
    setGame((g) => ({
      ...g,
      day: g.day + 1,
      energy: Math.min(100, g.energy + 40),
      rainToday: Math.random() < 0.25,
    }));
    setTiles((arr) =>
      arr.map((t) => {
        let crop = t.crop;
        const wasWatered =
          t.wateredAt != null || game.rainToday || Math.random() < 0.1;
        if (crop) {
          const willGrow = wasWatered && crop.stage < 3;
          crop = {
            stage: (willGrow ? crop.stage + 1 : crop.stage) as 0 | 1 | 2 | 3,
            plantedAt: crop.plantedAt,
            wateredToday: false,
          };
        }
        return { ...t, wateredAt: null, crop };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const hour = Math.floor(time / 60) % 24;
  const minute = time % 60;
  const isNight = hour >= 20 || hour < 6;

  /* ----------------------------- Player ----------------------------- */
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem("sv-lite-player");
      if (saved)
        return JSON.parse(saved) as { x: number; y: number; facing: Facing };
    } catch {}
    return { x: 7, y: 13, facing: "down" as Facing }; // near the house
  });
  useEffect(() => {
    try {
      localStorage.setItem("sv-lite-player", JSON.stringify(player));
    } catch {}
  }, [player]);

  /* ----------------------------- Camera ----------------------------- */
  const camX = Math.max(
    0,
    Math.min(player.x - Math.floor(VIEW_COLS / 2), WORLD_COLS - VIEW_COLS)
  );
  const camY = Math.max(
    0,
    Math.min(player.y - Math.floor(VIEW_ROWS / 2), WORLD_ROWS - VIEW_ROWS)
  );

  /* ------------------------- Movement & Input ------------------------ */
  const moveCooldownRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      moveCooldownRef.current = Math.max(0, moveCooldownRef.current - 1);
    }, 16);
    return () => clearInterval(id);
  }, []);

  function canWalk(nx: number, ny: number) {
    if (nx < 0 || ny < 0 || nx >= WORLD_COLS || ny >= WORLD_ROWS) return false;
    const t = tiles[ny * WORLD_COLS + nx];
    if (!t) return false;
    return (
      !t.blocked &&
      t.type !== "water" &&
      t.type !== "house" &&
      t.type !== "stand" &&
      t.type !== "chest"
    );
  }

  function step(dx: number, dy: number) {
    if (paused) return;
    if (moveCooldownRef.current > 0) return;
    const facing: Facing =
      dx === 0 && dy === -1
        ? "up"
        : dy === 1
          ? "down"
          : dx === -1
            ? "left"
            : "right";
    const nx = player.x + dx;
    const ny = player.y + dy;
    setPlayer((p) => ({ ...p, facing }));
    if (!canWalk(nx, ny)) return;
    setPlayer((p) => ({ ...p, x: nx, y: ny, facing }));
    moveCooldownRef.current = 1; // smoother
  }

  function stepByKey(key: string) {
    if (key === "ArrowUp" || key === "w" || key === "W") step(0, -1);
    if (key === "ArrowDown" || key === "s" || key === "S") step(0, 1);
    if (key === "ArrowLeft" || key === "a" || key === "A") step(-1, 0);
    if (key === "ArrowRight" || key === "d" || key === "D") step(1, 0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused) return;
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          "W",
          "A",
          "S",
          "D",
        ].includes(e.key)
      ) {
        e.preventDefault();
        stepByKey(e.key);
      } else if (e.key === "e" || e.key === "E" || e.key === " ") {
        e.preventDefault();
        interact();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, game, tiles, paused]);

  function inBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && x < WORLD_COLS && y < WORLD_ROWS;
  }

  function frontTile(p = player) {
    const dx = p.facing === "left" ? -1 : p.facing === "right" ? 1 : 0;
    const dy = p.facing === "up" ? -1 : p.facing === "down" ? 1 : 0;
    const x = p.x + dx;
    const y = p.y + dy;
    if (!inBounds(x, y)) return null;
    const i = y * WORLD_COLS + x;
    return { i, x, y, t: tiles[i] };
  }

  /* -------------------------- Interactions -------------------------- */
  const canSpendEnergy = (g: GameState) => g.day > 1; // day 1: no energy drain

  function spendEnergy(cost: number) {
    setGame((g) => ({
      ...g,
      energy: canSpendEnergy(g) ? Math.max(0, g.energy - cost) : g.energy,
    }));
  }

  function till(i: number) {
    setTiles((arr) =>
      arr.map((t, idx) =>
        idx === i ? { ...t, tilled: true, blocked: false } : t
      )
    );
    spendEnergy(2);
  }

  function water(i: number) {
    setTiles((arr) =>
      arr.map((t, idx) =>
        idx === i
          ? {
              ...t,
              wateredAt: Date.now(),
              crop: t.crop ? { ...t.crop, wateredToday: true } : t.crop,
            }
          : t
      )
    );
    spendEnergy(1);
  }

  function plant(i: number) {
    if (game.seeds <= 0) return;
    setTiles((arr) =>
      arr.map((t, idx) =>
        idx === i
          ? t.crop
            ? t
            : {
                ...t,
                crop: { stage: 0, plantedAt: Date.now(), wateredToday: false },
              }
          : t
      )
    );
    setGame((g) => ({ ...g, seeds: g.seeds - 1 }));
    spendEnergy(2);
  }

  function harvest(i: number) {
    setTiles((arr) =>
      arr.map((t, idx) => (idx === i ? { ...t, crop: null, tilled: true } : t))
    );
    setGame((g) => ({ ...g, coins: g.coins + 6 }));
  }

  function unearth(i: number) {
    setTiles((arr) =>
      arr.map((t, idx) =>
        idx === i ? { ...t, tilled: false, wateredAt: null, crop: null } : t
      )
    );
    spendEnergy(1);
  }

  function interact() {
    const p = player;

    // Easier shop/chest adjacency (4-way)
    const neighbors = [
      { x: p.x + 1, y: p.y },
      { x: p.x - 1, y: p.y },
      { x: p.x, y: p.y + 1 },
      { x: p.x, y: p.y - 1 },
    ].filter(({ x, y }) => inBounds(x, y));

    const neighTiles = neighbors.map(({ x, y }) => ({
      x,
      y,
      t: tiles[y * WORLD_COLS + x],
    }));

    const nearbyStand = neighTiles.find((c) => c.t?.type === "stand");
    const nearbyChest = neighTiles.find((c) => c.t?.type === "chest");
    const nearbyDoor = neighTiles.find((c) => c.t?.type === "door");

    if (nearbyStand) {
      if (game.coins >= 4) {
        setGame((g) => ({ ...g, coins: g.coins - 4, seeds: g.seeds + 1 }));
      }
      return;
    }
    if (nearbyChest) {
      setGame((g) =>
        g.coins >= 10
          ? { ...g, coins: g.coins - 10 }
          : { ...g, coins: g.coins + 10 }
      );
      return;
    }
    if (nearbyDoor) {
      setGame((g) => ({ ...g, energy: Math.min(100, g.energy + 10) }));
      return;
    }

    // Farming with the exact front tile
    const front = frontTile();
    if (!front) return;
    const { i, t } = front;

    if (game.energy <= 0 && game.tool !== "harvest") return;

    if (game.tool === "hoe") {
      if (!t.tilled && !t.blocked && (t.type === "dirt" || t.type === "grass"))
        till(i);
    } else if (game.tool === "water") {
      if (t.tilled || t.crop) water(i);
    } else if (game.tool === "seed") {
      if ((t.tilled || t.type === "dirt") && !t.crop && game.seeds > 0)
        plant(i);
    } else if (game.tool === "harvest") {
      if (t.crop?.stage === 3) harvest(i);
    } else if (game.tool === "pickaxe") {
      if (t.tilled || t.crop) unearth(i);
    }
  }

  function onTileClick(i: number) {
    if (paused) return;
    // Click to interact if adjacent
    const tx = i % WORLD_COLS;
    const ty = Math.floor(i / WORLD_COLS);
    if (!inBounds(tx, ty)) return;
    const dx = tx - player.x;
    const dy = ty - player.y;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return;
    const facing: Facing =
      dx === -1 ? "left" : dx === 1 ? "right" : dy === -1 ? "up" : "down";
    setPlayer((p) => ({ ...p, facing }));
    interact();
  }

  function buySeeds(n = 1) {
    const cost = 4 * n;
    if (game.coins < cost) return;
    setGame((g) => ({ ...g, coins: g.coins - cost, seeds: g.seeds + n }));
  }

  function resetGame() {
    setGame(NEW_GAME);
    setTiles((prev) =>
      prev.map((t) => ({
        ...t,
        tilled: false,
        wateredAt: null,
        crop: null,
      }))
    );
    setTime(6 * 60);
    setPlayer({ x: 7, y: 13, facing: "down" });
  }

  /* --------------------------- Pretty bits -------------------------- */
  // Stars + aurora accent
  const stars = useMemo(
    () =>
      range(isMobile ? 60 : 120).map((i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 55,
        size: Math.random() * 1.6 + 0.8,
        delay: Math.random() * 5,
      })),
    [isMobile]
  );
  const [accent, setAccent] = useState("#6ee7b7");
  useEffect(() => {
    const palette = ["#6ee7b7", "#93c5fd", "#fca5a5", "#fde68a", "#c4b5fd"];
    const id = setInterval(() => {
      setAccent(palette[Math.floor(Math.random() * palette.length)]);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  // Onboarding overlay
  const [showTut, setShowTut] = useState<boolean>(() => {
    try {
      return !localStorage.getItem("sv-lite-seen-tut");
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (!showTut) {
      try {
        localStorage.setItem("sv-lite-seen-tut", "1");
      } catch {}
    }
  }, [showTut]);

  const front = frontTile();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0b0c1a] via-[#17132a] to-[#091015] text-white">
      {/* overlays */}
      <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(transparent_0_2px,rgba(255,255,255,0.03)_3px,transparent_4px)] mix-blend-soft-light opacity-30" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_60px_rgba(0,0,0,0.9)]" />

      {/* sky */}
      <Aurora accent={accent} reduced={!!prefersReduced} />
      {isNight && <StarField stars={stars} reduced={!!prefersReduced} />}
      <ParallaxMountains reduced={!!prefersReduced} night={isNight} />
      <MeadowWaves isMobile={isMobile} />

      {/* HUD (high z-index) */}
      <Hud
        coins={game.coins}
        energy={game.energy}
        day={game.day}
        hour={hour}
        minute={minute}
        isNight={isNight}
        rain={game.rainToday}
        onSpeed={setSpeed}
        speed={speed}
        paused={paused}
        setPaused={setPaused}
        onReset={resetGame}
      />

      {/* Tool dock */}
      <ControlDock
        tool={game.tool}
        setTool={(tool) => setGame((g) => ({ ...g, tool }))}
        seeds={game.seeds}
        onBuyOne={() => buySeeds(1)}
        onBuyPack={() => buySeeds(5)}
      />

      {/* WORLD */}
      <div className="relative z-10 mx-auto mt-[16vh] flex max-w-[95vw] items-center justify-center px-2 sm:px-4">
        <div className="relative rounded-xl border border-white/10 bg-black/10 p-2 backdrop-blur-[1px]">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${VIEW_COLS}, ${TILE_PX}px)`,
              gap: 6,
            }}
          >
            {(() => {
              const vis: { t: Tile; x: number; y: number; i: number }[] = [];
              for (let y = camY; y < camY + VIEW_ROWS; y++) {
                for (let x = camX; x < camX + VIEW_COLS; x++) {
                  const i = y * WORLD_COLS + x;
                  vis.push({ t: tiles[i], x, y, i });
                }
              }
              return vis.map(({ t, i }) => (
                <TileView
                  key={i}
                  tile={t}
                  onClick={() => onTileClick(i)}
                  night={isNight}
                  reduced={!!prefersReduced}
                  px={TILE_PX}
                />
              ));
            })()}
          </div>

          {/* Front-tile highlight */}
          <FrontTileHighlight
            front={front ? { x: front.x, y: front.y } : null}
            camX={camX}
            camY={camY}
            tilePx={TILE_PX}
          />

          {/* Player */}
          <div
            className="pointer-events-none absolute left-2 top-2"
            style={{
              transform: `translate(${(player.x - camX) * (TILE_PX + 6)}px, ${(player.y - camY) * (TILE_PX + 6)}px)`,
              transition: "transform 120ms linear",
              width: TILE_PX,
              height: TILE_PX,
            }}
          >
            <PlayerSprite facing={player.facing} night={isNight} />
          </div>
        </div>
      </div>

      {/* Hints for special tiles */}
      <ActionHints player={player} tiles={tiles} frontTile={front} />

      {/* Tutorial */}
      {showTut && <TutorialOverlay onClose={() => setShowTut(false)} />}

      {/* Mobile controls */}
      <MobilePad
        show={isMobile}
        onDir={(dx, dy) => step(dx, dy)}
        onAction={() => interact()}
      />
    </div>
  );
}

/* ================================ UI ================================ */

function Hud({
  coins,
  energy,
  day,
  hour,
  minute,
  isNight,
  rain,
  onSpeed,
  speed,
  paused,
  setPaused,
  onReset,
}: {
  coins: number;
  energy: number;
  day: number;
  hour: number;
  minute: number;
  isNight: boolean;
  rain: boolean;
  onSpeed: (v: number) => void;
  speed: number;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  onReset: () => void;
}) {
  const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
  return (
    <div className="fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[9999] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4">
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          {isNight ? <Moon className="size-4" /> : <Sun className="size-4" />}
          <span className="font-mono">{timeStr}</span>
        </div>
        <div className="mx-2 h-3 w-28 sm:w-32 overflow-hidden rounded bg-black/30">
          <div
            className="h-full bg-emerald-400"
            style={{ width: `${energy}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <Coins className="size-4" /> {coins}
        </div>
        <div className="text-xs sm:text-sm">Day {day}</div>
        <div className="hidden sm:flex items-center gap-1 text-xs sm:text-sm opacity-80">
          <CloudSun className="size-4" />
          {rain ? "Rain" : "Clear"}
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className={`rounded-lg px-2 py-1 text-xs ${paused ? "bg-yellow-500/30" : "bg-black/30"}`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <label className="hidden sm:flex items-center gap-1 text-xs">
          <Zap className="size-4" />
          Speed
          <input
            aria-label="Speed"
            type="range"
            min={30}
            max={160}
            value={speed}
            onChange={(e) => onSpeed(Number(e.target.value))}
            className="ml-2"
          />
        </label>
        <button
          onClick={onReset}
          className="hidden sm:flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs"
        >
          <RefreshCw className="size-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

function ControlDock({
  tool,
  setTool,
  seeds,
  onBuyOne,
  onBuyPack,
}: {
  tool: Tool;
  setTool: (t: Tool) => void;
  seeds: number;
  onBuyOne: () => void;
  onBuyPack: () => void;
}) {
  const Btn = ({
    id,
    icon,
    label,
  }: {
    id: Tool;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      onClick={() => setTool(id)}
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs sm:text-sm ${tool === id ? "bg-green-500/30" : "bg-black/30"}`}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4">
        <Btn
          id="hoe"
          icon={<Shovel className="size-3 sm:size-4" />}
          label="Hoe"
        />
        <Btn
          id="water"
          icon={<Droplets className="size-3 sm:size-4" />}
          label="Water"
        />
        <Btn
          id="seed"
          icon={<Sprout className="size-3 sm:size-4" />}
          label={`Seed (${seeds})`}
        />
        <Btn
          id="harvest"
          icon={<Hand className="size-3 sm:size-4" />}
          label="Harvest"
        />
        <Btn
          id="pickaxe"
          icon={<Pickaxe className="size-3 sm:size-4" />}
          label="Pickaxe"
        />
        <div className="ml-1 hidden sm:flex items-center gap-2 text-xs sm:text-sm opacity-90">
          <FlameKindling className="size-4" /> Shop:
          <button
            onClick={onBuyOne}
            className="rounded bg-black/30 px-2 py-0.5"
          >
            +1 Seed (4)
          </button>
          <button
            onClick={onBuyPack}
            className="rounded bg-black/30 px-2 py-0.5"
          >
            +5 (20)
          </button>
        </div>
      </div>
    </div>
  );
}

function TileView({
  tile,
  onClick,
  night,
  reduced,
  px,
}: {
  tile: Tile;
  onClick: () => void;
  night: boolean;
  reduced: boolean;
  px: number;
}) {
  const baseGrass =
    "linear-gradient(180deg,#345d2c 0%,#2a4a24 60%,#1e371b 100%)";
  const dirt =
    "repeating-linear-gradient(45deg,#5a3d22 0 6px,#6e4a28 6px 12px)";
  const tree =
    "radial-gradient(circle at 40% 40%, #305c2a, #254722 60%, #183016)";
  const water = "linear-gradient(180deg,#1b5f9e,#0f4578)";
  const bridge =
    "repeating-linear-gradient(0deg,#8a5f31 0 4px,#6b4a26 4px 8px)";
  const house = "linear-gradient(180deg,#c7c5c3,#a8a7a6)";
  const path =
    "repeating-linear-gradient(45deg,#826d52 0 6px,#6b5942 6px 12px)";
  const chest = "linear-gradient(180deg,#a7743b,#6b4a26)";
  const stand = "linear-gradient(180deg,#9a845f,#7f6845)";

  let bg = baseGrass;
  if (tile.type === "dirt") bg = dirt;
  else if (tile.type === "tree") bg = tree;
  else if (tile.type === "water") bg = water;
  else if (tile.type === "bridge") bg = bridge;
  else if (tile.type === "house") bg = house;
  else if (tile.type === "path") bg = path;
  else if (tile.type === "chest") bg = chest;
  else if (tile.type === "stand") bg = stand;
  else if (tile.type === "door") bg = house;

  const watered = tile.wateredAt != null;
  const crop = tile.crop;

  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-[3px] focus:outline-none focus:ring-2 focus:ring-white/60"
      style={{ background: bg, width: px, height: px, position: "relative" }}
      whileTap={{ scale: 0.96 }}
      title={
        tile.type === "stand"
          ? "Shop stand"
          : tile.type === "chest"
            ? "Chest"
            : undefined
      }
    >
      {/* moisture shine */}
      {watered && tile.type !== "water" && (
        <motion.span
          className="absolute inset-0 rounded-[3px]"
          style={{
            background: "linear-gradient(180deg, #73c6ff33, #2aa1ff22)",
          }}
          animate={reduced ? {} : { opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      )}

      {/* crop stages */}
      {crop && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {crop.stage === 0 && (
            <div className="h-2 w-2 rounded-[2px] bg-emerald-300" />
          )}
          {crop.stage === 1 && (
            <div className="h-3 w-3 rounded-[2px] bg-emerald-400" />
          )}
          {crop.stage === 2 && (
            <div className="h-4 w-4 rounded-[2px] bg-emerald-500" />
          )}
          {crop.stage === 3 && (
            <motion.div
              className="h-5 w-5 rounded-[3px] bg-[conic-gradient(#ffd166,#ffa600,#ffd166)] shadow-[0_0_6px_rgba(255,214,102,0.8)]"
              animate={reduced ? {} : { rotate: [0, 6, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              title="Harvest!"
            />
          )}
        </motion.div>
      )}

      {/* icons */}
      {tile.type === "stand" && (
        <Store className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 opacity-90" />
      )}
      {tile.type === "chest" && (
        <PackageOpen className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 opacity-90" />
      )}

      {/* night overlay */}
      {night && <div className="absolute inset-0 rounded-[3px] bg-black/15" />}
    </motion.button>
  );
}

function PlayerSprite({ facing, night }: { facing: Facing; night: boolean }) {
  const scaleX = facing === "left" ? -1 : 1;
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      style={{
        transformOrigin: "center",
        filter: night ? "brightness(0.9)" : undefined,
      }}
    >
      <Image
        src="/fakir.jpeg"
        alt="Fakir"
        fill
        style={{
          objectFit: "cover",
          borderRadius: 4,
          transform: `scaleX(${scaleX})`,
        }}
        className="pointer-events-none select-none rounded-[4px] shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
        sizes="(max-width: 640px) 40px, 48px"
        priority
      />
    </motion.div>
  );
}

function ActionHints({
  frontTile,
}: {
  player: { x: number; y: number; facing: Facing };
  tiles: Tile[];
  frontTile: { i: number; x: number; y: number; t: Tile } | null;
}) {
  if (!frontTile) return null;
  const { t } = frontTile;
  let hint: string | null = null;
  if (t.type === "stand") hint = "E/Action: Buy seed (+1 for 4c)";
  if (t.type === "chest") hint = "E/Action: Deposit/withdraw 10c";
  if (t.type === "door") hint = "E/Action: Rest (+Energy)";
  if (!hint) return null;

  return (
    <motion.div
      className="fixed left-1/2 top-[14vh] z-[5000] -translate-x-1/2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs sm:text-sm backdrop-blur"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {hint}
    </motion.div>
  );
}

function FrontTileHighlight({
  front,
  camX,
  camY,
  tilePx,
}: {
  front: { x: number; y: number } | null;
  camX: number;
  camY: number;
  tilePx: number;
}) {
  if (!front) return null;
  const { x, y } = front;
  return (
    <div
      className="pointer-events-none absolute left-2 top-2 z-20"
      style={{
        transform: `translate(${(x - camX) * (tilePx + 6)}px, ${(y - camY) * (tilePx + 6)}px)`,
        width: tilePx,
        height: tilePx,
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.85)",
        borderRadius: 4,
      }}
    />
  );
}

function MeadowWaves({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
      <WaveStrip
        fill={farmGreens[0]}
        height={isMobile ? 14 : 20}
        amplitude={10}
        speed={26}
        points={3}
        opacity={0.9}
      />
      <WaveStrip
        fill={farmGreens[1]}
        height={isMobile ? 12 : 18}
        amplitude={9}
        speed={22}
        points={4}
        opacity={0.8}
      />
      <WaveStrip
        fill={farmGreens[2]}
        height={isMobile ? 10 : 16}
        amplitude={8}
        speed={18}
        points={5}
        opacity={0.7}
      />
      <div className="h-16 sm:h-24 w-full bg-gradient-to-t from-[#061206] to-transparent" />
    </div>
  );
}

function WaveStrip({
  fill,
  height,
  amplitude,
  speed,
  points,
  opacity,
}: {
  fill: string;
  height: number;
  amplitude: number;
  speed: number;
  points: number;
  opacity: number;
}) {
  return (
    <motion.svg
      className="w-[110vw]"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      style={{ position: "relative", bottom: 0, opacity }}
      animate={{ x: [0, -100] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      <path
        d={`M0 ${20 - height} Q 25 ${20 - height - amplitude}, 50 ${20 - height} T 100 ${20 - height} V 20 H 0 Z`}
        fill={fill}
      />
    </motion.svg>
  );
}

function ParallaxMountains({
  reduced,
  night,
}: {
  reduced: boolean;
  night: boolean;
}) {
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
            fill={
              layer === 0
                ? night
                  ? "#152334"
                  : "#22324a"
                : night
                  ? "#1b2b40"
                  : "#2b3e5a"
            }
          />
        </motion.svg>
      ))}
    </>
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

function MobilePad({
  show,
  onDir,
  onAction,
}: {
  show: boolean;
  onDir: (dx: number, dy: number) => void;
  onAction: () => void;
}) {
  if (!show) return null;
  return (
    <div className="fixed bottom-24 left-4 z-30 flex items-center gap-6">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <PadBtn label="" onPress={() => {}} />
        <PadBtn label="▲" onPress={() => onDir(0, -1)} />
        <PadBtn label="" onPress={() => {}} />
        <PadBtn label="◀" onPress={() => onDir(-1, 0)} />
        <PadBtn label={<Gamepad2 className="size-4" />} onPress={() => {}} />
        <PadBtn label="▶" onPress={() => onDir(1, 0)} />
        <PadBtn label="" onPress={() => {}} />
        <PadBtn label="▼" onPress={() => onDir(0, 1)} />
        <PadBtn label="" onPress={() => {}} />
      </div>
      <button
        onClick={onAction}
        className="rounded-full bg-emerald-500/70 px-6 py-6 text-sm font-semibold shadow active:scale-95"
      >
        Action
      </button>
    </div>
  );
}
function PadBtn({
  label,
  onPress,
}: {
  label: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <button
      onClick={onPress}
      className="h-10 w-10 rounded bg-white/10 text-sm backdrop-blur active:scale-95"
    >
      <span className="select-none">{label}</span>
    </button>
  );
}

function TutorialOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-white/20 bg-white/10 p-5 text-sm">
        <h2 className="text-lg font-semibold mb-2">How to play</h2>
        <ul className="list-disc ml-5 space-y-1 opacity-90">
          <li>
            Move with <b>WASD</b> or arrow keys. On mobile, use the D‑Pad.
          </li>
          <li>
            Press <b>E</b> or <b>Space</b> to <b>use your tool</b> / interact.
          </li>
          <li>
            Pick a tool from the bottom dock: Hoe → Water → Seed → Water →
            Harvest.
          </li>
          <li>
            Face the <b>shop stand</b> to buy seeds. Face the <b>chest</b> to
            deposit/withdraw 10 coins.
          </li>
          <li>Day 1 has no energy drain. Time runs slower now — explore!</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 rounded-lg bg-emerald-500/70 px-3 py-1.5 text-sm font-semibold"
        >
          Let’s go
        </button>
      </div>
    </div>
  );
}
