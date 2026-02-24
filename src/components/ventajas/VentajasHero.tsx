"use client";

import { motion } from "framer-motion";

export default function VentajasHero() {
  return (
    <section className="relative pt-24 pb-10 px-6 bg-[#1E1810] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(166,109,3,0.18),transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a66d03]/50 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="h-px w-10 bg-[#a66d03]" />
          <span className="text-[#d9bf8f] text-xs font-bold uppercase tracking-[0.3em]">
            Por qué elegirnos
          </span>
          <div className="h-px w-10 bg-[#a66d03]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black uppercase leading-tight"
          style={{ color: "#f5e6cc" }}
        >
          Tu viaje, <span className="text-gold-gradient">completamente resuelto</span>
        </motion.h1>
      </div>
    </section>
  );
}
