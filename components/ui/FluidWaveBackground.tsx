"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader - Fluid gradient with noise
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uIntensity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // FBM (Fractal Brownian Motion)
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    
    // Calculate distance from mouse
    vec2 mousePos = uMouse * 0.5 + 0.5;
    float dist = distance(uv * aspect, mousePos * aspect);
    
    // Time-based animation
    float time = uTime * 0.3;
    
    // Create flowing noise pattern
    vec2 q = vec2(0.0);
    q.x = fbm(uv * 2.0 + time * 0.5);
    q.y = fbm(uv * 2.0 + vec2(1.0));
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv * 2.0 + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time);
    r.y = fbm(uv * 2.0 + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time);
    
    float f = fbm(uv * 2.0 + r);
    
    // Mouse influence - creates ripple effect
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * uIntensity;
    f += mouseInfluence * 0.5 * sin(dist * 10.0 - time * 2.0);
    
    // Color palette - Dark theme with accent
    vec3 color1 = vec3(0.08, 0.08, 0.10);      // Dark base
    vec3 color2 = vec3(0.12, 0.12, 0.15);      // Slightly lighter
    vec3 color3 = vec3(0.964, 0.188, 0.263);   // Primary accent #F63043
    vec3 color4 = vec3(0.15, 0.10, 0.12);      // Dark accent tint
    
    // Mix colors based on noise
    vec3 finalColor = mix(color1, color2, clamp(f * f * 2.0, 0.0, 1.0));
    finalColor = mix(finalColor, color4, clamp(length(q), 0.0, 1.0));
    
    // Add subtle accent color influence near mouse and in certain areas
    float accentMix = smoothstep(0.4, 0.0, dist) * 0.15 * uIntensity;
    accentMix += smoothstep(0.5, 1.0, f) * 0.05;
    finalColor = mix(finalColor, color3, accentMix);
    
    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
    finalColor *= 0.9 + vignette * 0.1;
    
    // Add subtle gradient overlay
    finalColor += vec3(0.02, 0.015, 0.02) * (1.0 - uv.y);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface FluidWaveBackgroundProps {
    className?: string;
}

export const FluidWaveBackground = ({ className = "" }: FluidWaveBackgroundProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetMouseRef = useRef({ x: 0, y: 0 });
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    // Handle SSR hydration
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
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Shader material
        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uIntensity: { value: 0 },
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
        });

        // Fullscreen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animate in the intensity
        gsap.to(uniforms.uIntensity, {
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

            // Smooth mouse following
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

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
            className={`absolute inset-0 z-0 ${className}`}
            style={{ width: "100%", height: "100%" }}
        />
    );
};
