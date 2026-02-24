"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS } from "@/data/destinations";
import { Destination } from "@/types";
import { formatRegion } from "@/lib/utils";
import DestinationCard from "./DestinationCard";
import AdvancedFilter from "./AdvancedFilter";

// Meses en español → índice (0=enero)
const MONTH_ES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

function parseDepartureDate(dateStr: string, year: number): Date {
  const match = dateStr.toLowerCase().match(/(\d{1,2})\s+([a-záéíóú]{3})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = MONTH_ES[match[2].substring(0, 3)];
    if (month !== undefined) return new Date(year, month, day);
  }
  return new Date(year, 11, 31);
}

interface RegionFilterProps {
  limit?: number;
  /** pageMode: hero oscuro con título + filtro integrados. Usar en /salidas */
  pageMode?: boolean;
  destinations?: Destination[];
}

export default function RegionFilter({ limit, pageMode = false, destinations }: RegionFilterProps) {
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    month: "",
    year: "2026",
  });

  const allDestinations = useMemo(() => {
    const source = destinations ?? DESTINATIONS;
    return source.filter((d) => d.active);
  }, [destinations]);

  const regions = useMemo(
    () => Array.from(new Set(allDestinations.map((d) => d.region))).sort(),
    [allDestinations]
  );
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const years = [2026, 2027];

  const filteredDestinations = useMemo(() => {
    let results = allDestinations.filter((d) => {
      const matchSearch = filters.search
        ? d.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchRegion = filters.region ? d.region === filters.region : true;
      const matchYear = filters.year ? d.year === parseInt(filters.year) : true;
      const matchMonth = filters.month
        ? d.departureDate.toLowerCase().includes(filters.month.toLowerCase().substring(0, 3))
        : true;
      return matchSearch && matchRegion && matchYear && matchMonth;
    });

    if (!filters.region) {
      results = [...results].sort((a, b) => {
        const dateA = parseDepartureDate(a.departureDate, a.year);
        const dateB = parseDepartureDate(b.departureDate, b.year);
        return dateA.getTime() - dateB.getTime();
      });
    }

    return results;
  }, [allDestinations, filters]);

  const visibleDestinations = limit ? filteredDestinations.slice(0, limit) : filteredDestinations;

  const filterNode = (
    <AdvancedFilter
      onFilterChange={setFilters}
      regions={regions}
      months={months}
      years={years}
    />
  );

  /* ─────────────────────────────────────────────────
     PAGE MODE: hero oscuro (solo título) + filtro y grid en blanco
  ───────────────────────────────────────────────── */
  if (pageMode) {
    return (
      <>
        {/* ── Hero oscuro — mismo header que Contacto ── */}
        <section className="relative pt-24 pb-10 px-6 bg-[#1E1810] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(166,109,3,0.18),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a66d03]/50 to-transparent" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-[#a66d03]" />
              <span className="text-[#d9bf8f] text-xs font-bold uppercase tracking-[0.3em]">
                {allDestinations.length} destinos confirmados
              </span>
              <div className="h-px w-10 bg-[#a66d03]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black uppercase leading-tight"
              style={{ color: "#f5e6cc" }}
            >
              Salidas Grupales <span className="text-gold-gradient">Acompañadas</span>
            </motion.h1>
          </div>
        </section>

        {/* Banner flotante — sin fondo */}
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

        {/* ── Filtro + Grid ── */}
        <section className="px-6 bg-white relative">
          <div className="max-w-7xl mx-auto pt-14 pb-16 md:pb-20">

            {/* Filtro — sobre fondo blanco, pills perfectamente visibles */}
            {filterNode}

            {/* Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 min-h-[300px]"
            >
              <AnimatePresence mode="popLayout">
                {visibleDestinations.length > 0 ? (
                  visibleDestinations.map((dest, i) => (
                    <DestinationCard key={dest.id} destination={dest} index={i} />
                  ))
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full flex flex-col items-center justify-center py-20 opacity-60"
                  >
                    <p className="text-[#5c3317] font-bold text-lg">No encontramos viajes con esos filtros.</p>
                    <p className="text-[#a66d03] text-sm mt-2">Intenta cambiar los criterios de búsqueda.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contador */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-[#1E1810]/30 text-sm mt-10"
            >
              {filteredDestinations.length}{" "}
              {filteredDestinations.length === 1 ? "destino encontrado" : "destinos encontrados"}
            </motion.p>

          </div>
        </section>
      </>
    );
  }

  /* ─────────────────────────────────────────────────
     SECTION MODE: sección blanca (homepage)
  ───────────────────────────────────────────────── */
  return (
    <section className="py-16 md:py-20 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-10 bg-[#a66d03]" />
            <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">
              Explorá por región
            </span>
            <div className="h-px w-10 bg-[#a66d03]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black uppercase text-[#5c3317] leading-[0.87]"
          >
            Todos nuestros{" "}
            <span className="text-gold-gradient">destinos</span>
          </motion.h2>
        </div>

        {/* Filtro */}
        {filterNode}

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 min-h-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {visibleDestinations.length > 0 ? (
              visibleDestinations.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))
            ) : (
              <motion.div
                key="no-results"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 opacity-60"
              >
                <p className="text-[#5c3317] font-bold text-lg">No encontramos viajes con esos filtros.</p>
                <p className="text-[#a66d03] text-sm mt-2">Intenta cambiar los criterios de búsqueda.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ver más */}
        {limit && filteredDestinations.length > limit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <Link href="/salidas" className="group flex flex-col items-center gap-2">
              <span className="inline-flex items-center gap-3 px-8 py-4 btn-gold text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#a66d03]/20">
                Ver todas las salidas
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                  +{filteredDestinations.length - limit}
                </span>
              </span>
            </Link>
          </motion.div>
        )}

        {/* Contador (solo sin limit o sin resultados) */}
        {(!limit || filteredDestinations.length === 0) && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[#1E1810]/35 text-sm mt-10"
          >
            {filteredDestinations.length}{" "}
            {filteredDestinations.length === 1 ? "destino encontrado" : "destinos encontrados"}
          </motion.p>
        )}
      </div>
    </section>
  );
}
