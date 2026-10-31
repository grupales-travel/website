import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import TeamSection from "@/components/quienes-somos/TeamSection";
import { Check, Compass, MessageCircle } from "lucide-react";
import { COMPANY } from "@/data/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestro Equipo — Profesionales Especializados | Grupales Travel",
  description:
    "Conocé al equipo de profesionales detrás de Grupales Travel. Coordinadores, asesores comerciales y directores comprometidos con tu viaje.",
};

const ADVANTAGES_LIST = [
  "Más de 8 años de experiencia coordinando salidas grupales.",
  "Equipo profesional especializado en cada destino.",
  "Salidas grupales cuidadosamente diseñadas desde cero.",
  "Acompañamiento permanente de coordinadores desde Argentina.",
  "Atención personalizada y asesoramiento pre y post viaje.",
  "Presencia física con oficinas comerciales en distintas ciudades.",
  "Representantes comerciales en diferentes regiones del país.",
];

export default function NuestroEquipoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF7F2] text-[#1E1810] relative">

        {/* Banner Principal / Hero de Nuestro Equipo */}
        <section className="relative flex items-center justify-center pt-24 sm:pt-28 pb-8 sm:pb-10 px-6 overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/[0.02] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(166,109,3,0.06),transparent)] z-10" />
          
          {/* Stylized background photo with low opacity and blur */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/foto-grupal-equipo.webp"
              alt="Equipo de Grupales Travel"
              fill
              className="object-cover opacity-[0.08] filter blur-[2px]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-transparent to-[#FAF7F2]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-20 text-center space-y-3.5">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#72500c]" />
                <span className="text-[#72500c] text-xs font-bold uppercase tracking-[0.25em]">
                  Profesionales
                </span>
                <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#72500c]" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#1E1810]">
                NUESTRO <span className="text-gold-gradient">EQUIPO</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-[#1E1810]/75 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                Cada viaje es el resultado del trabajo coordinado de profesionales especializados en distintas áreas. 
                Nuestro compromiso es acompañarte en cada etapa del proceso para que solo tengas que disfrutar la experiencia.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Sección del Equipo (Grilla compacta y filtros) */}
        <section className="py-8 md:py-12 px-4 sm:px-6 relative border-t border-[#1E1810]/5">
          <div className="max-w-7xl mx-auto">
            <TeamSection />
          </div>
        </section>

        {/* ¿Por qué elegir Grupales Travel? (Formato compacto) */}
        <section className="py-12 md:py-16 px-6 bg-[#FAF7F2] relative border-t border-[#1E1810]/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 space-y-2">
              <AnimatedSection>
                <h3 className="text-[#72500c] text-xs font-bold uppercase tracking-widest">
                  Diferenciales
                </h3>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1810]">
                  ¿Por qué elegir <span className="text-gold-gradient">Grupales Travel?</span>
                </h2>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ADVANTAGES_LIST.map((adv, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 0.04}
                  className="flex items-center gap-3 bg-white border border-[#db5835]/15 p-3 sm:p-3.5 rounded-xl hover:border-[#db5835]/40 transition-colors shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-[#db5835]/10 flex items-center justify-center shrink-0 border border-[#db5835]/20">
                    <Check size={14} className="text-[#db5835]" />
                  </div>
                  <p className="text-[#1E1810]/85 text-xs sm:text-sm font-bold leading-snug">
                    {adv}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Cierre / Frase Final con Foto Grupal (Proporción estilizada) */}
        <section className="py-10 md:py-14 px-6 relative border-t border-[#1E1810]/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,88,53,0.04),transparent)] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            {/* Foto grupal compacta */}
            <AnimatedSection>
              <div className="relative aspect-[24/9] w-full border border-[#1E1810]/5 rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src="/foto-grupal-equipo.webp"
                  alt="Equipo de Grupales Travel"
                  fill
                  className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
                  sizes="(max-w-3xl) 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>
            </AnimatedSection>

            <div className="space-y-3">
              <AnimatedSection delay={0.1}>
                <p className="text-[#72500c] text-[11px] font-bold uppercase tracking-widest">
                  Nuestro Compromiso
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={0.15}>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E1810] leading-snug">
                  &ldquo;Detrás de cada salida hay un equipo comprometido con un mismo objetivo: <br />
                  <span className="text-gold-gradient">
                    Que cada viaje se convierta en una experiencia inolvidable.
                  </span>&rdquo;
                </h3>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={COMPANY.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-gold text-white font-bold text-xs uppercase tracking-widest shadow-md hover:scale-105 transition-all duration-300"
                  >
                    <MessageCircle size={15} />
                    Conversar con un asesor
                  </a>
                  <Link
                    href="/salidas"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#1E1810]/15 hover:border-[#db5835] text-[#1E1810] font-bold text-xs uppercase tracking-widest transition-all duration-300"
                  >
                    <Compass size={15} className="text-[#db5835]" />
                    Explorar salidas grupales
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
