import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white overflow-x-hidden">
      <Hero />
      <About />
    </main>
  );
}
