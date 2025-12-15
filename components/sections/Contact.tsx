"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export const Contact = () => {
    return (
        <footer id="contact" className="py-24 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/5">
            <ScrollReveal>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Vamos conversar?</h2>
                        <p className="text-text-secondary">Estou disponível para novos projetos.</p>
                    </div>

                    <div className="flex gap-8">
                        <a href="mailto:yuri@example.com" className="text-text-secondary hover:text-primary transition-colors">
                            <Mail className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                            <Github className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-sm text-text-secondary">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <MapPin className="w-4 h-4" />
                        <span>Santa Helena, PR</span>
                    </div>
                    <p>© {new Date().getFullYear()} Yuri Santos. All rights reserved.</p>
                </div>
            </ScrollReveal>
        </footer>
    );
};
