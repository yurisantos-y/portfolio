import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white overflow-x-hidden">
      <Hero />
      <ProjectCarousel />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </main>
  );
}
