"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe2, CalendarDays, ChevronDown, Check, Search } from "lucide-react";
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

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside: overlay approach — infalible
  useEffect(() => {
    if (!openDropdown) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [openDropdown]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setOpenDropdown(null);
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  return (
    <>
      {/* Overlay transparente — cierra el dropdown al clickar fuera */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-30"
          onMouseDown={() => setOpenDropdown(null)}
        />
      )}

      <div className="w-full mb-8 relative z-[35]" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex items-center justify-center gap-3 flex-wrap"
        >

          {/* ── Búsqueda ── */}
          <div className="relative flex-grow max-w-[280px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-[#1E1810]/40" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white text-[#1E1810] text-[15px] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.07),_0_4px_16px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#a66d03]/50 transition-shadow placeholder:text-[#1E1810]/40"
            />
          </div>

          {/* ── Región ── */}
          <FilterPill
            icon={<Globe2 size={16} strokeWidth={2} />}
            label="Región"
            value={filters.region ? formatRegion(filters.region) : null}
            active={!!filters.region}
            open={openDropdown === "region"}
            onClick={() => toggleDropdown("region")}
          >
            <Sheet>
              <SheetOption
                label="Todas las regiones"
                selected={!filters.region}
                onClick={() => handleFilterChange("region", "")}
              />
              <SheetDivider />
              {regions.map((r) => (
                <SheetOption
                  key={r}
                  label={formatRegion(r)}
                  selected={filters.region === r}
                  onClick={() => handleFilterChange("region", r)}
                />
              ))}
            </Sheet>
          </FilterPill>

          {/* ── Mes ── */}
          <FilterPill
            icon={<CalendarDays size={16} strokeWidth={2} />}
            label="Mes"
            value={filters.month || null}
            active={!!filters.month}
            open={openDropdown === "month"}
            onClick={() => toggleDropdown("month")}
          >
            <Sheet>
              <SheetOption
                label="Todos los meses"
                selected={!filters.month}
                onClick={() => handleFilterChange("month", "")}
              />
              <SheetDivider />
              <div className="max-h-64 overflow-y-auto elegant-scrollbar">
                {months.map((m) => (
                  <SheetOption
                    key={m}
                    label={m}
                    selected={filters.month === m}
                    onClick={() => handleFilterChange("month", m)}
                  />
                ))}
              </div>
            </Sheet>
          </FilterPill>

          {/* ── Año ── */}
          <FilterPill
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            label="Año"
            value={filters.year || null}
            active={filters.year !== CURRENT_YEAR}
            open={openDropdown === "year"}
            onClick={() => toggleDropdown("year")}
          >
            <Sheet>
              <SheetOption
                label="Todos los años"
                selected={!filters.year}
                onClick={() => handleFilterChange("year", "")}
              />
              <SheetDivider />
              {years.map((y) => (
                <SheetOption
                  key={y}
                  label={y.toString()}
                  selected={filters.year === y.toString()}
                  onClick={() => handleFilterChange("year", y.toString())}
                />
              ))}
            </Sheet>
          </FilterPill>


        </motion.div>
      </div>
    </>
  );
}

/* ─── FilterPill ──────────────────────────────────────────── */

function FilterPill({
  icon,
  label,
  value,
  active,
  open,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  active: boolean;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isDark = active || open;

  return (
    <div className="relative z-40">
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`
          flex items-center gap-3 pl-5 pr-4 py-3 rounded-full cursor-pointer select-none
          transition-all duration-200 ease-out
          ${isDark
            ? "text-white shadow-[0_4px_20px_rgba(92,51,23,0.32)]"
            : "bg-white text-[#1E1810]/65 shadow-[0_1px_4px_rgba(0,0,0,0.07),_0_4px_16px_rgba(0,0,0,0.05)] hover:text-[#1E1810] hover:shadow-[0_2px_8px_rgba(0,0,0,0.10),_0_6px_20px_rgba(0,0,0,0.07)]"
          }
        `}
        style={isDark ? { backgroundColor: "#5c3317" } : {}}
      >
        {/* Icon */}
        <span className={`shrink-0 transition-colors duration-200 ${isDark ? "text-[#cd9720]" : "text-[#1E1810]/35"}`}>
          {icon}
        </span>

        {/* Label / Value */}
        <span className="text-[15px] font-semibold leading-none whitespace-nowrap">
          {value ? value : label}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className={`shrink-0 transition-colors duration-200 ${isDark ? "text-white/50" : "text-[#1E1810]/25"}`}
        >
          <ChevronDown size={14} strokeWidth={2.5} />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && children}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sheet (dropdown panel) ──────────────────────────────── */

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 36, mass: 0.6 }}
      className="absolute top-full mt-2 min-w-[200px] z-40 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10), 0 20px 48px rgba(0,0,0,0.08)",
      }}
    >
      <div className="py-2">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── SheetOption ─────────────────────────────────────────── */

function SheetOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-5 py-3 text-left
        text-[15px] leading-none transition-colors duration-100 cursor-pointer
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
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="ml-5 shrink-0"
          >
            <Check size={15} strokeWidth={2.5} className="text-[#cd9720]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─── SheetDivider ────────────────────────────────────────── */

function SheetDivider() {
  return <div className="h-px mx-4 my-1.5" style={{ background: "rgba(0,0,0,0.06)" }} />;
}
