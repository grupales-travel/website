"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe2, CalendarDays, ChevronDown, Check, Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatRegion } from "@/lib/utils";

export interface FilterState {
  search: string;
  region: string;
  month: string;
  year: string;
}

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterState) => void;
  regions: string[];
  months: string[];
  years: number[];
}

const CURRENT_YEAR = new Date().getFullYear().toString();

export default function AdvancedFilter({
  onFilterChange,
  regions,
  months,
  years,
}: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    region: "",
    month: "",
    year: CURRENT_YEAR,
  });

  // Un único panel abierto: "search" | "region" | "month" | "year" | null
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click fuera → cerrar todo
  useEffect(() => {
    if (!openPanel) return;
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openPanel]);

  // Para dropdowns (región/mes/año): cierra el panel después de seleccionar
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setOpenPanel(null);
  };

  // Para búsqueda: filtra sin cerrar el panel
  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const togglePanel = (key: string) => {
    setOpenPanel(openPanel === key ? null : key);
  };

  const hasActiveFilters = !!(filters.region || filters.month || filters.year !== CURRENT_YEAR);

  const clearFilters = () => {
    const cleared = { ...filters, region: "", month: "", year: CURRENT_YEAR };
    setFilters(cleared);
    onFilterChange(cleared);
    setOpenPanel(null);
  };

  return (
    <>
      {/* Backdrop: cierra cualquier panel abierto */}
      {openPanel && (
        <div
          className="fixed inset-0 z-[45]"
          onMouseDown={() => setOpenPanel(null)}
        />
      )}

      <div className="w-full mb-8 relative z-[50]" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          {/* ── Barra de búsqueda (mobile) — siempre visible, encima de los filtros ── */}
          <div className="sm:hidden relative mb-2">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <Search size={15} className="text-[#1E1810]/35" />
            </div>
            <input
              type="text"
              placeholder="Buscar destino..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white text-[#1E1810] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#a66d03]/40 placeholder:text-[#1E1810]/40"
              style={{ fontSize: 16 }}
            />
            {filters.search && (
              <button
                onMouseDown={(e) => { e.preventDefault(); handleSearchChange(""); }}
                className="absolute inset-y-0 right-3 flex items-center text-[#1E1810]/35 hover:text-[#1E1810]/70"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── Fila de filtros ── */}
          <div className="flex items-center justify-center gap-2">

            {/* Input completo (desktop) */}
            <div className="hidden sm:block relative flex-grow max-w-[280px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-[#1E1810]/40" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white text-[#1E1810] text-[15px] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.07)] focus:outline-none focus:ring-2 focus:ring-[#a66d03]/50 transition-shadow placeholder:text-[#1E1810]/40"
              />
            </div>

            {/* Región */}
            <FilterPill
              icon={<Globe2 size={14} strokeWidth={2} />}
              label="Región"
              value={filters.region ? formatRegion(filters.region) : null}
              active={!!filters.region}
              open={openPanel === "region"}
              onClick={() => togglePanel("region")}
              align="left"
            >
              <Sheet align="left">
                <SheetOption label="Todas las regiones" selected={!filters.region} onClick={() => handleFilterChange("region", "")} />
                <SheetDivider />
                {regions.map((r) => (
                  <SheetOption key={r} label={formatRegion(r)} selected={filters.region === r} onClick={() => handleFilterChange("region", r)} />
                ))}
              </Sheet>
            </FilterPill>

            {/* Mes */}
            <FilterPill
              icon={<CalendarDays size={14} strokeWidth={2} />}
              label="Mes"
              value={filters.month || null}
              active={!!filters.month}
              open={openPanel === "month"}
              onClick={() => togglePanel("month")}
              align="right"
            >
              <Sheet align="right">
                <SheetOption label="Todos los meses" selected={!filters.month} onClick={() => handleFilterChange("month", "")} />
                <SheetDivider />
                <div className="max-h-56 overflow-y-auto elegant-scrollbar">
                  {months.map((m) => (
                    <SheetOption key={m} label={m} selected={filters.month === m} onClick={() => handleFilterChange("month", m)} />
                  ))}
                </div>
              </Sheet>
            </FilterPill>

            {/* Año */}
            <FilterPill
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              label="Año"
              value={filters.year || null}
              active={filters.year !== CURRENT_YEAR}
              open={openPanel === "year"}
              onClick={() => togglePanel("year")}
              align="right"
            >
              <Sheet align="right">
                <SheetOption label="Todos los años" selected={!filters.year} onClick={() => handleFilterChange("year", "")} />
                <SheetDivider />
                {years.map((y) => (
                  <SheetOption key={y} label={y.toString()} selected={filters.year === y.toString()} onClick={() => handleFilterChange("year", y.toString())} />
                ))}
              </Sheet>
            </FilterPill>

            {/* ── X para limpiar región/mes/año ── */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  key="clear-all"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={clearFilters}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1E1810]/10 text-[#1E1810]/45 hover:bg-[#1E1810]/18 hover:text-[#1E1810]/70 transition-colors shrink-0"
                  aria-label="Limpiar filtros"
                >
                  <X size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </>
  );
}

/* ─── FilterPill ──────────────────────────────────────────── */

function FilterPill({
  icon, label, value, active, open, onClick, align, children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  active: boolean;
  open: boolean;
  onClick: () => void;
  align: "left" | "right";
  children: React.ReactNode;
}) {
  const isDark = active || open;

  return (
    <div className="relative z-[50]">
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.1 }}
        className={`
          flex items-center gap-1.5 sm:gap-3
          pl-3 pr-2 py-2 sm:pl-5 sm:pr-4 sm:py-3
          rounded-full cursor-pointer select-none
          transition-colors duration-100
          ${isDark
            ? "text-white"
            : "bg-white text-[#1E1810]/65 shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:text-[#1E1810]"
          }
        `}
        style={isDark ? { backgroundColor: "#5c3317", boxShadow: "0 4px_20px_rgba(92,51,23,0.3)" } : {}}
      >
        <span className={`shrink-0 ${isDark ? "text-[#cd9720]" : "text-[#1E1810]/35"}`}>
          {icon}
        </span>
        <span className="text-[12px] sm:text-[15px] font-semibold leading-none whitespace-nowrap">
          {value ?? label}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className={`shrink-0 ${isDark ? "text-white/50" : "text-[#1E1810]/25"}`}
        >
          <ChevronDown size={12} strokeWidth={2.5} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && children}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sheet ────────────────────────────────────────────────── */

function Sheet({ children, align }: { children: React.ReactNode; align: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 3, scale: 0.99 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className={`absolute top-full mt-1.5 z-[60] rounded-2xl overflow-hidden ${align === "right" ? "right-0" : "left-0"}`}
      style={{
        minWidth: "180px",
        maxWidth: "min(220px, calc(100vw - 2rem))",
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12), 0 20px 48px rgba(0,0,0,0.08)",
      }}
    >
      <div className="py-2">{children}</div>
    </motion.div>
  );
}

/* ─── SheetOption ─────────────────────────────────────────── */

function SheetOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-2.5 text-left
        text-[14px] leading-none transition-colors duration-75 cursor-pointer
        ${selected
          ? "text-[#5c3317] font-semibold bg-[#f5e6cc]/60"
          : "text-[#1E1810]/60 font-medium hover:bg-black/[0.03] hover:text-[#1E1810]/90"
        }
      `}
    >
      <span>{label}</span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="ml-4 shrink-0"
          >
            <Check size={14} strokeWidth={2.5} className="text-[#cd9720]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─── SheetDivider ────────────────────────────────────────── */

function SheetDivider() {
  return <div className="h-px mx-4 my-1" style={{ background: "rgba(0,0,0,0.06)" }} />;
}
