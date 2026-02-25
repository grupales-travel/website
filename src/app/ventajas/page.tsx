import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactCTA from "@/components/home/ContactCTA";
import AnimatedSection from "@/components/ui/AnimatedSection";
import VentajasHero from "@/components/ventajas/VentajasHero";
import { ADVANTAGES } from "@/data/company";
import { Users, Plane, Building2, Map, Shield, BedDouble, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Beneficios — Grupales Travel",
  description:
    "Conocé todos los beneficios de viajar con Grupales Travel: coordinadores, vuelos incluidos, seguro médico, excursiones en español y mucho más.",
};

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  users:         <Users size={18} />,
  plane:         <Plane size={18} />,
  building:      <Building2 size={18} />,
  map:           <Map size={18} />,
  shield:        <Shield size={18} />,
  "door-open":   <BedDouble size={18} />,
  "credit-card": <CreditCard size={18} />,
};

const STATS = [
  { value: "+500",  label: "Viajeros satisfechos" },
  { value: "+23",   label: "Destinos activos" },
  { value: "+8",    label: "Años de experiencia" },
  { value: "100%",  label: "Salidas confirmadas" },
];

export default function BeneficiosPage() {
  return (
    <>
      <Navbar />
      <main>

        <VentajasHero />

        {/* Banner flotante entre secciones — sin fondo */}
        <div className="relative z-10 flex justify-center -mt-5 -mb-5 px-6">
          <Image
            src="/iconos-beneficios.png"
            alt="Beneficios incluidos"
            width={220}
            height={40}
            className="h-9 w-auto object-contain block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Stats */}
        <section className="py-10 px-6 bg-[#f5e6cc]/50 border-b border-[#a66d03]/12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.07} direction="up" className="flex flex-col items-center justify-center text-center">
                <p className="text-3xl md:text-4xl font-black text-[#a66d03] leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-[#1E1810]/55 text-sm font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-14 px-6 bg-[#f5e6cc] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_80%_50%,rgba(166,109,3,0.09),transparent)] pointer-events-none" />
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-5">
              <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight" style={{ color: "#5c3317" }}>
                Todo lo que <span className="text-gold-gradient">necesitás</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADVANTAGES.filter((adv) => adv.id !== "room").map((adv) => (
                <div key={adv.id} className="flex items-start gap-4 px-6 py-6 rounded-xl border-l-2 bg-white/50 border-[#a66d03]/45 hover:bg-white/70 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-[#a66d03]/10 flex items-center justify-center text-[#a66d03] shrink-0 mt-0.5">
                    {ICON_COMPONENTS[adv.icon]}
                  </div>
                  <div>
                    <p className="font-black text-[#8c5a2b] text-lg uppercase tracking-wide leading-tight mb-0.5">
                      {adv.title}
                    </p>
                    <p className="text-[#1E1810]/60 text-lg leading-[1.2]">
                      {adv.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Image
                src="/recurso-8.png"
                alt="Habitación doble a compartir garantizada"
                width={900}
                height={120}
                className="w-full max-w-2xl h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-16 px-6 bg-[#1E1810] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_30%_50%,rgba(166,109,3,0.12),transparent)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#a66d03]" />
                <span className="text-[#d9bf8f] text-xs font-bold uppercase tracking-[0.3em]">
                  Nuestra filosofía
                </span>
              </div>
              <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-6">
                &ldquo;Todos los detalles están previstos y cuidados para que el
                pasajero solo se concentre en lo verdaderamente importante:{" "}
                <span className="text-gold-gradient">vivir el viaje.</span>&rdquo;
              </blockquote>
              <p className="text-white/45 text-sm font-medium uppercase tracking-widest">
                — Grupales Travel · Desde 2018
              </p>
            </AnimatedSection>
          </div>
        </section>

        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
