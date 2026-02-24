"use client";

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
      >
        <div className="relative rounded-2xl overflow-hidden aspect-[15/16] bg-[#2d2418]">

          {/* Imagen con zoom en hover */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url('${destination.thumbnailImage || destination.heroImage}')` }}
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

          {/* Overlay en hover para que destaque el texto */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Contenido centrado (solo visible en hover) */}
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
                  <img src="/wp-icon.png" alt="" className="w-3 h-3 object-contain opacity-0 hidden" /> {/* Espaciador si queremos icono despues */}
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
