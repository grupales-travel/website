"use client";

import { motion } from "framer-motion";
import { Users, Plane, Building2, Map, Shield, BedDouble, CreditCard, ArrowRight } from "lucide-react";
import { COMPANY, ADVANTAGES } from "@/data/company";

const ICON_MAP: Record<string, React.ReactNode> = {
  users:         <Users size={17} />,
  plane:         <Plane size={17} />,
  building:      <Building2 size={17} />,
  map:           <Map size={17} />,
  shield:        <Shield size={17} />,
  "door-open":   <BedDouble size={17} />,
  "credit-card": <CreditCard size={17} />,
};

// Stats reordenados: +500 viajeros reemplaza 23 destinos
const STATS = [
  { value: "+500", label: "viajeros" },
  { value: "8",    label: "años" },
  { value: "3",    label: "oficinas" },
];

export default function ExperienceSection() {
  return (
    <section className="py-12 md:py-16 px-6 bg-[#f5e6cc] overflow-hidden relative">
      {/* Radial warm glow hacia la imagen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_80%_50%,rgba(166,109,3,0.09),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* ── Izquierda — Texto ── */}
          <div className="flex flex-col justify-center">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-[#a66d03]" />
              <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">
                Por qué elegirnos
              </span>
            </motion.div>

            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-5xl md:text-6xl font-black uppercase text-[#5c3317] leading-[0.82] mb-7"
            >
              Viví tu experiencia
              <br />
              <span className="text-[#a66d03]">grupal</span>
            </motion.h2>

            {/* Ventajas — texto más grande */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {ADVANTAGES.map((adv, i) => (
                <motion.div
                  key={adv.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/50 border-l-2 border-[#a66d03]/45 hover:bg-white/70 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#a66d03]/10 flex items-center justify-center text-[#a66d03] shrink-0">
                    {ICON_MAP[adv.icon]}
                  </div>
                  <p className="font-bold text-[#5c3317] text-sm md:text-base uppercase tracking-wide leading-tight">
                    {adv.title}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA + Stats en la misma fila */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.45 }}
              className="flex items-center gap-6 flex-wrap"
            >
              {/* Botón */}
              <motion.a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-white text-sm font-bold uppercase tracking-widest group shrink-0"
              >
                Hablá con un Asesor
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </motion.a>

              {/* Separador vertical */}
              <div className="h-10 w-px bg-[#a66d03]/20 hidden sm:block" />

              {/* Stats a la derecha del botón */}
              <div className="flex items-center gap-0">
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center ${i > 0 ? "pl-5 ml-5 border-l border-[#a66d03]/20" : ""}`}
                  >
                    <span className="text-2xl font-black text-[#a66d03] leading-none tabular-nums">
                      {s.value}
                    </span>
                    <span className="text-[10px] font-semibold text-[#1E1810]/45 uppercase tracking-wider mt-0.5">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Derecha — Imagen limpia, sin overlays ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-full min-h-[420px] rounded-3xl overflow-hidden"
          >
            {/* Marco dorado offset decorativo */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-[#a66d03]/30 pointer-events-none -z-10" />

            {/* La imagen — sola, sin overlays */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/nueva-portada.webp')" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
