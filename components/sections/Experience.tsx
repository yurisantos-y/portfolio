"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card } from "@/components/ui/Card";
import { ParallaxWrapper } from "@/components/animations/ParallaxWrapper";
import experienceData from "@/data/experience.json";

export const Experience = () => {
    return (
        <section id="experience" className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
            <ScrollReveal>
                <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                    <h3 className="text-xl font-mono text-text-secondary sticky top-32 h-fit">02 / Experiência</h3>

                    <div className="space-y-12">
                        {experienceData.map((job, index) => (
                            <ParallaxWrapper key={index} offset={index % 2 === 0 ? 0 : 30}>
                                <Card className="hover:border-primary/30 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between mb-4 items-start md:items-center">
                                        <h4 className="text-2xl font-bold text-text-primary">{job.company}</h4>
                                        <span className="text-sm font-mono text-accent bg-accent/10 px-3 py-1 rounded-full mt-2 md:mt-0">
                                            {job.period}
                                        </span>
                                    </div>
                                    <h5 className="text-xl text-text-secondary mb-4">{job.role}</h5>
                                    <p className="text-text-secondary leading-relaxed">
                                        {job.description}
                                    </p>
                                </Card>
                            </ParallaxWrapper>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
};
