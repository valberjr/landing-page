import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SnakeGame from '@/components/SnakeGame';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6">
        <SnakeGame />
      </main>
      <Footer />
    </div>
  );
}
