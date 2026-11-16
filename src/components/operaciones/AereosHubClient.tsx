"use client";

import { useState } from "react";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";
import {
  PlaneTakeoff,
  Compass,
  Copy,
  Download,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  user: OperatorUser | null;
  initialDepartures: DepartureGroup[];
  initialPassengers: PassengerPax[];
}

export default function AereosHubClient({
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

  // Copiar formato aerolínea
  const copyAirlineManifest = () => {
    const headers = "APELLIDO\tNOMBRES\tTIPO_DOC\tNRO_DOC\tNACIONALIDAD\tNACIMIENTO\tVENC_PASAPORTE\tGENERO\n";
    const rows = depPax
      .map(
        (p) =>
          `${p.lastName}\t${p.firstName}\t${p.documentType}\t${p.passportNumber || p.documentNumber}\t${p.nationality}\t${p.birthDate}\t${p.passportExpiryDate || "-"}\t${p.gender}`
      )
      .join("\n");

    navigator.clipboard.writeText(headers + rows);
    setCopiedNotification("¡Listado de aéreos copiado al portapapeles en formato aerolínea!");
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const exportCsv = () => {
    const headers = "Apellido,Nombres,TipoDoc,NroDoc,Nacionalidad,Nacimiento,Vencimiento,Genero\n";
    const rows = depPax
      .map((p) =>
        [
          `"${p.lastName}"`,
          `"${p.firstName}"`,
          `"${p.documentType}"`,
          `"${p.passportNumber || p.documentNumber}"`,
          `"${p.nationality}"`,
          `"${p.birthDate}"`,
          `"${p.passportExpiryDate || ""}"`,
          `"${p.gender}"`,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Aereos_${activeDep?.slug || "salida"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PlaneTakeoff size={16} className="text-[#ba8728]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#dfb44f]">
              Emisión de Pasajes & Vuelos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Emisión de Aéreos (IATA)
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Generador de manifiestos oficiales de pasajeros listos para copiar o enviar al consolidador aéreo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>

          <button
            onClick={copyAirlineManifest}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25 cursor-pointer"
          >
            <Copy size={15} />
            Copiar Formato Aerolínea
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

      {/* Tabla Oficial de Emisión */}
      <div className="bg-[#1f242c] rounded-2xl border border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#14181d] text-white/60 uppercase text-[10px] tracking-wider border-b border-white/10 font-bold font-sans">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">APELLIDO</th>
                <th className="py-3 px-4">NOMBRES</th>
                <th className="py-3 px-4">TIPO DOC</th>
                <th className="py-3 px-4">Nº PASAPORTE / DNI</th>
                <th className="py-3 px-4">NACIONALIDAD</th>
                <th className="py-3 px-4">F. NACIMIENTO</th>
                <th className="py-3 px-4">VENCIMIENTO</th>
                <th className="py-3 px-4">GÉNERO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {depPax.length > 0 ? (
                depPax.map((p, i) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-white/40">{i + 1}</td>
                    <td className="py-3 px-4 font-bold text-white">{p.lastName}</td>
                    <td className="py-3 px-4 font-bold text-white">{p.firstName}</td>
                    <td className="py-3 px-4 text-white/70">{p.documentType}</td>
                    <td className="py-3 px-4 text-[#dfb44f] font-bold">
                      {p.passportNumber || p.documentNumber}
                    </td>
                    <td className="py-3 px-4 text-white/70">{p.nationality}</td>
                    <td className="py-3 px-4 text-white/70">{p.birthDate}</td>
                    <td className="py-3 px-4">
                      {p.passportExpiryDate ? (
                        <span className={p.docsStatus === "pasaporte_por_vencer" ? "text-red-400 font-bold" : "text-white/70"}>
                          {p.passportExpiryDate}
                        </span>
                      ) : (
                        <span className="text-white/30">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{p.gender}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-white/40 font-sans">
                    No hay pasajeros cargados en esta salida.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
