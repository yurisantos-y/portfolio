"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// List of available asset images
const assetImages = [
    "aws.png",
    "css3.png",
    "dart.png",
    "figma.png",
    "firebase.png",
    "flutter.png",
    "go.png",
    "html5.png",
    "nextjs2.png",
    "postgresql.png",
    "prisma.png",
    "python.png",
    "tailwindcss.png",
    "typescript.png",
];

interface OrbProps {
    totalItems?: number;
    baseWidth?: number;
    baseHeight?: number;
    sphereRadius?: number;
    backgroundColor?: string;
}

const Orb = ({
    totalItems = 60,
    baseWidth = 1.2,
    baseHeight = 1.2,
    sphereRadius = 6,
    backgroundColor = "0A0A0A",
}: OrbProps) => {
    const orbRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const frameIdRef = useRef<number>(0);

    useEffect(() => {
        if (!orbRef.current) return;

        // Cleanup any existing canvas
        if (rendererRef.current) {
            orbRef.current.removeChild(rendererRef.current.domElement);
            rendererRef.current.dispose();
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(parseInt(backgroundColor, 16), 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        orbRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.minDistance = 4;
        controls.maxDistance = 12;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        const textureLoader = new THREE.TextureLoader();
        let loadedCount = 0;

        const getRandomImagePath = (): string => {
            const randomIndex = Math.floor(Math.random() * assetImages.length);
            return `/assets/${assetImages[randomIndex]}`;
        };

        const createImagePlane = (texture: THREE.Texture): THREE.PlaneGeometry => {
            const imageAspect = texture.image.width / texture.image.height;
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

                    const geometry = createImagePlane(texture);
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        transparent: true,
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

                    if (loadedCount === totalItems) {
                        animate();
                    }
                },
                undefined,
                (error) => {
                    console.error("Error loading texture:", error);
                    loadedCount++;
                    if (loadedCount === totalItems) {
                        animate();
                    }
                }
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

        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

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
            cancelAnimationFrame(frameIdRef.current);

            if (rendererRef.current && orbRef.current) {
                orbRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
                rendererRef.current = null;
            }

            // Dispose scene objects
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                        object.material.dispose();
                    }
                }
            });
        };
    }, [totalItems, baseWidth, baseHeight, sphereRadius, backgroundColor]);

    return <div className="orb-container" ref={orbRef}></div>;
};

export default Orb;
