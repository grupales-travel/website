"use client";

import { useState, useRef } from "react";
import { PassengerPax, PaxDocumentCategory } from "@/types/operations";
import { X, Upload, FileText, CheckCircle2, AlertTriangle, ExternalLink, Loader2, Paperclip, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pax: PassengerPax | null;
  onUploaded: (updatedPax: PassengerPax) => void;
}

export default function QuickDocUploadModal({ isOpen, onClose, pax, onUploaded }: Props) {
  const [category, setCategory] = useState<PaxDocumentCategory>("pasaporte");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !pax) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", category);
      fd.append("paxId", pax.id);
      fd.append("name", file.name);

      const token = typeof window !== "undefined" ? localStorage.getItem("operaciones_token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/operaciones/upload", {
        method: "POST",
        headers,
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al subir el archivo.");
      }

      setSuccess(`¡Archivo "${file.name}" guardado exitosamente en la nube!`);
      if (data.passenger) {
        onUploaded(data.passenger);
      }

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err?.message || "Error al subir a la nube");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#1b2027] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#222832]/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#dfb44f]">
              Carga Directa a la Nube (R2)
            </span>
            <h3 className="text-base font-black uppercase text-white tracking-tight">
              {pax.lastName}, {pax.firstName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Selector de Categoría */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb44f] mb-2">
              Tipo de Documento a Cargar:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "pasaporte", label: "Pasaporte" },
                { id: "dni", label: "DNI / Cédula" },
                { id: "vacuna", label: "F. Amarilla" },
                { id: "visa", label: "Visa EEUU" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as PaxDocumentCategory)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                    category === c.id
                      ? "bg-[#ba8728] border-[#ba8728] text-white shadow-md shadow-[#ba8728]/25"
                      : "bg-[#14181d] border-white/10 text-white/70 hover:border-white/25"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zona de Subida */}
          <div className="pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-[#ba8728]/50 hover:border-[#dfb44f] rounded-2xl p-6 bg-[#14181d] hover:bg-[#ba8728]/5 transition-all flex flex-col items-center justify-center gap-2.5 group cursor-pointer disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-[#ba8728]/20 flex items-center justify-center text-[#dfb44f] group-hover:scale-110 transition-transform">
                {uploading ? (
                  <Loader2 size={22} className="animate-spin text-[#dfb44f]" />
                ) : (
                  <Upload size={22} />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {uploading ? "Subiendo a Cloudflare R2..." : "Hacé clic para seleccionar archivo"}
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Admite fotos legibles (JPG, PNG) o documentos PDF (máx. 30MB)
                </p>
              </div>
            </button>
          </div>

          {/* Documentos ya cargados para este pasajero */}
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2 flex items-center gap-1.5">
              <Paperclip size={13} className="text-[#dfb44f]" />
              Documentos actualmente en la nube:
            </h4>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {pax.docPassportUrl && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    📘 Pasaporte Principal
                  </span>
                  <a
                    href={pax.docPassportUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink size={10} /> Ver Archivo
                  </a>
                </div>
              )}

              {pax.docDniUrl && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    📄 DNI / Documento
                  </span>
                  <a
                    href={pax.docDniUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink size={10} /> Ver Archivo
                  </a>
                </div>
              )}

              {pax.docVaccineUrl && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    💉 Fiebre Amarilla
                  </span>
                  <a
                    href={pax.docVaccineUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink size={10} /> Ver Archivo
                  </a>
                </div>
              )}

              {pax.docVisaUrl && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    🇺🇸 Visa de EEUU
                  </span>
                  <a
                    href={pax.docVisaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink size={10} /> Ver Archivo
                  </a>
                </div>
              )}

              {pax.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-white truncate max-w-[240px]">
                    📎 {doc.name}
                  </span>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:underline shrink-0"
                  >
                    <ExternalLink size={10} /> Ver
                  </a>
                </div>
              ))}

              {!pax.docPassportUrl && !pax.docDniUrl && !pax.docVaccineUrl && !pax.docVisaUrl && (!pax.documents || pax.documents.length === 0) && (
                <p className="text-[11px] text-white/40 italic py-1">
                  Este pasajero aún no tiene documentación cargada en la nube.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex justify-end bg-[#222832]/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

