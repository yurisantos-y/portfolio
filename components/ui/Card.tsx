"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hoverEffect = true, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={hoverEffect ? { scale: 1 } : undefined}
                whileHover={hoverEffect ? { scale: 1.02, y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" } : undefined}
                transition={{ duration: 0.2 }}
                className={cn(
                    "bg-surface rounded-xl p-6 border border-white/5",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";

export { Card };
