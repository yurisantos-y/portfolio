"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ASCIIVideoBackground } from "@/components/ui/ASCIIVideoBackground";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const container = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [entryAnimationComplete, setEntryAnimationComplete] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        // Initial setup - elements start hidden for entry animation
        gsap.set(titleRef.current, { y: 40, opacity: 0 });
        gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
        gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 20 });

        // Entry animation sequence
        const entryTl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
                setEntryAnimationComplete(true);
            }
        });

        entryTl.to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
        })
            .to(subtitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
            }, "-=0.4")
            .to(scrollIndicatorRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
            }, "-=0.3");

    }, { scope: container, dependencies: [mounted] });

    // Separate useGSAP for scroll animations - runs after entry animation
    useGSAP(() => {
        if (!entryAnimationComplete) return;



        // ========== PARALLAX SCROLL EFFECT (FULLY REVERSIBLE) ==========

        // Title parallax - uses fromTo for clean reversibility
        gsap.fromTo(titleRef.current,
            { y: 0, opacity: 1 },
            {
                y: "-200%",
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "50% top",
                    scrub: 0.5,
                }
            }
        );

        // Subtitle parallax - follows title with slight delay
        gsap.fromTo(subtitleRef.current,
            { y: 0, opacity: 1 },
            {
                y: "-300%",
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "10% top",
                    end: "60% top",
                    scrub: 0.5,
                }
            }
        );

        // Scroll indicator fades out first
        gsap.fromTo(scrollIndicatorRef.current,
            { opacity: 1, y: 0 },
            {
                opacity: 0,
                y: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "25% top",
                    scrub: 0.5,
                }
            }
        );

        // Background parallax - ASCII background moves slower creating depth
        gsap.fromTo(backgroundRef.current,
            { y: "0%" },
            {
                y: "-20%",
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5,
                }
            }
        );



    }, { scope: container, dependencies: [entryAnimationComplete] });

    return (
        <section
            ref={container}
            className="relative h-screen w-full overflow-hidden bg-background"
        >
            {/* Hero Container */}
            <div className="relative h-full w-full overflow-hidden">
                {/* ASCII Video Background with parallax ref */}
                <div
                    ref={backgroundRef}
                    className="absolute inset-0 w-full h-[120%]"
                >
                    <ASCIIVideoBackground />
                </div>

                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Title - Top Left Corner */}
                    <div className="absolute top-24 md:top-32 left-6 md:left-24 relative">
                        <h1
                            ref={titleRef}
                            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-wide text-text-primary will-change-transform"
                            style={{ fontFamily: 'var(--font-badeen)' }}
                        >
                            YURI SANTOS
                        </h1>

                        {/* Subtitle - positioned absolute overlapping the title */}
                        <h2
                            ref={subtitleRef}
                            className="absolute bottom-1 left-4 md:left-8 lg:left-12 text-base md:text-xl lg:text-2xl text-[#FF6B00] tracking-wide font-semibold drop-shadow-md will-change-transform translate-y-1/2"
                            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                        >
                            Software Engineer | Mobile Developer
                        </h2>
                    </div>

                    {/* Scroll Indicator */}
                    <div
                        ref={scrollIndicatorRef}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 will-change-transform"
                    >
                        <span className="text-text-secondary/60 text-sm font-light tracking-widest uppercase">
                            Scroll
                        </span>
                        <div className="w-px h-12 bg-gradient-to-b from-text-secondary/40 to-transparent relative overflow-hidden">
                            <div className="absolute w-full h-4 bg-gradient-to-b from-primary/80 to-primary/0 animate-scroll-indicator" />
                        </div>
                    </div>
                </div>

                {/* Gradient overlay at bottom for smooth transition */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
            </div>
        </section>
    );
};
