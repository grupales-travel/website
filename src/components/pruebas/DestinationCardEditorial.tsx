"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Destination } from "@/types";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface DestinationCardEditorialProps {
  destination: Destination;
  index?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  customHero?: string;
  customDateLabel?: string; // ej: "21 DE MARZO"
  customYear?: string;
}

const MONTH_NAMES: Record<string, string> = {
  ene: "ENERO",
  feb: "FEBRERO",
  mar: "MARZO",
  abr: "ABRIL",
  may: "MAYO",
  jun: "JUNIO",
  jul: "JULIO",
  ago: "AGOSTO",
  sep: "SEPTIEMBRE",
  oct: "OCTUBRE",
  nov: "NOVIEMBRE",
  dic: "DICIEMBRE",
};

// Extrae fecha completa (día + mes) y año del destino
function extractDateBadge(destination: Destination, customDateLabel?: string, customYear?: string) {
  if (customDateLabel) {
    return {
      dateLabel: customDateLabel.toUpperCase(),
      year: customYear || (destination.year ? String(destination.year) : "2027"),
    };
  }

  const raw = destination.departureDate || "";
  const year = destination.year ? String(destination.year) : "2027";

  // Buscar formato con día: "21 de Marzo", "13 Ago 2026", "13 Abr – 4 May"
  const dayMonthMatch = raw.match(/(\d{1,2})\s*(?:de\s+)?([a-záéíóú]+)/i);
  if (dayMonthMatch) {
    const day = dayMonthMatch[1].padStart(2, "0");
    const mKey = dayMonthMatch[2].toLowerCase().substring(0, 3);
    const month = MONTH_NAMES[mKey] || dayMonthMatch[2].toUpperCase();
    return {
      dateLabel: `${day} DE ${month}`,
      year,
    };
  }

  // Buscar solo mes
  const lower = raw.toLowerCase();
  for (const [key, val] of Object.entries(MONTH_NAMES)) {
    if (lower.includes(key)) {
      return {
        dateLabel: val,
        year,
      };
    }
  }

  // Caso especial Perú si no tiene día explícito
  if (destination.id.includes("peru") || destination.slug.includes("peru")) {
    return { dateLabel: "21 DE MARZO", year: "2027" };
  }

  return { dateLabel: "SALIDA 2027", year };
}

export default function DestinationCardEditorial({
  destination,
  index = 0,
  isSelected = false,
  onSelect,
  customHero,
  customDateLabel,
  customYear,
}: DestinationCardEditorialProps) {
  const [hovered, setHovered] = useState(false);
  const href = `/destinos/${destination.slug}`;
  const prefetched = useRef(false);

  const { dateLabel, year } = extractDateBadge(destination, customDateLabel, customYear);

  // Limpiar año repetido en el título (ej: "Gira Ibérica 2027" -> "Gira Ibérica")
  const cleanTitle = destination.title.replace(/\s+202[5-9]$/i, "").trim().toUpperCase();

  // Priorizar portada específica de la tarjeta (card). Si no existe, usar imagen de fondo como respaldo.
  const imageSrc =
    customHero ||
    destination.thumbnailImage ||
    destination.heroImage ||
    "/pruebas/peru-clean-hero.jpg";

  const prefetchHeroImage = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = imageSrc;
    (link as HTMLLinkElement & { fetchPriority: string }).fetchPriority = "high";
    document.head.appendChild(link);
  }, [imageSrc]);

  const active = isSelected || hovered;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="h-full flex flex-col"
      onMouseEnter={() => {
        setHovered(true);
        prefetchHeroImage();
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <Link
        href={href}
        className={`group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 transform ${
          active
            ? "border-2 border-[#ba8728] shadow-[0_16px_44px_rgba(186,135,40,0.28)] -translate-y-2"
            : "border border-[#e5dfd5] hover:border-[#ba8728] shadow-md hover:shadow-2xl hover:-translate-y-2"
        }`}
        onTouchStart={prefetchHeroImage}
      >
        {/* ── 1. FOTOGRAFÍA HEROICA LIMPIA ── */}
        <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden bg-[#242930]">
          <Image
            src={imageSrc}
            alt={cleanTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            priority={index < 2}
            quality={85}
            unoptimized={true}
          />

          {/* Sutil viñeta superior para legibilidad impecable del badge */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/65 via-black/25 to-transparent pointer-events-none" />

          {/* Badge Fecha: Año + Píldora con Día y Mes (en Dorado) */}
          <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1.5">
            <span className="text-white font-extrabold text-sm sm:text-base tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {year}
            </span>
            <span className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-black tracking-wider uppercase rounded-md shadow-lg shadow-black/40 text-white bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] border border-white/20 whitespace-nowrap">
              {dateLabel}
            </span>
          </div>

          {/* Badge de Cupo / Novedad (si existe) */}
          {destination.badge && destination.badge !== "ninguno" && (
            <div className="absolute top-4 right-4 z-10">
              <span
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-md shadow-lg border ${
                  destination.badge === "agotado"
                    ? "bg-[#282d35] text-[#ba8728] border-[#ba8728]/40"
                    : destination.badge === "ultimos"
                    ? "bg-[#ba8728] text-white border-white/30"
                    : destination.badge === "nuevo"
                    ? "bg-white text-[#20252c] border-[#ba8728]"
                    : "bg-white text-[#20252c] border-white/80"
                }`}
              >
                {destination.badge === "agotado"
                  ? "AGOTADO"
                  : destination.badge === "ultimos"
                  ? "ÚLTIMOS CUPOS"
                  : destination.badge === "nuevo"
                  ? "NUEVO"
                  : destination.badge}
              </span>
            </div>
          )}
        </div>

        {/* ── 2. SECCIÓN EDITORIAL (TEXTO Y LOGO) ── */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow bg-white">
          <div>
            {/* USP Estrella arriba ocupando todo el ancho: Habitación Doble a Compartir Garantizada */}
            <p className="text-[10px] sm:text-[11px] font-black text-[#ba8728] uppercase tracking-[0.16em] mb-2 flex items-center gap-1.5 leading-tight">
              <Sparkles size={13} className="text-[#ba8728] flex-shrink-0" />
              <span>Habitación Doble a Compartir Garantizada</span>
            </p>

            {/* Nombre del destino — MAYÚSCULA COMPLETA, sin año repetido, fuente grande con transición a Dorado */}
            <h3
              className={`text-xl sm:text-2xl md:text-[25px] font-black leading-tight tracking-tight uppercase mb-2.5 line-clamp-2 transition-colors duration-200 ${
                active ? "text-[#ba8728]" : "text-[#1a1f26] group-hover:text-[#ba8728]"
              }`}
            >
              {cleanTitle}
            </h3>

            {/* Bajada de ruta / desglose de ciudades */}
            {destination.tagline && (
              <p className="text-xs sm:text-sm text-[#4a525d] font-semibold line-clamp-1 mb-4 tracking-wide">
                {destination.tagline}
              </p>
            )}
          </div>

          {/* Fila inferior: "Salida Grupal Acompañada" a la izquierda + Logo Grupales Travel a la derecha */}
          <div className="flex items-center justify-between pt-4 border-t border-[#ede7de] mt-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-black text-[#242930] uppercase tracking-wider">
              <CheckCircle2 size={15} className="text-[#ba8728] flex-shrink-0" />
              <span className="leading-tight">Salida Grupal Acompañada</span>
            </div>

            {/* Logo de Grupales Travel con mayor tamaño y nitidez */}
            <div className="relative h-9 sm:h-11 w-32 sm:w-40 flex items-center justify-end flex-shrink-0 ml-2">
              <Image
                src="/logo-footer.png"
                alt="Grupales Travel"
                fill
                className="object-contain object-right opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* ── 3. BARRA DE ACCIÓN INFERIOR: GRIS OSCURO ESTILO ANTIGRAVITY (TIPO INPUT IDE) CON HOVER DORADO ── */}
        <div
          className={`px-5 sm:px-6 py-4 flex items-center justify-between text-sm sm:text-base font-black uppercase tracking-widest transition-all duration-300 border-t ${
            active
              ? "bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] text-white shadow-md border-transparent"
              : "bg-gradient-to-r from-[#323842] via-[#3f4652] to-[#323842] text-[#f3f4f6] border-white/10 group-hover:bg-[#ba8728] group-hover:border-transparent"
          }`}
        >
          <span className="leading-none flex items-center gap-2">
            FECHAS & TARIFAS
          </span>
          <ArrowRight
            size={18}
            className="transform transition-transform duration-300 group-hover:translate-x-2 text-white"
          />
        </div>
      </Link>
    </motion.div>
  );
}
