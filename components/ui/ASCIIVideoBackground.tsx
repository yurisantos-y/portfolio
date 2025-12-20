"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ASCII characters ordered by brightness (dark to light)
const ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

// Vertex Shader for ASCII grid
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRepulsionRadius;
  uniform float uRepulsionStrength;
  
  attribute vec2 aBasePosition;
  attribute float aBrightness;
  attribute float aCharIndex;
  
  varying float vBrightness;
  varying float vCharIndex;
  varying vec2 vUv;
  varying float vDisplacement;
  
  void main() {
    vUv = uv;
    vBrightness = aBrightness;
    vCharIndex = aCharIndex;
    
    vec3 pos = position;
    
    // Calculate distance to mouse
    vec2 mousePos = uMouse;
    vec2 toMouse = aBasePosition - mousePos;
    float dist = length(toMouse);
    
    // Repulsion effect - characters flee from cursor
    float repulsionRadius = uRepulsionRadius;
    float repulsion = smoothstep(repulsionRadius, 0.0, dist);
    
    // Add some organic movement
    float wave = sin(aBasePosition.x * 3.0 + uTime * 0.5) * cos(aBasePosition.y * 3.0 + uTime * 0.3);
    repulsion *= (1.0 + wave * 0.2);
    
    // Displace position away from mouse
    vec2 displacement = vec2(0.0);
    if (dist > 0.001) {
      displacement = normalize(toMouse) * repulsion * uRepulsionStrength;
    }
    
    pos.xy += displacement;
    vDisplacement = repulsion;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
    // Size based on displacement and brightness
    float baseSize = 8.0;
    float sizeMultiplier = 1.0 + repulsion * 0.5;
    gl_PointSize = baseSize * sizeMultiplier;
  }
`;

// Fragment Shader for rendering ASCII characters
const fragmentShader = `
  uniform sampler2D uAsciiTexture;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  
  varying float vBrightness;
  varying float vCharIndex;
  varying vec2 vUv;
  varying float vDisplacement;
  
  void main() {
    // Calculate character position in the ASCII texture atlas
    float charCount = 70.0; // Number of ASCII characters
    float charWidth = 1.0 / charCount;
    
    // Map point coordinates to character texture
    vec2 pointCoord = gl_PointCoord;
    float charIndex = floor(vCharIndex);
    
    vec2 charUv = vec2(
      (charIndex + pointCoord.x) * charWidth,
      pointCoord.y
    );
    
    // Sample the ASCII texture
    vec4 charColor = texture2D(uAsciiTexture, charUv);
    
    // Color mixing based on brightness and displacement
    vec3 color = mix(uBaseColor, uAccentColor, vDisplacement * 0.8 + vBrightness * 0.2);
    
    // Glow effect when displaced
    float glow = vDisplacement * 0.5;
    color += uAccentColor * glow;
    
    // Final color with brightness-based alpha
    float alpha = charColor.r * vBrightness * uOpacity;
    alpha += vDisplacement * 0.3 * uOpacity;
    
    // Vignette effect
    vec2 center = vec2(0.5);
    float vignette = 1.0 - length(vUv - center) * 0.8;
    vignette = clamp(vignette, 0.0, 1.0);
    
    gl_FragColor = vec4(color, alpha * vignette);
  }
`;

// Alternative simpler approach - Render ASCII as a post-processing effect
const asciiVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const asciiFragmentShader = `
  uniform sampler2D uVideo;
  uniform sampler2D uAsciiTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uOpacity;
  uniform float uCellSize;
  uniform float uRepulsionRadius;
  uniform float uRepulsionStrength;
  
  varying vec2 vUv;
  
  // ASCII characters count
  const float CHAR_COUNT = 70.0;
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate cell position
    vec2 aspectCorrection = vec2(uResolution.x / uResolution.y, 1.0);
    float cellSize = uCellSize / uResolution.y;
    
    // Grid position
    vec2 cellUv = floor(uv / cellSize) * cellSize;
    vec2 cellCenter = cellUv + cellSize * 0.5;
    
    // Mouse repulsion
    vec2 mouseNorm = uMouse * 0.5 + 0.5;
    vec2 toMouse = cellCenter - mouseNorm;
    float distToMouse = length(toMouse * aspectCorrection);
    
    float repulsion = smoothstep(uRepulsionRadius, 0.0, distToMouse);
    
    // Displacement direction
    vec2 displacement = vec2(0.0);
    if (distToMouse > 0.001) {
      displacement = normalize(toMouse) * repulsion * uRepulsionStrength * cellSize;
    }
    
    // Apply displacement to sample position
    vec2 sampleUv = cellUv + displacement;
    sampleUv = clamp(sampleUv, 0.0, 1.0);
    
    // Sample video at cell position for brightness
    vec4 videoColor = texture2D(uVideo, sampleUv + cellSize * 0.5);
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
    // More vibrant orange tones - from dark to bright
    vec3 darkOrange = vec3(0.8, 0.3, 0.05);    // Rich dark orange
    vec3 midOrange = vec3(1.0, 0.5, 0.1);      // Vibrant orange
    vec3 brightOrange = vec3(1.0, 0.7, 0.25);  // Bright amber
    vec3 hotOrange = vec3(1.0, 0.9, 0.5);      // Hot yellow-orange
    
    // Create orange gradient based on video brightness
    vec3 orangeColor;
    if (brightness < 0.25) {
      orangeColor = mix(darkOrange, midOrange, brightness * 4.0);
    } else if (brightness < 0.5) {
      orangeColor = mix(midOrange, brightOrange, (brightness - 0.25) * 4.0);
    } else {
      orangeColor = mix(brightOrange, hotOrange, (brightness - 0.5) * 2.0);
    }
    
    // Ensure minimum orange visibility even in dark areas
    orangeColor = max(orangeColor, darkOrange * 0.5);
    
    // Boost color intensity near mouse (glow effect)
    vec3 glowColor = vec3(1.0, 0.55, 0.15); // Intense warm orange glow
    float glowIntensity = repulsion * 2.0;
    orangeColor = mix(orangeColor, glowColor, glowIntensity * 0.8);
    orangeColor += glowColor * glowIntensity * 0.4;
    
    // Character visibility (use red channel as alpha mask)
    float charAlpha = charSample.r;
    
    // Base alpha from character and brightness - increased base visibility
    float alpha = charAlpha * (0.6 + brightness * 0.4);
    
    // Boost alpha and brightness on repulsion
    alpha += repulsion * 0.5 * charAlpha;
    
    // Vignette effect - softer
    float vignette = 1.0 - length(uv - 0.5) * 0.9;
    vignette = pow(max(vignette, 0.0), 1.0);
    
    // Final output - multiply by opacity and vignette
    alpha *= uOpacity * vignette;
    
    // Clamp color to avoid overflow
    orangeColor = clamp(orangeColor, 0.0, 1.0);
    
    gl_FragColor = vec4(orangeColor, alpha);
  }
`;

export const ASCIIVideoBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
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

    // Attempt to play
    video.play().catch(() => {
      // Autoplay may be blocked, that's okay
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

    // Renderer with explicit context loss handling
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle WebGL context loss
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("ASCIIVideoBackground: WebGL context lost");
      cancelAnimationFrame(animationRef.current);
    };

    const handleContextRestored = () => {
      console.log("ASCIIVideoBackground: WebGL context restored");
      animate();
    };

    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);

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

    // Shader material
    const uniforms = {
      uVideo: { value: videoTexture },
      uAsciiTexture: { value: asciiTexture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uOpacity: { value: 0 },
      uCellSize: { value: 5.0 }, // Size of each ASCII cell in pixels (smaller = higher density)
      uRepulsionRadius: { value: 0.15 }, // Radius of mouse repulsion effect
      uRepulsionStrength: { value: 3.0 }, // Strength of repulsion
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
      duration: 2,
      ease: "power2.out",
    });

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        targetMouseRef.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouseRef.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      uniforms.uResolution.value.set(width, height);
    };

    // Intersection Observer to pause rendering when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Animation loop with visibility check
    const clock = new THREE.Clock();

    const animate = () => {
      // Skip rendering if not visible - saves GPU resources
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse following
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

      // Update uniforms
      uniforms.uTime.value = elapsedTime;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Update video texture
      if (video.readyState >= 2) {
        videoTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
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
  }, [isMounted, videoReady, createAsciiTexture]);

  return (
    <>
      {/* Hidden video element */}
      <video
        ref={videoRef}
        src="/video-hero.mp4"
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

      {/* Three.js canvas container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
};
