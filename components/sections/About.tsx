"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const highlightsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !contentRef.current) return;

        // Initial state - hidden and translated down
        gsap.set([titleRef.current, textRef.current, highlightsRef.current], {
            opacity: 0,
            y: 60
        });

        // Create animation when the About section comes into view
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "top 30%",
                toggleActions: "play none none reverse",
            }
        });

        tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5")
            .to(highlightsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5");

    }, { scope: sectionRef });

    const highlights = [
        { number: "5+", label: "Anos de Experiência" },
        { number: "50+", label: "Projetos Entregues" },
        { number: "10+", label: "Clientes Satisfeitos" },
    ];

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative min-h-screen w-full bg-background py-24 px-6 md:px-24"
        >
            <div ref={contentRef} className="max-w-5xl mx-auto">
                {/* Section Title */}
                <h2
                    ref={titleRef}
                    className="text-3xl md:text-5xl lg:text-6xl font-thin tracking-tight text-text-primary mb-12"
                >
                    Sobre <span className="text-primary">Mim</span>
                </h2>

                {/* About Text */}
                <p
                    ref={textRef}
                    className="text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-16 max-w-3xl"
                >
                    Sou um desenvolvedor apaixonado por criar experiências digitais
                    excepcionais. Com foco em desenvolvimento mobile utilizando Flutter
                    e desenvolvimento web com Next.js, busco sempre entregar soluções
                    elegantes e performáticas que fazem a diferença no dia a dia dos usuários.
                    <br /><br />
                    Minha jornada na tecnologia me levou a trabalhar em diversos projetos
                    desafiadores, onde pude aprimorar minhas habilidades em arquitetura
                    de software, design patterns e melhores práticas de desenvolvimento.
                </p>

                {/* Highlights Grid */}
                <div
                    ref={highlightsRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {highlights.map((item, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-2xl bg-surface/50 border border-white/5 hover:border-primary/30 transition-all duration-500"
                        >
                            {/* Gradient Glow on Hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <span className="block text-4xl md:text-5xl font-bold text-primary mb-2">
                                    {item.number}
                                </span>
                                <span className="text-text-secondary font-light tracking-wide">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
