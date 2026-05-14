'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const GRID = 20;
const TICK = 150;
const BEST_KEY = 'snake-best';

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pos = { x: number; y: number };
type Phase = 'idle' | 'playing' | 'gameOver';

const OPP: Record<Dir, Dir> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

function randomFood(snake: Pos[]): Pos {
  const set = new Set(snake.map((p) => `${p.x},${p.y}`));
  let p: Pos;
  do {
    p = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (set.has(`${p.x},${p.y}`));
  return p;
}

function initSnake(): Pos[] {
  const m = Math.floor(GRID / 2);
  return [
    { x: m - 2, y: m },
    { x: m - 1, y: m },
    { x: m, y: m },
  ];
}

function ScoreBoard({ score, best, mounted }: { score: number; best: number; mounted: boolean }) {
  return (
    <div className="flex justify-between w-full max-w-[320px] font-mono mb-4">
      <div>
        <p className="text-[10px] opacity-40 tracking-[0.15em]">SCORE</p>
        <p className="text-sm tracking-[0.2em]">
          {String(score).padStart(4, '0')}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] opacity-40 tracking-[0.15em]">BEST</p>
        <p className="text-sm tracking-[0.2em]">
          {mounted ? String(best).padStart(4, '0') : '0000'}
        </p>
      </div>
    </div>
  );
}

function DPad({ onDir }: { onDir: (d: Dir) => void }) {
  const Btn = ({ d, label }: { d: Dir; label: string }) => (
    <button
      onClick={() => onDir(d)}
      className="w-7 h-7 border border-current rounded flex items-center justify-center text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
    >
      {label}
    </button>
  );
  return (
    <div className="grid grid-cols-3 gap-1 mt-6">
      <div />
      <Btn d="UP" label="↑" />
      <div />
      <Btn d="LEFT" label="←" />
      <Btn d="DOWN" label="↓" />
      <Btn d="RIGHT" label="→" />
    </div>
  );
}

export default function SnakeGame() {
  const [mounted, setMounted] = useState(false);
  const [snake, setSnake] = useState<Pos[]>(() => initSnake());
  const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
  const [gamePhase, setGamePhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const dirRef = useRef<Dir>('RIGHT');
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const phaseRef = useRef<Phase>('idle');
  const scoreRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    setFood(randomFood(snakeRef.current));
  }, []);

  const changeDir = useCallback((d: Dir) => {
    if (OPP[d] !== dirRef.current) {
      dirRef.current = d;
    }
  }, []);

  const start = useCallback(() => {
    phaseRef.current = 'playing';
    setGamePhase('playing');
  }, []);

  const restart = useCallback(() => {
    const s = initSnake();
    const f = randomFood(s);
    snakeRef.current = s;
    foodRef.current = f;
    dirRef.current = 'RIGHT';
    phaseRef.current = 'idle';
    scoreRef.current = 0;
    setSnake(s);
    setFood(f);
    setGamePhase('idle');
    setScore(0);
  }, []);

  const tickRef = useRef<() => void>(() => {});
  tickRef.current = () => {
    if (phaseRef.current !== 'playing') return;

    const s = snakeRef.current;
    const head = s[s.length - 1];
    const d = dirRef.current;

    const nh: Pos =
      d === 'UP' ? { x: head.x, y: head.y - 1 }
      : d === 'DOWN' ? { x: head.x, y: head.y + 1 }
      : d === 'LEFT' ? { x: head.x - 1, y: head.y }
      : { x: head.x + 1, y: head.y };

    if (nh.x < 0 || nh.x >= GRID || nh.y < 0 || nh.y >= GRID) {
      phaseRef.current = 'gameOver';
      setGamePhase('gameOver');
      const prev = Number(localStorage.getItem(BEST_KEY)) || 0;
      const next = Math.max(prev, scoreRef.current);
      if (next > prev) {
        localStorage.setItem(BEST_KEY, String(next));
        setBest(next);
      }
      return;
    }

    if (s.some((p) => p.x === nh.x && p.y === nh.y)) {
      phaseRef.current = 'gameOver';
      setGamePhase('gameOver');
      const prev = Number(localStorage.getItem(BEST_KEY)) || 0;
      const next = Math.max(prev, scoreRef.current);
      if (next > prev) {
        localStorage.setItem(BEST_KEY, String(next));
        setBest(next);
      }
      return;
    }

    const ns = [...s, nh];

    if (nh.x === foodRef.current.x && nh.y === foodRef.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      const nf = randomFood(ns);
      foodRef.current = nf;
      setFood(nf);
    } else {
      ns.shift();
    }

    snakeRef.current = ns;
    setSnake(ns);
  };

  useEffect(() => {
    if (gamePhase !== 'playing') return;
    const id = setInterval(() => tickRef.current(), TICK);
    return () => clearInterval(id);
  }, [gamePhase]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          changeDir('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeDir('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeDir('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeDir('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [changeDir]);

  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`));
  const headKey = snake.length > 0
    ? `${snake[snake.length - 1].x},${snake[snake.length - 1].y}`
    : '';

  const cells: {
    x: number;
    y: number;
    isSnake: boolean;
    isHead: boolean;
    isFood: boolean;
  }[] = [];

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const key = `${x},${y}`;
      cells.push({
        x,
        y,
        isSnake: snakeSet.has(key),
        isHead: key === headKey,
        isFood: x === food.x && y === food.y,
      });
    }
  }

  return (
    <div className="flex flex-col items-center">
      <ScoreBoard score={score} best={best} mounted={mounted} />
      <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] border-2 border-current rounded-xl relative overflow-hidden game-grid">
        <div className="grid grid-cols-[repeat(20,1fr)] w-full h-full">
          {cells.map((c) => (
            <div
              key={`${c.x}-${c.y}`}
              className={`w-full h-full ${mounted && c.isSnake ? 'bg-[var(--accent)]' : ''} ${mounted && c.isFood ? 'bg-[#dc2626]' : ''}`}
            />
          ))}
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
            gamePhase !== 'playing' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'var(--background)' }}
        >
          {gamePhase === 'idle' && (
            <button
              onClick={start}
              className="font-mono text-xs border border-current rounded-md px-4 py-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer tracking-[0.1em]"
            >
              START
            </button>
          )}
          {gamePhase === 'gameOver' && (
            <>
              <p className="font-mono text-sm tracking-[0.2em] mb-5">
                GAME OVER
              </p>
              <button
                onClick={restart}
                className="font-mono text-xs border border-current rounded-md px-3 py-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                RESTART
              </button>
            </>
          )}
        </div>
      </div>
      <DPad onDir={gamePhase === 'playing' ? changeDir : () => {}} />
      <p className="font-mono text-[10px] opacity-25 tracking-[0.15em] mt-4">
        USE THE ARROW KEYS TO PLAY
      </p>
    </div>
  );
}
