"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, Map, ExternalLink } from "lucide-react";
import { OfficeInfo } from "@/types";

interface OfficeCardProps {
  office: OfficeInfo & { id: string; imagePlaceholder: string; hours: string };
}

export default function OfficeCard({ office }: OfficeCardProps) {
  const [showMap, setShowMap] = useState(false);

  // Generamos una URL de inserción de Google Maps basada en la dirección
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    office.address + ", " + office.city + ", Argentina"
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div
      id={`office-${office.id}`}
      className="bg-[#1E1810] border border-[#a66d03]/25 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#bf8b2a]/50 flex flex-col h-full scroll-mt-24 group"
    >
      {/* Imagen / Placeholder de la Oficina */}
      <div className="relative h-56 bg-[#261E14] flex items-center justify-center overflow-hidden border-b border-[#a66d03]/10">
        {/* Placeholder elegante en degradé */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1810] via-transparent to-transparent z-10" />
        <div className="text-center p-6 z-15">
          <div className="w-16 h-16 rounded-full bg-[#bf8b2a]/15 flex items-center justify-center mx-auto mb-3 border border-[#bf8b2a]/30 group-hover:scale-105 transition-transform duration-300">
            <MapPin size={24} className="text-[#d9bf8f]" />
          </div>
          <span className="text-[#d9bf8f] text-xs font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
            {office.city}
          </span>
        </div>
        
        {/* Nota flotante de imagen */}
        <div className="absolute top-3 right-3 z-20 text-[10px] text-white/40 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-white/5">
          Imagen Oficina (Pendiente)
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#d9bf8f] transition-colors duration-200">
            {office.city === "San Luis" ? "San Luis Capital" : office.city}
          </h3>

          <div className="space-y-4 text-white/70 text-sm">
            {/* Dirección */}
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#a66d03] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#f5e6cc]/95">Dirección</p>
                <p className="text-white/55">{office.address}</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#a66d03] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#f5e6cc]/95">Horarios de Atención</p>
                <p className="text-white/55">{office.hours}</p>
              </div>
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-[#a66d03] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#f5e6cc]/95">WhatsApp / Contacto</p>
                <a
                  href={office.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d9bf8f] hover:underline flex items-center gap-1.5 transition-all duration-200 mt-0.5"
                >
                  {office.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Botón Ver Mapa Embebido */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200 cursor-pointer ${
                showMap
                  ? "bg-[#bf8b2a] text-white border-[#bf8b2a]"
                  : "bg-transparent text-[#d9bf8f] border-[#a66d03]/30 hover:border-[#bf8b2a]/70 hover:bg-white/5"
              }`}
            >
              <Map size={14} />
              {showMap ? "Ocultar Mapa" : "Ver Mapa"}
            </button>

            {/* Botón Cómo Llegar (Google Maps Externo) */}
            <a
              href={office.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest bg-[#261E14] text-white border border-white/5 hover:border-white/20 hover:bg-[#2e251a] transition-all duration-200"
            >
              Cómo Llegar
              <ExternalLink size={12} className="opacity-70" />
            </a>
          </div>

          {/* Iframe de Google Maps deslizable */}
          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 220, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-xl border border-[#a66d03]/20"
              >
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de la oficina de ${office.city}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
