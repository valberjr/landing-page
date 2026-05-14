export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="p-6 flex justify-between items-center">
        <span className="font-mono">seudominio.com</span>

        <button className="border px-4 py-2 rounded-md">
          ☕ buy me a coffee
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center">Snake</div>

      <footer className="p-6 text-center text-sm opacity-60">github</footer>
    </main>
  );
}
