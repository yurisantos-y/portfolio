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
    
    // Animation states
    const [scrollProgress, setScrollProgress] = useState(0);
    const [objectX, setObjectX] = useState(150);
    const [objectY, setObjectY] = useState(100);
    const [textOpacity, setTextOpacity] = useState(0);
    const [textScale, setTextScale] = useState(0.8);
    const [textY, setTextY] = useState(50);
    const [exitProgress, setExitProgress] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        // ========== PHASE 1: Text entrance animation (0% - 15% of scroll) ==========
        // ========== PHASE 2: Object slides in, text stays centered (15% - 75%) ==========
        // ========== PHASE 3: Exit animation (75% - 100%) ==========
        
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // ===== PHASE 1: Text entrance (0 - 0.15) =====
                if (progress <= 0.15) {
                    const textProgress = progress / 0.15; // 0 to 1
                    const easeText = 1 - Math.pow(1 - textProgress, 3);
                    
                    setTextOpacity(easeText);
                    setTextScale(0.8 + (easeText * 0.2)); // 0.8 to 1
                    setTextY(50 * (1 - easeText)); // 50 to 0
                    
                    // Object not visible yet
                    setScrollProgress(0);
                    setObjectX(150);
                    setObjectY(100);
                    setExitProgress(0);
                }
                // ===== PHASE 2: Object entrance (0.15 - 0.75) =====
                else if (progress <= 0.75) {
                    const objectProgress = (progress - 0.15) / 0.6; // 0 to 1
                    const easeObject = 1 - Math.pow(1 - objectProgress, 3);
                    
                    // Text stays centered and fully visible
                    setTextOpacity(1);
                    setTextScale(1);
                    setTextY(0);
                    
                    // Object slides in diagonally
                    setObjectX(150 * (1 - easeObject));
                    setObjectY(100 * (1 - easeObject));
                    setScrollProgress(Math.min(objectProgress * 1.3, 1));
                    setExitProgress(0);
                }
                // ===== PHASE 3: Exit animation (0.75 - 1.0) =====
                else {
                    const exitProg = (progress - 0.75) / 0.25; // 0 to 1
                    const easeExit = exitProg * exitProg; // ease in
                    
                    // Text fades and moves up
                    setTextOpacity(1 - easeExit);
                    setTextScale(1 - (easeExit * 0.1));
                    setTextY(-30 * easeExit);
                    
                    // Object moves out to left and fades
                    setObjectX(-50 * easeExit);
                    setObjectY(-30 * easeExit);
                    setScrollProgress(1 - (easeExit * 0.5));
                    setExitProgress(easeExit);
                }
            },
        });

    }, { scope: sectionRef, dependencies: [mounted] });

    return (
        <section
            ref={sectionRef}
            className="relative h-[300vh] w-full bg-background overflow-hidden"
        >
            {/* Fixed viewport container */}
            <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                
                {/* Centered Text */}
                <div
                    ref={textRef}
                    className="absolute z-20 text-center px-6 max-w-2xl"
                    style={{
                        opacity: textOpacity,
                        transform: `translateY(${textY}px) scale(${textScale})`,
                        willChange: 'transform, opacity',
                    }}
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
                        opacity: textOpacity,
                    }}
                />

                {/* Parallax transition layers to Work section */}
                {/* Layer 1 - Dots pattern (slowest) */}
                <div 
                    className="absolute inset-0 pointer-events-none z-5"
                    style={{
                        opacity: exitProgress * 0.8,
                        transform: `translateY(${-exitProgress * 30}px)`,
                        willChange: 'transform, opacity',
                    }}
                >
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.12) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                {/* Layer 2 - Medium speed gradient */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none z-25"
                    style={{
                        opacity: exitProgress,
                        transform: `translateY(${(1 - exitProgress) * 100}px)`,
                        background: 'linear-gradient(to top, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0.8) 40%, transparent 100%)',
                        willChange: 'transform, opacity',
                    }}
                />

                {/* Layer 3 - Fastest parallax dots */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-[30vh] pointer-events-none z-26"
                    style={{
                        opacity: exitProgress * 0.9,
                        transform: `translateY(${(1 - exitProgress) * 150}px)`,
                        willChange: 'transform, opacity',
                    }}
                >
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.2) 1.5px, transparent 1.5px)`,
                            backgroundSize: '30px 30px',
                        }}
                    />
                </div>
            </div>
        </section>
    );
};
