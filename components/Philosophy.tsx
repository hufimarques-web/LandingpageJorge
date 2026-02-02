"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const philosophyPoints = [
    {
        number: "01",
        title: "Melhorar, não exagerar",
        description: "Cada intervenção tem um propósito claro. Retiramos o que já não serve para revelar conforto, funcionalidade e beleza duradoura.",
    },
    {
        number: "02",
        title: "Renovação guiada pela estrutura",
        description: "Respeitamos a base da casa e trabalhamos a partir dela. Layouts pensados para luz, circulação e uso real dos espaços.",
    },
    {
        number: "03",
        title: "Transformação subtil",
        description: "Mudanças que se sentem, não que gritam. Intervenções naturais, como a luz que entra melhor ou o espaço que finalmente flui.",
    },
    {
        number: "04",
        title: "Estética que permanece",
        description: "Escolhas equilibradas e intemporais. Renovações que não seguem modas passageiras — criam casas que continuam a fazer sentido com o tempo.",
    },
];

export default function Philosophy() {
    return (
        <section id="filosofia" className="py-24 bg-gray-50 text-black overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left side - Eyebrow, Heading, and Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
                            Nossa Filosofia
                        </p>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight tracking-tight mb-12">
                            Renovar com
                            <br />
                            <span className="relative inline-block font-bold">
                                intenção
                                <svg
                                    className="absolute -bottom-1 left-0 w-full h-4 overflow-visible"
                                    viewBox="0 0 200 12"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <motion.path
                                        d="M0 8 Q50 2, 100 6 T200 8"
                                        stroke="#E0C097"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                        viewport={{ once: true }}
                                    />
                                </svg>
                            </span>
                        </h2>

                        <div className="w-full">
                            <Image
                                src="/philosophy-illustration.png"
                                alt="Architectural Design Illustration"
                                width={600}
                                height={600}
                                className="w-full h-auto mix-blend-multiply opacity-90"
                            />
                        </div>
                    </motion.div>

                    {/* Right side - Intro and Philosophy Points */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <p className="text-gray-600 mb-12 text-lg leading-relaxed">
                            A renovação é mais do que mudar paredes — é transformar a forma como se vive um espaço. Criamos casas que evoluem com as pessoas e elevam o quotidiano.
                        </p>

                        <div className="space-y-8">
                            {philosophyPoints.map((point, index) => (
                                <motion.div
                                    key={point.number}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="text-xs text-gray-400 font-mono">
                                            {point.number}
                                        </span>
                                        <h3 className="text-xl font-semibold">
                                            {point.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed pl-8">
                                        {point.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
