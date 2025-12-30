"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ASCII3DObject } from "@/components/ui/ASCII3DObject";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const objectContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Animation states - texto visível desde o início
    const [scrollProgress, setScrollProgress] = useState(0);
    const [objectX, setObjectX] = useState(150);
    const [objectY, setObjectY] = useState(100);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        // Animação simples: apenas o objeto 3D se move conforme o scroll
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                const easeProgress = 1 - Math.pow(1 - progress, 2);

                // Objeto 3D entra diagonalmente
                setObjectX(150 * (1 - easeProgress));
                setObjectY(100 * (1 - easeProgress));
                setScrollProgress(Math.min(progress * 1.5, 1));
            },
        });

    }, { scope: sectionRef, dependencies: [mounted] });

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen w-full bg-background overflow-hidden"
        >
            {/* Container principal */}
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">

                {/* Texto centralizado - sempre visível */}
                <div
                    ref={textRef}
                    className="relative z-20 text-center px-6 max-w-2xl"
                >
                    <span className="block text-xs font-mono tracking-[0.5em] uppercase text-text-secondary/60 mb-6">
                        Sobre Mim
                    </span>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight leading-tight text-text-primary mb-8">
                        Desenvolvedor de software com paixão por criar experiências móveis excepcionais.
                    </h2>

                    <p className="text-base md:text-lg font-light leading-relaxed text-text-secondary/80 max-w-lg mx-auto">
                        Especializado em React Native e Flutter, transformo ideias em aplicativos que combinam design elegante com performance impecável.
                    </p>
                </div>

                {/* 3D Object - appears from diagonal */}
                <div
                    ref={objectContainerRef}
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        transform: `translate(${objectX}%, ${objectY}%)`,
                        willChange: 'transform',
                    }}
                >
                    <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[80vw] h-[120vh] md:w-[70vw] md:h-[140vh]">
                        <ASCII3DObject
                            objPath="/objeto-about-me.obj"
                            className="w-full h-full"
                            cellSize={5}
                            scrollProgress={scrollProgress}
                        />
                    </div>
                </div>

                {/* Subtle vignette overlay */}
                <div
                    className="absolute inset-0 pointer-events-none z-30"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.4) 100%)',
                    }}
                />
            </div>
        </section>
    );
};
