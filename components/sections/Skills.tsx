"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import styles from "./Skills.module.css";

gsap.registerPlugin(ScrollTrigger);

// Dynamic import for PillarModel to avoid SSR issues
const PillarModel = dynamic(
    () => import("@/components/ui/PillarModel").then((mod) => mod.PillarModel),
    { ssr: false }
);

// Dynamic import for CapitelModel (top of pillar only)
const CapitelModel = dynamic(
    () => import("@/components/ui/CapitelModel").then((mod) => mod.CapitelModel),
    { ssr: false }
);

// Skill interface
interface Skill {
    name: string;
    icon: string; // Devicon class name
    color?: string;
}

// Skills data organized by column with pillars
// Each column has skills stacked vertically with a pillar behind
interface SkillColumn {
    skills: Skill[];
    pillarHeight: number; // 1-4 representing rows of skills
}

// Left side columns (3 pillars) - Order: Tall (corner) -> Medium -> Short (near center)
const leftColumns: SkillColumn[] = [
    {
        // Column 1 - Tall pillar (4 skills) - Corner
        pillarHeight: 4,
        skills: [
            { name: "React", icon: "devicon-react-original", color: "#61DAFB" },
            { name: "Next.js", icon: "devicon-nextjs-plain", color: "#ffffff" },
            { name: "JavaScript", icon: "devicon-javascript-plain", color: "#F7DF1E" },
            { name: "Node.js", icon: "devicon-nodejs-plain", color: "#339933" },
        ],
    },
    {
        // Column 2 - Medium pillar (3 skills) - Middle
        pillarHeight: 3,
        skills: [
            { name: "TypeScript", icon: "devicon-typescript-plain", color: "#3178C6" },
            { name: "HTML5", icon: "devicon-html5-plain", color: "#E34F26" },
            { name: "Git", icon: "devicon-git-plain", color: "#F05032" },
        ],
    },
    {
        // Column 3 - Short pillar (2 skills) - Near center
        pillarHeight: 2,
        skills: [
            { name: "CSS3", icon: "devicon-css3-plain", color: "#1572B6" },
            { name: "TailwindCSS", icon: "devicon-tailwindcss-original", color: "#06B6D4" },
        ],
    },
];

// Right side columns (3 pillars) - Order: Short (near center) -> Medium -> Tall (corner)
const rightColumns: SkillColumn[] = [
    {
        // Column 1 - Short pillar (2 skills) - Near center
        pillarHeight: 2,
        skills: [
            { name: "Swift", icon: "devicon-swift-plain", color: "#FA7343" },
            { name: "PostgreSQL", icon: "devicon-postgresql-plain", color: "#4169E1" },
        ],
    },
    {
        // Column 2 - Medium pillar (3 skills) - Middle
        pillarHeight: 3,
        skills: [
            { name: "Dart", icon: "devicon-dart-plain", color: "#0175C2" },
            { name: "Kotlin", icon: "devicon-kotlin-plain", color: "#7F52FF" },
            { name: "MongoDB", icon: "devicon-mongodb-plain", color: "#47A248" },
        ],
    },
    {
        // Column 3 - Tall pillar (4 skills) - Corner
        pillarHeight: 4,
        skills: [
            { name: "Flutter", icon: "devicon-flutter-plain", color: "#02569B" },
            { name: "Firebase", icon: "devicon-firebase-plain", color: "#FFCA28" },
            { name: "Android", icon: "devicon-android-plain", color: "#3DDC84" },
            { name: "Docker", icon: "devicon-docker-plain", color: "#2496ED" },
        ],
    },
];

const centerSkills: Skill[] = [
    { name: "VS Code", icon: "devicon-vscode-plain", color: "#007ACC" },
    { name: "GitHub", icon: "devicon-github-original", color: "#ffffff" },
    { name: "NPM", icon: "devicon-npm-original-wordmark", color: "#CB3837" },
    { name: "Vercel", icon: "devicon-vercel-original", color: "#ffffff" },
    { name: "Figma", icon: "devicon-figma-plain", color: "#F24E1E" },
];

// Component for individual skill block
interface SkillBlockProps {
    skill: Skill;
    delay: number;
}

const SkillBlock = ({ skill, delay }: SkillBlockProps) => {
    return (
        <div
            className={`${styles.skillBlock} ${styles.colored} ${styles.handDrawn}`}
            style={{
                "--delay": `${delay}s`,
                "--icon-color": skill.color,
            } as React.CSSProperties}
        >
            <i className={skill.icon}></i>
            <span className={styles.tooltip}>{skill.name}</span>
        </div>
    );
};

// Component for a column with pillar and skills
interface SkillColumnComponentProps {
    column: SkillColumn;
    columnIndex: number;
    side: "left" | "right";
}

const SkillColumnComponent = ({ column, columnIndex, side }: SkillColumnComponentProps) => {
    const baseDelay = side === "left" ? columnIndex * 0.15 : 0.5 + columnIndex * 0.15;

    return (
        <div
            className={styles.skillColumn}
            style={{
                "--pillar-height": column.pillarHeight,
            } as React.CSSProperties}
        >
            {/* Pillar behind skills */}
            <div className={styles.pillarWrapper}>
                <PillarModel
                    scale={column.pillarHeight * 0.4}
                    rotationY={side === "left" ? 0.15 : -0.15}
                    positionY={0}
                />
            </div>

            {/* Skills stacked on top of pillar */}
            <div className={styles.skillStack}>
                {column.skills.map((skill, skillIndex) => (
                    <SkillBlock
                        key={`${side}-${columnIndex}-${skill.name}`}
                        skill={skill}
                        delay={baseDelay + skillIndex * 0.08}
                    />
                ))}
            </div>
        </div>
    );
};

export const Skills = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted || !sectionRef.current) return;

        const blocks = sectionRef.current.querySelectorAll(`.${styles.skillBlock}`);
        const title = sectionRef.current.querySelector(`.${styles.title}`);
        const pillars = sectionRef.current.querySelectorAll(`.${styles.pillarWrapper}`);

        // Animate pillars first
        gsap.fromTo(pillars,
            {
                opacity: 0,
                scaleY: 0,
            },
            {
                opacity: 1,
                scaleY: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // Animate blocks on scroll
        gsap.fromTo(blocks,
            {
                opacity: 0,
                scale: 0.5,
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 30%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // Animate title
        if (title) {
            gsap.fromTo(title,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }

    }, { scope: sectionRef, dependencies: [mounted] });

    return (
        <section ref={sectionRef} className={styles.skillsSection} data-section="skills">
            {/* Title */}
            <h2 className={styles.title}>Skills</h2>

            {/* Columns Container */}
            <div className={styles.columnsContainer}>
                {/* Left Columns */}
                <div className={styles.columnsGroup}>
                    {leftColumns.map((column, index) => (
                        <SkillColumnComponent
                            key={`left-column-${index}`}
                            column={column}
                            columnIndex={index}
                            side="left"
                        />
                    ))}
                </div>

                {/* Right Columns */}
                <div className={styles.columnsGroup}>
                    {rightColumns.map((column, index) => (
                        <SkillColumnComponent
                            key={`right-column-${index}`}
                            column={column}
                            columnIndex={index}
                            side="right"
                        />
                    ))}
                </div>
            </div>

            {/* Center Skills Row */}
            <div className={styles.centerSkillsRow}>
                {centerSkills.map((skill, index) => (
                    <div key={`center-${skill.name}`} className={styles.centerSkillWrapper}>
                        {/* Capitel above each skill */}
                        <div className={styles.capitelWrapper}>
                            <CapitelModel
                                scale={0.8}
                                rotationY={Math.PI * 0.1 * (index % 2 === 0 ? 1 : -1)}
                            />
                        </div>
                        <SkillBlock
                            skill={skill}
                            delay={0.6 + index * 0.1}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
