"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import educationData from "@/data/education.json";
import { motion } from "framer-motion";

export const Education = () => {
    return (
        <section id="education" className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
            <ScrollReveal>
                <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                    <h3 className="text-xl font-mono text-text-secondary sticky top-32 h-fit">04 / Formação</h3>

                    <div className="relative border-l border-white/10 pl-8 ml-3 space-y-12">
                        {educationData.map((edu, index) => (
                            <div key={index} className="relative">
                                <motion.div
                                    className="absolute -left-[39px] top-2 w-5 h-5 rounded-full bg-background border-2 border-primary"
                                    whileInView={{ scale: [0, 1.2, 1] }}
                                    viewport={{ once: true }}
                                />
                                <div className="space-y-1">
                                    <span className="text-sm font-mono text-accent">{edu.year}</span>
                                    <h4 className="text-xl font-medium text-text-primary">{edu.course}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
};
