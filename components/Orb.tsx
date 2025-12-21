"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { motion, useScroll, useTransform } from "framer-motion";

interface OrbProps {
    totalImages?: number;
    totalItems?: number;
    baseWidth?: number;
    baseHeight?: number;
    sphereRadius?: number;
    backgroundColor?: string;
}

const Orb = ({
    totalImages = 30,
    totalItems = 30, // Defaulted to 30 to match typical usage, updated from TotalItems
    baseWidth = 1,
    baseHeight = 0.6,
    sphereRadius = 5,
    backgroundColor = "3b3b3b",
}: OrbProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [0.5, 1]);

    useEffect(() => {
        if (!orbRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(parseInt(backgroundColor, 16));
        renderer.setPixelRatio(window.devicePixelRatio);
        // @ts-ignore - handling version compatibility
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

        orbRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 1.2;
        controls.minDistance = 5;
        controls.maxDistance = 10;
        controls.enableZoom = true;
        controls.enablePan = false;

        const textureLoader = new THREE.TextureLoader();
        let loadedCount = 0;

        const assetNames = [
            "aws.png", "css3.png", "dart.png", "figma.png",
            "firebase.png", "flutter.png", "go.png", "html5.png",
            "nextjs2.png", "postgresql.png", "prisma.png", "python.png",
            "tailwindcss.png", "typescript.png"
        ];

        const getRandomImagePath = () => {
            const name = assetNames[Math.floor(Math.random() * assetNames.length)];
            return `/assets/${name}`;
        };

        const createImagePlane = (texture: THREE.Texture) => {
            const imageAspect = (texture.image as any).width / (texture.image as any).height;
            let width = baseWidth;
            let height = baseHeight;

            if (imageAspect > 1) {
                height = width / imageAspect;
            } else {
                width = height * imageAspect;
            }

            return new THREE.PlaneGeometry(width, height);
        };

        const loadImageMesh = (phi: number, theta: number) => {
            textureLoader.load(
                getRandomImagePath(),
                (texture) => {
                    texture.generateMipmaps = false;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.colorSpace = THREE.LinearSRGBColorSpace;

                    const geometry = createImagePlane(texture);
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        transparent: true, // Asset images are likely PNGs with transparency
                        depthWrite: true,
                        depthTest: true,
                    });

                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
                    mesh.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
                    mesh.position.z = sphereRadius * Math.cos(phi);

                    mesh.lookAt(0, 0, 0);
                    mesh.rotateY(Math.PI);

                    scene.add(mesh);

                    loadedCount++;

                    if (loadedCount >= totalItems) {
                        // All requested items loaded (or close enough)
                    }
                },
                undefined,
                (error) => console.error("Error loading texture:", error)
            );
        };

        const createSphere = () => {
            for (let i = 0; i < totalItems; i++) {
                const phi = Math.acos(-1 + (2 * i) / totalItems);
                const theta = Math.sqrt(totalItems * Math.PI) * phi;

                loadImageMesh(phi, theta);
            }
        };

        camera.position.z = 10;

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", handleResize);

        createSphere();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (orbRef.current && renderer.domElement) {
                orbRef.current.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationId);
            renderer.dispose();
        };
    }, [totalImages, totalItems, baseWidth, baseHeight, sphereRadius, backgroundColor]);

    return (
        <div ref={containerRef} className="w-full h-[800px] flex items-center justify-center">
            <motion.div
                style={{ opacity, scale }}
                className="orb w-full h-full"
                ref={orbRef}
            />
        </div>
    );
};

export default Orb;
