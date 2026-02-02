"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // Hide header after KitchenSequence (approximately 3500px)
            setIsVisible(scrollPosition < 3500);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToCTA = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMenuOpen(false); // Close menu first
        window.dispatchEvent(new CustomEvent('open-cta'));

        // Small delay to let the state update before scrolling
        setTimeout(() => {
            const ctaSection = document.getElementById('cta');
            if (ctaSection) {
                ctaSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleScrollToSection = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[9999] px-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="container mx-auto flex items-start justify-between">
                {/* Logo Card */}
                <Link href="/" className="relative flex-shrink-0 bg-white rounded-b-3xl px-4 md:px-6 pb-3 md:pb-4 pt-3 md:pt-4 shadow-2xl">
                    <div className="relative h-16 md:h-24 aspect-[1.1/1]">
                        <Image
                            src="/logo.png"
                            alt="Freitas Renovações"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Floating Menu Wrapper */}
                <div className="relative mt-2 md:mt-4 flex flex-col items-end">

                    {/* Floating Menu Pill */}
                    <div className="relative z-50 rounded-full p-[2px] overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#000000_50%,#E2E8F0_100%)] opacity-100" style={{ animationDuration: '3s' }} />
                        <div className="relative flex items-center gap-2 md:gap-4 bg-white rounded-full px-2 py-2 md:pl-6 backdrop-blur-3xl">
                            <div onClick={handleScrollToCTA} className="hidden md:block p-3 bg-black hover:bg-[#333] rounded-full transition-colors group shadow-md border border-black/5 cursor-pointer relative z-10 transition-transform active:scale-95">
                                <FileText className="w-5 h-5 text-white" />
                            </div>

                            <div onClick={handleScrollToCTA} className="hidden md:block p-3 bg-black hover:bg-[#333] rounded-full transition-colors group shadow-md border border-black/5 cursor-pointer relative z-10 transition-transform active:scale-95">
                                <Phone className="w-5 h-5 text-white" />
                            </div>

                            <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-2"></div>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 px-2 md:pr-4 group relative z-10"
                            >
                                <span className={`hidden md:block font-medium text-sm tracking-wide transition-colors ${isMenuOpen ? 'text-[#E0C097]' : 'text-black group-hover:text-[#E0C097]'}`}>
                                    {isMenuOpen ? 'Fechar' : 'Menu'}
                                </span>
                                <Menu className={`w-6 h-6 transition-colors ${isMenuOpen ? 'text-[#E0C097]' : 'text-black group-hover:text-[#E0C097]'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-full right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40"
                            >
                                <div className="flex flex-col py-2">
                                    <button
                                        onClick={() => handleScrollToSection('filosofia')}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Filosofia
                                    </button>
                                    <button
                                        onClick={() => handleScrollToSection('projetos')}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Histórias Reais
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            handleScrollToCTA(e);
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Começar Agora
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}
