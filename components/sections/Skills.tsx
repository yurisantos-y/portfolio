"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Skills.module.css";

gsap.registerPlugin(ScrollTrigger);

// Skill interface
interface Skill {
    name: string;
    icon: string; // Devicon class name
    color?: string;
}

// Skills data organized by pyramid position
const leftPyramidSkills: Skill[][] = [
    // Row 1 (top - 1 block)
    [{ name: "React", icon: "devicon-react-original", color: "#61DAFB" }],
    // Row 2 (2 blocks)
    [
        { name: "Next.js", icon: "devicon-nextjs-plain", color: "#ffffff" },
        { name: "TypeScript", icon: "devicon-typescript-plain", color: "#3178C6" },
    ],
    // Row 3 (3 blocks)
    [
        { name: "JavaScript", icon: "devicon-javascript-plain", color: "#F7DF1E" },
        { name: "HTML5", icon: "devicon-html5-plain", color: "#E34F26" },
        { name: "CSS3", icon: "devicon-css3-plain", color: "#1572B6" },
    ],
    // Row 4 (4 blocks)
    [
        { name: "Node.js", icon: "devicon-nodejs-plain", color: "#339933" },
        { name: "Git", icon: "devicon-git-plain", color: "#F05032" },
        { name: "TailwindCSS", icon: "devicon-tailwindcss-original", color: "#06B6D4" },
        { name: "Sass", icon: "devicon-sass-original", color: "#CC6699" },
    ],
];

const rightPyramidSkills: Skill[][] = [
    // Row 1 (top - 1 block)
    [{ name: "Flutter", icon: "devicon-flutter-plain", color: "#02569B" }],
    // Row 2 (2 blocks)
    [
        { name: "Dart", icon: "devicon-dart-plain", color: "#0175C2" },
        { name: "Firebase", icon: "devicon-firebase-plain", color: "#FFCA28" },
    ],
    // Row 3 (3 blocks)
    [
        { name: "Swift", icon: "devicon-swift-plain", color: "#FA7343" },
        { name: "Kotlin", icon: "devicon-kotlin-plain", color: "#7F52FF" },
        { name: "Android", icon: "devicon-android-plain", color: "#3DDC84" },
    ],
    // Row 4 (4 blocks)
    [
        { name: "PostgreSQL", icon: "devicon-postgresql-plain", color: "#4169E1" },
        { name: "MongoDB", icon: "devicon-mongodb-plain", color: "#47A248" },
        { name: "Docker", icon: "devicon-docker-plain", color: "#2496ED" },
        { name: "Figma", icon: "devicon-figma-plain", color: "#F24E1E" },
    ],
];

const centerSkills: Skill[] = [
    { name: "VS Code", icon: "devicon-vscode-plain", color: "#007ACC" },
    { name: "GitHub", icon: "devicon-github-original", color: "#ffffff" },
    { name: "NPM", icon: "devicon-npm-original-wordmark", color: "#CB3837" },
    { name: "Vercel", icon: "devicon-vercel-original", color: "#ffffff" },
    { name: "Linux", icon: "devicon-linux-plain", color: "#FCC624" },
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

            {/* Pyramid Container */}
            <div className={styles.pyramidContainer}>
                {/* Left Pyramid */}
                <div className={`${styles.pyramid} ${styles.pyramidLeft}`}>
                    {leftPyramidSkills.map((row, rowIndex) => (
                        <div key={`left-row-${rowIndex}`} className={styles.pyramidRow}>
                            {row.map((skill, skillIndex) => (
                                <SkillBlock
                                    key={`left-${skill.name}`}
                                    skill={skill}
                                    delay={rowIndex * 0.1 + skillIndex * 0.05}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Right Pyramid */}
                <div className={`${styles.pyramid} ${styles.pyramidRight}`}>
                    {rightPyramidSkills.map((row, rowIndex) => (
                        <div key={`right-row-${rowIndex}`} className={styles.pyramidRow}>
                            {row.map((skill, skillIndex) => (
                                <SkillBlock
                                    key={`right-${skill.name}`}
                                    skill={skill}
                                    delay={rowIndex * 0.1 + skillIndex * 0.05 + 0.3}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Skills Row */}
            <div className={styles.centerSkillsRow}>
                {centerSkills.map((skill, index) => (
                    <SkillBlock
                        key={`center-${skill.name}`}
                        skill={skill}
                        delay={0.6 + index * 0.1}
                    />
                ))}
            </div>
        </section>
    );
};
