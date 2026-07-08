"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import OfficeCard from "@/components/quienes-somos/OfficeCard";
import ArgentinaMap from "@/components/quienes-somos/ArgentinaMap";
import TeamSection from "@/components/quienes-somos/TeamSection";
import { OFFICES } from "@/data/company";
import { Check } from "lucide-react";

// Horarios de atención y placeholders adicionales para las oficinas
const OFFICE_DETAILS = [
  {
    id: "san-luis",
    city: "San Luis",
    phone: "+54 9 266 486-7440",
    whatsapp: "https://wa.me/5492664867440",
    address: "Pringles 335",
    mapsUrl: "https://maps.app.goo.gl/1sh3LZxdtG22muas8",
    hours: "Lunes a Viernes: 09:00 a 13:00 hs y 16:30 a 20:30 hs. Sábados: 09:30 a 13:00 hs.",
    imagePlaceholder: "/placeholder-office-sl.jpg",
  },
  {
    id: "villa-mercedes",
    city: "Villa Mercedes",
    phone: "+54 9 265 777-3473",
    whatsapp: "https://wa.me/5492657773473",
    address: "General Paz 560",
    mapsUrl: "https://maps.app.goo.gl/mzAafmsanWRdkpEbA",
    hours: "Lunes a Viernes: 09:00 a 13:00 hs y 16:30 a 20:30 hs. Sábados: 09:30 a 13:00 hs.",
    imagePlaceholder: "/placeholder-office-vm.jpg",
  },
  {
    id: "cordoba",
    city: "Córdoba",
    phone: "+54 9 351 212-3128",
    whatsapp: "https://wa.me/5493512123128",
    address: "La Rioja 590, oficina 14",
    mapsUrl: "https://maps.app.goo.gl/keemdMTUaXw2nwEC8",
    hours: "Lunes a Viernes: 09:00 a 18:00 hs. Sábados: 09:00 a 13:00 hs.",
    imagePlaceholder: "/placeholder-office-cba.jpg",
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "El Comienzo",
    text: "Grupales Travel nace con el propósito de ofrecer salidas grupales acompañadas con un alto nivel de servicio, cuidado al detalle y trato directo.",
  },
  {
    year: "2020",
    title: "Adaptabilidad y Resiliencia",
    text: "Frente a los mayores desafíos del turismo global, consolidamos nuestras bases tecnológicas y operativas para cuidar de cada pasajero.",
  },
  {
    year: "2022",
    title: "Crecimiento de Oficinas",
    text: "Inauguramos nuevos puntos de atención al público en San Luis y Villa Mercedes, fortaleciendo la cercanía y el asesoramiento uno a uno.",
  },
  {
    year: "2024",
    title: "Desembarco en Córdoba",
    text: "Expandimos nuestra presencia física con oficinas comerciales en la Ciudad de Córdoba, conformando un equipo robusto e interdisciplinario.",
  },
  {
    year: "2026",
    title: "Presencia Nacional",
    text: "Con oficinas físicas y representantes comerciales activos en Neuquén, Río Negro, Córdoba y CABA, diseñamos y coordinamos experiencias mundiales.",
  },
];

const ADVANTAGES_LIST = [
  "Más de 8 años de experiencia coordinando salidas grupales.",
  "Equipo profesional especializado en cada destino.",
  "Salidas grupales cuidadosamente diseñadas desde cero.",
  "Acompañamiento permanente de coordinadores desde Argentina.",
  "Atención personalizada y asesoramiento pre y post viaje.",
  "Presencia física con oficinas comerciales en distintas ciudades.",
  "Representantes comerciales en diferentes regiones del país.",
];

export default function QuienesSomosPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF7F2] text-[#1E1810]">
        
        {/* Banner Principal / Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/[0.03] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(166,109,3,0.08),transparent)] z-10" />
          
          {/* Espacio para la foto amplia de la oficina o collage */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-transparent to-[#FAF7F2] z-10" />
          <div className="absolute inset-0 bg-[#FAF7F2]/40 flex items-center justify-center">
            <span className="text-[#1E1810]/15 uppercase tracking-[0.2em] font-extrabold text-xl md:text-3xl border border-[#1E1810]/5 p-8 rounded-2xl bg-white/20">
              Banner Principal (Foto de Oficina o Collage)
            </span>
          </div>

          <div className="max-w-4xl mx-auto relative z-20 text-center space-y-6">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-10 bg-[#a66d03]" />
                <span className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.3em]">
                  Grupales Travel
                </span>
                <div className="h-px w-10 bg-[#a66d03]" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-tight text-[#1E1810]">
                Más que una agencia, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d9bf8f] via-[#bf8b2a] to-[#a66d03]">
                  un equipo que crea experiencias
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-[#1E1810]/75 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                En Grupales Travel creemos que los grandes viajes comienzan mucho antes del embarque. 
                Comienzan con un equipo de personas apasionadas por el turismo que trabaja cada día para diseñar 
                experiencias únicas, acompañar a nuestros pasajeros y cuidar cada detalle desde la primera consulta 
                hasta el regreso a casa.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-24 px-6 relative border-t border-[#1E1810]/5">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Textos descriptivos */}
              <div className="lg:col-span-5 space-y-6">
                <AnimatedSection>
                  <h3 className="text-[#a66d03] text-xs font-bold uppercase tracking-widest mb-2">
                    Trayectoria
                  </h3>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1810] leading-tight">
                    Una empresa en constante crecimiento
                  </h2>
                </AnimatedSection>

                <AnimatedSection delay={0.15}>
                  <p className="text-[#1E1810]/75 text-[17px] leading-relaxed">
                    Grupales Travel nació con el propósito de ofrecer salidas grupales cuidadosamente diseñadas, 
                    combinando el asesoramiento personalizado con una operación profesional y un acompañamiento permanente.
                  </p>
                  <p className="text-[#1E1810]/75 text-[17px] leading-relaxed mt-4">
                    Con el paso de los años fuimos creciendo, incorporando nuevas oficinas, representantes en distintas 
                    ciudades y un equipo multidisciplinario que hoy nos permite brindar un servicio integral antes, 
                    durante y después de cada viaje.
                  </p>
                </AnimatedSection>
              </div>

              {/* Línea de tiempo interactiva */}
              <div className="lg:col-span-7 pl-0 lg:pl-10 relative">
                <div className="absolute left-4 lg:left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#a66d03] via-[#bf8b2a]/30 to-transparent" />
                
                <div className="space-y-10">
                  {TIMELINE.map((item, index) => (
                    <AnimatedSection
                      key={item.year}
                      delay={index * 0.1}
                      className="relative pl-12 lg:pl-16 group"
                    >
                      {/* Puntero de línea de tiempo */}
                      <div className="absolute left-[9px] lg:left-[17px] top-1.5 w-4 h-4 rounded-full bg-[#FAF7F2] border-2 border-[#bf8b2a] group-hover:bg-[#bf8b2a] transition-all duration-300 shadow-lg shadow-[#bf8b2a]/10" />
                      
                      <div className="space-y-1">
                        <span className="text-2xl font-black text-[#bf8b2a] tracking-tight block">
                          {item.year}
                        </span>
                        <h4 className="text-lg font-bold text-[#1E1810] group-hover:text-[#a66d03] transition-colors duration-200">
                          {item.title}
                        </h4>
                        <p className="text-[#1E1810]/70 text-[15px] leading-relaxed max-w-lg">
                          {item.text}
                        </p>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Nuestras Oficinas */}
        <section className="py-24 px-6 bg-[#FAF7F2] relative border-y border-[#1E1810]/5">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <AnimatedSection>
                <h3 className="text-[#a66d03] text-xs font-bold uppercase tracking-widest">
                  Ubicaciones
                </h3>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E1810]">
                  Estamos cerca tuyo
                </h2>
                <p className="text-[#1E1810]/75 text-base sm:text-lg max-w-xl mx-auto">
                  Acercate a cualquiera de nuestras sedes presenciales o coordiná una llamada virtual con nuestros representantes.
                </p>
              </AnimatedSection>
            </div>

            {/* Grid de Oficinas + Mapa SVG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Tarjetas de Oficinas (8 cols) */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {OFFICE_DETAILS.map((office, index) => (
                  <AnimatedSection key={office.id} delay={index * 0.1} className="h-full">
                    <OfficeCard office={office} />
                  </AnimatedSection>
                ))}
              </div>

              {/* Mapa de Argentina interactivo (4 cols) */}
              <div className="lg:col-span-4 h-full">
                <AnimatedSection delay={0.2}>
                  <ArgentinaMap />
                </AnimatedSection>
              </div>

            </div>
          </div>
        </section>

        {/* Nuestro Equipo */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <AnimatedSection>
                <h3 className="text-[#a66d03] text-xs font-bold uppercase tracking-widest">
                  Profesionales
                </h3>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E1810]">
                  Nuestro Equipo
                </h2>
                <p className="text-[#1E1810]/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  Cada viaje es el resultado del trabajo coordinado de profesionales especializados en distintas áreas. 
                  Nuestro compromiso es acompañarte en cada etapa del proceso para que solo tengas que disfrutar la experiencia.
                </p>
              </AnimatedSection>
            </div>

            <TeamSection />

          </div>
        </section>

        {/* ¿Por qué elegir Grupales Travel? */}
        <section className="py-24 px-6 bg-[#FAF7F2] relative border-t border-[#1E1810]/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <AnimatedSection>
                <h3 className="text-[#a66d03] text-xs font-bold uppercase tracking-widest">
                  Diferenciales
                </h3>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1810]">
                  ¿Por qué elegir Grupales Travel?
                </h2>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ADVANTAGES_LIST.map((adv, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 0.05}
                  className="flex items-start gap-4 bg-white border border-[#a66d03]/10 p-5 rounded-2xl hover:border-[#bf8b2a]/30 transition-colors shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-[#bf8b2a]/10 flex items-center justify-center shrink-0 border border-[#bf8b2a]/20 mt-0.5">
                    <Check size={13} className="text-[#a66d03]" />
                  </div>
                  <p className="text-[#1E1810]/75 text-sm sm:text-base leading-relaxed">
                    {adv}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Cierre / Frase Final */}
        <section className="py-24 px-6 relative border-t border-[#1E1810]/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,109,3,0.05),transparent)] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center space-y-10 relative z-10">
            {/* Foto grupal placeholder */}
            <AnimatedSection>
              <div className="relative aspect-[21/9] w-full bg-[#F3EFE7] border border-[#1E1810]/5 rounded-3xl flex items-center justify-center overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                <span className="text-[#1E1810]/35 uppercase tracking-[0.25em] font-extrabold text-xs sm:text-sm border border-[#1E1810]/5 p-4 rounded-xl bg-white/50 z-20">
                  Foto Grupal de Todo el Equipo (Pendiente)
                </span>
              </div>
            </AnimatedSection>

            <div className="space-y-4">
              <AnimatedSection delay={0.15}>
                <p className="text-[#a66d03] text-xs font-bold uppercase tracking-widest">
                  Nuestro Compromiso
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={0.25}>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1810] leading-tight">
                  "Detrás de cada salida hay un equipo comprometido con un mismo objetivo: <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d9bf8f] via-[#bf8b2a] to-[#a66d03]">
                    Que cada viaje se convierta en una experiencia inolvidable.
                  </span>"
                </h3>
              </AnimatedSection>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
