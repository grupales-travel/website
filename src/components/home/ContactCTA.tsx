"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Navigation } from "lucide-react";
import { COMPANY, OFFICES } from "@/data/company";

export default function ContactCTA() {
  return (
    <section className="relative py-12 md:py-16 lg:py-20 px-6 overflow-hidden bg-[#fafaf8]">
      <div className="relative max-w-6xl mx-auto">

        {/* ── Título ── */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <div className="h-px w-6 sm:w-10 bg-[#72500c]" />
            <span className="text-[#72500c] text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              Hablemos
            </span>
            <div className="h-px w-6 sm:w-10 bg-[#72500c]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92]"
          >
            <span className="text-[#db5835]">Comunicate con </span>
            <span className="text-[#72500c]">nosotros</span>
          </motion.h2>
        </div>

        {/* ── Oficinas (Tarjetas Naranja #db5835) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {OFFICES.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="rounded-2xl bg-[#db5835] text-white p-6 flex flex-col gap-4 shadow-xl shadow-[#db5835]/20"
            >
              {/* Ciudad */}
              <h3 className="text-2xl font-black uppercase tracking-wide text-center text-white">
                {office.city}
              </h3>

              {/* Teléfono */}
              <a
                href={`tel:${office.phone.replace(/[\s-]/g, "")}`}
                className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-white" />
                </div>
                <span className="text-base md:text-lg font-black text-white tracking-wide">
                  {office.phone}
                </span>
              </a>

              {/* Dirección */}
              {office.address && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <span className="text-base md:text-lg font-black text-white/95 tracking-wide">
                    {office.address}
                  </span>
                </div>
              )}

              {/* Acciones (Botones Blancos) */}
              <div className="flex gap-3 mt-auto pt-3 border-t border-white/20">
                {office.whatsapp && (
                  <a
                    href={office.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#db5835] text-xs font-black uppercase tracking-wider hover:bg-white/90 transition-all duration-200 shadow-md"
                  >
                    <img src="/wp-icon.png" alt="WhatsApp" className="w-3.5 h-3.5 object-contain" />
                    WhatsApp
                  </a>
                )}
                {office.mapsUrl && (
                  <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/30 transition-all duration-200"
                  >
                    <Navigation size={13} />
                    Mapa
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
          className="text-center mt-10"
        >
          <a
            href={`mailto:${COMPANY.email}`}
            className="inline-flex items-center gap-2 text-base font-bold text-[#db5835] hover:text-[#72500c] uppercase tracking-wider transition-colors duration-200"
          >
            <Mail size={16} className="text-[#db5835]" />
            {COMPANY.email}
          </a>
          <p className="text-[#72500c]/70 text-xs font-bold uppercase tracking-widest mt-1">
            Respondemos en menos de 24 hrs. hábiles
          </p>
        </motion.div>

      </div>
    </section>
  );
}
