"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const About = () => {
    return (
        <section id="about" className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
            <ScrollReveal>
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-baseline">
                    <h3 className="text-xl font-mono text-text-secondary">01 / Sobre</h3>
                    <div className="space-y-6 text-xl md:text-2xl font-light leading-relaxed text-text-primary">
                        <p>
                            Sou um desenvolvedor apaixonado por criar interfaces digitais intuitivas e performáticas.
                            Foco em entregar experiências de usuário excepcionais combinando design limpo e código eficiente.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-base text-text-secondary">
                            <div>
                                <h4 className="font-bold text-text-primary mb-2">Atualmente</h4>
                                <p>7° período Ciência da Computação - UTFPR</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-primary mb-2">Idiomas</h4>
                                <p>Espanhol Fluente | Inglês B2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
};
