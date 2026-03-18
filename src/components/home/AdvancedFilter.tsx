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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openPanel === "search") searchInputRef.current?.focus();
  }, [openPanel]);

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
          {/* ── Fila única de filtros ── */}
          <div className="relative flex items-center justify-center gap-2">

            {/* Lupa (mobile) */}
            <div className="sm:hidden">
              <motion.button
                onClick={() => togglePanel("search")}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-100"
                style={
                  filters.search || openPanel === "search"
                    ? { backgroundColor: "#5c3317", color: "#cd9720" }
                    : { backgroundColor: "white", color: "rgba(30,24,16,0.55)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                }
                aria-label="Buscar"
              >
                <Search size={15} />
              </motion.button>
            </div>

            {/* Barra de búsqueda expandible (mobile) — overlay animado que tapa los filtros */}
            <AnimatePresence>
              {openPanel === "search" && (
                <motion.div
                  key="search-overlay"
                  initial={{ width: 36 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 36 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute left-0 top-0 bottom-0 z-[70] flex items-center overflow-hidden rounded-full sm:hidden"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Search size={14} className="absolute left-3 text-[#1E1810]/35 pointer-events-none shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar destino..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    inputMode="search"
                    className="w-full h-full pl-8 pr-8 bg-transparent text-[#1E1810] font-medium focus:outline-none placeholder:text-[#1E1810]/40"
                    style={{ fontSize: 16 }}
                  />
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      searchInputRef.current?.blur();
                      handleSearchChange("");
                      setOpenPanel(null);
                    }}
                    className="absolute right-2.5 text-[#1E1810]/40 flex items-center justify-center w-6 h-6"
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input completo (desktop) */}
            <div className="hidden sm:block relative flex-grow max-w-[280px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-[#1E1810]/40" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
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
