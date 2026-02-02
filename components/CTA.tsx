"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { Users, MapPin, Calendar, Trophy, ArrowRight } from "lucide-react";

export default function CTA() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [clipPath, setClipPath] = useState("polygon(29% 29%, 71% 29%, 71% 71%, 29% 71%)");
    const [contentOpacity, setContentOpacity] = useState(0);
    const [contentY, setContentY] = useState(50);
    const [scale, setScale] = useState(1.2);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const [forceOpen, setForceOpen] = useState(false);
    const isForcingRef = useRef(false);

    useEffect(() => {
        const handleForceOpen = () => {
            isForcingRef.current = true;
            setForceOpen(true);
            // Reset the forcing guard after 2 seconds (enough for smooth scroll)
            setTimeout(() => {
                isForcingRef.current = false;
            }, 2000);
        };
        window.addEventListener('open-cta', handleForceOpen);
        return () => window.removeEventListener('open-cta', handleForceOpen);
    }, []);

    useEffect(() => {
        if (forceOpen) {
            setClipPath(`polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`);
            setContentOpacity(1);
            setContentY(0);
            setScale(1);
        }
    }, [forceOpen]);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Reset forceOpen if we scroll back up to the start AND not currently forcing
            if (latest < 0.1 && forceOpen && !isForcingRef.current) {
                setForceOpen(false);
            }

            // Clip path animation - expands as you scroll
            // If forced open, we act as if progress is complete (1)
            let progress = Math.max(0, Math.min(1, (latest - 0.2) / 0.6));

            if (forceOpen) {
                progress = 1;
            }

            const size = 29 + (21 * progress); // From 29% to 50% (full screen)
            setClipPath(`polygon(${50 - size}% ${50 - size}%, ${50 + size}% ${50 - size}%, ${50 + size}% ${50 + size}%, ${50 - size}% ${50 + size}%)`);

            // Content fade in
            let contentProgress = Math.max(0, Math.min(1, (latest - 0.4) / 0.3));
            if (forceOpen) contentProgress = 1;

            setContentOpacity(contentProgress);
            setContentY(50 - (50 * contentProgress));

            // Scale animation
            let scaleProgress = Math.max(0, Math.min(1, (latest - 0.2) / 0.5));
            if (forceOpen) scaleProgress = 1;

            setScale(1.2 - (0.2 * scaleProgress));
        });

        return () => unsubscribe();
    }, [scrollYProgress, forceOpen]);

    return (
        <div id="cta" className="bg-white">
            <div ref={containerRef} className="relative w-full" style={{ height: "2500px" }}>
                <div
                    className="sticky top-0 h-screen w-full bg-white overflow-hidden"
                    style={{
                        willChange: "transform",
                        clipPath: clipPath
                    }}
                >
                    {/* Desktop Background Image */}
                    <div
                        className="absolute inset-0 hidden md:block"
                        style={{
                            backgroundImage: "url('/cta-construction.png')",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "168%",
                            transform: `scale(${scale})`
                        }}
                    />

                    {/* Mobile Background Image */}
                    <div
                        className="absolute inset-0 md:hidden"
                        style={{
                            backgroundImage: "url('/cta-construction-mobile.jpg')",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            transform: `scale(${scale})`
                        }}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Content */}
                    <div
                        className="absolute inset-0 flex items-center justify-center z-20"
                        style={{
                            opacity: contentOpacity,
                            transform: `translateY(${contentY}px)`
                        }}
                    >
                        <div className="text-center text-white max-w-4xl mx-auto px-4 md:px-6">
                            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-wider mb-4 md:mb-6 leading-none">
                                PRONTO PARA
                                <br />
                                <span className="text-white">
                                    RENOVAÇÕES?
                                </span>
                            </h2>

                            <p className="text-sm md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed font-medium">
                                Junte-se a dezenas de clientes em Aveiro que transformaram as suas casas.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-12">
                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-xl md:text-3xl font-black text-white mb-1">50+</div>
                                    <div className="text-[10px] md:text-sm text-gray-300 font-medium leading-tight">Clientes Felizes</div>
                                </div>

                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-xl md:text-3xl font-black text-white mb-1">Aveiro</div>
                                    <div className="text-[10px] md:text-sm text-gray-300 font-medium leading-tight">Local</div>
                                </div>

                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-xl md:text-3xl font-black text-white mb-1">5+</div>
                                    <div className="text-[10px] md:text-sm text-gray-300 font-medium leading-tight">Anos Exp.</div>
                                </div>

                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-xl md:text-3xl font-black text-white mb-1">100%</div>
                                    <div className="text-[10px] md:text-sm text-gray-300 font-medium leading-tight">Garantia</div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-2 md:pt-8 mb-6 md:mb-0">
                                <a
                                    href="https://wa.me/351961455997?text=Ol%C3%A1%2C%20gostaria%20de%20pedir%20um%20or%C3%A7amento."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative transition-transform duration-300 hover:scale-105 active:scale-95 w-full md:w-auto inline-block"
                                >
                                    <div className="relative rounded-full p-[2px] overflow-hidden">
                                        <div className="absolute inset-0 animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#FFFFFF_50%,#000000_100%)] opacity-100" style={{ animationDuration: '3s' }} />
                                        <div className="relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 px-6 py-3 md:px-8 md:py-4 backdrop-blur-3xl">
                                            <span className="text-sm md:text-lg font-bold uppercase tracking-wider text-white">PEDIR ORÇAMENTO</span>
                                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* Trust Badges - Hidden on very small screens if needed, or compacted */}
                            <div className="mt-4 md:mt-12 pt-4 md:pt-6 border-t border-white/20">
                                <p className="text-[10px] md:text-xs text-gray-400 mb-2 md:mb-3 font-medium">CONFIANÇA & QUALIDADE</p>
                                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-gray-300">
                                    <span className="text-[10px] md:text-xs font-semibold">🏠 RENOVAÇÕES</span>
                                    <span className="text-[10px] md:text-xs font-semibold">⚡ PRAZOS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
