"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Extended ASCII characters for better gradation (dark to light)
const ASCII_CHARS = " .`'-:_,\"^;~!><+i=?/\\|()1{}[]rcvunxzjftLCJUYXZO0QoahkSPDAKW#MW%8@$";

// Vertex Shader for the 3D object - enhanced lighting
const objectVertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Fragment Shader for the 3D object - enhanced lighting for better ASCII definition
const objectFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Multiple light sources for better definition
        vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
        vec3 lightDir2 = normalize(vec3(-0.5, 0.8, 0.5));
        vec3 lightDir3 = normalize(vec3(0.0, -0.5, 1.0));
        vec3 lightDir4 = normalize(vec3(-1.0, 0.2, 0.3));
        
        // Diffuse lighting with varied intensities
        float diff1 = max(dot(normal, lightDir1), 0.0) * 0.7;
        float diff2 = max(dot(normal, lightDir2), 0.0) * 0.4;
        float diff3 = max(dot(normal, lightDir3), 0.0) * 0.3;
        float diff4 = max(dot(normal, lightDir4), 0.0) * 0.2;
        
        float lighting = diff1 + diff2 + diff3 + diff4;
        
        // Enhanced fresnel rim lighting for edge definition
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
        lighting += fresnel * 0.5;
        
        // Add ambient occlusion simulation based on normal direction
        float ao = 0.5 + 0.5 * normal.y;
        lighting *= mix(0.7, 1.0, ao);
        
        // Boost contrast for sharper ASCII definition
        float brightness = pow(clamp(lighting, 0.0, 1.0), 0.8);
        brightness = clamp(brightness * 1.1, 0.0, 1.0);
        
        gl_FragColor = vec4(vec3(brightness), 1.0);
    }
`;

// ASCII Post-processing vertex shader
const postVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

// Enhanced ASCII Post-processing fragment shader
const asciiFragmentShader = `
    uniform sampler2D uScene;
    uniform sampler2D uAsciiTexture;
    uniform vec2 uResolution;
    uniform float uCellSize;
    uniform float uTime;
    
    varying vec2 vUv;
    
    const float CHAR_COUNT = 70.0;
    
    void main() {
        vec2 uv = vUv;
        
        // Calculate cell position with high precision
        float cellSize = uCellSize / uResolution.y;
        float aspectRatio = uResolution.x / uResolution.y;
        
        vec2 cellSizeVec = vec2(cellSize / aspectRatio, cellSize);
        vec2 cellIndex = floor(uv / cellSizeVec);
        vec2 cellCenter = (cellIndex + 0.5) * cellSizeVec;
        
        // Multi-sample for smoother brightness detection
        float brightness = 0.0;
        brightness += texture2D(uScene, cellCenter).r;
        brightness += texture2D(uScene, cellCenter + vec2(cellSizeVec.x * 0.3, 0.0)).r * 0.7;
        brightness += texture2D(uScene, cellCenter - vec2(cellSizeVec.x * 0.3, 0.0)).r * 0.7;
        brightness += texture2D(uScene, cellCenter + vec2(0.0, cellSizeVec.y * 0.3)).r * 0.7;
        brightness += texture2D(uScene, cellCenter - vec2(0.0, cellSizeVec.y * 0.3)).r * 0.7;
        brightness /= 3.8;
        
        // Skip if too dark (background)
        if (brightness < 0.02) {
            discard;
        }
        
        // Enhanced brightness curve for better character distribution
        brightness = pow(brightness, 0.6) * 1.3;
        brightness = clamp(brightness, 0.0, 1.0);
        
        // Apply dithering for smoother transitions
        float dither = fract(sin(dot(cellIndex, vec2(12.9898, 78.233))) * 43758.5453);
        brightness += (dither - 0.5) * 0.03;
        brightness = clamp(brightness, 0.0, 1.0);
        
        // Map brightness to character index with smooth selection
        float charIndex = floor(brightness * (CHAR_COUNT - 1.0));
        
        // Position within the cell for character rendering
        vec2 cellLocalUv = fract(uv / cellSizeVec);
        
        // Add slight padding to characters for cleaner look
        vec2 paddedUv = cellLocalUv * 0.9 + 0.05;
        paddedUv = clamp(paddedUv, 0.0, 1.0);
        
        // Calculate UV in the ASCII texture atlas
        float charWidth = 1.0 / CHAR_COUNT;
        vec2 charUv = vec2(
            charIndex * charWidth + paddedUv.x * charWidth,
            paddedUv.y
        );
        
        // Sample character from atlas with linear filtering
        vec4 charSample = texture2D(uAsciiTexture, charUv);
        
        // Rich orange color palette
        vec3 deepOrange = vec3(0.4, 0.12, 0.0);
        vec3 darkOrange = vec3(0.6, 0.22, 0.0);
        vec3 midOrange = vec3(1.0, 0.45, 0.05);
        vec3 brightOrange = vec3(1.0, 0.6, 0.15);
        vec3 hotOrange = vec3(1.0, 0.85, 0.4);
        vec3 whiteHot = vec3(1.0, 0.95, 0.8);
        
        // Smooth 5-step gradient based on brightness
        vec3 color;
        if (brightness < 0.2) {
            color = mix(deepOrange, darkOrange, brightness * 5.0);
        } else if (brightness < 0.4) {
            color = mix(darkOrange, midOrange, (brightness - 0.2) * 5.0);
        } else if (brightness < 0.6) {
            color = mix(midOrange, brightOrange, (brightness - 0.4) * 5.0);
        } else if (brightness < 0.8) {
            color = mix(brightOrange, hotOrange, (brightness - 0.6) * 5.0);
        } else {
            color = mix(hotOrange, whiteHot, (brightness - 0.8) * 5.0);
        }
        
        // Subtle glow effect for bright areas
        float glowIntensity = smoothstep(0.5, 1.0, brightness) * 0.2;
        vec3 glowColor = vec3(1.0, 0.5, 0.1);
        color = mix(color, glowColor, glowIntensity);
        
        // Subtle pulsing animation
        float pulse = sin(uTime * 1.2) * 0.03 + 1.0;
        color *= pulse;
        
        // Character alpha with enhanced visibility
        float charAlpha = charSample.r;
        
        // Sharp character edges
        charAlpha = smoothstep(0.2, 0.5, charAlpha);
        
        // Final alpha calculation
        float alpha = charAlpha * (0.8 + brightness * 0.3);
        
        // Ambient glow for depth
        float ambientGlow = smoothstep(0.0, 0.4, charSample.r) * 0.1;
        alpha = max(alpha, ambientGlow * brightness);
        
        // Subtle scanline effect (less prominent)
        float scanLine = sin(uv.y * uResolution.y * 0.3 + uTime * 1.5) * 0.02 + 0.98;
        alpha *= scanLine;
        
        // Edge enhancement for character definition
        float edgeEnhance = 1.0 + (1.0 - smoothstep(0.0, 0.3, charSample.r)) * 0.1;
        color *= edgeEnhance;
        
        gl_FragColor = vec4(color, alpha);
    }
`;

// Create high-resolution ASCII texture atlas
function createAsciiTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    const charSize = 64; // Higher resolution for sharper characters
    canvas.width = ASCII_CHARS.length * charSize;
    canvas.height = charSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");

    // Clear with black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw characters with high quality
    ctx.fillStyle = "white";
    ctx.font = `bold ${charSize * 0.85}px "Courier New", "Consolas", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Enable text smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    for (let i = 0; i < ASCII_CHARS.length; i++) {
        ctx.fillText(ASCII_CHARS[i], i * charSize + charSize / 2, charSize / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    return texture;
}

interface PillarModelProps {
    className?: string;
    scale?: number;
    rotationY?: number;
    positionY?: number;
    cellSize?: number;
}

export const PillarModel = ({
    className = "",
    scale = 1,
    rotationY = 0,
    positionY = 0,
    cellSize = 3.5, // Smaller cells = higher density
}: PillarModelProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Higher resolution rendering
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        const renderWidth = Math.floor(width * pixelRatio);
        const renderHeight = Math.floor(height * pixelRatio);

        // Main scene for rendering
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        camera.position.z = Math.max(5, 8 * scale);
        camera.position.y = -0.3 * scale;

        // High quality renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(pixelRatio);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // High resolution render target
        const renderTarget = new THREE.WebGLRenderTarget(renderWidth, renderHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.HalfFloatType, // Better precision
        });

        // Create ASCII texture
        const asciiTexture = createAsciiTexture();

        // Custom shader material for the 3D object
        const objectMaterial = new THREE.ShaderMaterial({
            vertexShader: objectVertexShader,
            fragmentShader: objectFragmentShader,
            side: THREE.DoubleSide,
        });

        // Post-processing setup
        const postScene = new THREE.Scene();
        const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const postGeometry = new THREE.PlaneGeometry(2, 2);

        const postUniforms = {
            uScene: { value: renderTarget.texture },
            uAsciiTexture: { value: asciiTexture },
            uResolution: { value: new THREE.Vector2(renderWidth, renderHeight) },
            uCellSize: { value: cellSize * pixelRatio },
            uTime: { value: 0 },
        };

        const postMaterial = new THREE.ShaderMaterial({
            vertexShader: postVertexShader,
            fragmentShader: asciiFragmentShader,
            uniforms: postUniforms,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });

        const postQuad = new THREE.Mesh(postGeometry, postMaterial);
        postScene.add(postQuad);

        // Load GLB model
        const loader = new GLTFLoader();
        let pivotGroup: THREE.Group | null = null;
        const childInitialPositions = new Map<THREE.Object3D, THREE.Vector3>();
        const startTime = Date.now();

        loader.load(
            "/pilar.glb",
            (gltf) => {
                const model = gltf.scene;

                // Center and scale
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const baseScale = (3.5 / maxDim) * scale;
                model.scale.setScalar(baseScale);

                model.position.set(
                    -center.x * baseScale,
                    -center.y * baseScale + positionY,
                    -center.z * baseScale
                );

                // Store initial positions
                model.traverse((child: THREE.Object3D) => {
                    childInitialPositions.set(child, child.position.clone());
                });

                // Apply custom shader material
                model.traverse((child: THREE.Object3D) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = objectMaterial;
                    }
                });

                // Create pivot group for rotation
                const pivot = new THREE.Group();
                pivot.add(model);
                pivot.rotation.y = rotationY;

                scene.add(pivot);
                pivotGroup = pivot;
            },
            undefined,
            (error) => {
                console.error("Error loading pilar model:", error);
            }
        );

        // Animation loop
        const animate = () => {
            const elapsedTime = (Date.now() - startTime) / 1000;
            postUniforms.uTime.value = elapsedTime;

            if (pivotGroup) {
                pivotGroup.rotation.y += 0.002;

                // Reset child positions
                childInitialPositions.forEach((initialPos, child) => {
                    child.position.copy(initialPos);
                });
            }

            // Render scene to texture
            renderer.setRenderTarget(renderTarget);
            renderer.clear();
            renderer.render(scene, camera);

            // Render ASCII post-processing
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(postScene, postCamera);

            animationRef.current = requestAnimationFrame(animate);
        };

        // Resize handler
        const handleResize = () => {
            if (!container || !renderer) return;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            const newRenderWidth = Math.floor(newWidth * pixelRatio);
            const newRenderHeight = Math.floor(newHeight * pixelRatio);

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            renderTarget.setSize(newRenderWidth, newRenderHeight);
            postUniforms.uResolution.value.set(newRenderWidth, newRenderHeight);
        };

        window.addEventListener("resize", handleResize);
        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);

            if (rendererRef.current && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            objectMaterial.dispose();
            postMaterial.dispose();
            postGeometry.dispose();
            asciiTexture.dispose();
            renderTarget.dispose();
            renderer.dispose();
        };
    }, [scale, rotationY, positionY, cellSize]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 ${className}`}
            style={{ pointerEvents: "none" }}
        />
    );
};
