"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface CapitelModelProps {
    className?: string;
    scale?: number;
    rotationY?: number;
}

export const CapitelModel = ({
    className = "",
    scale = 1,
    rotationY = 0,
}: CapitelModelProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            35,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        // Position camera further back to reduce zoom
        camera.position.z = 2.5; // Further back for less zoom
        camera.position.y = 0;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Orange outline material
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b00,
            transparent: true,
            opacity: 1.0,
            side: THREE.BackSide,
        });

        // Inner dark material
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x0a0a0a,
            transparent: true,
            opacity: 0.98,
        });

        // Edge material for outline effect
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0xff8c00,
            linewidth: 3,
        });

        // Load GLB model
        const loader = new GLTFLoader();
        let pivotGroup: THREE.Group | null = null;

        // Store initial positions
        const childInitialPositions = new Map<THREE.Object3D, THREE.Vector3>();

        loader.load(
            "/pilar.glb",
            (gltf) => {
                const model = gltf.scene;

                // Get the bounding box to find the top portion
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Scale to fit - focusing on the capitel (top) - LARGER scale for zoom
                const maxDim = Math.max(size.x, size.y, size.z);
                const baseScale = (5.0 / maxDim) * scale; // Much larger scale for zoom
                model.scale.setScalar(baseScale);

                // Position the model so only the TOP (capitel) is visible
                // Move the model DOWN so the capitel (volutas) is centered in view
                const topY = box.max.y;

                model.position.set(
                    -center.x * baseScale,
                    -(topY * 0.92) * baseScale, // Move down more to show the top capitel
                    -center.z * baseScale
                );

                // Store initial positions
                model.traverse((child: THREE.Object3D) => {
                    childInitialPositions.set(child, child.position.clone());
                });

                // Apply materials - create outline effect
                model.traverse((child: THREE.Object3D) => {
                    if (child instanceof THREE.Mesh) {
                        // Create a copy for outline effect
                        const outlineMesh = child.clone();
                        outlineMesh.material = outlineMaterial;
                        outlineMesh.scale.multiplyScalar(1.02);
                        model.add(outlineMesh);

                        // Original mesh with dark interior
                        child.material = innerMaterial;

                        // Add edge lines
                        const edges = new THREE.EdgesGeometry(child.geometry, 15);
                        const line = new THREE.LineSegments(edges, edgeMaterial);
                        line.scale.copy(child.scale);
                        line.position.copy(child.position);
                        line.rotation.copy(child.rotation);
                        child.add(line);
                    }
                });

                // Create a pivot group for rotation
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

        // Animation loop - slow rotation
        const animate = () => {
            if (pivotGroup) {
                pivotGroup.rotation.y += 0.003;

                // Reset child positions
                childInitialPositions.forEach((initialPos, child) => {
                    child.position.copy(initialPos);
                });
            }

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };

        // Resize handler
        const handleResize = () => {
            if (!container || !renderer) return;
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
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

            outlineMaterial.dispose();
            innerMaterial.dispose();
            edgeMaterial.dispose();
            renderer.dispose();
        };
    }, [scale, rotationY]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 ${className}`}
            style={{ pointerEvents: "none" }}
        />
    );
};
