"use client";

import { useState } from "react";
import Link from "next/link";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";
import {
  Compass,
  Users2,
  BedDouble,
  PlaneTakeoff,
  AlertTriangle,
  Plus,
  ArrowRight,
  Calendar,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import PassengerModal from "./PassengerModal";
import DepartureModal from "./DepartureModal";

interface Props {
  user: OperatorUser | null;
  initialDepartures: DepartureGroup[];
  initialPassengers: PassengerPax[];
}

export default function OperationsDashboardClient({
  user,
  initialDepartures,
  initialPassengers,
}: Props) {
  const [departures, setDepartures] = useState<DepartureGroup[]>(initialDepartures);
  const [passengers, setPassengers] = useState<PassengerPax[]>(initialPassengers);
  const [isPaxModalOpen, setIsPaxModalOpen] = useState(false);
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [editingPax, setEditingPax] = useState<PassengerPax | null>(null);
  const [selectedDepartureFilter, setSelectedDepartureFilter] = useState<string>("todos");

  // Métricas calculadas en tiempo real
  const totalPax = passengers.length;
  const activeDepartures = departures.filter((d) => d.status !== "finalizada").length;
  
  // Pasajeros que viajan en Doble a Compartir y no tienen compañero aún
  const seekingPartnerPax = passengers.filter(
    (p) => p.roomType === "doble_compartir" && (p.roomSeekingPartner || !p.roomPartnerId)
  );

  // Pasajeros con pasaporte que vence en menos de 6 meses
  const expiringPassportPax = passengers.filter((p) => {
    if (!p.passportExpiryDate) return false;
    const exp = new Date(p.passportExpiryDate);
    const sixMonthsAhead = new Date();
    sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
    return exp < sixMonthsAhead;
  });

  const handlePaxSaved = (savedPax: PassengerPax) => {
    setPassengers((prev) => {
      const idx = prev.findIndex((p) => p.id === savedPax.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedPax;
        return copy;
      }
      return [savedPax, ...prev];
    });
    setIsPaxModalOpen(false);
    setEditingPax(null);
  };

  const handleDepSaved = (savedDep: DepartureGroup) => {
    setDepartures((prev) => {
      const idx = prev.findIndex((d) => d.id === savedDep.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedDep;
        return copy;
      }
      return [savedDep, ...prev];
    });
    setIsDepModalOpen(false);
  };

  const openNewPaxModal = () => {
    setEditingPax(null);
    setIsPaxModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* ── ENCABEZADO Y ACCIONES PRINCIPALES ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#ba8728]">
              Base Operativa Online · Tiempo Real
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Panel de Control Operativo
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Bienvenido, <strong className="text-white">{user?.name}</strong>. Gestión centralizada de salidas, pasajeros y logística.
          </p>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDepModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
          >
            <Compass size={16} className="text-[#ba8728]" />
            Nueva Salida
          </button>
          
          <button
            onClick={openNewPaxModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25"
          >
            <Plus size={16} strokeWidth={3} />
            Cargar Pasajero
          </button>
        </div>
      </div>

      {/* ── TARJETAS DE MÉTRICAS OPERATIVAS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Salidas Activas */}
        <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Salidas Activas</p>
            <p className="text-3xl font-black text-white mt-1">{activeDepartures}</p>
            <p className="text-[11px] text-[#ba8728] font-semibold mt-1">Temporadas 2026/2027</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ba8728]/15 border border-[#ba8728]/30 flex items-center justify-center text-[#dfb44f]">
            <Compass size={24} />
          </div>
        </div>

        {/* 2. Total Pasajeros */}
        <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Pasajeros Cargados</p>
            <p className="text-3xl font-black text-white mt-1">{totalPax}</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">Registrados en el sistema</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users2 size={24} />
          </div>
        </div>

        {/* 3. ALERTA: Dobles a Compartir Pendientes */}
        <div className={`p-5 rounded-2xl border transition-all ${
          seekingPartnerPax.length > 0
            ? "bg-amber-500/10 border-amber-500/40"
            : "bg-[#1f242c] border-white/10"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Doble a Compartir
              </p>
              <p className="text-3xl font-black text-amber-200 mt-1">{seekingPartnerPax.length}</p>
              <p className="text-[11px] text-amber-300/80 font-semibold mt-1">
                {seekingPartnerPax.length === 1 ? "1 pasajero buscando comp." : `${seekingPartnerPax.length} buscando comp.`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <BedDouble size={24} />
            </div>
          </div>
        </div>

        {/* 4. ALERTA: Pasaportes por vencer */}
        <div className={`p-5 rounded-2xl border transition-all ${
          expiringPassportPax.length > 0
            ? "bg-red-500/10 border-red-500/40"
            : "bg-[#1f242c] border-white/10"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-300">
                Pasaportes en Alerta
              </p>
              <p className="text-3xl font-black text-red-200 mt-1">{expiringPassportPax.length}</p>
              <p className="text-[11px] text-red-300/80 font-semibold mt-1">
                Vigencia &lt; 6 meses
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-300">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BANNER DE ALERTA RÁPIDA DE DOBLE A COMPARTIR ── */}
      {seekingPartnerPax.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/60 to-[#1f242c] border border-amber-500/40 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <BedDouble size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                Atención Rooming: Hay {seekingPartnerPax.length} pasajeros en Doble a Compartir sin compañero
              </h4>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Ingresá al módulo de Rooming Inteligente para emparejarlos en sus respectivas salidas.
              </p>
            </div>
          </div>
          <Link
            href="/operaciones/rooming"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shrink-0 transition-colors"
          >
            Emparejar Ahora
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ── LISTADO DE SALIDAS GRUPALES ACTIVAS ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
              <Compass size={18} className="text-[#ba8728]" />
              Salidas Grupales en Gestión
            </h2>
            <p className="text-white/50 text-xs">
              Hacé clic en cualquier salida para ver su lista de pasajeros, rooming o exportar listados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departures.map((dep) => {
            const depPax = passengers.filter((p) => p.departureId === dep.id);
            const occupied = depPax.length;
            const percentage = Math.min(Math.round((occupied / dep.capacity) * 100), 100);
            
            // Pasajeros en doble a compartir de esta salida específica
            const depSeekingPartner = depPax.filter(
              (p) => p.roomType === "doble_compartir" && (p.roomSeekingPartner || !p.roomPartnerId)
            ).length;

            return (
              <div
                key={dep.id}
                className="bg-[#1f242c] border border-white/10 hover:border-[#ba8728]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
              >
                <div>
                  {/* Badge de Estado y Cupo */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ba8728]/15 text-[#dfb44f] border border-[#ba8728]/30">
                      {dep.status.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold text-white/50 flex items-center gap-1">
                      <Calendar size={13} className="text-[#ba8728]" />
                      {dep.departureDate}
                    </span>
                  </div>

                  {/* Título de la Salida */}
                  <h3 className="text-lg font-black uppercase text-white tracking-tight leading-snug group-hover:text-[#dfb44f] transition-colors">
                    {dep.title}
                  </h3>

                  <p className="text-xs text-white/60 mt-1 flex items-center gap-1.5">
                    <UserCheck size={14} className="text-[#ba8728]" />
                    Coordinador: <strong className="text-white">{dep.coordinator || "A designar"}</strong>
                  </p>

                  {/* Barra de Ocupación / Cupos */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-white/60">Ocupación</span>
                      <span className="text-[#dfb44f]">
                        {occupied} / {dep.capacity} cupos ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 90
                            ? "bg-amber-400"
                            : percentage >= 50
                            ? "bg-emerald-400"
                            : "bg-[#ba8728]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Mini alertas por salida */}
                  {depSeekingPartner > 0 && (
                    <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] font-semibold flex items-center gap-2">
                      <BedDouble size={14} className="text-amber-400 shrink-0" />
                      <span>{depSeekingPartner} en doble a compartir sin pareja</span>
                    </div>
                  )}
                </div>

                {/* Accesos rápidos de la salida */}
                <div className="mt-5 pt-3 border-t border-white/10 grid grid-cols-3 gap-1.5 text-center">
                  <Link
                    href={`/operaciones/salidas/${dep.id}?tab=pasajeros`}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Pasajeros ({occupied})
                  </Link>
                  <Link
                    href={`/operaciones/salidas/${dep.id}?tab=rooming`}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Rooming
                  </Link>
                  <Link
                    href={`/operaciones/salidas/${dep.id}?tab=aereos`}
                    className="py-1.5 px-2 rounded-lg bg-[#ba8728]/20 hover:bg-[#ba8728]/30 text-[#dfb44f] text-[11px] font-bold uppercase tracking-wider transition-colors border border-[#ba8728]/30"
                  >
                    Aéreos
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL: NUEVO / EDITAR PASAJERO ── */}
      {isPaxModalOpen && (
        <PassengerModal
          isOpen={isPaxModalOpen}
          onClose={() => {
            setIsPaxModalOpen(false);
            setEditingPax(null);
          }}
          onSave={handlePaxSaved}
          passenger={editingPax}
          departures={departures}
          allPassengers={passengers}
          currentUser={user}
        />
      )}

      {/* ── MODAL: NUEVA SALIDA GRUPAL ── */}
      {isDepModalOpen && (
        <DepartureModal
          isOpen={isDepModalOpen}
          onClose={() => setIsDepModalOpen(false)}
          onSave={handleDepSaved}
        />
      )}
    </div>
  );
}

