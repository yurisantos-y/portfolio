"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

// ASCII Post-processing vertex shader
const asciiVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
  uniform float uDispersalAmount;
  uniform vec2 uMousePos;
  
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
    
    // Calculate dispersal offset based on mouse position
    // Mouse position comes in as -1 to 1, convert to 0 to 1 UV space
    vec2 mouseUv = uMousePos * 0.5 + 0.5;
    
    vec2 toMouse = cellCenter - mouseUv;
    float distToMouse = length(toMouse);
    
    // Black hole effect - create a gradient void
    float blackHoleRadius = 0.05; // Inner radius where it's fully transparent
    float blackHoleOuter = 0.25; // Outer radius where fade begins
    
    // Calculate a smooth fade factor based on distance
    // 0.0 at center, 1.0 at outer edge
    float blackHoleFactor = smoothstep(blackHoleRadius, blackHoleOuter, distToMouse);
    
    // Mix with 1.0 when not hovering (uDispersalAmount < 0.1)
    blackHoleFactor = mix(1.0, blackHoleFactor, smoothstep(0.0, 1.0, uDispersalAmount));
    
    // Dispersal effect - particles fly away from cursor
    float dispersalRadius = 0.45; // Increased slightly for smoother transition
    float dispersalStrength = 0.12; // Slightly reduced for better control
    
    // Create unique random values for each cell
    float cellRandom = random(cellIndex);
    float cellRandom2 = random(cellIndex + vec2(17.0, 31.0));
    
    // Calculate push direction and amount
    vec2 pushDir = normalize(toMouse + vec2(0.001)); // Avoid division by zero
    float pushAmount = smoothstep(dispersalRadius, 0.0, distToMouse) * uDispersalAmount;
    
    // Add some randomness to the push direction for particle-like effect
    float angle = (cellRandom - 0.5) * 3.14159 * 0.5; // Random angle variation
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    pushDir = rotation * pushDir;
    
    // Apply dispersal with easing and random variation
    vec2 offset = pushDir * pushAmount * dispersalStrength * (0.5 + cellRandom2);
    
    // Add slight rotation/spin effect
    float spinAmount = pushAmount * (cellRandom - 0.5) * 0.3;
    
    // Offset the cell UV
    vec2 dispersedUv = uv + offset;
    
    // Recalculate cell position with dispersal
    vec2 dispersedCellUv = floor(dispersedUv / cellSizeVec) * cellSizeVec;
    
    // Sample scene at dispersed cell position for brightness
    vec4 sceneColor = texture2D(uScene, dispersedCellUv + cellSizeVec * 0.5);
    float brightness = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Skip if too dark (background)
    if (brightness < 0.02) {
      discard;
    }
    
    // Map brightness to character index
    float charIndex = floor(brightness * (CHAR_COUNT - 1.0));
    
    // Position within the cell for character rendering
    vec2 cellLocalUv = fract(dispersedUv / cellSizeVec);
    
    // Apply rotation to local UV for spin effect
    vec2 centeredLocalUv = cellLocalUv - 0.5;
    float spinAngle = spinAmount * 6.28318; // Full rotation possible
    mat2 spinRotation = mat2(cos(spinAngle), -sin(spinAngle), sin(spinAngle), cos(spinAngle));
    centeredLocalUv = spinRotation * centeredLocalUv;
    cellLocalUv = centeredLocalUv + 0.5;
    
    // Clamp to prevent sampling outside cell
    cellLocalUv = clamp(cellLocalUv, 0.0, 1.0);
    
    // Calculate UV in the ASCII texture atlas
    float charWidth = 1.0 / CHAR_COUNT;
    vec2 charUv = vec2(
      charIndex * charWidth + cellLocalUv.x * charWidth,
      cellLocalUv.y
    );
    
    // Sample character from atlas
    vec4 charSample = texture2D(uAsciiTexture, charUv);
    
    // ========== ORANGE COLOR SCHEME ==========
    vec3 darkOrange = vec3(0.4, 0.15, 0.0);
    vec3 midOrange = vec3(1.0, 0.45, 0.0);
    vec3 brightOrange = vec3(1.0, 0.6, 0.15);
    vec3 hotOrange = vec3(1.0, 0.85, 0.4);
    
    // Create orange gradient based on brightness
    vec3 color;
    if (brightness < 0.25) {
      color = mix(darkOrange, midOrange, brightness * 4.0);
    } else if (brightness < 0.5) {
      color = mix(midOrange, brightOrange, (brightness - 0.25) * 4.0);
    } else {
      color = mix(brightOrange, hotOrange, (brightness - 0.5) * 2.0);
    }
    
    // Add slight color variation based on dispersal for "energy" effect
    color = mix(color, hotOrange, pushAmount * 0.3);
    
    // Darken particles near the black hole for better gradient effect
    color *= smoothstep(0.0, 0.6, blackHoleFactor);
    
    // Character visibility
    float charAlpha = charSample.r;
    
    // Base alpha from character and brightness
    float alpha = charAlpha * (0.6 + brightness * 0.5);
    
    // Fade out particles that are pushed far
    alpha *= 1.0 - pushAmount * 0.5;
    
    // Apply black hole gradient fade
    alpha *= blackHoleFactor;
    
    // Add subtle scan line effect
    float scanLine = sin(uv.y * uResolution.y * 0.5 + uTime * 2.0) * 0.05 + 0.95;
    alpha *= scanLine;
    
    // Final output
    alpha *= uOpacity;
    
    gl_FragColor = vec4(color, alpha);
  }
`;


interface ASCII3DObjectProps {
  objPath: string;
  className?: string;
  cellSize?: number;
  scrollProgress?: number;
  isHovered?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export const ASCII3DObject = ({
  objPath,
  className = "",
  cellSize = 8.0,
  scrollProgress = 1,
  isHovered = false,
  onHoverChange,
}: ASCII3DObjectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const objectRef = useRef<THREE.Group | null>(null);
  const uniformsRef = useRef<{ uOpacity: { value: number }; uDispersalAmount: { value: number }; uMousePos: { value: THREE.Vector2 } } | null>(null);
  const scrollProgressRef = useRef(scrollProgress);
  const isHoveredRef = useRef(isHovered);
  const dispersalAmountRef = useRef(0);

  const [isMounted, setIsMounted] = useState(false);
  const [objectLoaded, setObjectLoaded] = useState(false);

  // Update scroll progress ref when prop changes
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Update hover ref when prop changes
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

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

  // Mouse tracking - relative to container
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      // Get container bounds
      const rect = container.getBoundingClientRect();

      // Calculate mouse position relative to container (0 to 1)
      const relativeX = (e.clientX - rect.left) / rect.width;
      const relativeY = (e.clientY - rect.top) / rect.height;

      // Convert to -1 to 1 range for shader
      mouseRef.current.targetX = relativeX * 2 - 1;
      mouseRef.current.targetY = -(relativeY * 2 - 1); // Flip Y for WebGL coordinates
    };

    // Use container for mouse tracking instead of window
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted]);

  // Main Three.js setup
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;

    // Main scene for 3D object
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

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

    // Render target for ASCII post-processing
    const renderTarget = new THREE.WebGLRenderTarget(
      container.clientWidth,
      container.clientHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    // Post-processing scene
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    postCamera.position.z = 1;

    // Create ASCII texture atlas
    const asciiTexture = createAsciiTexture();
    if (!asciiTexture) {
      console.error("Failed to create ASCII texture");
      return;
    }

    // ASCII post-processing material
    const postUniforms = {
      uScene: { value: renderTarget.texture },
      uAsciiTexture: { value: asciiTexture },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uCellSize: { value: cellSize },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uDispersalAmount: { value: 0 },
      uMousePos: { value: new THREE.Vector2(0, 0) },
    };
    uniformsRef.current = postUniforms;

    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: asciiVertexShader,
      fragmentShader: asciiFragmentShader,
      uniforms: postUniforms,
      transparent: true,
      blending: THREE.NormalBlending,
    });

    const postGeometry = new THREE.PlaneGeometry(2, 2);
    const postMesh = new THREE.Mesh(postGeometry, postMaterial);
    postScene.add(postMesh);

    // Custom material for the 3D object
    const objectMaterial = new THREE.ShaderMaterial({
      vertexShader: objectVertexShader,
      fragmentShader: objectFragmentShader,
      side: THREE.DoubleSide,
    });

    // Load GLB/GLTF
    const loader = new GLTFLoader();
    loader.load(
      objPath,
      (gltf) => {
        const model = gltf.scene;

        // Apply custom material to all meshes
        model.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.material = objectMaterial;
          }
        });

        // Center and scale the object
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Normalize size - smaller to fit container without clipping
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.0 / maxDim;
        model.scale.setScalar(scale);

        // Center the object
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);
        objectRef.current = model;
        setObjectLoaded(true);
      },
      (progress: ProgressEvent) => {
        if (progress.total > 0) {
          console.log(`Loading model: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
        }
      },
      (error: unknown) => {
        console.error("Error loading model:", error);
      }
    );

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotate object with pendulum motion (oscillating between -45° and +45°)
      // This ensures the user NEVER sees the back of the object
      if (objectRef.current) {
        // Convert 45 degrees to radians - small angle to keep front visible
        const maxAngle = (45 * Math.PI) / 180; // ~0.785 radians

        // Use sine wave for smooth pendulum-like oscillation
        // Speed factor controls how fast the oscillation is
        const oscillationSpeed = 0.4;
        // Add Math.PI (180°) to flip the object so the front faces the camera
        const baseRotationY = Math.PI + Math.sin(elapsedTime * oscillationSpeed) * maxAngle;

        // Mouse influence (very small to prevent showing back)
        const mouseRotationY = mouseRef.current.x * 0.08;
        const mouseRotationX = mouseRef.current.y * 0.05;

        objectRef.current.rotation.y = baseRotationY + mouseRotationY;
        objectRef.current.rotation.x = mouseRotationX;
      }

      // Update time uniform
      postUniforms.uTime.value = elapsedTime;

      // Update dispersal amount with smooth transition
      const targetDispersal = isHoveredRef.current ? 1.0 : 0.0;
      dispersalAmountRef.current += (targetDispersal - dispersalAmountRef.current) * 0.1;
      postUniforms.uDispersalAmount.value = dispersalAmountRef.current;

      // Update mouse position for dispersal effect
      postUniforms.uMousePos.value.set(mouseRef.current.x, mouseRef.current.y);

      // Update opacity based on scroll progress
      if (uniformsRef.current) {
        uniformsRef.current.uOpacity.value = scrollProgressRef.current;
        uniformsRef.current.uDispersalAmount.value = dispersalAmountRef.current;
        uniformsRef.current.uMousePos.value.set(mouseRef.current.x, mouseRef.current.y);
      }

      // Render scene to render target
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);

      // Render ASCII post-processing
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);

      animationRef.current = requestAnimationFrame(animate);
    };

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      renderTarget.setSize(width, height);
      postUniforms.uResolution.value.set(width, height);
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

      postGeometry.dispose();
      postMaterial.dispose();
      objectMaterial.dispose();
      asciiTexture.dispose();
      renderTarget.dispose();
      renderer.dispose();
    };
  }, [isMounted, objPath, createAsciiTexture, cellSize]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%", cursor: "pointer" }}
      />

      {/* Loading indicator */}
      {!objectLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-text-secondary/50 font-mono text-sm animate-pulse">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

