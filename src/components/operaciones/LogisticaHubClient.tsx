"use client";

import { useState } from "react";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";
import {
  Bus,
  Compass,
  BedDouble,
  PlaneTakeoff,
  Printer,
  Copy,
  CheckCircle2,
} from "lucide-react";

interface Props {
  user: OperatorUser | null;
  initialDepartures: DepartureGroup[];
  initialPassengers: PassengerPax[];
}

export default function LogisticaHubClient({
  user,
  initialDepartures,
  initialPassengers,
}: Props) {
  const [departures] = useState<DepartureGroup[]>(initialDepartures);
  const [passengers] = useState<PassengerPax[]>(initialPassengers);
  const [selectedDepId, setSelectedDepId] = useState<string>(initialDepartures[0]?.id || "");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const activeDep = departures.find((d) => d.id === selectedDepId) || departures[0];
  const depPax = passengers.filter((p) => p.departureId === activeDep?.id);

  const busInboundPax = depPax.filter((p) => p.busInbound);
  const busOutboundPax = depPax.filter((p) => p.busOutbound);
  const hotelPrePax = depPax.filter((p) => p.hotelPre);
  const hotelPostPax = depPax.filter((p) => p.hotelPost);
  const transferOutPax = depPax.filter((p) => p.transferAirportOut);
  const transferInPax = depPax.filter((p) => p.transferAirportIn);

  const copyLogisticsSummary = () => {
    let text = `LOGÍSTICA PRE Y POST VIAJE — ${activeDep?.title || ""}\n`;
    text += `Fecha Salida: ${activeDep?.departureDate || ""}\n\n`;

    text += `1. BUS IDA A BUENOS AIRES (${busInboundPax.length} pax):\n`;
    busInboundPax.forEach((p, i) => {
      text += `  ${i + 1}. ${p.lastName}, ${p.firstName} — ${p.busInboundRoute} (Tel: ${p.phone})\n`;
    });

    text += `\n2. NOCHE PREVIA HOTEL BS AS (${hotelPrePax.length} pax):\n`;
    hotelPrePax.forEach((p, i) => {
      text += `  ${i + 1}. ${p.lastName}, ${p.firstName} — ${p.hotelPreName}\n`;
    });

    text += `\n3. TRASLADOS A EZEIZA (${transferOutPax.length} pax):\n`;
    transferOutPax.forEach((p, i) => {
      text += `  ${i + 1}. ${p.lastName}, ${p.firstName} (Tel: ${p.phone})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotification("¡Resumen de logística copiado al portapapeles!");
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bus size={16} className="text-[#ba8728]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#dfb44f]">
              Servicios Nacionales Pre y Post Viaje
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Logística Interna & Traslados
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Control de pasajes de bus interprovincial, hotelería previa en Buenos Aires y traslados a Ezeiza.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyLogisticsSummary}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ba8728]/20 cursor-pointer"
          >
            <Copy size={15} />
            Copiar Resumen
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Printer size={15} />
            Imprimir Hoja de Ruta
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Selector de Salida */}
      <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#dfb44f] flex items-center gap-2">
          <Compass size={16} className="text-[#ba8728]" />
          Seleccionar Salida Grupal:
        </label>
        <select
          value={selectedDepId}
          onChange={(e) => setSelectedDepId(e.target.value)}
          className="bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ba8728] w-full sm:w-auto"
        >
          {departures.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title} ({d.departureDate})
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Servicios Logísticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Traslados en Bus */}
        <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-[#ba8728]" />
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Traslados en Bus
              </h3>
            </div>
            <span className="text-xs font-bold text-[#dfb44f]">
              {busInboundPax.length + busOutboundPax.length} tramos
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#dfb44f] mb-2">
                Bus Ida hacia Bs As ({busInboundPax.length} pax)
              </p>
              {busInboundPax.length > 0 ? (
                <div className="space-y-1.5">
                  {busInboundPax.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#14181d] text-xs">
                      <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                      <p className="text-[11px] text-white/50">{p.busInboundRoute}</p>
                      <p className="text-[10px] text-[#ba8728] mt-0.5">{p.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Ningún pasajero requiere bus de ida.</p>
              )}
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-xs font-bold uppercase text-[#dfb44f] mb-2">
                Bus Regreso al Interior ({busOutboundPax.length} pax)
              </p>
              {busOutboundPax.length > 0 ? (
                <div className="space-y-1.5">
                  {busOutboundPax.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#14181d] text-xs">
                      <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                      <p className="text-[11px] text-white/50">{p.busOutboundRoute}</p>
                      <p className="text-[10px] text-[#ba8728] mt-0.5">{p.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Ningún pasajero requiere bus de regreso.</p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Hotelería Pre y Post en Buenos Aires */}
        <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BedDouble size={18} className="text-[#ba8728]" />
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Hotelería Pre / Post
              </h3>
            </div>
            <span className="text-xs font-bold text-[#dfb44f]">
              {hotelPrePax.length + hotelPostPax.length} noches
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#dfb44f] mb-2">
                Noche Pre-Circuito ({hotelPrePax.length} pax)
              </p>
              {hotelPrePax.length > 0 ? (
                <div className="space-y-1.5">
                  {hotelPrePax.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#14181d] text-xs">
                      <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                      <p className="text-[11px] text-white/50">{p.hotelPreName || "Hotel asignado"}</p>
                      <p className="text-[10px] text-[#ba8728] mt-0.5">Hab: {p.roomType.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Ningún pasajero requiere hotel pre.</p>
              )}
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-xs font-bold uppercase text-[#dfb44f] mb-2">
                Noche Post-Circuito ({hotelPostPax.length} pax)
              </p>
              {hotelPostPax.length > 0 ? (
                <div className="space-y-1.5">
                  {hotelPostPax.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#14181d] text-xs">
                      <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                      <p className="text-[11px] text-white/50">{p.hotelPostName || "Hotel asignado"}</p>
                      <p className="text-[10px] text-[#ba8728] mt-0.5">Hab: {p.roomType.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Ningún pasajero requiere hotel post.</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Traslados Ezeiza / Aeroparque */}
        <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <PlaneTakeoff size={18} className="text-[#ba8728]" />
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Traslados Aeropuerto
              </h3>
            </div>
            <span className="text-xs font-bold text-[#dfb44f]">
              {transferOutPax.length + transferInPax.length} transfers
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#dfb44f] mb-2">
                Hacia Ezeiza / Aeroparque ({transferOutPax.length} pax)
              </p>
              {transferOutPax.length > 0 ? (
                <div className="space-y-1.5">
                  {transferOutPax.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#14181d] text-xs">
                      <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                      <p className="text-[10px] text-[#ba8728] mt-0.5">Tel: {p.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Ningún pasajero requiere transfer ida.</p>
              )}
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-xs font-bold uppercase text-[#dfb44f] mb-2">
                Desde Ezeiza / Aeroparque ({transferInPax.length} pax)
              </p>
              {transferInPax.length > 0 ? (
                <div className="space-y-1.5">
                  {transferInPax.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#14181d] text-xs">
                      <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                      <p className="text-[10px] text-[#ba8728] mt-0.5">Tel: {p.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Ningún pasajero requiere transfer vuelta.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

