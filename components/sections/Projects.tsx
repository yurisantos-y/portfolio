"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import styles from "./Projects.module.css";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const projects = [
    { id: 1, title: "Project One", category: "Web Design", image: "/assets/react.png" }, // Using placeholders from assets if available, else generated
    { id: 2, title: "Project Two", category: "Mobile App", image: "/assets/flutter.png" },
    { id: 3, title: "Project Three", category: "Backend", image: "/assets/nextjs.png" },
    { id: 4, title: "Project Four", category: "Full Stack", image: "/assets/typescript.png" },
    { id: 5, title: "Project Five", category: "Design", image: "/assets/figma.png" },
];

export const Projects = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const workSectionRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Basic setup
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Keep lenis and scrolltrigger in sync is often good but user code used manual update
        // lenis.on("scroll", ScrollTrigger.update); // Optional with newer versions, but let's keep it if needed.
        // Actually, common practice is:
        // gsap.ticker.add((time) => lenis.raf(time * 1000));
        // gsap.ticker.lagSmoothing(0);

        // BUT, since we are inside a larger app, using a global lenis might fight with other scroll logic if any. 
        // Assuming this is the main scroll manager for this page or section.

        // --- Grid Canvas Setup ---
        const gridCanvas = gridCanvasRef.current;
        if (!gridCanvas || !workSectionRef.current) return;

        const gridCtx = gridCanvas.getContext("2d");
        if (!gridCtx) return;

        const resizeGridCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            gridCanvas.width = window.innerWidth * dpr;
            gridCanvas.height = window.innerHeight * dpr;
            gridCanvas.style.width = `${window.innerWidth}px`;
            gridCanvas.style.height = `${window.innerHeight}px`;
            gridCtx.scale(dpr, dpr);
        };
        resizeGridCanvas();

        const drawGrid = (scrollProgress = 0) => {
            if (!gridCanvas || !gridCtx) return;
            gridCtx.fillStyle = "#000";
            gridCtx.fillRect(0, 0, gridCanvas.width / (window.devicePixelRatio || 1), gridCanvas.height / (window.devicePixelRatio || 1));
            gridCtx.fillStyle = "#f40c3f";

            const spacing = 30;
            const dotSize = 1; // Corrected from datSize
            const rows = Math.ceil(window.innerHeight / spacing);
            const cols = Math.ceil(window.innerWidth / spacing) + 15;

            // Corrected logic for offset
            const offset = (scrollProgress * spacing * 10) % spacing;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    gridCtx.beginPath();
                    // Corrected "OffscreenCanvas" to "offset"
                    gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
                    gridCtx.fill();
                }
            }
        };

        // --- Three.js Setup ---
        const lettersScene = new THREE.Scene();
        const lettersCamera = new THREE.PerspectiveCamera( // Corrected typo
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        lettersCamera.position.z = 20;

        const lettersRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        lettersRenderer.setClearColor(0x000000, 0);
        lettersRenderer.setPixelRatio(window.devicePixelRatio);
        lettersRenderer.domElement.className = styles['projects-canvas-letters']; // Use class instead of ID for styling
        workSectionRef.current.appendChild(lettersRenderer.domElement);

        const createTextAnimationPath = (yPos: number, amplitude: number) => {
            const points = [];
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                points.push(
                    new THREE.Vector3( // Corrected typo TRHEE
                        -25 + 50 * t,
                        yPos + Math.sin(t * Math.PI) * -amplitude,
                        (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
                    )
                );
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)), // Corrected captureEvents/BufferGeomatry
                new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, visible: false }) // Hide the line itself
            );
            // @ts-ignore
            line.curve = curve;
            return line;
        };

        const path = [
            createTextAnimationPath(10, 2),
            createTextAnimationPath(3.5, 1),
            createTextAnimationPath(-3.5, -1),
            createTextAnimationPath(-10, -2),
        ];

        path.forEach((line) => lettersScene.add(line));

        // Create Letters DOM Elements
        const letterPositions = new Map();
        const words = ["P", "R", "O", "J"]; // Just using "PROJ" or repeating based on the user's code ["W", "O", "R", "K"]
        // User code: ["W", "O", "R", "K"] [i]
        const wordList = ["W", "O", "R", "K"];

        if (textContainerRef.current) {
            textContainerRef.current.innerHTML = ''; // Clear prev
            path.forEach((line: any, i) => {
                // Create 15 letters per line as per original code?
                // Original code: Array.from({ length: 15 }, ...
                const lettersForLine = Array.from({ length: 15 }, (_, j) => {
                    const el = document.createElement("div");
                    el.className = styles['projects-letter'];
                    // Cycle through letters of the word for this line
                    // Wait, original code: elTextContent = ["W", "O", "R", "K"] [i]; -> This sets all letters in line i to the same char?
                    // "W" for line 0, "O" for line 1? That seems to be the intent in original code.
                    el.textContent = wordList[i] || "";
                    textContainerRef.current?.appendChild(el);

                    letterPositions.set(el, {
                        current: { x: 0, y: 0 },
                        target: { x: 0, y: 0 },
                        lineIndex: i,
                        indexOnLine: j
                    });
                    return el;
                });
                line.letterElements = lettersForLine;
            });
        }

        const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];

        const updateTargetPosition = (scrollProgress = 0) => {
            path.forEach((line: any, lineIndex) => {
                line.letterElements.forEach((element: HTMLElement, i: number) => {
                    // i / 14 so it spreads across 0 to 1
                    const progressOnLine = (i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1;
                    const point = line.curve.getPoint(progressOnLine);

                    const vector = point.clone().project(lettersCamera);
                    // Convert NDC to screen coordinates
                    // Re-targeting based on vector
                    const positions = letterPositions.get(element);
                    if (positions) {
                        positions.target = {
                            x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                            y: -(vector.y * 0.5 - 0.5) * window.innerHeight, // Flip Y logic usually
                        };
                    }
                });
            });
        };
        // Note: original code: x: (-vector.x * 0.5 + 0.5) ...
        // Let's stick to their logic if possible, but THREE.js project usually gives -1 to 1.
        // Screen X: (v.x + 1) / 2 * width
        // Screen Y: (-v.y + 1) / 2 * height (since Y is up in 3D, down in CSS)

        const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

        const updateLetterPositions = () => {
            letterPositions.forEach((positions, element) => {
                const distX = positions.target.x - positions.current.x;

                // Wrap around logic
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

        let currentXPosition = 0;
        const moveDistance = window.innerWidth * 4; // Adjust based on width

        const updateCardPositions = () => {
            // We need scroll progress. In GSAP ScrollTrigger, we can get it from the instance.
            // Or we pass it in. 
            // The original code uses ScrollTrigger.getAll()[0]?.progress.
            // We will store reference to our specific trigger.
        };

        // Animation Loop
        const animate = () => {
            updateLetterPositions();

            // Manual lerp for cards
            // Check scroll trigger progress
            // This relies on the global variable or closure which we will set up
            if (stInstance) {
                const progress = stInstance.progress;
                const targetX = -moveDistance * progress;
                currentXPosition = lerp(currentXPosition, targetX, 0.05); // 0.007 was very slow, 0.05 a bit smoother

                if (cardsContainerRef.current) {
                    gsap.set(cardsContainerRef.current, { x: currentXPosition });
                }
            }

            lettersRenderer.render(lettersScene, lettersCamera);
            requestAnimationFrame(animate);
        };

        let stInstance: ScrollTrigger | null = null;

        // Create ScrollTrigger
        const ctx = gsap.context(() => {
            stInstance = ScrollTrigger.create({
                trigger: workSectionRef.current,
                start: "top top",
                end: "+=500%", // 700% might be too long
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    updateTargetPosition(self.progress);
                    drawGrid(self.progress);
                }
            });
        }, containerRef);


        animate();

        // Resize handler
        const handleResize = () => {
            resizeGridCanvas();
            lettersCamera.aspect = window.innerWidth / window.innerHeight;
            lettersCamera.updateProjectionMatrix();
            lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            ctx.revert();
            lenis.destroy();
            window.removeEventListener("resize", handleResize);
            if (workSectionRef.current && lettersRenderer.domElement) {
                workSectionRef.current.removeChild(lettersRenderer.domElement);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className={styles['projects-section-container']}>
            <div ref={workSectionRef} className={styles['projects-work']}>
                <canvas ref={gridCanvasRef} id="grid-canvas" className={styles['projects-canvas-grid']} />

                <div ref={textContainerRef} className={styles['projects-text-container']} />

                <div ref={cardsContainerRef} className={styles['projects-cards']}>
                    {projects.map((project, index) => (
                        <div key={index} className={styles['projects-card']}>
                            <div className={styles['projects-card-img']}>
                                {/* Use actual project images or placeholders */}
                                <img src={project.image} alt={project.title} />
                            </div>
                            <div className={styles['projects-card-copy']}>
                                <span>{project.title}</span>
                                <span>{project.category}</span>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate for loop/length if needed, or simply have enough projects to scroll */}
                    {projects.map((project, index) => (
                        <div key={`dup-${index}`} className={styles['projects-card']}>
                            <div className={styles['projects-card-img']}>
                                <img src={project.image} alt={project.title} />
                            </div>
                            <div className={styles['projects-card-copy']}>
                                <span>{project.title}</span>
                                <span>{project.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
