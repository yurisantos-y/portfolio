"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

import Lenis from "lenis";
import "./WorkScroll.css";


gsap.registerPlugin(ScrollTrigger);

interface Project {
    title: string;
    id: string;
    image?: string;
    size: 'vertical' | 'horizontal' | 'square';
    position: 'up' | 'down';
}

const projects: Project[] = [
    { title: "App Mobile 1", id: "001", size: "vertical", position: "up" },
    { title: "Project Beta", id: "002", size: "horizontal", position: "down" },
    { title: "App Mobile 2", id: "003", size: "vertical", position: "up" },
    { title: "Project Delta", id: "004", size: "square", position: "down" },
    { title: "Project Epsilon", id: "005", size: "horizontal", position: "up" },
    { title: "Project Zeta", id: "006", size: "square", position: "down" },
];

export const WorkScroll = () => {
    const workSectionRef = useRef<HTMLElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);
    const entranceOverlayRef = useRef<HTMLDivElement>(null);

    const lettersCanvasRef = useRef<HTMLDivElement>(null);
    const letterElementsRef = useRef<HTMLSpanElement[][]>([]);
    const letterPositionsRef = useRef<Map<HTMLSpanElement, { current: { x: number; y: number }; target: { x: number; y: number } }>>(new Map());
    const currentXPositionRef = useRef(0);
    const scrollProgressRef = useRef(0);
    const pathsRef = useRef<THREE.Line[]>([]);
    const lettersSceneRef = useRef<THREE.Scene | null>(null);
    const lettersCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const lettersRendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameRef = useRef<number>(0);
    
    const [entranceOpacity, setEntranceOpacity] = useState(1);
    const [entranceScale, setEntranceScale] = useState(1.1);

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const createTextAnimationPath = useCallback((yPos: number, amplitude: number): THREE.Line => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            points.push(
                new THREE.Vector3(
                    -25 + 50 * t,
                    yPos + Math.sin(t * Math.PI) * -amplitude,
                    (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
                )
            );
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
        const line = new THREE.Line(geometry, material);
        (line as any).curve = curve;
        return line;
    }, []);

    const drawGrid = useCallback((progress: number = 0) => {
        const canvas = gridCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#0A0A0A";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FF6B35"; // Orange color

        const dotSize = 1;
        const spacing = 30;
        const dpr = window.devicePixelRatio || 1;
        const rows = Math.ceil(canvas.height / spacing / dpr);
        const cols = Math.ceil(canvas.width / spacing / dpr) + 15;
        const offset = (progress * spacing * 10) % spacing;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                ctx.beginPath();
                ctx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, []);

    const resizeGridCanvas = useCallback(() => {
        const canvas = gridCanvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.scale(dpr, dpr);
        }
    }, []);

    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis();

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        const workSection = workSectionRef.current;
        const cardsContainer = cardsContainerRef.current;
        const textContainer = textContainerRef.current;

        if (!workSection || !cardsContainer || !textContainer) return;

        const moveDistance = typeof window !== "undefined" ? window.innerWidth * 5 : 0;



        // Setup grid canvas
        resizeGridCanvas();

        // Setup Three.js for letter animations
        const lettersScene = new THREE.Scene();
        lettersSceneRef.current = lettersScene;

        const lettersCamera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        lettersCamera.position.z = 20;
        lettersCameraRef.current = lettersCamera;

        const lettersRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        lettersRenderer.setClearColor(0x000000, 0);
        lettersRenderer.setPixelRatio(window.devicePixelRatio);
        lettersRenderer.domElement.id = "letters-canvas";
        lettersRendererRef.current = lettersRenderer;

        if (lettersCanvasRef.current) {
            lettersCanvasRef.current.appendChild(lettersRenderer.domElement);
        }

        // Create animation paths
        const paths = [
            createTextAnimationPath(10, 2),
            createTextAnimationPath(3.5, 1),
            createTextAnimationPath(-3.5, -1),
            createTextAnimationPath(-10, -2),
        ];
        pathsRef.current = paths;
        paths.forEach((line) => lettersScene.add(line));

        // Create letter elements
        const letters = ["W", "O", "R", "K"];
        const letterSpeedMultipliers = [0.8, 1, 0.7, 0.9];

        // Indices that should have z-front class (appear above cards)
        // W (line 0) and K (line 3) with specific indices
        const zFrontLetters: Record<number, number[]> = {
            0: [2, 5, 8, 11, 14], // W letters at front
            3: [1, 4, 7, 10, 13], // K letters at front
        };

        letterElementsRef.current = paths.map((line, lineIndex) => {
            return Array.from({ length: 15 }, (_, i) => {
                const el = document.createElement("span");
                const isZFront = zFrontLetters[lineIndex]?.includes(i);
                el.className = `work-letter${isZFront ? ' z-front' : ''}`;
                el.textContent = letters[lineIndex];
                textContainer.appendChild(el);
                letterPositionsRef.current.set(el, {
                    current: { x: 0, y: 0 },
                    target: { x: 0, y: 0 },
                });
                return el;
            });
        });

        const updateTargetPositions = (progress: number = 0) => {
            paths.forEach((line, lineIndex) => {
                const curve = (line as any).curve as THREE.CatmullRomCurve3;
                letterElementsRef.current[lineIndex]?.forEach((element, i) => {
                    const t = ((i / 14) + progress * letterSpeedMultipliers[lineIndex]) % 1;
                    const point = curve.getPoint(t);

                    const vector = point.clone().project(lettersCamera);
                    const positions = letterPositionsRef.current.get(element);
                    if (positions) {
                        positions.target = {
                            x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                            y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
                        };
                    }
                });
            });
        };

        const updateLetterPositions = () => {
            letterPositionsRef.current.forEach((positions, element) => {
                const distX = positions.target.x - positions.current.x;
                if (Math.abs(distX) > window.innerWidth * 0.7) {
                    positions.current.x = positions.target.x;
                    positions.current.y = positions.target.y;
                } else {
                    positions.current.x = lerp(positions.current.x, positions.target.x, 0.07);
                    positions.current.y = lerp(positions.current.y, positions.target.y, 0.07);
                }
                element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
            });
        };

        const updateCardPositions = () => {
            const triggers = ScrollTrigger.getAll();
            const workTrigger = triggers.find(t => t.vars.trigger === workSection);
            const targetX = -moveDistance * (workTrigger?.progress || 0);
            currentXPositionRef.current = lerp(currentXPositionRef.current, targetX, 0.007);
            gsap.set(cardsContainer, { x: currentXPositionRef.current });
        };

        const animate = () => {
            updateLetterPositions();
            updateCardPositions();

            if (lettersRendererRef.current && lettersSceneRef.current && lettersCameraRef.current) {
                lettersRendererRef.current.render(lettersSceneRef.current, lettersCameraRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Entrance animation - fade in as section comes into view
        ScrollTrigger.create({
            trigger: workSection,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                // Fade overlay out (1 to 0)
                setEntranceOpacity(1 - progress);
                // Scale from 1.1 to 1
                setEntranceScale(1.1 - (progress * 0.1));
            },
        });

        // Create ScrollTrigger for main horizontal scroll
        ScrollTrigger.create({
            trigger: workSection,
            start: "top top",
            end: "+=700%",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                scrollProgressRef.current = self.progress;
                updateTargetPositions(self.progress);
                drawGrid(self.progress);
            },
        });

        // Initial render
        drawGrid(0);
        animate();
        updateTargetPositions(0);

        // Handle resize
        const handleResize = () => {
            resizeGridCanvas();
            drawGrid(scrollProgressRef.current);
            if (lettersCameraRef.current) {
                lettersCameraRef.current.aspect = window.innerWidth / window.innerHeight;
                lettersCameraRef.current.updateProjectionMatrix();
            }
            if (lettersRendererRef.current) {
                lettersRendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }



            updateTargetPositions(scrollProgressRef.current);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameRef.current);
            lenis.destroy();

            // Cleanup letter elements
            letterElementsRef.current.forEach((letterGroup) => {
                letterGroup.forEach((el) => el.remove());
            });

            // Cleanup Three.js
            if (lettersRendererRef.current) {
                lettersRendererRef.current.dispose();
                lettersRendererRef.current.domElement.remove();
            }



            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [createTextAnimationPath, drawGrid, resizeGridCanvas]);

    return (
        <>
            {/* Work Section with Cards */}
            <section ref={workSectionRef} className="work-section">
                {/* Entrance overlay for smooth transition */}
                <div 
                    ref={entranceOverlayRef}
                    className="absolute inset-0 z-[200] pointer-events-none"
                    style={{
                        opacity: entranceOpacity,
                        background: 'linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.95) 50%, rgba(10,10,10,0.8) 100%)',
                        willChange: 'opacity',
                    }}
                >
                    {/* Parallax dots pattern that fades with entrance */}
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.15) 1px, transparent 1px)`,
                            backgroundSize: '30px 30px',
                            transform: `scale(${entranceScale})`,
                            willChange: 'transform',
                        }}
                    />
                </div>
                
                <canvas ref={gridCanvasRef} id="grid-canvas" />
                <div ref={lettersCanvasRef} className="letters-canvas-container" />
                {/* Text container for animated letters - separate from cards */}
                <div ref={textContainerRef} className="work-text-container" />
                {/* Cards container - z-index above letters */}
                <div className="work-cards-wrapper">
                    <div ref={cardsContainerRef} className="work-cards">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={`work-card card-${project.size} pos-${project.position}`}
                            >
                                <div className="work-card-img">
                                    {project.image ? (
                                        <img src={project.image} alt={project.title} />
                                    ) : (
                                        <div style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#71717A",
                                            fontSize: "14px"
                                        }}>
                                            {project.title}
                                        </div>
                                    )}
                                </div>
                                <div className="work-card-copy">
                                    <p>{project.title}</p>
                                    <p>#{project.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
