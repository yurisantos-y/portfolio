"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useFBO } from "@react-three/drei";

// ASCII characters ordered by brightness (dark to light)
const ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

// Vertex Shader for the 3D object
const objectVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader for the 3D object - creates depth/lighting for ASCII
const objectFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    // Basic lighting calculation
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Light from multiple directions
    vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.5, 0.5, 0.5));
    vec3 lightDir3 = normalize(vec3(0.0, -1.0, 0.5));
    
    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0) * 0.5;
    float diff3 = max(dot(normal, lightDir3), 0.0) * 0.3;
    
    float lighting = diff1 + diff2 + diff3;
    
    // Fresnel rim lighting
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    lighting += fresnel * 0.4;
    
    // Output grayscale based on lighting
    float brightness = clamp(lighting * 0.7, 0.0, 1.0);
    
    gl_FragColor = vec4(vec3(brightness), 1.0);
  }
`;

// ASCII Post-processing fragment shader
const asciiFragmentShader = `
  uniform sampler2D uScene;
  uniform sampler2D uAsciiTexture;
  uniform vec2 uResolution;
  uniform float uCellSize;
  uniform float uOpacity;
  uniform float uTime;
  uniform vec2 uMousePos;
  uniform float uDispersalAmount;
  
  varying vec2 vUv;
  
  const float CHAR_COUNT = 70.0;
  
  // Pseudo-random function for particle variation
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate cell position
    float cellSize = uCellSize / uResolution.y;
    float aspectRatio = uResolution.x / uResolution.y;
    
    vec2 cellSizeVec = vec2(cellSize / aspectRatio, cellSize);
    vec2 cellIndex = floor(uv / cellSizeVec);
    vec2 cellCenter = (cellIndex + 0.5) * cellSizeVec;
    
    // ============= DISPERSAL LOGIC =============
    
    vec2 toMouse = cellCenter - uMousePos;
    vec2 toMouseScaled = toMouse * vec2(aspectRatio, 1.0);
    float distToMouse = length(toMouseScaled);
    
    // Dispersal parameters
    float dispersalRadius = 0.35;
    float dispersalStrength = 0.25;
    
    // Create unique random values for each cell
    float cellRandom = random(cellIndex);
    float cellRandom2 = random(cellIndex + vec2(17.0, 31.0));
    
    // Calculate push direction and amount
    vec2 pushDir = normalize(toMouse + vec2(0.001));
    float pushAmount = smoothstep(dispersalRadius, 0.0, distToMouse) * uDispersalAmount;
    
    // Add some randomness to the push direction
    float angle = (cellRandom - 0.5) * 3.14159 * 0.5;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    pushDir = rotation * pushDir;
    
    // Apply dispersal offset
    vec2 offset = pushDir * pushAmount * dispersalStrength * (0.8 + cellRandom2 * 0.4);
    
    // Offset the UV for sampling
    vec2 dispersedUv = uv - offset;
    
    // Recalculate cell position for dispersed coordinate
    vec2 dispersedCellCenter = (floor(dispersedUv / cellSizeVec) + 0.5) * cellSizeVec;
    
    // ===========================================
    
    // Sample scene at dispersed cell position for brightness
    vec4 sceneColor = texture2D(uScene, dispersedCellCenter);
    float brightness = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Skip if too dark (background)
    if (brightness < 0.01) {
      discard;
    }
    
    // Boost brightness for more visible characters
    brightness = pow(brightness, 0.7) * 1.2;
    brightness = clamp(brightness, 0.0, 1.0);
    
    // Map brightness to character index
    float charIndex = floor(brightness * (CHAR_COUNT - 1.0));
    
    vec2 cellLocalUv = fract(dispersedUv / cellSizeVec);
    
    // Calculate UV in the ASCII texture atlas
    float charWidth = 1.0 / CHAR_COUNT;
    vec2 charUv = vec2(
      charIndex * charWidth + cellLocalUv.x * charWidth,
      cellLocalUv.y
    );
    
    // Sample character from atlas
    vec4 charSample = texture2D(uAsciiTexture, charUv);
    
    // ========== ENHANCED ORANGE COLOR SCHEME ==========
    vec3 darkOrange = vec3(0.5, 0.18, 0.0);
    vec3 midOrange = vec3(1.0, 0.5, 0.05);
    vec3 brightOrange = vec3(1.0, 0.65, 0.2);
    vec3 hotOrange = vec3(1.0, 0.9, 0.5);
    vec3 glowColor = vec3(1.0, 0.4, 0.0);
    
    // Create orange gradient based on brightness
    vec3 color;
    if (brightness < 0.25) {
      color = mix(darkOrange, midOrange, brightness * 4.0);
    } else if (brightness < 0.5) {
      color = mix(midOrange, brightOrange, (brightness - 0.25) * 4.0);
    } else {
      color = mix(brightOrange, hotOrange, (brightness - 0.5) * 2.0);
    }
    
    // Add glow effect for brighter areas
    float glowIntensity = smoothstep(0.4, 1.0, brightness) * 0.3;
    color = mix(color, glowColor, glowIntensity);
    
    // Add subtle color pulsing
    float pulse = sin(uTime * 1.5) * 0.05 + 1.0;
    color *= pulse;
    
    // Character visibility - enhanced for density
    float charAlpha = charSample.r;
    
    // Base alpha from character and brightness
    float alpha = charAlpha * (0.7 + brightness * 0.4);
    
    // Add ambient glow around characters
    float ambientGlow = smoothstep(0.0, 0.5, charAlpha) * 0.15;
    alpha = max(alpha, ambientGlow * brightness);
    
    // Decrease alpha on dispersed particles
    alpha *= 1.0 - pushAmount * 0.8;
    
    // Add subtle scan line effect
    float scanLine = sin(uv.y * uResolution.y * 0.5 + uTime * 2.0) * 0.03 + 0.97;
    alpha *= scanLine;
    
    // Final output
    alpha *= uOpacity;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Create ASCII texture atlas
function createAsciiTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    const charSize = 32;
    canvas.width = ASCII_CHARS.length * charSize;
    canvas.height = charSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");

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
}

interface ASCIIPillarSceneProps {
    scale: number;
    rotationY: number;
    positionY: number;
    cellSize: number;
}

// Internal component that uses React Three Fiber hooks
const ASCIIPillarScene = ({
    scale,
    rotationY,
    positionY,
    cellSize,
}: ASCIIPillarSceneProps) => {
    const { scene: gltfScene } = useGLTF("/pilar.glb");
    const { size, gl, viewport } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const [asciiTexture] = useState(() => createAsciiTexture());

    // Mouse tracking refs
    const uMousePos = useRef(new THREE.Vector2(-1, -1));
    const uDispersal = useRef(0);
    const targetDispersal = useRef(0);

    // Create FBO for offscreen rendering
    const renderTarget = useFBO(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
    });

    // Create a separate scene for the 3D model
    const virtualScene = useMemo(() => new THREE.Scene(), []);
    const virtualCamera = useMemo(() => {
        const cam = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
        cam.position.z = 5;
        return cam;
    }, [size]);

    // Custom material for the 3D object
    const objectMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader: objectVertexShader,
                fragmentShader: objectFragmentShader,
                side: THREE.DoubleSide,
            }),
        []
    );

    // Pivot group ref for rotation
    const pivotRef = useRef<THREE.Group>(null);

    // Create cloned model with custom material and pivot group
    const { clonedModel, pivotGroup } = useMemo(() => {
        const clone = gltfScene.clone();
        clone.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                child.material = objectMaterial;
            }
        });

        // Get bounding box before scaling
        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const objSize = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(objSize.x, objSize.y, objSize.z);
        const normalizedScale = 2.5 / maxDim;

        // Apply scale
        clone.scale.setScalar(normalizedScale * scale);

        // Center the model at origin (offset by scaled center)
        clone.position.set(
            -center.x * normalizedScale * scale,
            -center.y * normalizedScale * scale + positionY,
            -center.z * normalizedScale * scale
        );

        // Create pivot group for rotation around center
        const pivot = new THREE.Group();
        pivot.add(clone);
        pivot.rotation.y = rotationY;

        return { clonedModel: clone, pivotGroup: pivot };
    }, [gltfScene, objectMaterial, scale, positionY, rotationY]);

    // Add pivot group to virtual scene
    useEffect(() => {
        virtualScene.add(pivotGroup);
        return () => {
            virtualScene.remove(pivotGroup);
        };
    }, [virtualScene, pivotGroup]);

    // Post-processing uniforms
    const uniforms = useMemo(
        () => ({
            uScene: { value: renderTarget.texture },
            uAsciiTexture: { value: asciiTexture },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uCellSize: { value: cellSize },
            uOpacity: { value: 1.0 },
            uTime: { value: 0 },
            uMousePos: { value: new THREE.Vector2(-1, -1) },
            uDispersalAmount: { value: 0 },
        }),
        [renderTarget.texture, asciiTexture, size, cellSize]
    );

    // Update uniforms on resize
    useEffect(() => {
        uniforms.uResolution.value.set(size.width, size.height);
        virtualCamera.aspect = size.width / size.height;
        virtualCamera.updateProjectionMatrix();
    }, [size, uniforms, virtualCamera]);

    // Animation loop
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        uniforms.uTime.value = time;

        // Smooth dispersal transition
        uDispersal.current += (targetDispersal.current - uDispersal.current) * 0.1;

        // Update uniforms
        uniforms.uMousePos.value.copy(uMousePos.current);
        uniforms.uDispersalAmount.value = uDispersal.current;

        // Rotate the pivot group continuously (spins on own axis)
        if (pivotGroup) {
            pivotGroup.rotation.y += 0.003;
        }

        // Render virtual scene to FBO
        gl.setRenderTarget(renderTarget);
        gl.clear();
        gl.render(virtualScene, virtualCamera);
        gl.setRenderTarget(null);
    });

    return (
        <group ref={groupRef}>
            {/* Interaction Plane - Invisible but captures mouse events */}
            <mesh
                visible={true}
                scale={[viewport.width, viewport.height, 1]}
                onPointerMove={(e) => {
                    if (e.uv) {
                        uMousePos.current.copy(e.uv);
                        targetDispersal.current = 1.0;
                    }
                }}
                onPointerLeave={() => {
                    targetDispersal.current = 0.0;
                }}
            >
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            <mesh>
                <planeGeometry args={[2, 2]} />
                <shaderMaterial
                    vertexShader={`
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={asciiFragmentShader}
                    uniforms={uniforms}
                    transparent={true}
                    depthTest={false}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

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
    cellSize = 6.0,
}: PillarModelProps) => {
    return (
        <div
            className={`absolute inset-0 ${className}`}
            style={{ pointerEvents: "auto" }}
        >
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                camera={{ position: [0, 0, 5], fov: 45 }}
            >
                <ASCIIPillarScene
                    scale={scale}
                    rotationY={rotationY}
                    positionY={positionY}
                    cellSize={cellSize}
                />
            </Canvas>
        </div>
    );
};

// Preload helper
export const preloadPillarModel = () => {
    useGLTF.preload("/pilar.glb");
};
