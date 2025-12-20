"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ASCIIVideo } from "@/components/ui/ASCIIVideo";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const line1Ref = useRef<HTMLParagraphElement>(null);
    const line2Ref = useRef<HTMLParagraphElement>(null);
    const line3Ref = useRef<HTMLParagraphElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        // ========== TEXT REVEAL ANIMATION ==========
        // Heading appears first - using fromTo for reversibility
        gsap.fromTo(headingRef.current,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 40%",
                    scrub: 0.5,
                },
            }
        );

        // Text lines appear with stagger - using fromTo for reversibility
        const textLines = [line1Ref.current, line2Ref.current, line3Ref.current];
        textLines.forEach((line, index) => {
            gsap.fromTo(line,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: `${10 + index * 10}% 80%`,
                        end: `${30 + index * 10}% 40%`,
                        scrub: 0.5,
                    },
                }
            );
        });

        // ========== VIDEO PARALLAX FROM BOTTOM ==========
        // Video rises from bottom as user scrolls down
        // Fully reversible - returns to bottom when user scrolls back up
        gsap.fromTo(videoContainerRef.current,
            {
                opacity: 0,
                y: 300  // Starts far below
            },
            {
                opacity: 1,
                y: -50,  // Ends slightly above its natural position
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    end: "80% 20%",
                    scrub: 0.8,  // Smooth scrub for natural parallax feel
                },
            }
        );

    }, { scope: sectionRef, dependencies: [mounted] });

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen w-full bg-background overflow-hidden"
        >
            {/* Gradient transition from Hero */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

            {/* Main Content Container - Ultra-minimalist layout */}
            <div className="relative z-20 h-full min-h-screen flex items-center">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                        {/* Text Content - Left Side */}
                        <div ref={textContainerRef} className="space-y-8">
                            {/* Minimal heading */}
                            <h2
                                ref={headingRef}
                                className="text-sm md:text-base font-light tracking-[0.3em] uppercase text-text-secondary/60 will-change-transform"
                            >
                                Sobre
                            </h2>

                            {/* Paragraphs - Renaissance inspired typography */}
                            <div className="space-y-6">
                                <p
                                    ref={line1Ref}
                                    className="text-xl md:text-2xl lg:text-3xl font-thin leading-relaxed text-text-primary will-change-transform"
                                    style={{ fontFamily: "var(--font-sans)" }}
                                >
                                    Desenvolvedor de software com paixão por criar experiências móveis excepcionais.
                                </p>

                                <p
                                    ref={line2Ref}
                                    className="text-base md:text-lg font-light leading-relaxed text-text-secondary will-change-transform"
                                >
                                    Especializado em React Native e Flutter, transformo ideias em aplicativos que combinam design elegante com performance impecável.
                                </p>

                                <p
                                    ref={line3Ref}
                                    className="text-base md:text-lg font-light leading-relaxed text-text-secondary/80 will-change-transform"
                                >
                                    Cada linha de código é uma oportunidade de criar algo extraordinário.
                                </p>
                            </div>
                        </div>

                        {/* Video Container - Right Side */}
                        <div
                            ref={videoContainerRef}
                            className="relative aspect-[3/4] lg:aspect-[4/5] w-full max-w-md lg:max-w-lg mx-auto lg:ml-auto will-change-transform"
                        >
                            {/* ASCII Video */}
                            <div className="absolute inset-0 overflow-hidden">
                                <ASCIIVideo
                                    videoSrc="/about-me.mp4"
                                    className="w-full h-full"
                                    cellSize={5}
                                />
                            </div>

                            {/* Subtle frame effect - Renaissance inspired */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Top-left corner */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-primary/20" />
                                {/* Bottom-right corner */}
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-primary/20" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom gradient for next section transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        </section>
    );
};
