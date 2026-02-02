"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

const FRAME_COUNT = 144;

export default function KitchenSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Scroll progress for the entire container (500vh)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth out the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Map progress (0 to 1) to frame index (0 to FRAME_COUNT - 1)
    const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Opacity transforms for text beats
    const opacityA = useTransform(smoothProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
    const opacityB = useTransform(smoothProgress, [0.25, 0.3, 0.45, 0.5], [0, 1, 1, 0]);
    const opacityC = useTransform(smoothProgress, [0.5, 0.55, 0.7, 0.75], [0, 1, 1, 0]);
    const opacityD = useTransform(smoothProgress, [0.75, 0.8, 0.9, 0.95], [0, 1, 1, 0]);

    const beats = [
        {
            id: "beat-a",
            opacity: opacityA,
            title: "REIMAGINE O ESPAÇO",
            subtitle: "Onde a funcionalidade encontra o design de luxo.",
        },
        {
            id: "beat-b",
            opacity: opacityB,
            title: "EXCELÊNCIA EM CADA DETALHE",
            highlightWord: "DETALHE",
            subtitle: "Do nicho planejado à bancada em pedra natural; transformamos o seu ritual matinal em uma experiência de luxo.",
        },
        {
            id: "beat-c",
            opacity: opacityC,
            title: "UM NOVO COMEÇO",
            highlightWord: "COMEÇO",
            subtitle: "Mármores selecionados, ferragens italianas e iluminação inteligente.",
        },
        {
            id: "beat-d",
            opacity: opacityD,
            title: "PARA UMA NOVA REALIDADE",
            highlightWord: "REALIDADE",
            subtitle: "Transformamos visões em lares extraordinários.",
        },
    ];

    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);
            const isMobile = window.innerWidth < 768;
            const basePath = isMobile ? "/framesmobile/" : "/sequence/";

            // Pre-allocate array to preserve order
            const promises: Promise<HTMLImageElement | null>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                promises.push(new Promise((resolve) => {
                    const img = new Image();
                    const filename = `ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;
                    img.src = `${basePath}${filename}`;
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                }));
            }

            // Load all images in parallel
            const results = await Promise.all(promises);

            // Filter out any failed loads but keep the array structure valid? 
            // Actually, for a sequence, we need contiguous frames. 
            // If one fails, we might just have a hole, but filtering removes it entirely shifting animation.
            // Let's filter nulls.
            const validImages = results.filter((img): img is HTMLImageElement => img !== null);

            setImages(validImages);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    // Render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size (responsive handling happens via CSS object-fit)
        // We update this to match the image aspect ratio if known, 
        // but 1920x1080 is a safe default for HD usually.
        // The previous code had 1920x1080.
        // Let's rely on the first image's natural dimensions if available, 
        // or fallback to 1920x1080. 
        // For simplicity efficiently, we keep 1920x1080 and drawImage will scale if needed 
        // OR we can set it dynamically.
        // Let's update it to use the image dimensions if possible to avoid distortion

        if (images.length > 0) {
            canvas.width = images[0].naturalWidth || 1920;
            canvas.height = images[0].naturalHeight || 1080;
        } else {
            canvas.width = 1920;
            canvas.height = 1080;
        }

        const render = () => {
            if (images.length === 0) return;

            const index = Math.round(frameIndex.get());
            // Clamp index
            const safeIndex = Math.min(Math.max(index, 0), images.length - 1);

            const image = images[safeIndex];

            if (image) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }

            requestAnimationFrame(render);
        };

        const unsubscribe = frameIndex.on("change", () => {
            // Trigger render on change if needed, but rAF is smoother usually
        });

        // Start render loop
        const animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
            unsubscribe();
        };
    }, [images, frameIndex]);

    const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

    return (
        <div id="inicio" ref={containerRef} className="h-[500vh] relative bg-[#050505]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Show first frame immediately so it's not a black screen */}
                <img
                    src={images.length > 0 ? images[0].src : (typeof window !== 'undefined' && window.innerWidth < 768 ? "/framesmobile/ezgif-frame-001.jpg" : "/sequence/ezgif-frame-001.jpg")}
                    alt="Kitchen Start"
                    className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
                />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white z-50 bg-black/20 backdrop-blur-[2px]">
                        <span className="animate-pulse tracking-widest uppercase text-xs md:text-sm font-medium drop-shadow-md">A carregar experiência...</span>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover scale-105 relative z-10"
                />

                {/* Scrollytelling Overlays */}
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center items-center">
                    {beats.map((beat) => (
                        <motion.div
                            key={beat.id}
                            style={{ opacity: beat.opacity }}
                            className="absolute inset-0 flex flex-col items-center justify-center pt-32 md:pt-0 text-center px-4 mix-blend-overlay"
                        >
                            {beat.id === "beat-a" ? (
                                <div className="flex flex-col items-center max-w-5xl mx-auto">
                                    <p className="text-xs md:text-sm tracking-[0.2em] uppercase mb-6 font-semibold text-[#E0C097] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        A Arte da Renovação
                                    </p>
                                    <h2
                                        className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-center leading-[1.1] mb-8 text-white"
                                        style={{
                                            textShadow: `
                                                1px 1px 0px rgba(0,0,0,0.2),
                                                2px 2px 0px rgba(0,0,0,0.2),
                                                3px 3px 0px rgba(0,0,0,0.2),
                                                4px 4px 0px rgba(0,0,0,0.2),
                                                5px 5px 0px rgba(0,0,0,0.2),
                                                6px 6px 0px rgba(0,0,0,0.2),
                                                7px 7px 10px rgba(0,0,0,0.5),
                                                8px 8px 20px rgba(0,0,0,0.3)
                                            `
                                        }}
                                    >
                                        REIMAGINE <span className="block md:inline text-white">O ESPAÇO</span>
                                    </h2>
                                </div>
                            ) : (
                                // Standard styling for other beats
                                <>
                                    <h2
                                        className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-center mb-4 text-white"
                                        style={{
                                            textShadow: `
                                                1px 1px 0px rgba(0,0,0,0.2),
                                                2px 2px 0px rgba(0,0,0,0.2),
                                                3px 3px 0px rgba(0,0,0,0.2),
                                                4px 4px 0px rgba(0,0,0,0.2),
                                                5px 5px 0px rgba(0,0,0,0.2),
                                                6px 6px 0px rgba(0,0,0,0.2),
                                                7px 7px 10px rgba(0,0,0,0.5),
                                                8px 8px 20px rgba(0,0,0,0.3)
                                            `
                                        }}
                                    >
                                        {beat.title}
                                    </h2>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    style={{ opacity: scrollIndicatorOpacity }}
                    animate={{ y: 8 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        y: { repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }
                    }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-nowrap opacity-90">
                            Arraste e Descubra a Transformação
                        </span>
                        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent opacity-60"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
