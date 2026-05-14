export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 md:px-10 md:py-5">
      <span className="font-mono text-sm">jvasc.com</span>
      <button className="font-mono text-xs border border-current rounded-md px-3 py-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        ☕ buy me a coffee
      </button>
    </header>
  );
}
