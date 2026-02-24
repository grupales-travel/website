"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Plus, Upload, FileText, Image as ImageIcon, ChevronDown, ChevronLeft, ChevronRight, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { supabase, SupabaseDestination } from "@/lib/supabase";

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function isoToEs(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${parseInt(d)} ${MONTHS_ES[parseInt(m) - 1]} ${y}`;
}

function esDateToIso(es: string, defaultYear?: number): string {
  const months: Record<string, number> = {
    ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12
  };
  const parts = es.toLowerCase().trim().split(/\s+/);
  if (parts.length >= 3) {
    const d = parts[0].padStart(2, "0");
    const mStr = parts[1] === "de" ? parts[2] : parts[1]; // Handle "11 de marzo" or "11 marzo"
    const m = String(months[mStr.slice(0, 3)] ?? 1).padStart(2, "0");
    let y = parts[parts.length - 1]; // Assume last part is year

    // If last part is not a 4-digit year (e.g., it was just the month name), use defaultYear
    if (y.length !== 4 || isNaN(Number(y))) {
      y = String(defaultYear || new Date().getFullYear());
    }
    return `${y}-${m}-${d}`;
  }
  return "";
}

function computeTagline(countries: number, cities: number | null, days: number) {
  const c = countries === 1 ? "1 PAÍS" : `${countries} PAÍSES`;
  const d = `${days} DÍA${days !== 1 ? "S" : ""}`;
  if (cities === null) {
    return `${c} · ${d}`;
  }
  const ci = cities === 1 ? "1 CIUDAD" : `${cities} CIUDADES`;
  return `${c} · ${ci} · ${d}`;
}

function previewUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/destinations/${path}`;
}

// ─── Subcomponente: DatePicker ───────────────────────────────────────────────

const MONTHS_LONG = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function DatePicker({ value, onChange, placeholder = "Seleccioná una fecha" }: {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const parsed = value ? value.split("-").map(Number) : null;
  const selYear = parsed?.[0];
  const selMonth = parsed ? parsed[1] - 1 : undefined;
  const selDay = parsed?.[2];

  const [viewYear, setViewYear] = useState(selYear ?? 2026);
  const [viewMonth, setViewMonth] = useState(selMonth ?? 0);

  // Sincronizar vista si el valor cambia externamente
  useEffect(() => {
    if (parsed) { setViewYear(parsed[0]); setViewMonth(parsed[1] - 1); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Lun = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }
  function selectDay(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  }

  const displayLabel = value ? isoToEs(value) : null;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-3 px-4 py-3 bg-white/8 border rounded-xl text-sm transition-colors ${open ? "border-[#a66d03]/50 bg-white/10" : "border-white/10 hover:border-white/20"
          }`}
      >
        <span className={displayLabel ? "text-[#f5e6cc] font-semibold" : "text-white/25"}>
          {displayLabel ?? placeholder}
        </span>
        <ChevronDown size={13} className={`text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-[#1E1810]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 w-72">
          {/* Navegación de mes */}
          <div className="flex items-center justify-between mb-5">
            <button type="button" onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors">
              <ChevronLeft size={15} />
            </button>
            <span className="text-[#f5e6cc] text-sm font-bold tracking-wide">
              {MONTHS_LONG[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Cabecera días */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_SHORT.map(d => (
              <span key={d} className="text-center text-[10px] font-bold text-[#a66d03]/60 uppercase tracking-wider py-0.5">
                {d}
              </span>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstWeekday }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isSelected = selYear === viewYear && selMonth === viewMonth && selDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`aspect-square flex items-center justify-center text-sm rounded-full transition-colors ${isSelected
                    ? "bg-[#a66d03] text-white font-bold shadow-lg"
                    : "text-[#f5e6cc]/60 hover:bg-white/8 hover:text-[#f5e6cc]"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Subcomponente: CustomSelect ────────────────────────────────────────────

interface SelectOption { value: number | null; label: string }

function CustomSelect({ value, onChange, options }: {
  value: number | null;
  onChange: (v: number | null) => void;
  options: SelectOption[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll al elemento seleccionado al abrir
  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector("[data-selected='true']") as HTMLElement;
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-white/8 border rounded-xl text-sm transition-colors ${open ? "border-[#a66d03]/50 bg-white/10" : "border-white/10 hover:border-white/20"
          }`}
      >
        <span className="text-[#f5e6cc] font-semibold">{selected?.label}</span>
        <ChevronDown size={13} className={`text-white/30 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1E1810]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-y-auto max-h-52 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                data-selected={isSelected}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isSelected
                  ? "bg-[#a66d03]/20 text-[#d9bf8f] font-bold"
                  : "text-[#f5e6cc]/65 hover:bg-white/6 hover:text-[#f5e6cc]"
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Subcomponente: FileUploadField ─────────────────────────────────────────

interface FileFieldProps {
  label: string;
  value: string | null;
  folder: "backgrounds" | "portadas" | "maps" | "pdfs" | "videos";
  accept: string;
  slug: string;
  type?: "image" | "pdf";
  compact?: boolean;
  onChange: (path: string) => void;
}

function FileUploadField({ label, value, folder, accept, slug, type = "image", compact = false, onChange }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [imageError, setImageError] = useState(false);

  const preview = type === "image" ? previewUrl(value) : null;
  const filename = value ? value.split("/").pop() : null;

  // Reset image error if value changes
  useEffect(() => {
    setImageError(false);
  }, [value]);

  async function handleFile(file: File) {
    setLoading(true);
    setErr("");
    setImageError(false);

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    // Agregamos un timestamp para evitar colisiones de "el archivo ya existe"
    // y resolver problemas de cacheado duro del navegador o CDN.
    const slugToUse = slug ? `${slug}-${Date.now()}` : `upload-${Date.now()}`;

    // Paso 1: pedir token firmado al servidor
    const res1 = await fetch("/api/admin-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder, slug: slugToUse, ext }),
    });
    if (!res1.ok) {
      const d = await res1.json();
      setErr(d.error ?? "Error al preparar la subida");
      setLoading(false);
      return;
    }
    const { token, storagePath } = await res1.json();

    // Paso 2: subir usando el método oficial de supabase-js
    const { error } = await supabase.storage
      .from("destinations")
      .uploadToSignedUrl(storagePath, token, file, { contentType: file.type });

    setLoading(false);
    if (error) setErr(error.message);
    else onChange(storagePath);
  }

  const hasFile = (preview && !imageError) || (type === "pdf" && filename);

  return (
    <div>
      <p className="text-xs font-bold text-white/35 uppercase tracking-[0.18em] mb-3">{label}</p>

      {hasFile ? (
        /* ESTADO LLENO: Archivo cargado */
        <div className={`relative group rounded-2xl overflow-hidden shadow-sm border border-white/10 bg-black/20 flex flex-col justify-center items-center ${compact ? 'h-32' : 'aspect-video'}`}>
          {type === "image" ? (
            <div className="absolute inset-0">
              <Image
                src={preview!}
                alt={label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 text-center z-0">
              <FileText size={32} className="text-[#a66d03]" />
              <span className="text-[#f5e6cc]/80 text-sm font-medium break-all line-clamp-2">{filename}</span>
            </div>
          )}

          {/* Botón flotante para cambiar */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 z-10 gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-[#a66d03] hover:border-[#a66d03] transition-all transform scale-95 group-hover:scale-100 shadow-xl flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
            >
              <Upload size={14} />
              {loading ? "Subiendo..." : "Cambiar archivo"}
            </button>
            {preview && !imageError && (
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-black/40 px-5 py-2.5 rounded-full hover:bg-black/60 transition-all transform scale-95 group-hover:scale-100 flex items-center gap-2 text-sm font-semibold backdrop-blur-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {type === "pdf" ? "Abrir archivo PDF" : "Ver imagen original"}
              </a>
            )}
          </div>
        </div>
      ) : (
        /* ESTADO VACÍO: Dropzone dashed */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className={`w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#a66d03]/50 hover:bg-[#a66d03]/5 transition-all duration-300 disabled:opacity-50 group ${compact ? 'h-32 py-2' : 'aspect-video'}`}
        >
          <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#a66d03]/20 flex items-center justify-center transition-colors">
            <Upload size={20} className="text-white/40 group-hover:text-[#a66d03] transition-colors" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/70 text-sm font-semibold group-hover:text-[#d9bf8f] transition-colors">
              {loading ? "Subiendo archivo..." : `Subir ${type === "pdf" ? "documento PDF" : "imagen"}`}
            </span>
            <span className="text-white/30 text-xs">
              Hacé click o arrastrá tu archivo acá
            </span>
          </div>
        </button>
      )}

      {err && <p className="text-red-400 text-xs mt-2 font-medium">{err}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ─── Subcomponente: Toggle ───────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3">
      <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${checked ? "bg-[#a66d03]" : "bg-white/12"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${checked ? "left-[22px]" : "left-0.5"}`} />
      </div>
      <span className="text-[#f5e6cc]/60 text-sm font-semibold">{label}</span>
    </button>
  );
}

// ─── Formulario principal ────────────────────────────────────────────────────

interface Props {
  initial?: Partial<SupabaseDestination>;
  id?: number;
}

const REGIONS = [
  { value: "europa", label: "Europa" },
  { value: "america", label: "América" },
  { value: "asia", label: "Asia" },
  { value: "africa-mo", label: "África y Medio Oriente" },
  { value: "oceania", label: "Oceanía" },
];

const BADGES = [
  { value: "ninguno", label: "Ninguno" },
  { value: "agotado", label: "Cupos Agotados" },
  { value: "ultimos", label: "Últimos Cupos" },
  { value: "nuevo", label: "Nuevo" },
  { value: "popular", label: "Popular" },
];

export default function DestinationForm({ initial, id }: Props) {
  const router = useRouter();

  // Básico
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [region, setRegion] = useState<string>(initial?.region ?? "europa");
  const [badge, setBadge] = useState<string | null>(initial?.badge ?? null);

  // Detalles del viaje
  const [year, setYear] = useState(initial?.year ?? 2026);
  const [countries, setCountries] = useState(initial?.countries ?? 1);
  const [cities, setCities] = useState<number | null>(initial?.cities ?? null);
  const [days, setDays] = useState(initial?.days ?? 1);
  const [depIso, setDepIso] = useState(esDateToIso(initial?.departure_date ?? ""));
  const [retIso, setRetIso] = useState(esDateToIso(initial?.return_date ?? ""));
  const [depCity, setDepCity] = useState(initial?.departure_city ?? "Buenos Aires");

  // Archivos
  const [heroPath, setHeroPath] = useState<string | null>(initial?.hero_path ?? null);
  const [coverPath, setCoverPath] = useState<string | null>(initial?.cover_path ?? null);
  const [mapPath, setMapPath] = useState<string | null>(initial?.map_path ?? null);
  const [itineraryPath, setItineraryPath] = useState<string | null>(initial?.itinerary_path ?? null);

  // Qué incluye
  const [includes, setIncludes] = useState<string[]>((initial?.includes as string[]) ?? []);
  const [newInclude, setNewInclude] = useState("");

  // Videos
  const [videos, setVideos] = useState<string[]>((initial?.video_urls as string[]) ?? []);
  const [newVideo, setNewVideo] = useState("");
  const videoFileRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Config
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [partner, setPartner] = useState(initial?.partner ?? false);

  // Estado de guardado y generacion
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Auto-slug y title ──────────────────────────────────────────────────────
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  }

  // ── Autocompletar con IA ───────────────────────────────────────────────────
  async function handleGenerateAI() {
    if (!itineraryPath) return;
    setIsGenerating(true);
    try {
      const pdfUrl = itineraryPath.startsWith("http")
        ? itineraryPath
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/destinations/${itineraryPath}`;

      const res = await fetch("https://n8n.grupalestravel.com.ar/webhook/relleno_de_pagina_web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl }),
      });

      if (!res.ok) throw new Error("Error en la IA (n8n)");
      let rawData = await res.json();

      // Defensivo: Si n8n envuelve la respuesta en formato array o en objetos anidados de OpenAI
      if (Array.isArray(rawData) && rawData[0]?.output?.[0]?.content?.[0]?.text) {
        rawData = rawData[0].output[0].content[0].text;
      } else if (Array.isArray(rawData)) {
        rawData = rawData[0]; // Por si devuelve un array directo
      } else if (rawData?.text && typeof rawData.text === "object") {
        rawData = rawData.text; // Formato exacto del último screenshot (objeto con prop 'text')
      } else if (rawData?.content?.[0]?.text) {
        rawData = rawData.content[0].text;
      }

      // Si por alguna razón la IA devolvió un string en lugar de un objeto puro (como Markdown)
      if (typeof rawData === "string") {
        try {
          // Intentar limpiar marcadores json si existen
          const cleanStr = rawData.replace(/```json\n?|\n?```/g, "").trim();
          rawData = JSON.parse(cleanStr);
        } catch (err) {
          console.error("No se pudo parsear el string de la IA a JSON válido:", rawData);
          throw new Error("El formato devuelto por la IA no es un JSON válido.");
        }
      }

      const data = rawData;
      console.log("IA Payload detectado:", data);

      if (data.title) handleTitleChange(data.title);
      if (data.region) setRegion(data.region);
      if (data.description) setDescription(data.description);
      if (data.year) setYear(Number(data.year));
      if (data.countries) setCountries(Number(data.countries));
      if (data.cities !== undefined) setCities(data.cities === null ? null : Number(data.cities));
      if (data.days) setDays(Number(data.days));
      if (data.departure_date) setDepIso(esDateToIso(data.departure_date, Number(data.year)));
      if (data.return_date) setRetIso(esDateToIso(data.return_date, Number(data.year)));
      if (data.includes && Array.isArray(data.includes)) setIncludes(data.includes);

      // Auto-set departure city if it seems they leave from somewhere other than Buenos Aires 
      // (Optional smart logic, for now default to AI departure city if we had it, else keep Buenos Aires)
      // Since AI doesn't return departure city yet in the updated prompt, we let the user manually change it.

    } catch (e) {
      alert("Error autocompletando con IA. Revisá la consola.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Tagline auto ───────────────────────────────────────────────────────────
  const tagline = computeTagline(countries, cities, days);

  // ── Includes ───────────────────────────────────────────────────────────────
  function addInclude() {
    const val = newInclude.trim();
    if (!val || includes.includes(val)) return;
    setIncludes((p) => [...p, val]);
    setNewInclude("");
  }

  // ── Videos ────────────────────────────────────────────────────────────────
  function addVideoUrl() {
    const val = newVideo.trim();
    if (!val || videos.includes(val)) return;

    // Validación estricta para asegurar que solo sean videos de YouTube
    if (!val.includes("youtube.com") && !val.includes("youtu.be")) {
      alert("Por favor, ingresá únicamente un enlace válido de YouTube Shorts o YouTube.");
      return;
    }

    setVideos((p) => [...p, val]);
    setNewVideo("");
  }

  async function uploadVideoFile(file: File) {
    setUploadingVideo(true);

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
    const videoSlug = `video-${Date.now()}`;

    // Paso 1: token firmado
    const res1 = await fetch("/api/admin-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "videos", slug: videoSlug, ext }),
    });

    if (!res1.ok) {
      const d = await res1.json().catch(() => ({}));
      alert(`Error preparando la subida: ${d.error ?? "Sin detalle"}`);
      setUploadingVideo(false);
      return;
    }
    const { token, storagePath } = await res1.json();

    // Paso 2: subida oficial con supabase-js (maneja headers, MIME, etc.)
    const { error } = await supabase.storage
      .from("destinations")
      .uploadToSignedUrl(storagePath, token, file, { contentType: file.type });

    setUploadingVideo(false);
    if (error) {
      alert(`Error al subir el video: ${error.message}`);
    } else {
      setVideos((p) => [...p, storagePath]);
    }
  }

  // ── Guardar ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!retIso) { setSaveErr("La fecha de regreso es obligatoria."); return; }
    setSaving(true);
    setSaveErr("");

    const departureDate = isoToEs(depIso) || "";
    const returnDate = retIso ? isoToEs(retIso) : null;

    const payload = {
      slug, title, tagline, description, region,
      year, countries, cities, days,
      departure_date: departureDate,
      return_date: returnDate,
      departure_city: depCity,
      hero_path: heroPath,
      cover_path: coverPath,
      map_path: mapPath,
      itinerary_path: itineraryPath,
      whatsapp_url: "https://wa.link/ggzwq4",
      video_urls: videos,
      includes,
      active, featured, partner, badge,
    };

    const res = await fetch(id ? `/api/admin-destination?id=${id}` : "/api/admin-destination", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setSaveErr(data.error ?? "Error al guardar"); return; }

    // Revalidar ISR
    await fetch(`/api/revalidate?secret=grupales-seed-2026&path=/destinos/${slug}`, { method: "POST" });
    router.push("/admin/destinos");
  }

  // ── Estilos ────────────────────────────────────────────────────────────────
  const input = "w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-[#f5e6cc] text-sm outline-none focus:border-[#a66d03]/50 transition-colors placeholder:text-white/20";
  const card = "bg-white/5 border border-white/8 rounded-2xl";
  const cardH = "px-6 py-4 border-b border-white/6";
  const cardB = "px-6 py-6 space-y-5";
  const label = "block text-xs font-bold text-white/35 uppercase tracking-[0.18em] mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── 0. Inteligencia Artificial ────────────────────────────────────── */}
      <div className={`${card} shadow-[0_0_25px_rgba(217,191,143,0.05)] border-[#a66d03]/30 border-2`}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={16} className="text-[#a66d03]" /> Asistente de IA
          </h3>
          <p className="text-white/40 text-xs mt-0.5">Subí el PDF del itinerario y la IA rellenará el formulario automáticamente.</p>
        </div>
        <div className={cardB}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 w-full relative z-10">
              <FileUploadField
                label="Itinerario (PDF)"
                value={itineraryPath}
                folder="pdfs"
                accept=".pdf"
                slug={slug}
                type="pdf"
                compact
                onChange={setItineraryPath}
              />
            </div>
            <div className="flex-1 w-full flex flex-col justify-center mt-2 md:mt-8">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={!itineraryPath || isGenerating}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-[#a66d03]/20 to-[#a66d03]/40 border border-[#a66d03]/50 text-[#f5e6cc] font-bold text-sm uppercase tracking-widest hover:from-[#a66d03]/40 hover:to-[#a66d03]/60 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#d9bf8f]" /> Procesando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-[#d9bf8f] group-hover:scale-110 transition-transform" /> Autocompletar Destino
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 1. Información básica ────────────────────────────────────────── */}
      <div className={card}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest">Información básica</h3>
        </div>
        <div className={cardB}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div>
              <label className={label}>Título <span className="text-red-400">*</span></label>
              <input
                className={input}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Alma Europea"
              />
            </div>

            {/* Región */}
            <div>
              <label className={label}>Región <span className="text-red-400">*</span></label>
              <CustomSelect
                value={
                  REGIONS.findIndex(r => r.value === region) !== -1
                    ? REGIONS.findIndex(r => r.value === region)
                    : 0
                }
                onChange={(index) => {
                  if (index !== null) {
                    setRegion(REGIONS[index].value);
                  }
                }}
                options={REGIONS.map((r, i) => ({ value: i, label: r.label }))}
              />
            </div>

            {/* Etiqueta (Badge) */}
            <div>
              <label className={label}>Etiqueta (Badge) Promocional</label>
              <CustomSelect
                value={
                  BADGES.findIndex(b => b.value === (badge || "ninguno")) !== -1
                    ? BADGES.findIndex(b => b.value === (badge || "ninguno"))
                    : 0
                }
                onChange={(index) => {
                  if (index !== null) {
                    const val = BADGES[index].value;
                    setBadge(val === "ninguno" ? null : val);
                  }
                }}
                options={BADGES.map((b, i) => ({ value: i, label: b.label }))}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className={label}>Descripción</label>
            <textarea
              className={`${input} min-h-[90px] resize-y`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del destino..."
            />
          </div>
        </div>
      </div>

      {/* ── 2. Detalles del viaje ────────────────────────────────────────── */}
      <div className={card}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest">Detalles del viaje</h3>
          <p className="text-white/25 text-xs mt-0.5">El tagline se genera automáticamente.</p>
        </div>
        <div className={cardB}>

          {/* Tagline preview */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#a66d03]/15 border border-[#a66d03]/30 rounded-full">
            <span className="text-[#d9bf8f] text-xs font-black uppercase tracking-widest">{tagline}</span>
          </div>

          {/* Configuración cuantitativa */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 mt-2">
            <div>
              <label className={label}>Año del viaje <span className="text-red-400">*</span></label>
              <CustomSelect
                value={year}
                onChange={(v) => setYear(v as number)}
                options={[2025, 2026, 2027, 2028].map(y => ({ value: y, label: String(y) }))}
              />
            </div>
            <div>
              <label className={label}>Cantidad de países <span className="text-red-400">*</span></label>
              <CustomSelect
                value={countries}
                onChange={(v) => setCountries(v as number)}
                options={Array.from({ length: 15 }, (_, i) => i + 1).map(n => ({
                  value: n, label: `${n} ${n === 1 ? "país" : "países"}`
                }))}
              />
            </div>
            <div>
              <label className={label}>Cantidad de ciudades</label>
              <CustomSelect
                value={cities}
                onChange={(v) => setCities(v)}
                options={[
                  { value: null, label: "Ninguna (Ocultar)" },
                  ...Array.from({ length: 25 }, (_, i) => i + 1).map(n => ({
                    value: n, label: `${n} ${n === 1 ? "ciudad" : "ciudades"}`
                  }))
                ]}
              />
            </div>
            <div>
              <label className={label}>Duración total <span className="text-red-400">*</span></label>
              <CustomSelect
                value={days}
                onChange={(v) => setDays(v as number)}
                options={Array.from({ length: 35 }, (_, i) => i + 1).map(n => ({
                  value: n, label: `${n} ${n === 1 ? "día" : "días"}`
                }))}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fecha de salida */}
            <div>
              <label className={label}>Fecha de salida <span className="text-red-400">*</span></label>
              <DatePicker
                value={depIso}
                onChange={setDepIso}
                placeholder="Seleccioná fecha"
              />
            </div>

            {/* Fecha de regreso (obligatoria) */}
            <div>
              <label className={label}>Fecha de regreso <span className="text-red-400">*</span></label>
              <DatePicker
                value={retIso}
                onChange={setRetIso}
                placeholder="Seleccioná fecha"
              />
              {!retIso && saveErr && (
                <p className="text-red-400 text-xs mt-1">Obligatoria.</p>
              )}
            </div>
          </div>

          {/* Ciudad de Salida */}
          <div className="mt-5">
            <label className={label}>Ciudad de Salida <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              className={input}
              value={depCity}
              onChange={(e) => setDepCity(e.target.value)}
              placeholder="Ej: Buenos Aires"
            />
          </div>
        </div>
      </div>

      {/* ── 3. Archivos ──────────────────────────────────────────────────── */}
      <div className={card}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest">Archivos e imágenes</h3>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadField
              label="Imagen de fondo (hero)"
              value={heroPath}
              folder="backgrounds"
              accept="image/*"
              slug={slug}
              type="image"
              onChange={setHeroPath}
            />
            <FileUploadField
              label="Portada (card)"
              value={coverPath}
              folder="portadas"
              accept="image/*"
              slug={slug}
              type="image"
              onChange={setCoverPath}
            />
            <FileUploadField
              label="Mapa del recorrido"
              value={mapPath}
              folder="maps"
              accept="image/*"
              slug={`${slug}-map`}
              type="image"
              onChange={setMapPath}
            />
          </div>
        </div>
      </div>

      {/* ── 4. Qué incluye ───────────────────────────────────────────────── */}
      <div className={card}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest">Qué incluye</h3>
          <p className="text-white/25 text-xs mt-0.5">Vista previa igual a como se verá en el sitio.</p>
        </div>
        <div className={cardB}>
          {/* Preview igual al sitio: grid de cards con checkmark */}
          {includes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/8 group/item relative">
                  <CheckCircle size={16} className="text-[#a66d03] flex-shrink-0 mt-0.5" />
                  <span className="text-[#f5e6cc]/70 text-sm leading-snug flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => setIncludes((p) => p.filter((_, j) => j !== i))}
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity text-white/25 hover:text-red-400 shrink-0"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              className={`${input} flex-1`}
              value={newInclude}
              onChange={(e) => setNewInclude(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
              placeholder="Ej: Vuelos internacionales incluidos"
            />
            <button
              type="button"
              onClick={addInclude}
              disabled={!newInclude.trim()}
              className="px-4 py-3 bg-[#a66d03]/20 border border-[#a66d03]/30 text-[#d9bf8f] rounded-xl hover:bg-[#a66d03]/30 transition-colors disabled:opacity-40 flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
            >
              <Plus size={15} /> Agregar
            </button>
          </div>
          <p className="text-white/20 text-xs">Presioná Enter o el botón para agregar cada ítem.</p>
        </div>
      </div>

      {/* ── 5. Videos testimonios ────────────────────────────────────────── */}
      <div className={card}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest">Videos del destino</h3>
          <p className="text-white/25 text-xs mt-0.5">Pegá el link de YouTube Shorts.</p>
        </div>
        <div className={cardB}>
          {/* Lista de videos */}
          {videos.length > 0 && (
            <div className="space-y-2">
              {videos.map((v, i) => {
                const isSocial = v.includes("youtube.com") || v.includes("youtu.be");
                const label = isSocial ? v : (v.split("/").pop() ?? v);
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
                    <FileText size={15} className="text-[#a66d03] shrink-0" />
                    <span className="text-sm text-[#f5e6cc]/55 flex-1 truncate">{label}</span>
                    <button type="button" onClick={() => setVideos((p) => p.filter((_, j) => j !== i))}
                      className="text-white/25 hover:text-red-400 transition-colors shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Input URL Redes Sociales */}
          <div className="flex gap-2 mt-4">
            <input
              className={`${input} flex-1`}
              value={newVideo}
              onChange={(e) => setNewVideo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVideoUrl())}
              placeholder="https://www.youtube.com/shorts/..."
            />
            <button type="button" onClick={addVideoUrl} disabled={!newVideo.trim()}
              className="px-4 py-3 bg-[#a66d03]/20 border border-[#a66d03]/30 text-[#d9bf8f] rounded-xl hover:bg-[#a66d03]/30 transition-colors disabled:opacity-40 flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap">
              <Plus size={15} /> Agregar
            </button>
          </div>
        </div>
      </div>

      {/* ── 6. Configuración ─────────────────────────────────────────────── */}
      <div className={card}>
        <div className={cardH}>
          <h3 className="text-sm font-bold text-[#f5e6cc] uppercase tracking-widest">Configuración</h3>
        </div>
        <div className="px-6 py-6 flex flex-wrap gap-8">
          <Toggle checked={active} onChange={setActive} label="Visible en el sitio" />
          <Toggle checked={featured} onChange={setFeatured} label="Destacado en home" />
          <Toggle checked={partner} onChange={setPartner} label="Salida partner" />
        </div>
      </div>

      {/* ── Acciones ──────────────────────────────────────────────────────── */}
      {saveErr && (
        <div className="px-5 py-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm font-semibold">
          {saveErr}
        </div>
      )}

      <div className="flex gap-3 pb-4">
        <button
          type="submit"
          disabled={saving}
          className="px-10 py-4 btn-gold text-white text-sm font-bold uppercase tracking-widest rounded-full disabled:opacity-50"
        >
          {saving ? "Guardando..." : id ? "Guardar cambios" : "Crear destino"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/destinos")}
          className="px-10 py-4 border border-white/12 text-white/40 text-sm font-bold uppercase tracking-widest rounded-full hover:border-white/25 hover:text-white/65 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
