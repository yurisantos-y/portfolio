"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface PillarModelProps {
    className?: string;
    scale?: number;
    rotationY?: number;
    positionY?: number;
}

export const PillarModel = ({
    className = "",
    scale = 1,
    rotationY = 0,
    positionY = 0,
}: PillarModelProps) => {
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
        // Adjust camera distance based on scale to prevent clipping for taller pillars
        // Increased factor from 6 to 8 to ensure full visibility of tall pillars
        camera.position.z = Math.max(6, 8 * scale);
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

        // Orange outline material - brighter and more visible
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b00,
            transparent: true,
            opacity: 1.0,
            side: THREE.BackSide,
        });

        // Inner dark material (for the "hole" effect)
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x0a0a0a,
            transparent: true,
            opacity: 0.98,
        });

        // Edge material for outline effect - brighter orange
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0xff8c00,
            linewidth: 3,
        });

        // Load GLB model
        const loader = new GLTFLoader();
        let modelGroup: THREE.Group | null = null;

        loader.load(
            "/pilar.glb",
            (gltf) => {
                const model = gltf.scene;

                // Center and scale
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Normalize size - scale to fit container
                const maxDim = Math.max(size.x, size.y, size.z);
                const baseScale = (3.5 / maxDim) * scale;
                model.scale.setScalar(baseScale);

                // Center the model properly
                model.position.x = -center.x * baseScale;
                model.position.y = -center.y * baseScale + positionY;
                model.position.z = -center.z * baseScale;

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

                        // Add edge lines for the outline look
                        const edges = new THREE.EdgesGeometry(child.geometry, 15);
                        const line = new THREE.LineSegments(edges, edgeMaterial);
                        line.scale.copy(child.scale);
                        line.position.copy(child.position);
                        line.rotation.copy(child.rotation);
                        child.add(line);
                    }
                });

                model.rotation.y = rotationY;

                scene.add(model);
                modelGroup = model;
            },
            undefined,
            (error) => {
                console.error("Error loading pilar model:", error);
            }
        );

        // Animation loop
        const animate = () => {
            if (modelGroup) {
                // Slow rotation for subtle movement
                modelGroup.rotation.y += 0.002;
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
    }, [scale, rotationY, positionY]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 ${className}`}
            style={{ pointerEvents: "none" }}
        />
    );
};
