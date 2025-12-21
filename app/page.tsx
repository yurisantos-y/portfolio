import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import Orb from "@/components/Orb";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white overflow-x-hidden">
      <Hero />
      <About />
      <section id="skills" className="w-full relative z-10 flex flex-col items-center justify-center bg-transparent py-20">
        <Orb
          totalItems={50}
          sphereRadius={6}
          backgroundColor="000000" // Transparent-ish or black to blend
        />
      </section>

    </main>
  );
}
