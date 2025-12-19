"use client";

import { useEffect, useRef } from "react";

interface OrganicParticle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    offset: number; // Random offset for animation
    color: string;
    points: number[]; // For organic shape deformation
    rotation: number;
    rotationSpeed: number;
    lag: number; // How fast it follows the cursor (0-1)
}

export const ParticlesBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -100, y: -100 });
    const particlesRef = useRef<OrganicParticle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        // Configuration
        const particleCount = 8; // Number of organic shapes
        // Use a mix of colors from the theme or the requested style
        // We'll use semi-transparent whites/greys and maybe one accent for the "heart" feel
        const colors = [
            "rgba(250, 250, 250, 0.15)", // text-primary
            "rgba(113, 113, 122, 0.2)",  // text-secondary
            "rgba(246, 48, 67, 0.1)",    // primary/accent (very subtle)
        ];

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Start particles at center or off-screen
            const startX = canvas.width / 2;
            const startY = canvas.height / 2;

            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                // Generate random points for organic blob shape
                // We'll use 8-12 points around the circle
                const pointsCount = 8 + Math.floor(Math.random() * 4);
                const points = Array.from({ length: pointsCount }, () => 0.8 + Math.random() * 0.4); // Variation between 0.8 and 1.2

                particlesRef.current.push({
                    x: startX,
                    y: startY,
                    vx: 0,
                    vy: 0,
                    size: 30 + Math.random() * 60, // Varying sizes
                    offset: Math.random() * Math.PI * 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    points: points,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    lag: 0.05 + Math.random() * 0.10 // Different speeds creates depth
                });
            }
        };

        const handleResize = () => {
            // Re-init but keep positions if possible, for now simple re-init
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        // Draw an organic blob shape
        const drawOrganicShape = (ctx: CanvasRenderingContext2D, p: OrganicParticle, time: number) => {
            ctx.beginPath();
            const pointCount = p.points.length;
            const angleStep = (Math.PI * 2) / pointCount;

            // Calculate vertices
            const vertices = p.points.map((variation, i) => {
                const angle = i * angleStep + p.rotation;
                // Animate the variation slightly with time
                const activeVariation = variation + Math.sin(time * 2 + i + p.offset) * 0.1;
                const r = p.size * activeVariation;
                return {
                    x: p.x + Math.cos(angle) * r,
                    y: p.y + Math.sin(angle) * r
                };
            });

            // Curve through vertices
            // Move to first mid-point
            const firstMid = {
                x: (vertices[0].x + vertices[vertices.length - 1].x) / 2,
                y: (vertices[0].y + vertices[vertices.length - 1].y) / 2
            };
            ctx.moveTo(firstMid.x, firstMid.y);

            for (let i = 0; i < vertices.length; i++) {
                const nextIndex = (i + 1) % vertices.length;
                const nextVertex = vertices[nextIndex];
                const midPoint = {
                    x: (vertices[i].x + nextVertex.x) / 2,
                    y: (vertices[i].y + nextVertex.y) / 2
                };

                // Quadratic curve slightly smooths the irregular polygon
                ctx.quadraticCurveTo(vertices[i].x, vertices[i].y, midPoint.x, midPoint.y);
            }

            ctx.lineWidth = 2 + Math.sin(time + p.offset) * 1; // Breathing stroke width
            ctx.strokeStyle = p.color;
            ctx.stroke();
            // Optional: fill with very low opacity?
            // ctx.fillStyle = p.color.replace("0.2", "0.05").replace("0.1", "0.02");
            // ctx.fill();
        };

        const draw = () => {
            const time = Date.now() * 0.001;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Only update if mouse has moved at least once (initialized)
            // But we initialized mouseRef to -100.

            const targetX = mouseRef.current.x;
            const targetY = mouseRef.current.y;

            particlesRef.current.forEach((p, i) => {
                // Smooth follow logic (Lerp)
                const dx = targetX - p.x;
                const dy = targetY - p.y;

                p.x += dx * p.lag;
                p.y += dy * p.lag;

                // Rotate
                p.rotation += p.rotationSpeed;

                // Draw
                drawOrganicShape(ctx, p, time);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const initListener = () => {
            init();
            window.addEventListener("resize", handleResize);
            window.addEventListener("mousemove", handleMouseMove);
            draw();
        };

        initListener();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
};
