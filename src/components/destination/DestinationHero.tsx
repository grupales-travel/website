"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Globe, Calendar, FileText } from "lucide-react";
import { Destination } from "@/types";

interface Props {
  destination: Destination;
}

export default function DestinationHero({ destination }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-[90vh] min-h-[580px] overflow-hidden bg-[#1E1810]">
      {/* Background parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
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
      </motion.div>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex flex-col justify-end pb-16 px-6 max-w-7xl mx-auto"
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10 bg-[#a66d03]" />
          <span className="text-[#d9bf8f] text-sm font-bold uppercase tracking-[0.3em]">
            Salida Grupal Acompañada · Desde {destination.departureCity || 'Buenos Aires'}
          </span>
        </div>

        {/* Título */}
        <h1
          className="text-5xl md:text-7xl font-black uppercase leading-[0.83] tracking-tight mb-6 max-w-3xl"
          style={{ color: "#f5e6cc" }}
        >
          {destination.title}
        </h1>

        {/* Stats — texto plano con iconos */}
        <div
          className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-4 mb-10"
        >
          {[
            { icon: <Globe size={22} strokeWidth={1.5} />, label: `${destination.countries} ${destination.countries === 1 ? "país" : "países"}` },
            { icon: <MapPin size={22} strokeWidth={1.5} />, label: `${destination.cities} ciudades` },
            { icon: <Clock size={22} strokeWidth={1.5} />, label: `${destination.days} días` },
            ...(destination.departureDate ? [{ icon: <Calendar size={22} strokeWidth={1.5} />, label: destination.departureDate }] : []),
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-x-3 md:gap-x-4">
              {i > 0 && <div className="h-5 md:h-6 w-px bg-white/30" />}
              <div className="flex items-center gap-2 drop-shadow-md">
                <span className="text-[#d9bf8f] shrink-0">{item.icon}</span>
                <span className="text-white text-sm md:text-[17px] font-black uppercase tracking-[0.1em]">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <a
            href={destination.itineraryPdfUrl || "#itinerario"}
            target={destination.itineraryPdfUrl ? "_blank" : undefined}
            rel={destination.itineraryPdfUrl ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/20 transition-colors duration-300"
          >
            <FileText size={16} />
            Ver itinerario
          </a>

          <a
            href={destination.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full btn-gold text-white text-sm font-bold uppercase tracking-widest"
          >
            <img src="/wp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
            Consultar disponibilidad
          </a>
        </div>
      </motion.div>
    </section>
  );
}
