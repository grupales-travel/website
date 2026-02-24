"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import DestinationCard from "./DestinationCard";
import { DESTINATIONS } from "@/data/destinations";
import { Destination } from "@/types";

interface Props {
  destinations?: Destination[];
}

export default function DestinationsSection({ destinations }: Props) {
  const source = destinations ?? DESTINATIONS;

  // Top Section: Only Featured Promoted Trips (Non-Partner)
  const featuredPromoted = useMemo(() => {
    return source.filter((d) => d.featured && !d.partner && d.active);
  }, [source]);

  return (
    <section
      id="destinos"
      className="py-24 md:py-32 px-6 bg-[#f5e6cc]/25"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - Salidas Destacadas (Solo Propias) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-[#a66d03]" />
              <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">
                Exclusivas
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-black uppercase text-[#5c3317] leading-[1.0]"
            >
              Descubrí nuestras
              <br />
              <span className="text-gold-gradient">salidas grupales destacadas</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-start md:items-end gap-2"
          >
            <Link
              href="/salidas"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#a66d03] hover:text-[#bf8b2a] uppercase tracking-widest transition-colors duration-200 group"
            >
              Ver todas
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </motion.div>
        </div>

        {/* Grid de cards - Destacadas Propias */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredPromoted.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
