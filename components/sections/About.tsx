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

        // Trigger 1: Entrada (Antes de fixar)
        // O objeto começa a aparecer assim que a seção entra na tela
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 60%", // Começa quando o topo da seção atinge 60% da altura da tela (delay no início)
            end: "top top",      // Termina quando a seção chega no topo (ocupa 100%)
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                // Easing cubic out para entrada suave
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                // Transição da posição inicial (80, 40) para o centro (0, 0)
                setObjectX(80 * (1 - easeProgress));
                setObjectY(40 * (1 - easeProgress));
                // Fade in gradual da opacidade
                setScrollProgress(easeProgress);
            }
        });

        // Trigger 2: Fixação e Saída (Quando a seção já ocupa 100%)
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%", // Duração da fase fixada
            scrub: 0.3,
            pin: contentRef.current,
            onUpdate: (self) => {
                const progress = self.progress;

                // Fase 2: Objeto fixo no centro (enquanto lê o sobre mim)
                // Mantemos por 70% do scroll pinned
                if (progress < 0.7) {
                    setObjectX(0);
                    setObjectY(0);
                    setScrollProgress(1);
                }
                // Fase 3: Saída para cima/esquerda (final do scroll)
                else {
                    const phaseProgress = (progress - 0.7) / 0.3; // Normaliza de 0.7-1.0 para 0-1
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
                            mouseControlMode="global"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
