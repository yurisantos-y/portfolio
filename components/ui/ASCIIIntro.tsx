"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// ASCII characters ordered by visual density (light to dark)
const ASCII_CHARS = " .:-=+*#%@";

interface ASCIIIntroProps {
    onComplete?: () => void;
    minDuration?: number; // Minimum time to show intro (ms)
}

export function ASCIIIntro({
    onComplete,
    minDuration = 2500,
}: ASCIIIntroProps) {
    const [phase, setPhase] = useState<"loading" | "revealing" | "complete">(
        "loading"
    );
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [asciiMatrix, setAsciiMatrix] = useState<string[][]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number>(Date.now());
    const animationFrameRef = useRef<number | undefined>(undefined);

    // Matrix dimensions
    const cols = 80;
    const rows = 24;

    // Generate random ASCII character
    const getRandomChar = useCallback(() => {
        return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
    }, []);

    // Initialize ASCII matrix
    useEffect(() => {
        const matrix: string[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: string[] = [];
            for (let x = 0; x < cols; x++) {
                row.push(getRandomChar());
            }
            matrix.push(row);
        }
        setAsciiMatrix(matrix);
    }, [getRandomChar]);

    // Animate the matrix - scramble effect
    useEffect(() => {
        if (phase === "complete") return;

        const scrambleInterval = setInterval(() => {
            setAsciiMatrix((prev) => {
                const newMatrix = prev.map((row) => [...row]);
                // Scramble random characters
                const scrambleCount = Math.floor(cols * rows * 0.15);
                for (let i = 0; i < scrambleCount; i++) {
                    const x = Math.floor(Math.random() * cols);
                    const y = Math.floor(Math.random() * rows);
                    if (newMatrix[y]) {
                        newMatrix[y][x] = getRandomChar();
                    }
                }
                return newMatrix;
            });
        }, 50);

        return () => clearInterval(scrambleInterval);
    }, [phase, getRandomChar]);

    // Progress simulation and resource loading
    useEffect(() => {
        startTimeRef.current = Date.now();

        // Simulated loading with acceleration curve
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const elapsed = Date.now() - startTimeRef.current;
                const targetProgress = Math.min(
                    95,
                    (elapsed / minDuration) * 100 * 1.2
                );
                return prev + (targetProgress - prev) * 0.1;
            });
        }, 30);

        // Check if resources are loaded
        const checkComplete = () => {
            const elapsed = Date.now() - startTimeRef.current;
            if (elapsed >= minDuration && document.readyState === "complete") {
                setProgress(100);
                setTimeout(() => {
                    setPhase("revealing");
                }, 300);
            } else {
                setTimeout(checkComplete, 100);
            }
        };

        if (document.readyState === "complete") {
            setTimeout(checkComplete, 100);
        } else {
            window.addEventListener("load", checkComplete);
        }

        return () => {
            clearInterval(progressInterval);
            window.removeEventListener("load", checkComplete);
        };
    }, [minDuration]);

    // Handle reveal phase
    useEffect(() => {
        if (phase === "revealing") {
            setIsExiting(true);
            const exitTimer = setTimeout(() => {
                setPhase("complete");
                onComplete?.();
            }, 800);

            return () => clearTimeout(exitTimer);
        }
    }, [phase, onComplete]);

    // Canvas animation for particles effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Particles
        const particles: {
            x: number;
            y: number;
            char: string;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            size: number;
        }[] = [];

        const createParticle = () => {
            if (particles.length > 50) return;
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                life: 0,
                maxLife: 100 + Math.random() * 100,
                size: 10 + Math.random() * 8,
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create new particles occasionally
            if (Math.random() < 0.1 && phase === "loading") {
                createParticle();
            }

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life++;

                if (p.life > p.maxLife) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha =
                    Math.sin((p.life / p.maxLife) * Math.PI) * (isExiting ? 0.03 : 0.08);
                ctx.fillStyle = `rgba(246, 48, 67, ${alpha})`;
                ctx.font = `${p.size}px var(--font-jetbrains), monospace`;
                ctx.fillText(p.char, p.x, p.y);
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [phase, isExiting]);

    if (phase === "complete") {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-all duration-700 ${isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
                }`}
            style={{
                background:
                    "radial-gradient(ellipse at center, rgba(20, 20, 20, 1) 0%, rgba(10, 10, 10, 1) 100%)",
            }}
        >
            {/* Background particles canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: 0.5 }}
            />

            {/* ASCII Matrix Background */}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                style={{
                    opacity: isExiting ? 0 : 0.15,
                    transition: "opacity 0.5s ease-out",
                }}
            >
                <pre
                    className="font-mono text-[8px] sm:text-[10px] leading-tight text-primary/30 whitespace-pre"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {asciiMatrix.map((row, i) => (
                        <div key={i}>{row.join("")}</div>
                    ))}
                </pre>
            </div>

            {/* Center content */}
            <div
                className={`relative z-10 flex flex-col items-center gap-8 transition-all duration-500 ${isExiting ? "translate-y-[-20px] opacity-0" : "translate-y-0 opacity-100"
                    }`}
            >
                {/* Logo/Name with ASCII effect */}
                <div className="relative">
                    <h1 className="font-badeen text-5xl sm:text-7xl md:text-8xl text-text-primary tracking-wider">
                        <span
                            className="inline-block"
                            style={{
                                textShadow: "0 0 40px rgba(246, 48, 67, 0.3)",
                            }}
                        >
                            YS
                        </span>
                    </h1>

                    {/* Glitch lines */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(246, 48, 67, 0.03) 2px,
                rgba(246, 48, 67, 0.03) 4px
              )`,
                        }}
                    />
                </div>

                {/* Loading bar */}
                <div className="w-48 sm:w-64 h-px bg-surface/50 overflow-hidden relative">
                    <div
                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out"
                        style={{
                            width: `${progress}%`,
                            boxShadow: "0 0 10px rgba(246, 48, 67, 0.8)",
                        }}
                    />
                </div>

                {/* Progress text */}
                <div className="font-mono text-xs text-text-secondary/60 tracking-widest">
                    <span className="text-primary">{Math.floor(progress)}</span>
                    <span className="text-text-secondary/40">%</span>
                </div>

                {/* ASCII art decoration */}
                <pre className="font-mono text-[10px] text-text-secondary/20 leading-none hidden sm:block">
                    {`╔══════════════════════════════╗
║  ▓▓▓▓▓  LOADING  ▓▓▓▓▓       ║
╚══════════════════════════════╝`}
                </pre>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 font-mono text-[10px] text-text-secondary/30">
                {">"} init_portfolio
            </div>
            <div className="absolute top-4 right-4 font-mono text-[10px] text-text-secondary/30">
                v1.0.0
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-text-secondary/30">
                [system.ready]
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-text-secondary/30">
                ASCII.mode
            </div>
        </div>
    );
}

export default ASCIIIntro;
