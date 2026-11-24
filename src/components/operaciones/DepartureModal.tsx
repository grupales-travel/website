"use client";

import { useState, useEffect } from "react";
import { DepartureGroup, DepartureStatus } from "@/types/operations";
import { X, Save, Compass } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (departure: DepartureGroup) => void;
  departure?: DepartureGroup | null;
}

export default function DepartureModal({ isOpen, onClose, onSave, departure }: Props) {
  const [formData, setFormData] = useState<Partial<DepartureGroup>>({
    id: `dep-${Date.now()}`,
    slug: "",
    title: "",
    departureDate: "",
    returnDate: "",
    coordinator: "",
    capacity: 25,
    status: "abierta",
    requiresUsaVisa: false,
    requiresYellowFever: false,
    specialRequirementsNotes: "",
    busRoutesAvailable: ["San Luis -> Buenos Aires", "Villa Mercedes -> Buenos Aires"],
    hotelsPreAvailable: ["Hotel Sheraton Libertador (Bs As)"],
    hotelsPostAvailable: ["Hotel Sheraton Libertador (Bs As)"],
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (departure) {
        setFormData(departure);
      } else {
        setFormData({
          id: `dep-${Date.now()}`,
          slug: "",
          title: "",
          departureDate: "",
          returnDate: "",
          coordinator: "",
          capacity: 25,
          status: "abierta",
          requiresUsaVisa: false,
          requiresYellowFever: false,
          specialRequirementsNotes: "",
          busRoutesAvailable: ["San Luis -> Buenos Aires", "Villa Mercedes -> Buenos Aires"],
          hotelsPreAvailable: ["Hotel Sheraton Libertador (Bs As)"],
          hotelsPostAvailable: ["Hotel Sheraton Libertador (Bs As)"],
          notes: "",
        });
      }
      setError("");
      setSaving(false);
    }
  }, [isOpen, departure]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.departureDate?.trim()) {
      setError("Completá el título del viaje y la fecha de salida.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const payload: DepartureGroup = {
        id: formData.id || `dep-${Date.now()}`,
        slug,
        title: formData.title.trim(),
        destinationSlug: slug,
        destinationTitle: formData.title.trim(),
        departureDate: formData.departureDate,
        returnDate: formData.returnDate || "",
        coordinator: formData.coordinator || "A designar",
        capacity: Number(formData.capacity) || 25,
        status: (formData.status as DepartureStatus) || "abierta",
        requiresUsaVisa: Boolean(formData.requiresUsaVisa),
        requiresYellowFever: Boolean(formData.requiresYellowFever),
        specialRequirementsNotes: formData.specialRequirementsNotes || "",
        busRoutesAvailable: formData.busRoutesAvailable || [],
        hotelsPreAvailable: formData.hotelsPreAvailable || [],
        hotelsPostAvailable: formData.hotelsPostAvailable || [],
        notes: formData.notes || "",
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("operaciones_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/operaciones/salidas", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al guardar la salida grupal");
      }

      const saved = await res.json();
      setSaving(false);
      onSave(saved);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la base de datos");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#1b2027] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#222832]/80">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#ba8728]" />
            <h2 className="text-base font-black uppercase text-white tracking-tight">
              {departure ? "Editar Salida Grupal" : "Nueva Salida Grupal"}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb44f] mb-1.5">
              Título del Viaje *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Turquía & Dubái 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Fecha Salida *
              </label>
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Fecha Regreso
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Coordinador Asignado
              </label>
              <input
                type="text"
                placeholder="Ej: Nicolás Sánchez"
                value={formData.coordinator}
                onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Cupo Máximo (Pax)
              </label>
              <input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
              Estado de la Salida
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DepartureStatus })}
              className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
            >
              <option value="abierta">Abierta (En Venta)</option>
              <option value="ultimos_cupos">Últimos Cupos</option>
              <option value="cerrada">Cerrada (Completa / En Operaciones)</option>
              <option value="en_viaje">En Viaje</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={formData.requiresYellowFever}
                onChange={(e) => setFormData({ ...formData, requiresYellowFever: e.target.checked })}
                className="rounded text-[#ba8728] focus:ring-[#ba8728]"
              />
              Requiere Fiebre Amarilla
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={formData.requiresUsaVisa}
                onChange={(e) => setFormData({ ...formData, requiresUsaVisa: e.target.checked })}
                className="rounded text-[#ba8728] focus:ring-[#ba8728]"
              />
              Requiere Visa EEUU
            </label>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#ba8728] hover:bg-[#c59b3f] text-white font-black text-xs uppercase flex items-center gap-2"
            >
              <Save size={15} />
              {saving ? "Guardando..." : "Guardar Salida"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

