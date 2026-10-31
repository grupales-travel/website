import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import OfficeCard from "@/components/quienes-somos/OfficeCard";
import { ArrowRight, Users2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes Somos — Trayectoria y Oficinas | Grupales Travel",
  description:
    "Conocé la historia, trayectoria y sedes comerciales de Grupales Travel. Más de 8 años acompañando viajeros por el mundo.",
};

// Sedes de atención presencial activas (San Luis y Villa Mercedes)
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
    text: "Frente a los desafíos del turismo global, consolidamos nuestras bases tecnológicas y operativas para cuidar a cada uno de nuestros pasajeros.",
  },
  {
    year: "2022",
    title: "Crecimiento de Oficinas",
    text: "Inauguramos nuestros puntos de atención al público en San Luis y Villa Mercedes, fortaleciendo la cercanía y el asesoramiento uno a uno.",
  },
  {
    year: "2024",
    title: "Expansión y Red Nacional",
    text: "Consolidamos nuestra red de representantes comerciales y ampliamos los destinos internacionales con nuevos circuitos por Europa, América y Asia.",
  },
  {
    year: "2026",
    title: "Presencia en Todo el País",
    text: "Con nuestras sedes presenciales y representantes comerciales activos en distintas regiones (Neuquén, Río Negro, Córdoba y CABA), coordinamos viajes grupales a todo el mundo.",
  },
];

export default function QuienesSomosPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF7F2] text-[#1E1810] relative">
        
        {/* Banner Principal / Hero (Espaciado optimizado sin reducir tipografía) */}
        <section className="relative flex items-center justify-center pt-24 pb-12 sm:pb-14 px-6 overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/[0.02] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(166,109,3,0.06),transparent)] z-10" />
          
          {/* Stylized background photo with low opacity and blur */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/office-san-luis.webp"
              alt="Grupales Travel Office"
              fill
              className="object-cover opacity-[0.10] filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-transparent to-[#FAF7F2]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-20 text-center space-y-4">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="h-px w-10 bg-[#72500c]" />
                <span className="text-[#72500c] text-xs font-bold uppercase tracking-[0.3em]">
                  Grupales Travel
                </span>
                <div className="h-px w-10 bg-[#72500c]" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-tight text-[#1E1810]">
                Más que una agencia, <br />
                <span className="text-gold-gradient">
                  un equipo que crea experiencias
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-[#1E1810]/75 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                En Grupales Travel creemos que los grandes viajes comienzan mucho antes del embarque. 
                Comienzan con un equipo de personas apasionadas por el turismo que trabaja cada día para diseñar 
                experiencias únicas, acompañar a nuestros pasajeros y cuidar cada detalle desde la primera consulta 
                hasta el regreso a casa.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Nuestra Historia / Trayectoria (Espaciado equilibrado y compacto) */}
        <section className="py-12 md:py-16 px-6 relative border-t border-[#1E1810]/5">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Textos descriptivos */}
              <div className="lg:col-span-5 space-y-4">
                <AnimatedSection>
                  <h3 className="text-[#72500c] text-xs font-bold uppercase tracking-widest mb-1">
                    Trayectoria
                  </h3>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1810] leading-tight">
                    Una empresa en constante crecimiento
                  </h2>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                  <p className="text-[#1E1810]/75 text-base sm:text-lg leading-relaxed">
                    Grupales Travel nació con el propósito de ofrecer salidas grupales cuidadosamente diseñadas, 
                    combinando el asesoramiento personalizado con una operación profesional y un acompañamiento permanente.
                  </p>
                  <p className="text-[#1E1810]/75 text-base sm:text-lg leading-relaxed mt-3">
                    Con el paso de los años fuimos consolidando nuestras oficinas centrales, sumando representantes en distintas 
                    provincias y un equipo interdisciplinario que hoy brinda un servicio integral antes, durante y después del viaje.
                  </p>
                </AnimatedSection>
              </div>

              {/* Línea de tiempo interactiva */}
              <div className="lg:col-span-7 pl-0 lg:pl-8 relative">
                <div className="absolute left-4 lg:left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#72500c] via-[#db5835]/30 to-transparent" />
                
                <div className="space-y-6 sm:space-y-7">
                  {TIMELINE.map((item, index) => (
                    <AnimatedSection
                      key={item.year}
                      delay={index * 0.08}
                      className="relative pl-12 lg:pl-16 group"
                    >
                      {/* Puntero de línea de tiempo */}
                      <div className="absolute left-[9px] lg:left-[17px] top-1.5 w-4 h-4 rounded-full bg-[#FAF7F2] border-2 border-[#db5835] group-hover:bg-[#db5835] transition-all duration-300 shadow-md shadow-[#db5835]/15" />
                      
                      <div className="space-y-0.5">
                        <span className="text-xl sm:text-2xl font-black text-[#db5835] tracking-tight block">
                          {item.year}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-[#1E1810] group-hover:text-[#db5835] transition-colors duration-200">
                          {item.title}
                        </h4>
                        <p className="text-[#1E1810]/70 text-sm sm:text-base leading-relaxed max-w-lg">
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

        {/* Nuestras Oficinas (Ahora 2 sedes presenciales, diseño centrado y no tan amplio) */}
        <section className="py-12 md:py-16 px-6 bg-[#FAF7F2] relative border-y border-[#1E1810]/5">
          <div className="max-w-4xl mx-auto space-y-10">
            
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <AnimatedSection>
                <h3 className="text-[#72500c] text-xs font-bold uppercase tracking-widest">
                  Sedes Presenciales
                </h3>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1810]">
                  Nuestras Oficinas
                </h2>
                <p className="text-[#1E1810]/75 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  Acercate a nuestras oficinas comerciales en San Luis y Villa Mercedes o coordiná una llamada virtual con nuestros asesores.
                </p>
              </AnimatedSection>
            </div>

            {/* Tarjetas de Oficinas: 2 columnas centradas con ancho equilibrado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
              {OFFICE_DETAILS.map((office, index) => (
                <AnimatedSection key={office.id} delay={index * 0.1} className="h-full">
                  <OfficeCard
                    office={office}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Enlace / Puente hacia Nuestro Equipo */}
        <section className="py-12 md:py-14 px-6 bg-white relative border-t border-[#1E1810]/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(186,135,40,0.06),transparent)] pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ba8728]/10 text-[#72500c] text-xs font-bold uppercase tracking-wider mb-1">
                <Users2 className="w-4 h-4 text-[#ba8728]" />
                Conocé a los protagonistas
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1810]">
                Detrás de cada salida hay un gran equipo
              </h2>
              <p className="text-[#1E1810]/75 text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed">
                Coordinadores, asesores comerciales, especialistas en operaciones y directores dedicados a que tu viaje sea inolvidable.
              </p>
              <div className="pt-4">
                <Link
                  href="/nuestro-equipo"
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full btn-gold text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-900/15 hover:scale-105 transition-all duration-300"
                >
                  Ver Nuestro Equipo
                  <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
