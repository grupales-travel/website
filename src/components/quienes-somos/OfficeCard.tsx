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
      default:
        return null;
    }
  };

  return (
    <div
      id={`office-${office.id}`}
      className={cn(
        "bg-white border rounded-2xl overflow-hidden shadow-md transition-all duration-500 flex flex-col h-full scroll-mt-24 group",
        "border-[#db5835]/15 hover:border-[#db5835] hover:shadow-xl hover:shadow-[#db5835]/10 hover:-translate-y-1"
      )}
    >
      {/* Imagen de la Oficina */}
      <div className="relative h-44 sm:h-48 bg-[#FAF7F2] overflow-hidden border-b border-[#db5835]/10">
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent z-10" />
        
        {getOfficeImage(office.id) ? (
          <img
            src={getOfficeImage(office.id)!}
            alt={office.city}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-center p-6 z-15 flex flex-col items-center justify-center h-full">
            <div className="w-14 h-14 rounded-full bg-[#db5835]/10 flex items-center justify-center mb-2 border border-[#db5835]/20">
              <MapPin size={22} className="text-[#db5835]" />
            </div>
            <span className="text-[#db5835] text-xs font-bold uppercase tracking-widest">
              {office.city}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-[#1E1810] mb-5 group-hover:text-[#db5835] transition-colors duration-200">
            {office.city === "San Luis" ? "San Luis Capital" : office.city}
          </h3>

          <div className="space-y-4 text-base">
            {/* Dirección */}
            <div className="flex items-start gap-3.5">
              <MapPin size={20} className="text-[#db5835] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#72500c] uppercase tracking-wider">Dirección</p>
                <p className="text-[#1E1810]/80 font-medium text-base mt-0.5">{office.address}</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-3.5">
              <Clock size={20} className="text-[#db5835] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#72500c] uppercase tracking-wider">Horarios de Atención</p>
                <p className="text-[#1E1810]/80 font-medium text-base mt-0.5 leading-snug">{office.hours}</p>
              </div>
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="flex items-start gap-3.5">
              <Phone size={20} className="text-[#db5835] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#72500c] uppercase tracking-wider">WhatsApp / Contacto</p>
                <a
                  href={office.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-[#db5835] hover:underline flex items-center gap-1.5 transition-all duration-200 mt-0.5"
                >
                  {office.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 pt-4 border-t border-[#1E1810]/5">
          <a
            href={office.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#db5835] text-white hover:bg-[#e86543] shadow-md hover:shadow-lg transition-all duration-200 text-center"
          >
            <Map size={15} />
            Ver en el mapa
          </a>
        </div>
      </div>
    </div>
  );
}
