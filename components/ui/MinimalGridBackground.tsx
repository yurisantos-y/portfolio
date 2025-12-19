"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Subtle wave based on mouse position
    float dist = distance(uv, uMouse * 0.5 + 0.5);
    float wave = sin(dist * 8.0 - uTime * 2.0) * 0.02;
    float falloff = smoothstep(0.5, 0.0, dist);
    
    pos.z += wave * falloff;
    vElevation = wave * falloff;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader - Minimal grid with diagonal movement
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uOpacity;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vec2 uv = vUv;
    
    // Correct for aspect ratio to get perfect squares
    float aspect = uResolution.x / uResolution.y;
    vec2 squareUv = vec2(uv.x * aspect, uv.y);
    
    // Diagonal movement - offset UV over time
    float speed = 0.02;
    vec2 movingUv = squareUv + vec2(uTime * speed, uTime * speed);
    
    // Grid parameters - 30x30 perfect squares
    float gridSize = 30.0;
    vec2 grid = fract(movingUv * gridSize / aspect);
    
    // Create thin lines
    float lineWidth = 0.025;
    float lineX = smoothstep(lineWidth, 0.0, grid.x) + smoothstep(1.0 - lineWidth, 1.0, grid.x);
    float lineY = smoothstep(lineWidth, 0.0, grid.y) + smoothstep(1.0 - lineWidth, 1.0, grid.y);
    float lines = max(lineX, lineY);
    
    // Mouse influence - subtle glow near cursor
    vec2 mousePos = uMouse * 0.5 + 0.5;
    float dist = distance(uv, mousePos);
    float mouseGlow = smoothstep(0.25, 0.0, dist) * 0.6;
    
    // Stronger vignette
    float vignetteStrength = length(uv - 0.5) * 1.6;
    float vignette = 1.0 - smoothstep(0.0, 0.7, vignetteStrength);
    vignette = pow(vignette, 1.3);
    
    // Corner darkening
    float cornerDark = smoothstep(0.3, 0.9, length(uv - 0.5));
    
    // Color - very subtle white/gray
    float alpha = lines * 0.12 * vignette;
    alpha += mouseGlow * 0.12 * lines;
    
    // Reduce alpha in corners
    alpha *= (1.0 - cornerDark * 0.7);
    
    // Add subtle accent color on mouse hover
    vec3 baseColor = vec3(1.0, 1.0, 1.0);
    vec3 accentColor = vec3(0.964, 0.188, 0.263); // #F63043
    vec3 color = mix(baseColor, accentColor, mouseGlow * 0.4);
    
    alpha *= uOpacity;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const MinimalGridBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetMouseRef = useRef({ x: 0, y: 0 });
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Shader material
        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uOpacity: { value: 0 },
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });

        // Fullscreen quad
        const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Fade in
        gsap.to(uniforms.uOpacity, {
            value: 1,
            duration: 2,
            ease: "power2.out",
        });

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            targetMouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            targetMouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };

        // Resize handler
        const handleResize = () => {
            if (!container || !rendererRef.current) return;
            const width = container.clientWidth;
            const height = container.clientHeight;

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            uniforms.uResolution.value.set(width, height);
        };

        // Animation loop
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Very smooth mouse following
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.03;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.03;

            // Update uniforms
            uniforms.uTime.value = elapsedTime;
            uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };

        // Event listeners
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        // Start animation
        animate();

        // Cleanup
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);

            if (rendererRef.current && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [isMounted]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0"
            style={{ width: "100%", height: "100%" }}
        />
    );
};
