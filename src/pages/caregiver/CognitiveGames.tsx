import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/caregiver/Sidebar";
import {
  Brain,
  Grid3x3,
  Type,
  Shapes,
  Star,
  Trophy,
  RotateCcw,
  Check,
  X,
  Hash,
  Palette,
  ChevronRight,
  Zap,
  Shield,
  Flame,
} from "lucide-react";

type GameId = "memory" | "word" | "attention" | "shape" | "number" | "simon";
type GameState = "idle" | "playing" | "finished";
type Level = 1 | 2 | 3;

interface Game {
  id: GameId;
  title: string;
  description: string;
  icon: typeof Brain;
  color: string;
  bg: string;
  gradient: string;
  category: string;
}

const games: Game[] = [
  {
    id: "memory",
    title: "Memory Match",
    description: "Retournez les cartes et trouvez les paires correspondantes.",
    icon: Grid3x3,
    color: "text-[#1a6fb5]",
    bg: "bg-[#eef4fb]",
    gradient: "from-[#1a6fb5] to-[#1254a0]",
    category: "Mémoire",
  },
  {
    id: "word",
    title: "Word Recall",
    description: "Mémorisez une liste de mots et rappelez-les.",
    icon: Type,
    color: "text-[#5b6fa8]",
    bg: "bg-[#eef0f7]",
    gradient: "from-[#5b6fa8] to-[#3d5088]",
    category: "Verbal",
  },
  {
    id: "attention",
    title: "Spot the Target",
    description: "Trouvez la cible parmi les distracteurs rapidement.",
    icon: Brain,
    color: "text-[#2a8c72]",
    bg: "bg-[#edf5f2]",
    gradient: "from-[#2a8c72] to-[#1a6b56]",
    category: "Attention",
  },
  {
    id: "shape",
    title: "Shape Sorting",
    description: "Classez les formes dans les bons emplacements.",
    icon: Shapes,
    color: "text-[#8c7a3a]",
    bg: "bg-[#f5f2ea]",
    gradient: "from-[#8c7a3a] to-[#6b5d2a]",
    category: "Spatial",
  },
  {
    id: "number",
    title: "Number Sequence",
    description: "Mémorisez et répétez une séquence de chiffres.",
    icon: Hash,
    color: "text-[#8c4a5a]",
    bg: "bg-[#f5eef0]",
    gradient: "from-[#8c4a5a] to-[#6b3344]",
    category: "Mémoire",
  },
  {
    id: "simon",
    title: "Simon Says",
    description: "Reproduisez la séquence de couleurs qui s'allonge.",
    icon: Palette,
    color: "text-[#7a5080]",
    bg: "bg-[#f2eef5]",
    gradient: "from-[#7a5080] to-[#5a3860]",
    category: "Séquence",
  },
];

const levelConfig = {
  1: {
    label: "Facile",
    icon: Shield,
    color: "text-[#2a8c72]",
    bg: "bg-[#edf5f2]",
    border: "border-emerald-300",
  },
  2: {
    label: "Moyen",
    icon: Zap,
    color: "text-[#8c7a3a]",
    bg: "bg-amber-100",
    border: "border-[#c8b870]",
  },
  3: {
    label: "Difficile",
    icon: Flame,
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-300",
  },
};

// ── MEMORY MATCH ───────────────────────────────────────────────
const EMOJI_POOL = [
  "🍎",
  "🐶",
  "🌸",
  "⭐",
  "🎈",
  "🦋",
  "🍓",
  "🌙",
  "🐠",
  "🌈",
  "🎭",
  "🦁",
  "🍦",
  "🚀",
  "🌺",
  "🎸",
];

function MemoryMatch({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number) => void;
}) {
  const pairCount = level === 1 ? 6 : level === 2 ? 8 : 10;
  const emojis = EMOJI_POOL.slice(0, pairCount);

  const [deck, setDeck] = useState(() =>
    [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const cols = level === 1 ? 4 : level === 2 ? 4 : 5;

  const flip = (id: number) => {
    if (selected.length === 2) return;
    if (deck[id].flipped || deck[id].matched) return;
    const newDeck = deck.map((c) =>
      c.id === id ? { ...c, flipped: true } : c,
    );
    const newSelected = [...selected, id];
    setDeck(newDeck);
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      if (newDeck[a].emoji === newDeck[b].emoji) {
        const matched = newDeck.map((c) =>
          c.id === a || c.id === b ? { ...c, matched: true } : c,
        );
        setDeck(matched);
        setSelected([]);
        const newMatches = matches + 1;
        setMatches(newMatches);
        if (newMatches === pairCount) {
          setTimeout(
            () =>
              onFinish(
                Math.max(
                  100 - moves * (level === 1 ? 3 : level === 2 ? 5 : 8),
                  40,
                ),
              ),
            500,
          );
        }
      } else {
        setTimeout(() => {
          setDeck((d) =>
            d.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c,
            ),
          );
          setSelected([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <span>
          Mouvements: <strong className="text-gray-800">{moves}</strong>
        </span>
        <span>
          Paires:{" "}
          <strong className="text-[#1a6fb5]">
            {matches}/{pairCount}
          </strong>
        </span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {deck.map((card) => (
          <button
            key={card.id}
            onClick={() => flip(card.id)}
            className={`w-14 h-14 rounded-xl text-2xl flex items-center justify-center transition-all duration-300 border-2 font-bold ${
              card.matched
                ? "bg-[#eef4fb] border-[#a8c8e8] scale-95"
                : card.flipped
                  ? "bg-white border-[#1a6fb5] shadow-md"
                  : "bg-gray-100 border-gray-200 hover:border-[#a8c8e8] hover:bg-gray-50"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── WORD RECALL ────────────────────────────────────────────────
const WORD_BANKS: Record<Level, string[]> = {
  1: ["Pomme", "Chaise", "Jardin", "Musique", "Soleil"],
  2: [
    "Rivière",
    "Château",
    "Papillon",
    "Horizon",
    "Lumière",
    "Forêt",
    "Étoile",
  ],
  3: [
    "Bibliothèque",
    "Mélodie",
    "Architecture",
    "Philosophie",
    "Constellation",
    "Équilibre",
    "Symphonie",
    "Mystère",
    "Panorama",
  ],
};

function WordRecall({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number) => void;
}) {
  const words = WORD_BANKS[level];
  const displayTime = level === 1 ? 6 : level === 2 ? 5 : 4;
  const [phase, setPhase] = useState<"memorize" | "countdown" | "recall">(
    "memorize",
  );
  const [countdown, setCountdown] = useState(displayTime);
  const [input, setInput] = useState("");
  const [recalled, setRecalled] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      const t = setTimeout(() => setPhase("recall"), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const addWord = () => {
    const w = input.trim();
    if (!w || recalled.map((r) => r.toLowerCase()).includes(w.toLowerCase()))
      return;
    setRecalled((prev) => [...prev, w]);
    setInput("");
  };

  const submit = () => {
    setSubmitted(true);
    const correct = recalled.filter((w) =>
      words.map((x) => x.toLowerCase()).includes(w.toLowerCase()),
    ).length;
    setTimeout(
      () => onFinish(Math.round((correct / words.length) * 100)),
      1500,
    );
  };

  if (phase === "memorize")
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-gray-500 text-center">
          Mémorisez ces <strong>{words.length} mots</strong>. Vous aurez{" "}
          {displayTime}s pour les retenir.
        </p>
        <div className="flex flex-wrap gap-3 justify-center max-w-md">
          {words.map((w) => (
            <span
              key={w}
              className="px-4 py-2 rounded-xl bg-[#eef0f7] text-[#3d5088] font-semibold text-base"
            >
              {w}
            </span>
          ))}
        </div>
        <button
          onClick={() => setPhase("countdown")}
          className="px-8 py-3 rounded-xl text-white font-medium text-sm bg-gradient-to-r from-[#5b6fa8] to-[#3d5088]"
        >
          Commencer le compte à rebours →
        </button>
      </div>
    );

  if (phase === "countdown")
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500">Mémorisez !</p>
        <div className="flex flex-wrap gap-3 justify-center max-w-md mb-2">
          {words.map((w) => (
            <span
              key={w}
              className="px-4 py-2 rounded-xl bg-[#eef0f7] text-[#3d5088] font-semibold text-base"
            >
              {w}
            </span>
          ))}
        </div>
        <div className="w-20 h-20 rounded-full border-4 border-violet-400 flex items-center justify-center">
          <span className="text-3xl font-black text-[#5b6fa8]">
            {countdown}
          </span>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500">
        Tapez les mots dont vous vous souvenez :
      </p>
      <div className="flex gap-2 w-full max-w-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addWord()}
          placeholder="Tapez un mot..."
          disabled={submitted}
          className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5b6fa8]"
        />
        <button
          onClick={addWord}
          disabled={submitted}
          className="px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-[#5b6fa8] disabled:opacity-40"
        >
          Ajouter
        </button>
      </div>
      <div className="flex flex-wrap gap-2 justify-center min-h-8">
        {recalled.map((w) => {
          const correct = words
            .map((x) => x.toLowerCase())
            .includes(w.toLowerCase());
          return (
            <span
              key={w}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${submitted ? (correct ? "bg-[#edf5f2] text-[#2a8c72]" : "bg-red-100 text-red-500") : "bg-[#eef0f7] text-[#5b6fa8]"}`}
            >
              {submitted && (correct ? <Check size={12} /> : <X size={12} />)}
              {w}
            </span>
          );
        })}
      </div>
      {!submitted && recalled.length > 0 && (
        <button
          onClick={submit}
          className="px-8 py-3 rounded-xl text-white font-medium text-sm bg-gradient-to-r from-[#5b6fa8] to-[#3d5088]"
        >
          Valider
        </button>
      )}
      {submitted && (
        <p className="text-sm text-gray-500">
          Mots corrects :{" "}
          <strong className="text-[#5b6fa8]">
            {
              recalled.filter((w) =>
                words.map((x) => x.toLowerCase()).includes(w.toLowerCase()),
              ).length
            }
            /{words.length}
          </strong>
        </p>
      )}
    </div>
  );
}

// ── ATTENTION ──────────────────────────────────────────────────
const TARGETS_LIST = ["🌟", "🎯", "🔴", "🦄", "🍀"];
const ALL_EMOJIS_POOL = [
  "🔵",
  "🟢",
  "🟡",
  "⬛",
  "🔶",
  "🔷",
  "🟣",
  "⬜",
  "🟤",
  "🔸",
  "🔹",
  "🔺",
  "🔻",
  "💠",
  "🔘",
  "🔲",
];

function AttentionGame({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number) => void;
}) {
  const gridSize = level === 1 ? 12 : level === 2 ? 20 : 30;
  const targetCount = level === 3 ? 2 : 1;

  const [targets] = useState(() =>
    TARGETS_LIST.slice(0, targetCount).sort(() => Math.random() - 0.5),
  );
  const [targetIndices] = useState(() => {
    const indices: number[] = [];
    while (indices.length < targetCount) {
      const idx = Math.floor(Math.random() * gridSize);
      if (!indices.includes(idx)) indices.push(idx);
    }
    return indices;
  });
  const [grid] = useState(() =>
    Array.from({ length: gridSize }, (_, i) => {
      const tIdx = targetIndices.indexOf(i);
      return tIdx >= 0
        ? targets[tIdx]
        : ALL_EMOJIS_POOL[Math.floor(Math.random() * ALL_EMOJIS_POOL.length)];
    }),
  );
  const [found, setFound] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState(false);

  const click = (idx: number) => {
    if (found.includes(idx)) return;
    setAttempts((a) => a + 1);
    if (targetIndices.includes(idx)) {
      const newFound = [...found, idx];
      setFound(newFound);
      if (newFound.length === targetCount) {
        setTimeout(
          () =>
            onFinish(
              Math.max(
                100 - attempts * (level === 1 ? 10 : level === 2 ? 15 : 20),
                30,
              ),
            ),
          600,
        );
      }
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 400);
    }
  };

  const cols = level === 1 ? 4 : level === 2 ? 5 : 6;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 bg-[#edf5f2] px-5 py-2.5 rounded-xl border border-[#c0ddd6]">
        <span className="text-sm text-gray-600">Trouvez :</span>
        {targets.map((t) => (
          <span key={t} className="text-3xl">
            {t}
          </span>
        ))}
        <span className="text-sm text-gray-400">
          ({found.length}/{targetCount})
        </span>
      </div>
      <div
        className={`grid gap-1.5 transition-all ${wrong ? "opacity-40" : ""}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((emoji, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all border-2 ${
              found.includes(i)
                ? "bg-[#edf5f2] border-[#2a8c72] scale-90"
                : "bg-gray-50 border-gray-200 hover:border-[#2a8c72] hover:bg-[#edf5f2]"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400">Tentatives : {attempts}</p>
    </div>
  );
}

// ── SHAPE SORTING ──────────────────────────────────────────────
const ALL_SHAPES = [
  { id: "circle", label: "⬤", name: "Cercle" },
  { id: "square", label: "■", name: "Carré" },
  { id: "triangle", label: "▲", name: "Triangle" },
  { id: "star", label: "★", name: "Étoile" },
  { id: "diamond", label: "◆", name: "Losange" },
  { id: "pentagon", label: "⬠", name: "Pentagone" },
];

// Different colors per level so shapes can't be matched by color on level 3
const SHAPE_COLORS_L1 = ["bg-[#f5f2ea] border-[#c8b870] text-[#8c7a3a]"]; // same color for all
const SHAPE_COLORS_L3 = [
  "bg-[#eef4fb] border-[#1a6fb5] text-[#1a6fb5]",
  "bg-[#edf5f2] border-[#2a8c72] text-[#2a8c72]",
  "bg-[#f5eef0] border-[#8c4a5a] text-[#8c4a5a]",
  "bg-[#f2eef5] border-[#7a5080] text-[#7a5080]",
  "bg-[#f5f2ea] border-[#8c7a3a] text-[#8c7a3a]",
  "bg-[#eef0f7] border-[#5b6fa8] text-[#5b6fa8]",
];

function ShapeSorting({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number) => void;
}) {
  const shapeCount = level === 1 ? 4 : level === 2 ? 5 : 6;
  const shapes = ALL_SHAPES.slice(0, shapeCount);
  const timerStart = level === 3 ? 30 : null;

  const [items, setItems] = useState(() =>
    [...shapes].sort(() => Math.random() - 0.5),
  );
  const [slots, setSlots] = useState<Record<string, string | null>>(
    Object.fromEntries(shapes.map((s) => [s.id, null])),
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(timerStart);
  const [finished, setFinished] = useState(false);

  // Timer for level 3
  useEffect(() => {
    if (timeLeft === null || finished) return;
    if (timeLeft <= 0) {
      const correct = shapes.filter((s) => slots[s.id] === s.id).length;
      setTimeout(() => {
        setFinished(true);
        onFinish(Math.round((correct / shapes.length) * 100));
      }, 0);
      return;
    }
    const t = setTimeout(
      () => setTimeLeft((l) => (l !== null ? l - 1 : null)),
      1000,
    );
    return () => clearTimeout(t);
  }, [timeLeft, finished, shapes, slots, onFinish]);

  const drop = (slotId: string) => {
    if (!dragging || finished) return;
    if (Object.values(slots).includes(dragging)) return;
    const newSlots = { ...slots, [slotId]: dragging };
    setSlots(newSlots);
    setItems((prev) => prev.filter((s) => s.id !== dragging));
    setDragging(null);
    if (shapes.every((s) => newSlots[s.id] !== null)) {
      setFinished(true);
      const correct = shapes.filter((s) => newSlots[s.id] === s.id).length;
      setTimeout(
        () => onFinish(Math.round((correct / shapes.length) * 100)),
        500,
      );
    }
  };

  const cols = level === 1 ? 4 : 3;

  // Assign a color to each shape item (only varies on level 3)
  const colorMap = Object.fromEntries(
    shapes.map((s, i) => [
      s.id,
      level === 3
        ? SHAPE_COLORS_L3[i % SHAPE_COLORS_L3.length]
        : SHAPE_COLORS_L1[0],
    ]),
  );

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center">
        {level === 1 &&
          "Faites glisser chaque forme vers son emplacement (les emplacements sont étiquetés)."}
        {level === 2 &&
          "Faites glisser chaque forme vers son emplacement (sans étiquette)."}
        {level === 3 &&
          "Faites glisser chaque forme vers son emplacement — attention aux couleurs et au timer !"}
      </p>

      {/* Timer — level 3 only */}
      {level === 3 && timeLeft !== null && (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
            timeLeft <= 10
              ? "bg-red-100 text-red-600"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          ⏱ {timeLeft}s
        </div>
      )}

      {/* Draggable shapes */}
      <div className="flex gap-3 flex-wrap justify-center">
        {items.map((shape) => (
          <div
            key={shape.id}
            draggable
            onDragStart={() => setDragging(shape.id)}
            className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl cursor-grab hover:scale-105 transition-all shadow-sm ${colorMap[shape.id]}`}
          >
            {shape.label}
          </div>
        ))}
      </div>

      {/* Drop slots */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {shapes.map((shape) => (
          <div
            key={shape.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(shape.id)}
            className={`w-14 h-14 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-0.5 transition-all ${
              slots[shape.id]
                ? slots[shape.id] === shape.id
                  ? "border-[#2a8c72] bg-[#edf5f2]"
                  : "border-red-400 bg-red-50"
                : "border-gray-300 hover:border-[#8c7a3a] hover:bg-[#f5f2ea]"
            }`}
          >
            {slots[shape.id] ? (
              <span className="text-2xl">
                {shapes.find((s) => s.id === slots[shape.id])?.label}
              </span>
            ) : level === 1 ? (
              <span className="text-[10px] text-gray-400 text-center leading-tight">
                {shape.name}
              </span>
            ) : (
              <span className="text-lg text-gray-200">{shape.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NUMBER SEQUENCE ────────────────────────────────────────────
function NumberSequence({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number) => void;
}) {
  const length = level === 1 ? 4 : level === 2 ? 6 : 8;
  const [sequence] = useState(() =>
    Array.from({ length }, () => Math.floor(Math.random() * 9) + 1),
  );
  const [phase, setPhase] = useState<"show" | "input">("show");
  const [showIdx, setShowIdx] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (phase !== "show") return;
    if (showIdx >= sequence.length) {
      const t = setTimeout(() => setPhase("input"), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setShowIdx((i) => i + 1),
      level === 1 ? 900 : level === 2 ? 700 : 550,
    );
    return () => clearTimeout(t);
  }, [phase, showIdx, sequence.length, level]);

  const check = () => {
    const userSeq = input.trim().replace(/\s+/g, "").split("").map(Number);
    const isCorrect = userSeq.join("") === sequence.join("");
    setCorrect(isCorrect);
    setSubmitted(true);
    setTimeout(
      () =>
        onFinish(
          isCorrect
            ? 100
            : (input
                .trim()
                .split("")
                .filter((c, i) => parseInt(c) === sequence[i]).length /
                sequence.length) *
                100,
        ),
      1200,
    );
  };

  if (phase === "show")
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-gray-500">Mémorisez la séquence :</p>
        <div className="flex gap-3 items-center min-h-16">
          {sequence.map((n, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                i < showIdx
                  ? "bg-[#f2eaed] text-[#8c4a5a] scale-110"
                  : "bg-gray-100 text-transparent"
              }`}
            >
              {n}
            </div>
          ))}
        </div>
        {showIdx >= sequence.length && (
          <p className="text-xs text-gray-400 animate-pulse">
            Prêt pour la saisie...
          </p>
        )}
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-gray-500">
        Saisissez la séquence dans l'ordre ({length} chiffres) :
      </p>
      <div className="flex gap-2 items-center">
        {sequence.map((n, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all ${
              submitted
                ? parseInt(input.replace(/\s/g, "")[i]) === sequence[i]
                  ? "border-[#2a8c72] bg-[#edf5f2] text-emerald-700"
                  : "border-red-400 bg-red-50 text-red-600"
                : "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {input.replace(/\s/g, "")[i] || (submitted ? n : "")}
          </div>
        ))}
      </div>
      {!submitted && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value.replace(/[^0-9]/g, "").slice(0, length))
            }
            onKeyDown={(e) =>
              e.key === "Enter" && input.length === length && check()
            }
            placeholder="Ex: 4721..."
            maxLength={length}
            className="bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8c4a5a] text-center tracking-widest font-mono text-lg w-40"
          />
          <button
            onClick={check}
            disabled={input.replace(/\s/g, "").length < length}
            className="px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-[#8c4a5a] disabled:opacity-40"
          >
            OK
          </button>
        </div>
      )}
      {submitted && (
        <p
          className={`text-sm font-semibold ${correct ? "text-[#2a8c72]" : "text-red-500"}`}
        >
          {correct
            ? "🎉 Parfait !"
            : `La séquence était : ${sequence.join(" ")}`}
        </p>
      )}
    </div>
  );
}

// ── SIMON SAYS ─────────────────────────────────────────────────
const SIMON_COLORS = [
  { id: "red", bg: "bg-[#b85555]", active: "bg-[#d4a0a0]" },
  { id: "blue", bg: "bg-[#1a6fb5]", active: "bg-[#7ab0d8]" },
  { id: "green", bg: "bg-[#2a8c72]", active: "bg-[#7ac4b0]" },
  { id: "yellow", bg: "bg-[#c8a840]", active: "bg-[#e8d898]" },
];

function SimonSays({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number) => void;
}) {
  const maxLength = level === 1 ? 5 : level === 2 ? 8 : 12;
  const speed = level === 1 ? 700 : level === 2 ? 550 : 400;

  const [sequence, setSequence] = useState<string[]>([]);
  const [userSeq, setUserSeq] = useState<string[]>([]);
  const [phase, setPhase] = useState<
    "start" | "show" | "input" | "win" | "fail"
  >("start");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  const showSequence = useCallback(
    (seq: string[]) => {
      setPhase("show");
      let i = 0;
      const interval = setInterval(() => {
        if (i >= seq.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("input"), 300);
          return;
        }
        setActiveColor(seq[i]);
        setTimeout(() => setActiveColor(null), speed * 0.6);
        i++;
      }, speed);
    },
    [speed],
  );

  const startRound = useCallback(
    (prevSeq: string[]) => {
      const newSeq = [
        ...prevSeq,
        SIMON_COLORS[Math.floor(Math.random() * SIMON_COLORS.length)].id,
      ];
      setSequence(newSeq);
      setUserSeq([]);
      setRound((r) => r + 1);
      setTimeout(() => showSequence(newSeq), 600);
    },
    [showSequence],
  );

  const handleClick = (colorId: string) => {
    if (phase !== "input") return;
    const newUserSeq = [...userSeq, colorId];
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);
    const idx = newUserSeq.length - 1;
    if (colorId !== sequence[idx]) {
      setPhase("fail");
      setTimeout(() => onFinish(Math.round((round / maxLength) * 100)), 800);
      return;
    }
    if (newUserSeq.length === sequence.length) {
      if (sequence.length >= maxLength) {
        setPhase("win");
        setTimeout(() => onFinish(100), 800);
        return;
      }
      setUserSeq([]);
      setTimeout(() => startRound(sequence), 800);
    } else {
      setUserSeq(newUserSeq);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {phase === "start" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 text-center">
            Regardez la séquence s'allumer, puis reproduisez-la. Elle s'allonge
            à chaque tour !
          </p>
          <button
            onClick={() => startRound([])}
            className="px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#7a5080] to-[#5a3860]"
          >
            Démarrer →
          </button>
        </div>
      )}
      {phase !== "start" && (
        <>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              Tour <strong className="text-gray-800">{round}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span
              className={`font-medium ${
                phase === "show"
                  ? "text-amber-500 animate-pulse"
                  : phase === "input"
                    ? "text-[#2a8c72]"
                    : phase === "win"
                      ? "text-[#1a6fb5]"
                      : "text-red-500"
              }`}
            >
              {phase === "show"
                ? "Observez..."
                : phase === "input"
                  ? "Votre tour !"
                  : phase === "win"
                    ? "🏆 Gagné !"
                    : "❌ Raté !"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SIMON_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleClick(c.id)}
                disabled={phase !== "input"}
                className={`w-24 h-24 rounded-2xl transition-all duration-150 border-4 border-white/30 shadow-lg ${
                  activeColor === c.id
                    ? c.active + " scale-95 shadow-none"
                    : c.bg
                } ${phase === "input" ? "hover:scale-105 cursor-pointer" : "cursor-default"}`}
              />
            ))}
          </div>
          <div className="flex gap-1.5 items-center">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i < userSeq.length ? "bg-[#7a5080]" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────
export default function CognitiveGames() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [zoom, setZoom] = useState(1);

  const categories = [
    "Tous",
    ...Array.from(new Set(games.map((g) => g.category))),
  ];
  const filteredGames =
    activeCategory === "Tous"
      ? games
      : games.filter((g) => g.category === activeCategory);

  const startGame = (id: GameId, lvl: Level) => {
    setActiveGame(id);
    setSelectedLevel(lvl);
    setGameState("playing");
    setScore(null);
  };

  const finishGame = (s: number) => {
    setScore(Math.round(s));
    setGameState("finished");
  };

  const reset = () => {
    setActiveGame(null);
    setSelectedLevel(null);
    setGameState("idle");
    setScore(null);
    setZoom(1)
  };

  const game = games.find((g) => g.id === activeGame);

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Jeux Cognitifs</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Activités de stimulation mentale — 3 niveaux de difficulté
            </p>
          </div>
          {gameState === "idle" && (
            <div className="flex items-center gap-2">
              {([1, 2, 3] as Level[]).map((l) => {
                const cfg = levelConfig[l];
                const Icon = cfg.icon;
                return (
                  <div
                    key={l}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color} ${cfg.border}`}
                  >
                    <Icon size={11} /> {cfg.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category filters */}
        {gameState === "idle" && (
          <div className="flex gap-2 mb-5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeCategory === cat
                    ? "bg-[#1a6fb5] text-white border-[#1a6fb5] shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#1a6fb5]/40 hover:text-[#1a6fb5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Game Grid — 3 columns */}
        {gameState === "idle" && (
          <div className="grid grid-cols-3 gap-4">
            {filteredGames.map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                  <div
                    className={`bg-gradient-to-br ${g.gradient} px-4 py-3 flex items-center gap-2.5`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-md leading-tight truncate">
                        {g.title}
                      </h3>
                      <span className="text-white/65 text-[11px]">
                        {g.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col gap-3 flex-1">
                    <p className="text-xs text-gray-400 leading-relaxed flex-1">
                      {g.description}
                    </p>
                    <div className="flex gap-1.5">
                      {([1, 2, 3] as Level[]).map((lvl) => {
                        const cfg = levelConfig[lvl];
                        const LvlIcon = cfg.icon;
                        return (
                          <button
                            key={lvl}
                            onClick={() => startGame(g.id, lvl)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all border hover:opacity-80 active:scale-95 ${cfg.bg} ${cfg.color} ${cfg.border}`}
                          >
                            <LvlIcon size={10} />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Game */}
        {gameState === "playing" && game && selectedLevel && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className={`bg-gradient-to-r ${game.gradient} px-6 py-4 flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <game.icon size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{game.title}</h2>
                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const cfg = levelConfig[selectedLevel];
                      const LI = cfg.icon;
                      return (
                        <span className="flex items-center gap-1 text-white/80 text-xs">
                          <LI size={11} /> {cfg.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white/80 bg-white/15 hover:bg-white/25 transition"
              >
                <RotateCcw size={12} /> Quitter
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                  className="px-2 py-1 rounded-lg text-white/80 bg-white/15 hover:bg-white/25 text-sm font-bold"
                >
                  A-
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(1.75, z + 0.25))}
                  className="px-2 py-1 rounded-lg text-white/80 bg-white/15 hover:bg-white/25 text-sm font-bold"
                >
                  A+
                </button>
              </div>
            </div>
            <div className="p-8 flex justify-center" style={{ zoom: zoom }}>
              {activeGame === "memory" && (
                <MemoryMatch level={selectedLevel} onFinish={finishGame} />
              )}
              {activeGame === "word" && (
                <WordRecall level={selectedLevel} onFinish={finishGame} />
              )}
              {activeGame === "attention" && (
                <AttentionGame level={selectedLevel} onFinish={finishGame} />
              )}
              {activeGame === "shape" && (
                <ShapeSorting level={selectedLevel} onFinish={finishGame} />
              )}
              {activeGame === "number" && (
                <NumberSequence level={selectedLevel} onFinish={finishGame} />
              )}
              {activeGame === "simon" && (
                <SimonSays level={selectedLevel} onFinish={finishGame} />
              )}
            </div>
          </div>
        )}

        {/* Finished */}
        {gameState === "finished" && game && selectedLevel && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className={`bg-gradient-to-r ${game.gradient} px-6 py-10 flex flex-col items-center gap-3`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Trophy size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Terminé !</h2>
              <div className="text-5xl font-black text-white">{score}%</div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    className={
                      i < Math.round((score || 0) / 20)
                        ? "text-yellow-300 fill-yellow-300"
                        : "text-white/30 fill-white/30"
                    }
                  />
                ))}
              </div>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500 text-center">
                {(score || 0) >= 80
                  ? "🎉 Excellent ! Continuez comme ça."
                  : (score || 0) >= 60
                    ? "👍 Bon travail ! Encore un peu de pratique."
                    : "💪 Continuez à pratiquer, chaque session aide !"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGameState("playing");
                    setScore(null);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${game.gradient}`}
                >
                  <RotateCcw size={14} /> Rejouer
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <ChevronRight size={14} /> Autre jeu
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
