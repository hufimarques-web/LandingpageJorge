import Image from "next/image";
import KitchenSequence from "@/components/KitchenSequence";
import Philosophy from "@/components/Philosophy";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen text-white">
      <Header />
      <KitchenSequence />
      <Philosophy />
      <Testimonials />
      <CTA />
    </main>
  );
}
