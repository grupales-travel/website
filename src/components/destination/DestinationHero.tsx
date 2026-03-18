"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Globe, Calendar, FileText, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Destination } from "@/types";

interface Props {
  destination: Destination;
}

export default function DestinationHero({ destination }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Altura bloqueada al montar — IDÉNTICO al home hero.
  // Debe ser 100% del viewport inicial para que no haya contenido debajo
  // del fold visible: cuando el browser chrome aparece/desaparece y el
  // viewport cambia de tamaño, no hay referencia visual que haga "saltar" la página.
  const [heroHeight, setHeroHeight] = useState<number | null>(null);
  useEffect(() => {
    setHeroHeight(window.innerHeight);
  }, []);

  // Solo opacidad del contenido al scrollear — SIN parallax en el fondo
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const statsItems = [
    {
      iconSm: <Globe size={12} strokeWidth={1.5} />,
      icon: <Globe size={20} strokeWidth={1.5} />,
      label: `${destination.countries} ${destination.countries === 1 ? "país" : "países"}`,
    },
    {
      iconSm: <MapPin size={12} strokeWidth={1.5} />,
      icon: <MapPin size={20} strokeWidth={1.5} />,
      label: `${destination.cities} cdds`,
      labelFull: `${destination.cities} ciudades`,
    },
    {
      iconSm: <Clock size={12} strokeWidth={1.5} />,
      icon: <Clock size={20} strokeWidth={1.5} />,
      label: `${destination.days} días`,
    },
    ...(destination.departureDate
      ? [{
          iconSm: <Calendar size={12} strokeWidth={1.5} />,
          icon: <Calendar size={20} strokeWidth={1.5} />,
          // Mobile: "25 ago" without year; desktop: full date
          label: destination.departureDate.split(" ").slice(0, 2).join(" "),
          labelFull: destination.departureDate,
        }]
      : []),
  ];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#1E1810]"
      style={heroHeight ? { height: heroHeight } : { height: "100svh" }}
    >
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-24 left-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Background estático — sin parallax para evitar el efecto de zoom al scrollear */}
      <div className="absolute inset-0">
        <Image
          src={destination.heroImage}
          alt={destination.title}
          fill
          priority
          unoptimized
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxRTE4MTAiLz48L3N2Zz4="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1810]/50 to-transparent" />
      </div>

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex flex-col justify-end pb-8 md:pb-16 px-6 max-w-7xl mx-auto"
      >
        {/* Label — una sola fila */}
        <div className="flex items-center gap-2 mb-4 overflow-hidden">
          <div className="h-px w-6 sm:w-10 bg-[#a66d03] shrink-0" />
          <span className="text-[#d9bf8f] text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.08em] sm:tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap overflow-hidden text-ellipsis">
            Salida Grupal Acompañada · Desde {destination.departureCity || "Buenos Aires"}
          </span>
        </div>

        {/* Título — máximo 2 filas */}
        <h1
          className="text-3xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tight mb-4 md:mb-6 max-w-3xl line-clamp-2"
          style={{ color: "#f5e6cc" }}
        >
          {destination.title}
        </h1>

        {/* Stats — una sola fila */}
        <div className="flex items-center gap-x-2 md:gap-x-4 mb-6 md:mb-10 overflow-hidden">
          {statsItems.map((item, i) => (
            <div key={i} className="flex items-center gap-x-2 md:gap-x-4 shrink-0">
              {i > 0 && <div className="h-4 md:h-5 w-px bg-white/30 shrink-0" />}
              <div className="flex items-center gap-1 sm:gap-2 drop-shadow-md">
                <span className="text-[#d9bf8f] shrink-0 sm:hidden">{item.iconSm}</span>
                <span className="text-[#d9bf8f] shrink-0 hidden sm:inline">{item.icon}</span>
                <span className="text-white text-[10px] sm:text-[13px] md:text-[17px] font-black uppercase tracking-[0.05em] sm:tracking-[0.1em] whitespace-nowrap">
                  <span className="sm:hidden">{item.label}</span>
                  <span className="hidden sm:inline">{(item as any).labelFull ?? item.label}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={destination.itineraryPdfUrl || "#itinerario"}
            target={destination.itineraryPdfUrl ? "_blank" : undefined}
            rel={destination.itineraryPdfUrl ? "noopener noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/20 transition-colors duration-300"
          >
            <FileText size={16} />
            Ver itinerario
          </a>

          <a
            href={destination.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full btn-gold text-white text-sm font-bold uppercase tracking-widest"
          >
            <img src="/wp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
            Consultar disponibilidad
          </a>
        </div>
      </motion.div>
    </section>
  );
}
