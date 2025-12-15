"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
}

export const TextReveal = ({ children, className, delay = 0 }: TextRevealProps) => {
    return (
        <span className={cn("inline-block", className)}>
            {children.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.2em] whitespace-nowrap">
                    {word.split("").map((char, j) => (
                        <motion.span
                            key={j}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.4,
                                delay: delay + i * 0.1 + j * 0.02,
                                ease: "easeOut",
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </span>
    );
};
