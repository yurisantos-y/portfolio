"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import styles from "./Work.module.css";

gsap.registerPlugin(ScrollTrigger);

// Tipos para os projetos
interface Project {
    id: string;
    title: string;
    category: string;
    image: string;
}

// Dados dos projetos (pode ser alterado depois)
const projects: Project[] = [
    { id: "01", title: "Project Alpha", category: "Mobile App", image: "/work.jpg" },
    { id: "02", title: "Project Beta", category: "Web Design", image: "/work.jpg" },
    { id: "03", title: "Project Gamma", category: "Flutter", image: "/work.jpg" },
    { id: "04", title: "Project Delta", category: "Next.js", image: "/work.jpg" },
    { id: "05", title: "Project Epsilon", category: "UI/UX", image: "/work.jpg" },
    { id: "06", title: "Project Zeta", category: "Mobile App", image: "/work.jpg" },
];

// Componente do modelo 3D - estático, sem animação
interface ParallaxModelProps {
    path: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
}

const ParallaxModel = ({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: ParallaxModelProps) => {
    const { scene } = useGLTF(path);

    return (
        <primitive
            object={scene.clone()}
            position={position}
            rotation={rotation}
            scale={scale}
        />
    );
};

// Preload dos modelos
useGLTF.preload("/parallax-1.glb");
useGLTF.preload("/parallax-2.glb");

// Componente do Card
interface CardProps {
    project: Project;
    index: number;
}

const ProjectCard = ({ project, index }: CardProps) => {
    return (
        <div className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={styles.cardImg}>
                <img src={project.image} alt={project.title} />
            </div>
            <div className={styles.cardCopy}>
                <p>{project.title}</p>
                <p>{project.id}</p>
            </div>
        </div>
    );
};

export const Work = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted || !sectionRef.current || !cardsContainerRef.current) return;

        const cards = cardsContainerRef.current;
        const totalWidth = cards.scrollWidth - window.innerWidth;

        // Scroll horizontal com GSAP ScrollTrigger
        gsap.to(cards, {
            x: -totalWidth,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                    const event = new CustomEvent("work-section-changed", { detail: { isActive: self.isActive } });
                    window.dispatchEvent(event);
                },
            },
        });

        // Os objetos parallax 3D agora ficam fixos nas suas posições

    }, { scope: sectionRef, dependencies: [mounted] });

    return (
        <section ref={sectionRef} className={styles.workSection} data-section="work">
            {/* Background */}
            <div className={styles.background} />

            {/* Parallax 3D Objects Layer - fixos nas posições */}
            <div className={styles.parallaxLayer}>
                {/* Parallax-1: Canto superior direito */}
                <div className={`${styles.parallax1} ${styles.parallaxObject}`}>
                    <Canvas
                        camera={{ position: [0, 0, 5], fov: 45 }}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[5, 5, 5]} intensity={1.2} />
                        <directionalLight position={[-3, 3, 2]} intensity={0.6} />
                        <Suspense fallback={null}>
                            <ParallaxModel
                                path="/parallax-1.glb"
                                position={[0, 0, 0]}
                                rotation={[0, -0.3, 0]}
                                scale={2.5}
                            />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Parallax-2: Canto inferior esquerdo */}
                <div className={`${styles.parallax2} ${styles.parallaxObject}`}>
                    <Canvas
                        camera={{ position: [0, 0, 6], fov: 45 }}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[5, 5, 5]} intensity={1.2} />
                        <directionalLight position={[-3, 3, 2]} intensity={0.6} />
                        <Suspense fallback={null}>
                            <ParallaxModel
                                path="/parallax-2.glb"
                                position={[0, 0, 0]}
                                rotation={[0, -0.5, 0]}
                                scale={2}
                            />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            {/* Cards Container - passa por trás dos objetos */}
            <div className={styles.cardsWrapper}>
                <div ref={cardsContainerRef} className={styles.cards}>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

