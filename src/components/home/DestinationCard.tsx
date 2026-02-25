"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Destination } from "@/types";
import { Clock } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
  index?: number;
}

export default function DestinationCard({
  destination,
  index = 0,
}: DestinationCardProps) {

  const isPartner = destination.partner;
  const href = `/destinos/${destination.slug}`;
  const prefetched = useRef(false);

  const prefetchHeroImage = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = destination.heroImage;
    (link as HTMLLinkElement & { fetchPriority: string }).fetchPriority = "high";
    document.head.appendChild(link);
  }, [destination.heroImage]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={href}
        className="group block"
        onMouseEnter={prefetchHeroImage}
        onTouchStart={prefetchHeroImage}
      >
        <div className="relative rounded-2xl overflow-hidden aspect-[15/16] bg-[#2d2418]">

          {/* Imagen con zoom en hover */}
          <Image
            src={destination.thumbnailImage || destination.heroImage}
            alt={destination.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            priority={index < 4}
            quality={75}
          />

          {/* Badge dinámico */}
          {(destination.badge && destination.badge !== 'ninguno') && (() => {
            const badgeText = {
              'agotado': 'CUPOS AGOTADOS',
              'ultimos': 'ÚLTIMOS CUPOS',
              'nuevo': 'NUEVO',
              'popular': 'POPULAR'
            }[destination.badge as string] || destination.badge;

            // Determinar colores basados en el badge
            let badgeBg = "bg-[#d32f2f]"; // Rojo por defecto para agotado
            if (destination.badge === 'ultimos') badgeBg = "bg-[#cda02a]"; // Dorado más claro/brillante
            if (destination.badge === 'nuevo') badgeBg = "bg-[#388e3c]"; // Verde (un poco más claro/vivo)
            if (destination.badge === 'popular') badgeBg = "bg-[#1976d2]"; // Azul

            return (
              <div
                className={`absolute top-6 -right-14 w-52 sm:-right-16 sm:top-8 sm:w-64 flex items-center justify-center rotate-45 z-20 shadow-xl ${badgeBg} border-y border-white/30 uppercase overflow-hidden py-0.5 sm:py-1`}
              >
                {/* Brillo de la cinta (Shine effect) */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

                {/* Texto */}
                <div className="relative text-white font-medium text-[0.95rem] sm:text-[1.1rem] leading-none tracking-tight drop-shadow-md pb-[1px] sm:pb-[2px]">
                  {badgeText}
                </div>
              </div>
            );
          })()}

          {/* Overlay inferior siempre visible — desaparece en hover desktop */}
          <div className="absolute inset-x-0 bottom-0 z-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-2xl" />
            <div className="relative px-3 pb-3.5 pt-10">
              <p className="text-white font-black text-xs sm:text-sm uppercase leading-tight tracking-wide line-clamp-2 drop-shadow-md">
                {destination.title}
              </p>
              <p className="text-[#d9bf8f] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mt-0.5 drop-shadow-md">
                {destination.departureDate}
              </p>
            </div>
          </div>

          {/* Overlay en hover para que destaque el texto */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Contenido centrado (solo visible en hover — desktop) */}
          <div className="absolute inset-0 p-4 sm:p-6 z-10 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-all duration-300">

            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center justify-center w-full h-full">

              {/* Fechas */}
              <p className="text-white font-black text-lg sm:text-xl lg:text-[22px] mb-3 drop-shadow-lg leading-tight uppercase tracking-wider whitespace-nowrap">
                {destination.departureDate}
              </p>

              {/* Días */}
              <div className="flex items-center justify-center gap-1.5 text-[#d9bf8f] text-xs sm:text-sm font-bold mb-6 sm:mb-8 drop-shadow-md uppercase tracking-[0.2em]">
                <Clock size={14} className="text-current" />
                <span>{destination.days} DÍAS</span>
              </div>

              <div className="mt-1">
                <span className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-gold text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300">
                  VER ITINERARIO
                </span>
              </div>

            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
