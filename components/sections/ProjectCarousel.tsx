"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useRef, useState } from "react";

const projects = [
    {
        id: 1,
        title: "Workout Tracker",
        tech: "Flutter • Firebase",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
        link: "#",
    },
    {
        id: 2,
        title: "E-Commerce",
        tech: "Next.js • Shopify",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1632&auto=format&fit=crop",
        link: "#",
    },
    {
        id: 3,
        title: "Finance App",
        tech: "React Native",
        image: "https://images.unsplash.com/photo-1565514020176-dbf223f07a03?q=80&w=1470&auto=format&fit=crop",
        link: "#",
    },
    {
        id: 4,
        title: "Social Dashboard",
        tech: "Next.js • Tailwind",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
        link: "#",
    },
    {
        id: 5,
        title: "Music Player",
        tech: "Flutter • Audio",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1470&auto=format&fit=crop",
        link: "#",
    }
];

export const ProjectCarousel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    // We duplicate the projects enough times to ensure smooth looping
    // 4 sets should be enough for most screen sizes
    const displayProjects = [...projects, ...projects, ...projects, ...projects];

    // Using motion value for performance
    const baseX = useMotionValue(0);
    const x = useTransform(baseX, (v) => `${v}%`);

    const baseVelocity = -0.001; // Base speed: negative moves left

    useAnimationFrame((t, delta) => {
        let moveBy = baseVelocity * speedMultiplier * delta;

        // Update x position
        let currentX = baseX.get();
        currentX += moveBy;

        // Reset when we've scrolled past the first set of projects
        // We know we have 4 sets. Resetting after 25% (1 set) keeps it seamless
        // But since we use percentages, we need to be precise.
        // Let's assume the reset point is -25% (Since we have 4 sets, -25% is exactly one full set width)
        if (currentX <= -25) {
            currentX = 0;
        }

        baseX.set(currentX);
    });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, currentTarget } = e;
        const { width, left } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const percentage = x / width;

        // If hovered on left 15% or right 15%, increase speed
        if (percentage < 0.15 || percentage > 0.85) {
            setSpeedMultiplier(4); // 4x speed
        } else {
            setSpeedMultiplier(1);
        }
    };

    const handleMouseLeave = () => {
        setSpeedMultiplier(1);
    };

    return (
        <section className="py-20 w-full bg-background overflow-hidden">
            <div className="flex w-full mb-12 px-6 md:px-24 max-w-7xl mx-auto">
                <h3 className="text-2xl font-light text-text-primary tracking-wide">
                    Featured Projects
                </h3>
            </div>

            <div
                className="relative flex w-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={containerRef}
            >
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

                <motion.div
                    className="flex gap-8 whitespace-nowrap pl-8"
                    style={{ x }}
                >
                    {displayProjects.map((project, idx) => (
                        <div
                            key={`${project.id}-${idx}`}
                            className="relative group w-[400px] h-[250px] flex-shrink-0 overflow-hidden rounded-xl bg-secondary/5 border border-white/5 cursor-pointer"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h4 className="text-2xl font-bold text-white mb-1">
                                    {project.title}
                                </h4>
                                <p className="text-sm text-gray-300 mb-4">
                                    {project.tech}
                                </p>
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <button className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-md transition-colors flex items-center gap-2">
                                        View Case <ExternalLink size={12} />
                                    </button>
                                    <button className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-md transition-colors flex items-center gap-2">
                                        Code <Github size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
