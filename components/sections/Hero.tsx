"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/animations/TextReveal";

export const Hero = () => {
    const scrollToProjects = () => {
        const element = document.getElementById("experience");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-7xl mx-auto relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8 z-10"
            >
                <div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-text-primary mb-4">
                        <TextReveal>Yuri Santos</TextReveal>
                    </h1>
                    <h2 className="text-2xl md:text-4xl text-text-secondary font-light tracking-wide">
                        FullStack Developer
                    </h2>
                </div>

                <p className="text-lg md:text-xl text-accent font-mono">
                    Flutter • Next.js • Mobile First
                </p>

                <div className="pt-8">
                    <Button
                        variant="outline"
                        onClick={scrollToProjects}
                        className="group"
                    >
                        Ver projetos
                        <span className="ml-2 group-hover:translate-y-1 transition-transform inline-block">↓</span>
                    </Button>
                </div>
            </motion.div>

            {/* Decorative background element */}
            <motion.div
                className="absolute -right-20 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
            />
        </section>
    );
};
