"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ASCIIVideoBackground } from "@/components/ui/ASCIIVideoBackground";

export const Hero = () => {
    const container = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToProjects = () => {
        const element = document.getElementById("experience");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    useGSAP(() => {
        if (!mounted) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Initial setup
        gsap.set(titleRef.current, { y: 40, opacity: 0 });
        gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
        gsap.set(ctaRef.current, { y: 20, opacity: 0 });

        // Clean, minimal animation sequence
        tl.to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
        })
            .to(subtitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
            }, "-=0.4")
            .to(ctaRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
            }, "-=0.5");

    }, { scope: container, dependencies: [mounted] });

    return (
        <section ref={container} className="relative min-h-screen w-full overflow-hidden bg-background">
            {/* ASCII Video Background */}
            <ASCIIVideoBackground />

            {/* Title - Top Left Corner */}
            <div className="absolute top-24 md:top-32 left-6 md:left-24 z-10">
                <h1
                    ref={titleRef}
                    className="text-4xl md:text-6xl lg:text-7xl font-thin tracking-tight text-text-primary"
                >
                    Yuri Santos
                </h1>

                {/* Subtitle */}
                <h2
                    ref={subtitleRef}
                    className="mt-2 text-base md:text-lg text-text-secondary font-light tracking-wide"
                >
                    Software Engineer | Mobile Developer
                </h2>
            </div>

            {/* CTA - Centered near bottom */}
            <div
                ref={ctaRef}
                className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-10"
            >
                <Button
                    variant="outline"
                    onClick={scrollToProjects}
                    className="text-sm tracking-wide"
                >
                    Ver projetos
                    <span className="ml-2">↓</span>
                </Button>
            </div>
        </section>
    );
};
