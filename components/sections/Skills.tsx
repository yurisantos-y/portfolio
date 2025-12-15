"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import skillsData from "@/data/skills.json";

export const Skills = () => {
    const categories = [
        { key: "languages", label: "Linguagens" },
        { key: "frameworks", label: "Frameworks" },
        { key: "tools", label: "Ferramentas" },
        { key: "design", label: "Design" },
    ] as const;

    return (
        <section id="skills" className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
            <ScrollReveal>
                <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                    <h3 className="text-xl font-mono text-text-secondary sticky top-32 h-fit">03 / Skills</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {categories.map((cat) => (
                            <div key={cat.key}>
                                <h4 className="text-lg font-bold text-text-primary mb-6 border-b border-white/10 pb-2">
                                    {cat.label}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {skillsData[cat.key].map((skill: string) => (
                                        <span
                                            key={skill}
                                            className="text-text-secondary hover:text-primary transition-colors text-lg cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
};
