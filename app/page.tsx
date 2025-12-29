import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { WorkScroll } from "@/components/sections/WorkScroll";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white overflow-x-hidden">
      <Hero />
      <About />
      <WorkScroll />
    </main>
  );
}
