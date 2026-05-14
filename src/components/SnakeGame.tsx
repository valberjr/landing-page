function ScoreBoard() {
  return (
    <div className="flex justify-between w-full max-w-[320px] font-mono mb-4">
      <div>
        <p className="text-[10px] opacity-40 tracking-[0.15em]">SCORE</p>
        <p className="text-sm tracking-[0.2em]">0000</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] opacity-40 tracking-[0.15em]">BEST</p>
        <p className="text-sm tracking-[0.2em]">0000</p>
      </div>
    </div>
  );
}

function DPad() {
  return (
    <div className="grid grid-cols-3 gap-1 mt-6">
      <div />
      <button className="w-7 h-7 border border-current rounded flex items-center justify-center text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
        ↑
      </button>
      <div />
      <button className="w-7 h-7 border border-current rounded flex items-center justify-center text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
        ←
      </button>
      <button className="w-7 h-7 border border-current rounded flex items-center justify-center text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
        ↓
      </button>
      <button className="w-7 h-7 border border-current rounded flex items-center justify-center text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
        →
      </button>
    </div>
  );
}

export default function SnakeGame() {
  return (
    <div className="flex flex-col items-center">
      <ScoreBoard />
      <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] border-2 border-current rounded-xl game-grid flex items-center justify-center font-mono text-sm opacity-50">
        snake game
      </div>
      <DPad />
      <p className="font-mono text-[10px] opacity-25 tracking-[0.15em] mt-4">
        USE AS SETAS DO TECLADO PARA JOGAR
      </p>
    </div>
  );
}
