"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ASCII3DObject } from "@/components/ui/ASCII3DObject";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const objectContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Animation states
    const [scrollProgress, setScrollProgress] = useState(0); // Começa invisível
    // Posição do objeto: começa fora da tela na diagonal inferior-direita
    const [objectX, setObjectX] = useState(80); // 80% = fora da tela à direita
    const [objectY, setObjectY] = useState(40); // 40% = abaixo do centro

    // Estado de hover para animação de espelhamento ASCII
    const [isObjectHovered, setIsObjectHovered] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        // Animação em 3 fases:
        // Fase 1 (0-30%): Objeto entra da direita e vai até o centro
        // Fase 2 (30-80%): Objeto visível e fixo no centro
        // Fase 3 (80-100%): Objeto sai da tela (para cima/esquerda)
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=250%", // Duração total da animação
            scrub: 0.3,
            pin: contentRef.current,
            onUpdate: (self) => {
                const progress = self.progress;

                // Fase 1: Entrada diagonal (inferior-direita para o centro) (0% a 30%)
                if (progress < 0.3) {
                    const phaseProgress = progress / 0.3; // Normaliza para 0-1
                    // Easing suave para entrada (easeOutCubic)
                    const easeProgress = 1 - Math.pow(1 - phaseProgress, 3);

                    // Objeto entra da diagonal inferior-direita até o centro
                    // Começa em (80%, 40%) e vai até (0%, 0%)
                    setObjectX(80 * (1 - easeProgress));
                    setObjectY(40 * (1 - easeProgress));
                    // Fade in gradual
                    setScrollProgress(easeProgress);
                }
                // Fase 2: Fixo no centro (30% a 80%)
                else if (progress < 0.8) {
                    setObjectX(0);
                    setObjectY(0);
                    setScrollProgress(1);
                }
                // Fase 3: Saída para cima/esquerda (80% a 100%)
                else {
                    const phaseProgress = (progress - 0.8) / 0.2; // Normaliza para 0-1
                    const easeProgress = Math.pow(phaseProgress, 2); // easeInQuad

                    // Objeto sai para cima/esquerda
                    setObjectX(-40 * easeProgress);
                    setObjectY(-30 * easeProgress);
                    // Fade out gradual
                    setScrollProgress(1 - easeProgress);
                }
            },
        });

    }, { scope: sectionRef, dependencies: [mounted] });

    // Handler para mudança de hover no objeto
    const handleObjectHoverChange = (hovered: boolean) => {
        setIsObjectHovered(hovered);
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-background overflow-hidden"
            style={{ minHeight: '350vh' }}
        >
            {/* Container principal - será fixado durante o scroll */}
            <div
                ref={contentRef}
                className="relative h-screen w-full flex items-center justify-center overflow-hidden"
            >

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

                {/* 3D Object - animação em 3 fases com entrada diagonal */}
                <div
                    ref={objectContainerRef}
                    className="absolute inset-0 z-10 pointer-events-auto"
                    style={{
                        transform: `translate(${objectX}%, ${objectY}%)`,
                        willChange: 'transform',
                        transition: objectX === 0 && objectY === 0 ? 'none' : 'transform 0.1s ease-out',
                    }}
                >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[120vh] md:w-[70vw] md:h-[140vh]">
                        <ASCII3DObject
                            objPath="/objeto-about-me.glb"
                            className="w-full h-full"
                            cellSize={5}
                            scrollProgress={scrollProgress}
                            isHovered={isObjectHovered}
                            onHoverChange={handleObjectHoverChange}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
