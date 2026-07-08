"use client";

import { MapPin, Clock, Phone, Map } from "lucide-react";
import { OfficeInfo } from "@/types";
import { cn } from "@/lib/utils";

interface OfficeCardProps {
  office: OfficeInfo & { id: string; imagePlaceholder: string; hours: string };
}

export default function OfficeCard({ office }: OfficeCardProps) {

  const getOfficeImage = (id: string) => {
    switch (id) {
      case "san-luis":
        return "/office-san-luis.webp";
      case "villa-mercedes":
        return "/office-villa-mercedes.webp";
      case "cordoba":
        return "/office-cordoba.webp";
      default:
        return null;
    }
  };

  return (
    <div
      id={`office-${office.id}`}
      className={cn(
        "bg-white border rounded-2xl overflow-hidden shadow-lg transition-all duration-500 flex flex-col h-full scroll-mt-24 group",
        "border-[#a66d03]/15 hover:border-[#bf8b2a] hover:shadow-xl hover:shadow-[#bf8b2a]/10 hover:ring-2 hover:ring-[#bf8b2a]/20 hover:scale-[1.02]"
      )}
    >
      {/* Imagen de la Oficina */}
      <div className="relative h-48 bg-[#FAF7F2] overflow-hidden border-b border-[#a66d03]/10">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
        
        {getOfficeImage(office.id) ? (
          <img
            src={getOfficeImage(office.id)!}
            alt={office.city}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-center p-6 z-15 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-[#bf8b2a]/10 flex items-center justify-center mb-3 border border-[#bf8b2a]/20">
              <MapPin size={24} className="text-[#a66d03]" />
            </div>
            <span className="text-[#a66d03] text-xs font-bold uppercase tracking-widest bg-[#1E1810]/5 px-3 py-1 rounded-full border border-[#1E1810]/5">
              {office.city}
            </span>
          </div>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1E1810] mb-6 group-hover:text-[#a66d03] transition-colors duration-200">
            {office.city === "San Luis" ? "San Luis Capital" : office.city}
          </h3>

          <div className="space-y-6 text-base md:text-lg">
            {/* Dirección */}
            <div className="flex items-start gap-4">
              <MapPin size={22} className="text-[#a66d03] shrink-0 mt-1" />
              <div>
                <p className="text-lg md:text-xl font-bold text-[#a66d03]">Dirección</p>
                <p className="text-[#1E1810]/75 font-medium mt-1">{office.address}</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4">
              <Clock size={22} className="text-[#a66d03] shrink-0 mt-1" />
              <div>
                <p className="text-lg md:text-xl font-bold text-[#a66d03]">Horarios de Atención</p>
                <p className="text-[#1E1810]/75 font-medium mt-1">{office.hours}</p>
              </div>
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="flex items-start gap-4">
              <Phone size={22} className="text-[#a66d03] shrink-0 mt-1" />
              <div>
                <p className="text-lg md:text-xl font-bold text-[#a66d03]">WhatsApp / Contacto</p>
                <a
                  href={office.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-bold text-[#a66d03] hover:underline flex items-center gap-1.5 transition-all duration-200 mt-1"
                >
                  {office.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-10 pt-6 border-t border-[#1E1810]/5">
          <a
            href={office.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 px-8 rounded-full text-sm font-extrabold uppercase tracking-widest bg-[#a66d03] text-white border border-transparent hover:bg-[#bf8b2a] shadow-md hover:shadow-lg transition-all duration-200 text-center"
          >
            <Map size={16} />
            Ver en el mapa
          </a>
        </div>
      </div>
    </div>
  );
}
