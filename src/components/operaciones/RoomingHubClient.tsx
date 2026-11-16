"use client";

import { useState } from "react";
import Link from "next/link";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";
import {
  BedDouble,
  Compass,
  Printer,
  Unlink,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface Props {
  user: OperatorUser | null;
  initialDepartures: DepartureGroup[];
  initialPassengers: PassengerPax[];
}

export default function RoomingHubClient({
  user,
  initialDepartures,
  initialPassengers,
}: Props) {
  const [departures] = useState<DepartureGroup[]>(initialDepartures);
  const [passengers, setPassengers] = useState<PassengerPax[]>(initialPassengers);
  const [selectedDepId, setSelectedDepId] = useState<string>(initialDepartures[0]?.id || "");

  const activeDep = departures.find((d) => d.id === selectedDepId) || departures[0];
  const depPax = passengers.filter((p) => p.departureId === activeDep?.id);

  // Pasajeros en Doble a Compartir que buscan compañero
  const seekingPartner = depPax.filter(
    (p) => p.roomType === "doble_compartir" && (p.roomSeekingPartner || !p.roomPartnerId)
  );

  // Habitaciones dobles armadas
  const pairedRooms: { [key: string]: PassengerPax[] } = {};
  const singleRooms: PassengerPax[] = [];
  const tripleRooms: PassengerPax[] = [];

  depPax.forEach((p) => {
    if (p.roomType === "single") {
      singleRooms.push(p);
    } else if (p.roomType === "triple") {
      tripleRooms.push(p);
    } else if (p.roomPartnerId) {
      const pairKey = [p.id, p.roomPartnerId].sort().join("_");
      if (!pairedRooms[pairKey]) pairedRooms[pairKey] = [];
      if (!pairedRooms[pairKey].some((existing) => existing.id === p.id)) {
        pairedRooms[pairKey].push(p);
      }
    }
  });

  const handlePairRoom = async (pax1Id: string, pax2Id: string) => {
    if (!pax2Id) return;
    try {
      const res = await fetch("/api/operaciones/rooming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pair", pax1Id, pax2Id }),
      });

      if (res.ok) {
        const p1 = passengers.find((p) => p.id === pax1Id);
        const p2 = passengers.find((p) => p.id === pax2Id);
        if (p1 && p2) {
          setPassengers((prev) =>
            prev.map((p) => {
              if (p.id === pax1Id) {
                return {
                  ...p,
                  roomPartnerId: p2.id,
                  roomPartnerName: `${p2.lastName}, ${p2.firstName}`,
                  roomSeekingPartner: false,
                };
              }
              if (p.id === pax2Id) {
                return {
                  ...p,
                  roomPartnerId: p1.id,
                  roomPartnerName: `${p1.lastName}, ${p1.firstName}`,
                  roomSeekingPartner: false,
                };
              }
              return p;
            })
          );
        }
      }
    } catch {
      alert("Error al emparejar habitación.");
    }
  };

  const handleUnpairRoom = async (paxId: string) => {
    if (!confirm("¿Desvincular esta habitación? Ambos pasajeros volverán a quedar en búsqueda de compañero.")) return;

    try {
      const res = await fetch("/api/operaciones/rooming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpair", paxId }),
      });

      if (res.ok) {
        const pax = passengers.find((p) => p.id === paxId);
        const partnerId = pax?.roomPartnerId;

        setPassengers((prev) =>
          prev.map((p) => {
            if (p.id === paxId || p.id === partnerId) {
              return {
                ...p,
                roomPartnerId: undefined,
                roomPartnerName: undefined,
                roomSeekingPartner: p.roomType === "doble_compartir",
              };
            }
            return p;
          })
        );
      }
    } catch {
      alert("Error al desemparejar habitación.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BedDouble size={16} className="text-[#ba8728]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#dfb44f]">
              Módulo de Distribución de Habitaciones
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Rooming Inteligente
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Automatización de Doble a Compartir Garantizada y generación del Rooming List oficial para hoteles.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Printer size={15} />
          Imprimir Rooming List
        </button>
      </div>

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

      {activeDep && (
        <div className="space-y-6">
          {/* Métricas de Habitaciones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-white/50">Habitaciones Dobles</p>
              <p className="text-2xl font-black text-white mt-1">{Object.keys(pairedRooms).length}</p>
              <p className="text-[11px] text-[#dfb44f] mt-0.5">{Object.keys(pairedRooms).length * 2} pasajeros</p>
            </div>

            <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-white/50">Habitaciones Singles</p>
              <p className="text-2xl font-black text-white mt-1">{singleRooms.length}</p>
              <p className="text-[11px] text-white/60 mt-0.5">{singleRooms.length} pasajeros</p>
            </div>

            <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-white/50">Habitaciones Triples</p>
              <p className="text-2xl font-black text-white mt-1">{tripleRooms.length}</p>
              <p className="text-[11px] text-white/60 mt-0.5">{tripleRooms.length * 3} pasajeros</p>
            </div>

            <div className={`p-4 rounded-2xl border ${seekingPartner.length > 0 ? "bg-amber-500/10 border-amber-500/40" : "bg-[#1f242c] border-white/10"}`}>
              <p className="text-[10px] font-bold uppercase text-amber-300">Buscando Compañero</p>
              <p className="text-2xl font-black text-amber-200 mt-1">{seekingPartner.length}</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">Doble a compartir</p>
            </div>
          </div>

          {/* Emparejador Interactivo de Doble a Compartir */}
          {seekingPartner.length > 0 && (
            <div className="bg-[#1f242c] border border-amber-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <BedDouble size={20} className="text-amber-400" />
                <h3 className="text-sm font-black uppercase text-amber-300 tracking-wider">
                  Pasajeros en Doble a Compartir esperando compañero ({seekingPartner.length})
                </h3>
              </div>
              <p className="text-xs text-white/70">
                Emparejá a dos personas de esta salida para conformar su habitación:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {seekingPartner.map((pax) => {
                  const otherAvailable = seekingPartner.filter((other) => other.id !== pax.id);

                  return (
                    <div
                      key={pax.id}
                      className="bg-[#14181d] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-white">
                            {pax.lastName}, {pax.firstName}
                          </p>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            {pax.gender} · {pax.city}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">DNI/Pasaporte: {pax.documentNumber}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => handlePairRoom(pax.id, e.target.value)}
                          className="flex-1 bg-[#1b2027] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#ba8728]"
                        >
                          <option value="">-- Emparejar con... --</option>
                          {otherAvailable.map((other) => (
                            <option key={other.id} value={other.id}>
                              {other.lastName}, {other.firstName} ({other.gender} · {other.city})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Habitaciones Conformadas */}
          <div className="space-y-4">
            <h3 className="text-base font-black uppercase text-white tracking-wide">
              Distribución de Habitaciones Conformadas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pairedRooms).map(([key, occupants], idx) => (
                <div
                  key={key}
                  className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-black uppercase text-[#dfb44f]">
                      Habitación Doble #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleUnpairRoom(occupants[0].id)}
                      className="text-white/40 hover:text-red-300 p-1 rounded"
                      title="Desvincular Habitación"
                    >
                      <Unlink size={14} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {occupants.map((occ) => (
                      <div key={occ.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                        <p className="font-bold text-white">{occ.lastName}, {occ.firstName}</p>
                        <p className="text-[10px] text-white/50">Doc: {occ.documentNumber} ({occ.gender})</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {singleRooms.map((pax, idx) => (
                <div
                  key={pax.id}
                  className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-black uppercase text-white/60">
                      Habitación Single #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                      Individual
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{pax.lastName}, {pax.firstName}</p>
                    <p className="text-[10px] text-white/50">Doc: {pax.documentNumber} ({pax.gender})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

