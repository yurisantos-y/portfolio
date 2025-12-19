"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ASCII characters ordered by brightness (dark to light)
const ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

// Vertex Shader
const asciiVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader for rendering ASCII characters with orange color scheme
const asciiFragmentShader = `
  uniform sampler2D uVideo;
  uniform sampler2D uAsciiTexture;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uOpacity;
  uniform float uCellSize;
  
  varying vec2 vUv;
  
  // ASCII characters count
  const float CHAR_COUNT = 70.0;
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate cell position
    float cellSize = uCellSize / uResolution.y;
    
    // Grid position
    vec2 cellUv = floor(uv / cellSize) * cellSize;
    
    // Sample video at cell position for brightness
    vec4 videoColor = texture2D(uVideo, cellUv + cellSize * 0.5);
    float brightness = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Map brightness to character index
    float charIndex = floor(brightness * (CHAR_COUNT - 1.0));
    
    // Position within the cell for character rendering
    vec2 cellLocalUv = fract(uv / cellSize);
    
    // Calculate UV in the ASCII texture atlas
    float charWidth = 1.0 / CHAR_COUNT;
    vec2 charUv = vec2(
      charIndex * charWidth + cellLocalUv.x * charWidth,
      cellLocalUv.y
    );
    
    // Sample character from atlas
    vec4 charSample = texture2D(uAsciiTexture, charUv);
    
    // ========== ORANGE COLOR SCHEME ==========
    vec3 darkOrange = vec3(0.8, 0.3, 0.05);
    vec3 midOrange = vec3(1.0, 0.5, 0.1);
    vec3 brightOrange = vec3(1.0, 0.7, 0.25);
    vec3 hotOrange = vec3(1.0, 0.9, 0.5);
    
    // Create orange gradient based on video brightness
    vec3 orangeColor;
    if (brightness < 0.25) {
      orangeColor = mix(darkOrange, midOrange, brightness * 4.0);
    } else if (brightness < 0.5) {
      orangeColor = mix(midOrange, brightOrange, (brightness - 0.25) * 4.0);
    } else {
      orangeColor = mix(brightOrange, hotOrange, (brightness - 0.5) * 2.0);
    }
    
    // Ensure minimum orange visibility
    orangeColor = max(orangeColor, darkOrange * 0.5);
    
    // Character visibility
    float charAlpha = charSample.r;
    
    // Base alpha from character and brightness
    float alpha = charAlpha * (0.6 + brightness * 0.4);
    
    // Vignette effect - softer
    float vignette = 1.0 - length(uv - 0.5) * 0.6;
    vignette = pow(max(vignette, 0.0), 0.8);
    
    // Final output
    alpha *= uOpacity * vignette;
    orangeColor = clamp(orangeColor, 0.0, 1.0);
    
    gl_FragColor = vec4(orangeColor, alpha);
  }
`;


interface ASCIIVideoProps {
    videoSrc: string;
    className?: string;
    cellSize?: number;
}

export const ASCIIVideo = ({
    videoSrc,
    className = "",
    cellSize = 6.0,
}: ASCIIVideoProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);
    const [isMounted, setIsMounted] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    // Create ASCII texture atlas
    const createAsciiTexture = useCallback(() => {
        const canvas = document.createElement("canvas");
        const charSize = 32;
        canvas.width = ASCII_CHARS.length * charSize;
        canvas.height = charSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = `${charSize * 0.9}px "Courier New", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < ASCII_CHARS.length; i++) {
            ctx.fillText(ASCII_CHARS[i], i * charSize + charSize / 2, charSize / 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        return texture;
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !containerRef.current || !videoRef.current) return;

        const video = videoRef.current;

        const handleVideoReady = () => {
            if (video.readyState >= 3) {
                setVideoReady(true);
            }
        };

        video.addEventListener("canplaythrough", handleVideoReady);
        video.addEventListener("playing", handleVideoReady);

        video.play().catch(() => {
            console.log("Video autoplay blocked, waiting for user interaction");
        });

        return () => {
            video.removeEventListener("canplaythrough", handleVideoReady);
            video.removeEventListener("playing", handleVideoReady);
        };
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted || !containerRef.current || !videoRef.current || !videoReady) return;

        const container = containerRef.current;
        const video = videoRef.current;

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

        // Create video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        // Create ASCII texture atlas
        const asciiTexture = createAsciiTexture();
        if (!asciiTexture) {
            console.error("Failed to create ASCII texture");
            return;
        }

        // Shader material - simplified without mouse interaction
        const uniforms = {
            uVideo: { value: videoTexture },
            uAsciiTexture: { value: asciiTexture },
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uOpacity: { value: 0 },
            uCellSize: { value: cellSize },
        };

        const material = new THREE.ShaderMaterial({
            vertexShader: asciiVertexShader,
            fragmentShader: asciiFragmentShader,
            uniforms,
            transparent: true,
            blending: THREE.NormalBlending,
        });

        // Fullscreen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Fade in
        gsap.to(uniforms.uOpacity, {
            value: 1,
            duration: 1.5,
            ease: "power2.out",
        });



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

            // Update uniforms
            uniforms.uTime.value = elapsedTime;

            // Update video texture
            if (video.readyState >= 2) {
                videoTexture.needsUpdate = true;
            }

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };

        // Event listeners
        window.addEventListener("resize", handleResize);

        // Start animation
        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);

            if (rendererRef.current && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            geometry.dispose();
            material.dispose();
            videoTexture.dispose();
            asciiTexture.dispose();
            renderer.dispose();
        };
    }, [isMounted, videoReady, createAsciiTexture, cellSize]);

    return (
        <div className={`relative ${className}`}>
            {/* Hidden video element */}
            <video
                ref={videoRef}
                src={videoSrc}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />

            {/* Three.js canvas container - Pure, no decorations */}
            <div
                ref={containerRef}
                className="absolute inset-0 z-0"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};
