"use client";

import { useState, useEffect, ReactNode } from "react";
import { ASCIIIntro } from "@/components/ui/ASCIIIntro";

interface IntroWrapperProps {
    children: ReactNode;
}

export function IntroWrapper({ children }: IntroWrapperProps) {
    const [showContent, setShowContent] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);

    // Check if intro was already shown in this session
    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem("intro_shown");
        if (hasSeenIntro === "true") {
            setShowContent(true);
            setIntroComplete(true);
        }
    }, []);

    const handleIntroComplete = () => {
        setIntroComplete(true);
        setShowContent(true);
        sessionStorage.setItem("intro_shown", "true");
    };

    return (
        <>
            {/* ASCII Intro - only shows if not seen in session */}
            {!introComplete && <ASCIIIntro onComplete={handleIntroComplete} />}

            {/* Main content */}
            <div
                className={`transition-opacity duration-700 ${showContent ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    visibility: showContent ? "visible" : "hidden",
                }}
            >
                {children}
            </div>
        </>
    );
}

export default IntroWrapper;
