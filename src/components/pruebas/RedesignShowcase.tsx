"use client";

import { useState } from "react";
import Image from "next/image";
import { Destination } from "@/types";
import DestinationCardEditorial from "./DestinationCardEditorial";
import { Sparkles, CheckCircle2, AlertTriangle, Layers, Eye, Crown, Check, Calendar } from "lucide-react";

interface RedesignShowcaseProps {
  destinations: Destination[];
}

export default function RedesignShowcase({ destinations }: RedesignShowcaseProps) {
  // Estado para la salida seleccionada (para probar el comportamiento al seleccionar)
  const [selectedSlug, setSelectedSlug] = useState<string>("encantos-de-peru-2027");

  // Destino Perú para la comparativa (con fecha específica "21 de Marzo")
  const peruDestination: Destination = {
    id: "peru-demo",
    slug: "encantos-de-peru-2027",
    title: "Encantos de Perú",
    tagline: "1 PAÍS · 4 CIUDADES · 12 DÍAS",
    countries: 1,
    cities: 4,
    days: 12,
    departureDate: "21 de Marzo 2027",
    year: 2027,
    region: "america" as const,
    heroImage: "/pruebas/peru-clean-hero.jpg",
    thumbnailImage: "/pruebas/peru-clean-hero.jpg",
    description: "Lima, Cusco, Machu Picchu y el Valle Sagrado.",
    whatsappUrl: "https://wa.me/5493512123128",
    featured: true,
    active: true,
  };

  // Lista curada ORDENADA CRONOLÓGICAMENTE DE ENERO A DICIEMBRE (con día específico)
  const cleanShowcaseList: { destination: Destination; dateLabel: string }[] = [
    {
      dateLabel: "21 DE MARZO",
      destination: {
        id: "peru-2027",
        slug: "encantos-de-peru-2027",
        title: "Encantos de Perú",
        tagline: "1 PAÍS · 4 CIUDADES · 12 DÍAS",
        countries: 1,
        cities: 4,
        days: 12,
        departureDate: "21 de Marzo 2027",
        year: 2027,
        region: "america",
        heroImage: "/pruebas/peru-clean-hero.jpg",
        thumbnailImage: "/pruebas/peru-clean-hero.jpg",
        description: "Lima, Cusco, Machu Picchu y el Valle Sagrado.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "13 DE ABRIL",
      destination: {
        id: "alma-europea-2027",
        slug: "alma-europea-2027",
        title: "Alma Europea",
        tagline: "4 PAÍSES · 11 CIUDADES · 22 DÍAS",
        countries: 4,
        cities: 11,
        days: 22,
        departureDate: "13 de Abril 2027",
        year: 2027,
        region: "europa",
        heroImage: "/r2-media/backgrounds/alma-europea-2026.webp",
        thumbnailImage: "/r2-media/backgrounds/alma-europea-2026.webp",
        description: "España, Francia, Suiza e Italia en un recorrido inolvidable.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "10 DE MAYO",
      destination: {
        id: "bella-italia-2027",
        slug: "bella-italia-2027",
        title: "Bella Italia",
        tagline: "1 PAÍS · 8 CIUDADES · 18 DÍAS",
        countries: 1,
        cities: 8,
        days: 18,
        departureDate: "10 de Mayo 2027",
        year: 2027,
        region: "europa",
        heroImage: "/r2-media/backgrounds/bella-italia-2026-1771875377471.jpg",
        thumbnailImage: "/r2-media/backgrounds/bella-italia-2026-1771875377471.jpg",
        description: "Roma, Florencia, Venecia, Milán y la Costa Amalfitana.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "08 DE JUNIO",
      destination: {
        id: "de-londres-a-viena-2027",
        slug: "de-londres-a-viena-2027",
        title: "De Londres a Viena",
        tagline: "5 PAÍSES · 8 CIUDADES · 18 DÍAS",
        countries: 5,
        cities: 8,
        days: 18,
        departureDate: "8 de Junio 2027",
        year: 2027,
        region: "europa",
        heroImage: "/r2-media/backgrounds/de-londres-a-viena-2026-1779821275830.jpg",
        thumbnailImage: "/r2-media/backgrounds/de-londres-a-viena-2026-1779821275830.jpg",
        description: "Londres, Amsterdam, Berlín, Praga y Viena en un solo viaje épico.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "13 DE AGOSTO",
      destination: {
        id: "new-york-miami-2027",
        slug: "new-york-miami-2027",
        title: "New York & Miami",
        tagline: "1 PAÍS · 2 CIUDADES · 13 DÍAS",
        countries: 1,
        cities: 2,
        days: 13,
        departureDate: "13 de Agosto 2027",
        year: 2027,
        region: "america",
        heroImage: "/r2-media/backgrounds/new-york-miami-2026-1776511949342.jpg",
        thumbnailImage: "/r2-media/backgrounds/new-york-miami-2026-1776511949342.jpg",
        description: "Broadway, Central Park, South Beach y Art Deco.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "18 DE SEPTIEMBRE",
      destination: {
        id: "gira-iberica-2027",
        slug: "gira-iberica-2027",
        title: "Gira Ibérica",
        tagline: "2 PAÍSES · 12 CIUDADES · 17 DÍAS",
        countries: 2,
        cities: 12,
        days: 17,
        departureDate: "18 de Septiembre 2027",
        year: 2027,
        region: "europa",
        heroImage: "/r2-media/backgrounds/gira-iberica-2026.jpg",
        thumbnailImage: "/r2-media/backgrounds/gira-iberica-2026.jpg",
        description: "España y Portugal de norte a sur.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "05 DE OCTUBRE",
      destination: {
        id: "turquia-grecia-2027",
        slug: "turquia-grecia-2027",
        title: "Turquía & Grecia",
        tagline: "2 PAÍSES · 7 CIUDADES · 16 DÍAS",
        countries: 2,
        cities: 7,
        days: 16,
        departureDate: "5 de Octubre 2027",
        year: 2027,
        region: "europa",
        heroImage: "/r2-media/backgrounds/turquia-grecia-esplendida-2026-1771872964485.jpg",
        thumbnailImage: "/r2-media/backgrounds/turquia-grecia-esplendida-2026-1771872964485.jpg",
        description: "Estambul, Capadocia, Éfeso, Santorini y Atenas.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
    {
      dateLabel: "15 DE NOVIEMBRE",
      destination: {
        id: "tailandia-playas-2027",
        slug: "tailandia-con-playas-2027",
        title: "Tailandia con Playa",
        tagline: "1 PAÍS · 5 CIUDADES · 15 DÍAS",
        countries: 1,
        cities: 5,
        days: 15,
        departureDate: "15 de Noviembre 2027",
        year: 2027,
        region: "asia",
        heroImage: "/r2-media/backgrounds/tailandia-con-playas-2026-1771875916638.jpg",
        thumbnailImage: "/r2-media/backgrounds/tailandia-con-playas-2026-1771875916638.jpg",
        description: "Templos dorados, mercados flotantes y playas de aguas cristalinas.",
        whatsappUrl: "https://wa.me/5493512123128",
        featured: true,
        active: true,
      },
    },
  ];

  return (
    <section className="py-12 md:py-18 px-4 sm:px-6 bg-[#faf9f6] border-b border-[#ebdccd]">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER PRINCIPAL DEL LABORATORIO ── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#242930] text-[#c59b3f] text-xs font-black uppercase tracking-widest mb-3.5 shadow-sm border border-[#ba8728]/30">
            <Crown size={15} className="text-[#ba8728]" />
            <span>Paleta Refinada: Gris Metalizado, Blanco y Dorado</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1f26] leading-tight mb-4 uppercase tracking-tight">
            Formato Editorial <span className="text-[#ba8728]">Perfeccionado</span>
          </h1>
          <p className="text-base sm:text-lg text-[#353c46] leading-relaxed font-medium">
            Títulos en <strong>mayúsculas completas</strong>, banner destacado de <strong>Habitación Doble a Compartir Garantizada</strong>, salidas ordenadas cronológicamente y la barra de fechas en el <strong>gris sofisticado estilo Antigravity</strong> con transición a dorado.
          </p>
        </div>

        {/* ── GUÍA RÁPIDA DE CAMBIOS DE ESTA VERSIÓN ── */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#e5dfd5] mb-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#323842] to-[#3f4652] flex items-center justify-center text-[#ba8728] shadow-sm border border-white/10">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-[#1a1f26] uppercase tracking-wider">
                Nuevos ajustes aplicados con éxito:
              </p>
              <p className="text-xs text-gray-500 font-medium">
                1. Títulos en Mayúsculas · 2. Habitación Doble a Compartir Garantizada arriba · 3. Salida Grupal Acompañada en la base · 4. Gris Antigravity (#323842 / #3f4652)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ba8728]/10 text-[#ba8728] font-bold text-xs uppercase tracking-wider border border-[#ba8728]/30">
              <Check size={13} /> Modificaciones Listas
            </span>
          </div>
        </div>

        {/* ── 1. COMPARATIVA TRIPLE: ACTUAL vs DOPAZO vs NUEVO FORMATO ── */}
        <div className="mb-16">
          <div className="flex items-center gap-2.5 mb-6">
            <Layers className="w-6 h-6 text-[#ba8728]" />
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1f26] uppercase tracking-tight">
              1. Comparativa Directa (Caso Perú)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* COLUMNA 1: FORMATO ACTUAL */}
            <div className="bg-white rounded-2xl p-5 border border-red-200/90 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                  <AlertTriangle size={13} /> Formato Actual
                </span>
                <span className="text-xs text-gray-400 font-mono">Flyer con texto encima</span>
              </div>

              {/* Imagen actual cargada */}
              <div className="relative aspect-[1/1] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-200 shadow-inner">
                <Image
                  src="/pruebas/peru-formato-actual.jpg"
                  alt="Formato actual Perú"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Diagnóstico */}
              <div className="text-xs sm:text-sm text-gray-600 space-y-2 flex-grow">
                <p className="font-bold text-[#111111] mb-1">Puntos débiles a superar:</p>
                <p className="flex items-start gap-1.5 text-red-700">
                  <span className="font-bold">✕</span> Casi el 50% de Machu Picchu tapado por texto.
                </p>
                <p className="flex items-start gap-1.5 text-red-700">
                  <span className="font-bold">✕</span> El logo compite con las ruinas andinas.
                </p>
                <p className="flex items-start gap-1.5 text-red-700">
                  <span className="font-bold">✕</span> Texto gráfico no indexable por Google para SEO.
                </p>
              </div>
            </div>

            {/* COLUMNA 2: REFERENCIA DOPAZO & RAVENNA */}
            <div className="bg-white rounded-2xl p-5 border border-gray-300 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1a1f26] bg-gray-100 px-2.5 py-1 rounded-md">
                  <Eye size={13} /> Referencia Dopazo & Ravenna
                </span>
                <span className="text-xs text-gray-400 font-mono">Benchmark</span>
              </div>

              {/* Imagen Dopazo */}
              <div className="relative aspect-[1/1] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-200 shadow-inner">
                <Image
                  src="/pruebas/dopazo-referencia.png"
                  alt="Referencia Dopazo y Ravenna"
                  fill
                  className="object-contain bg-white"
                />
              </div>

              {/* Aspectos destacados */}
              <div className="text-xs sm:text-sm text-gray-600 space-y-2 flex-grow">
                <p className="font-bold text-[#111111] mb-1">Claves del modelo:</p>
                <p className="flex items-start gap-1.5 text-[#1a1f26]">
                  <span className="font-bold text-[#ba8728]">✓</span> Fotografía del destino 100% despejada.
                </p>
                <p className="flex items-start gap-1.5 text-[#1a1f26]">
                  <span className="font-bold text-[#ba8728]">✓</span> Bloque blanco con información sobria.
                </p>
                <p className="flex items-start gap-1.5 text-[#1a1f26]">
                  <span className="font-bold text-[#ba8728]">✓</span> Logo institucional a la derecha.
                </p>
              </div>
            </div>

            {/* COLUMNA 3: NUEVO FORMATO GRUPALES TRAVEL (REFINADO CON CORRECCIONES) */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#ba8728] shadow-2xl flex flex-col h-full relative">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-[#ba8728] px-3 py-1 rounded-md shadow-sm">
                  <CheckCircle2 size={14} /> Nuevo Formato Grupales Travel
                </span>
                <span className="text-xs text-[#ba8728] font-black uppercase tracking-wider">
                  ¡Modificaciones Listas!
                </span>
              </div>

              {/* NUEVA CARD REAL */}
              <div className="mb-4">
                <DestinationCardEditorial
                  destination={peruDestination}
                  customHero="/pruebas/peru-clean-hero.jpg"
                  customDateLabel="21 DE MARZO"
                  customYear="2027"
                  isSelected={selectedSlug === "encantos-de-peru-2027"}
                  onSelect={() => setSelectedSlug("encantos-de-peru-2027")}
                />
              </div>

              {/* Beneficios logrados */}
              <div className="text-xs sm:text-sm text-gray-700 space-y-2 bg-[#fcfaf7] p-4 rounded-xl border border-[#ebdccf]">
                <p className="font-black text-[#ba8728] uppercase tracking-wider mb-1">
                  Nuevos detalles aplicados:
                </p>
                <p className="flex items-start gap-1.5 text-[#1a1f26] font-medium">
                  <span className="font-black text-[#ba8728]">✓</span> <strong>Títulos en MAYÚSCULAS:</strong> Impacto tipográfico total.
                </p>
                <p className="flex items-start gap-1.5 text-[#1a1f26] font-medium">
                  <span className="font-black text-[#ba8728]">✓</span> <strong>Habitación Doble a Compartir Garantizada:</strong> Arriba con ancho completo.
                </p>
                <p className="flex items-start gap-1.5 text-[#1a1f26] font-medium">
                  <span className="font-black text-[#ba8728]">✓</span> <strong>Salida Grupal Acompañada:</strong> En la base junto al logo de Grupales Travel.
                </p>
                <p className="flex items-start gap-1.5 text-[#1a1f26] font-medium">
                  <span className="font-black text-[#ba8728]">✓</span> <strong>Gris estilo Antigravity:</strong> Tono moderno con hover a Dorado radiante.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── 2. CATÁLOGO COMPLETO ORDENADO CRONOLÓGICAMENTE (ENERO A DICIEMBRE) ── */}
        <div className="mt-16 pt-12 border-t border-[#ebdccd]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={15} className="text-[#ba8728]" />
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#ba8728] block">
                  Catálogo Cronológico · Ordenado por Mes y Día de Salida
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a1f26] uppercase tracking-tight">
                2. Galería Cronológica (Marzo a Noviembre)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md font-medium">
              Ordenadas de inicio a fin del año, con el día exacto en la píldora superior y la barra inferior en gris oscuro metalizado/plateado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cleanShowcaseList.map((item, i) => (
              <DestinationCardEditorial
                key={item.destination.id}
                destination={item.destination}
                index={i}
                customDateLabel={item.dateLabel}
                isSelected={selectedSlug === item.destination.slug}
                onSelect={() => setSelectedSlug(item.destination.slug)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
