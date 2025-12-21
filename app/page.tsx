import { Hero } from "@/components/sections/Hero";
import { WorkScroll } from "@/components/sections/WorkScroll";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white overflow-x-hidden">
      <Hero />
      <WorkScroll />
    </main>
  );
}
