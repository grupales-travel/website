"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SupabaseDestination } from "@/lib/supabase";
import { Search, Calendar, MapPin, Filter, ChevronDown } from "lucide-react";

function CustomSelect({ value, onChange, options, icon: Icon }: { value: string, onChange: (v: string) => void, options: { value: string, label: string }[], icon?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div ref={ref} className="relative w-full md:w-56">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-[#a66d03]/30 hover:border-[#a66d03] text-[#f5e6cc] text-sm rounded-lg transition-all"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-[#d9bf8f] shrink-0" />}
                    <span className="truncate">{selectedOption.label}</span>
                </div>
                <ChevronDown size={14} className={`text-[#d9bf8f] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 py-1 bg-[#1E1810] border border-[#a66d03]/30 rounded-lg shadow-xl max-h-60 overflow-y-auto elegant-scrollbar">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === opt.value
                                    ? "bg-[#a66d03]/20 text-[#f5e6cc] font-bold"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface Props {
    initialDestinations: SupabaseDestination[];
}

const MONTHS: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
};

function parseDateScore(dateStr: string, year: number): number {
    if (!dateStr || dateStr.toLowerCase() === "consultar") return 9999999999999;

    // Try to parse something like "13 Ago" or "Ago"
    const lower = dateStr.toLowerCase();
    let monthScore = 0;
    let dayScore = 1;

    for (const [m, val] of Object.entries(MONTHS)) {
        if (lower.includes(m)) {
            monthScore = val;
            break;
        }
    }

    const match = lower.match(/\d+/);
    if (match) {
        dayScore = parseInt(match[0], 10);
    }

    return new Date(year, monthScore, dayScore).getTime();
}

export default function DestinationsClient({ initialDestinations }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [filterRegion, setFilterRegion] = useState("all");
    const [filterYear, setFilterYear] = useState("all");

    const filteredAndSorted = useMemo(() => {
        let result = [...initialDestinations];

        // Búsqueda
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(d => d.title.toLowerCase().includes(q));
        }

        // Filtros
        if (filterRegion !== "all") {
            result = result.filter(d => d.region === filterRegion);
        }
        if (filterYear !== "all") {
            result = result.filter(d => d.year.toString() === filterYear);
        }

        // Ordenamiento: 1º Activos, 2º Más próximos
        result.sort((a, b) => {
            // Regla 1: Inactivos siempre van abajo
            if (a.active && !b.active) return -1;
            if (!a.active && b.active) return 1;

            // Regla 2: Ordenar por cercanía en fecha
            const scoreA = parseDateScore(a.departure_date, a.year);
            const scoreB = parseDateScore(b.departure_date, b.year);
            return scoreA - scoreB;
        });

        return result;
    }, [initialDestinations, search, filterRegion, filterYear]);

    // Años únicos para el filtro
    const uniqueYears = Array.from(new Set(initialDestinations.map(d => d.year))).sort((a, b) => a - b);

    return (
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase text-[#f5e6cc] tracking-tight">Destinos</h1>
                    <p className="text-white/40 text-sm mt-1">{filteredAndSorted.length} destinos encontrados</p>
                </div>
                <Link href="/admin/destinos/nuevo"
                    className="px-6 py-2.5 bg-[#a66d03] text-[#f5e6cc] hover:bg-[#c98604] text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm">
                    Agregar destino
                </Link>
            </div>

            {/* Barra de Filtros */}
            <div className="bg-[#1E1810] p-4 rounded-xl border border-white/10 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-[#f5e6cc] focus:outline-none focus:ring-2 focus:ring-[#a66d03]/30 focus:border-[#a66d03] transition-all placeholder:text-white/30"
                    />
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
                    <CustomSelect
                        value={filterRegion}
                        onChange={setFilterRegion}
                        icon={MapPin}
                        options={[
                            { value: "all", label: "Todas las Regiones" },
                            { value: "europa", label: "Europa" },
                            { value: "america", label: "América" },
                            { value: "asia", label: "Asia" },
                            { value: "africa-mo", label: "África & Medio Oriente" },
                            { value: "oceania", label: "Oceanía" }
                        ]}
                    />

                    <CustomSelect
                        value={filterYear}
                        onChange={setFilterYear}
                        icon={Calendar}
                        options={[
                            { value: "all", label: "Todos los Años" },
                            ...uniqueYears.map(y => ({ value: y.toString(), label: y.toString() }))
                        ]}
                    />
                </div>
            </div>

            {/* Tabla de Resultados */}
            <div className="bg-[#1E1810] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Destino</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 hidden md:table-cell">Región</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 hidden md:table-cell">Salida</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredAndSorted.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-white/30 text-sm">
                                        No se encontraron destinos que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSorted.map((d) => (
                                    <tr
                                        key={d.id}
                                        onClick={() => router.push(`/admin/destinos/${d.id}`)}
                                        className="hover:bg-white/5 cursor-pointer transition-colors duration-150 group"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#f5e6cc] group-hover:text-white transition-colors uppercase">{d.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60 capitalize hidden md:table-cell">
                                            {d.region.replace('-mo', ' & M.O.')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60 hidden md:table-cell">
                                            {d.departure_date ? `${d.departure_date} ${d.year}` : `Consultar ${d.year}`}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${d.active
                                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                                : "bg-white/5 text-white/30 border border-white/10"
                                                }`}>
                                                {d.active ? "Activo" : "Inactivo"}
                                            </span>
                                            {d.featured && (
                                                <span className="inline-flex items-center ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#a66d03]/20 text-[#d9bf8f] border border-[#a66d03]/30">
                                                    Destacado
                                                </span>
                                            )}
                                            {d.partner && (
                                                <span className="inline-flex items-center ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                    Partner
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
