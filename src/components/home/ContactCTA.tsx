"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Navigation } from "lucide-react";
import { COMPANY, OFFICES } from "@/data/company";

export default function ContactCTA() {
  return (
    <section className="relative py-14 md:py-16 px-6 overflow-hidden bg-[#1E1810]">
      {/* Gradient sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(166,109,3,0.15),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a66d03]/60 to-transparent" />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Título ── */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <div className="h-px w-10 bg-[#a66d03]" />
            <span className="text-[#d9bf8f] text-sm font-bold uppercase tracking-[0.3em]">
              Hablemos
            </span>
            <div className="h-px w-10 bg-[#a66d03]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase leading-[0.92]"
            style={{ color: "#f5e6cc" }}
          >
            Comunicate con <span className="text-gold-gradient">nosotros</span>
          </motion.h2>
        </div>

        {/* ── 3 Oficinas ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OFFICES.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="rounded-2xl border border-[#a66d03]/25 bg-white/5 p-6 flex flex-col gap-4"
            >
              {/* Ciudad — centrada */}
              <h3 className="text-2xl font-black uppercase tracking-wide text-center" style={{ color: "#f5e6cc" }}>
                {office.city}
              </h3>

              {/* Teléfono */}
              <a
                href={`tel:${office.phone.replace(/[\s-]/g, "")}`}
                className="group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#a66d03]/20 flex items-center justify-center group-hover:bg-[#a66d03] transition-colors duration-200 shrink-0">
                  <Phone size={16} className="text-[#a66d03] group-hover:text-white transition-colors" />
                </div>
                <span className="text-xl font-black text-white/80 group-hover:text-[#d9bf8f] transition-colors duration-200 tracking-wide">
                  {office.phone}
                </span>
              </a>

              {/* Dirección — mismo tamaño y color que teléfono */}
              {office.address && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#a66d03]/20 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-[#a66d03]" />
                  </div>
                  <span className="text-xl font-black text-white/80 tracking-wide">
                    {office.address}
                  </span>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3 mt-auto pt-2 border-t border-white/8">
                {office.whatsapp && (
                  <a
                    href={office.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl btn-gold text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-[#a66d03]/30"
                  >
                    <img src="/wp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                    WhatsApp
                  </a>
                )}
                {office.mapsUrl && (
                  <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/8 border border-white/15 text-white/70 text-sm font-bold uppercase tracking-wider hover:bg-white/15 hover:text-white transition-all duration-200"
                  >
                    <Navigation size={14} />
                    Oficina
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Email al pie ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-7"
        >
          <a
            href={`mailto:${COMPANY.email}`}
            className="inline-flex items-center gap-2 text-base font-semibold text-white/40 hover:text-[#d9bf8f] transition-colors duration-200"
          >
            <Mail size={15} className="text-[#a66d03]" />
            {COMPANY.email}
          </a>
          <p className="text-white/25 text-sm mt-1">Respondemos en menos de 24 horas hábiles</p>
        </motion.div>

      </div>
    </section>
  );
}
