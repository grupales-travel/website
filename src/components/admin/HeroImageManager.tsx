"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { GripVertical, Trash2, X, Upload } from "lucide-react";

interface HeroImage {
  id: number;
  storage_path: string;
  alt: string;
  order: number;
  active: boolean;
  publicUrl: string;
}

interface Props {
  images: HeroImage[];
}

export default function HeroImageManager({ images: init }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState([...init].sort((a, b) => a.order - b.order));
  const [isModal, setIsModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  // ── Toggle activo ────────────────────────────────────────────────────────
  async function toggleActive(id: number) {
    const img = images.find((i) => i.id === id)!;
    const next = !img.active;
    setImages((prev) => prev.map((i) => i.id === id ? { ...i, active: next } : i));

    const res = await fetch(`/api/admin-hero?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: img.alt, active: next }),
    });
    if (!res.ok) {
      setImages((prev) => prev.map((i) => i.id === id ? { ...i, active: img.active } : i));
      toast("Error al guardar el estado.");
    }
  }

  // ── Editar alt (onBlur) ─────────────────────────────────────────────────
  async function saveAlt(id: number, alt: string) {
    const img = images.find((i) => i.id === id)!;
    await fetch(`/api/admin-hero?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt, active: img.active }),
    });
  }

  // ── Eliminar ─────────────────────────────────────────────────────────────
  async function deleteImage(id: number) {
    if (!confirm("¿Eliminar esta imagen? La acción no se puede deshacer.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-hero?id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setImages((prev) => prev.filter((i) => i.id !== id));
      toast("Imagen eliminada.");
    } else {
      toast("Error al eliminar.");
    }
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  function onDragStart(id: number) { setDraggedId(id); }
  function onDragEnd() { setDraggedId(null); setDragOverId(null); }
  function onDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    if (id !== draggedId) setDragOverId(id);
  }

  async function onDrop(targetId: number) {
    if (!draggedId || draggedId === targetId) { onDragEnd(); return; }

    const arr = [...images];
    const fromIdx = arr.findIndex((i) => i.id === draggedId);
    const toIdx = arr.findIndex((i) => i.id === targetId);
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);

    const reordered = arr.map((img, idx) => ({ ...img, order: idx }));
    setImages(reordered);
    onDragEnd();

    // Guardar nuevo orden en BD
    await fetch("/api/admin-hero", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reordered.map(({ id, order }) => ({ id, order }))),
    });
  }

  // ── Upload (modal) ───────────────────────────────────────────────────────
  function openModal() { setIsModal(true); setFile(null); setPreview(null); setAltText(""); setUploadErr(""); }
  function closeModal() { setIsModal(false); if (fileInputRef.current) fileInputRef.current.value = ""; }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadErr("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", altText);
    fd.append("order", String(images.length));

    const res = await fetch("/api/admin-hero", { method: "POST", body: fd });
    const data = await res.json();

    if (res.ok) {
      setImages((prev) => [...prev, data.image]);
      closeModal();
      toast("Imagen subida correctamente.");
    } else {
      setUploadErr(data.error ?? "Error al subir la imagen.");
    }
    setUploading(false);
  }

  return (
    <div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-6 right-6 z-50 px-5 py-3.5 bg-[#1E1810] border border-[#a66d03]/40 text-[#f5e6cc] text-sm font-semibold rounded-xl shadow-2xl"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.25em] mb-2">Panel de administración</p>
          <h1 className="text-4xl font-black uppercase text-[#f5e6cc] tracking-wide">Imágenes de portada</h1>
          <p className="text-white/35 text-base mt-1">
            {images.length} imagen{images.length !== 1 ? "es" : ""} · Arrastrá para reordenar
          </p>
        </div>
        <button
          onClick={openModal}
          className="px-7 py-3.5 btn-gold text-white text-sm font-bold uppercase tracking-widest rounded-full flex items-center gap-2"
        >
          <Upload size={15} strokeWidth={2.5} />
          Nueva imagen
        </button>
      </div>

      {/* ── Lista de imágenes ───────────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">

        {/* Cabecera */}
        <div className="grid grid-cols-[32px_120px_1fr_100px_60px] gap-6 items-center px-6 py-4 border-b border-white/6">
          <span />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 text-center">Imagen</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">Descripción</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 text-center">Estado</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 text-center">Borrar</p>
        </div>

        {images.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-white/25 text-lg font-semibold">No hay imágenes cargadas todavía.</p>
            <p className="text-white/15 text-sm mt-2">Subí la primera usando el botón de arriba.</p>
          </div>
        )}

        {images.map((img) => {
          const isDragging = draggedId === img.id;
          const isOver = dragOverId === img.id;

          return (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(img.id)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => onDragOver(e, img.id)}
              onDrop={() => onDrop(img.id)}
              className={`grid grid-cols-[32px_120px_1fr_100px_60px] gap-6 items-center px-6 py-4 border-b border-white/4 last:border-0 transition-all duration-150 ${isDragging ? "opacity-30" : "opacity-100"
                } ${isOver ? "bg-[#a66d03]/10 border-l-2 border-l-[#a66d03]" : "hover:bg-white/3"
                }`}
            >
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors">
                <GripVertical size={18} />
              </div>

              {/* Thumbnail */}
              <div
                className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/8 shrink-0 cursor-pointer group"
                onClick={() => setPreviewImage(img.publicUrl)}
              >
                <Image
                  src={img.publicUrl}
                  alt={img.alt || "Imagen"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">Ver</p>
                </div>
              </div>

              {/* Alt text inline */}
              <input
                defaultValue={img.alt}
                onChange={(e) => setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, alt: e.target.value } : i))}
                onBlur={(e) => saveAlt(img.id, e.target.value)}
                placeholder="Descripción de la imagen..."
                className="bg-transparent text-[#f5e6cc] text-[15px] font-medium placeholder:text-white/20 outline-none border-b border-transparent focus:border-white/20 transition-colors py-1 w-full"
              />

              {/* Toggle activo / inactivo */}
              <div className="flex flex-col items-center justify-center gap-1.5 h-full">
                <button
                  onClick={() => toggleActive(img.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${img.active ? "bg-[#a66d03]" : "bg-white/12"
                    }`}
                  title={img.active ? "Activa — click para desactivar" : "Inactiva — click para activar"}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${img.active ? "left-[22px]" : "left-0.5"
                    }`} />
                </button>
                <p className={`text-[10px] font-bold uppercase tracking-wide ${img.active ? "text-[#a66d03]" : "text-white/25"
                  }`}>
                  {img.active ? "Activa" : "Inactiva"}
                </p>
              </div>

              {/* Eliminar */}
              <div className="flex justify-center h-full items-center">
                <button
                  onClick={() => deleteImage(img.id)}
                  disabled={deletingId === img.id}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-40"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal de Vista Previa de Imagen ────────────────────────────── */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 cursor-default"
            >
              <Image
                src={previewImage}
                alt="Vista Previa"
                fill
                className="object-contain bg-black"
                unoptimized
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                title="Cerrar vista previa"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal para nueva imagen ─────────────────────────────────────── */}
      <AnimatePresence>
        {isModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#1E1810] border border-[#a66d03]/25 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header del modal */}
              <div className="px-7 py-6 border-b border-white/6 flex items-center justify-between">
                <div>
                  <p className="text-[#a66d03] text-[10px] font-bold uppercase tracking-[0.25em] mb-0.5">Nueva imagen</p>
                  <h2 className="text-xl font-black uppercase text-[#f5e6cc] tracking-wide">Subir imagen de portada</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cuerpo del modal */}
              <form onSubmit={handleUpload} className="px-7 py-7 space-y-6">

                {/* Zona de archivo */}
                <div>
                  <p className="text-xs font-bold text-white/35 uppercase tracking-[0.18em] mb-3">
                    Archivo <span className="text-red-400">*</span>
                  </p>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-white/12 hover:border-[#a66d03]/40 transition-colors overflow-hidden"
                  >
                    {preview ? (
                      <div className="relative w-full aspect-video">
                        <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-bold">Cambiar imagen</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <Upload size={28} className="mx-auto text-white/20 mb-3" />
                        <p className="text-[#f5e6cc]/50 text-sm font-semibold">Hacé clic para seleccionar</p>
                        <p className="text-white/20 text-xs mt-1">JPG, PNG, WEBP · Recomendado 1920×1080</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                    required
                  />
                  {file && (
                    <p className="text-[#a66d03] text-xs font-semibold mt-2">{file.name}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <p className="text-xs font-bold text-white/35 uppercase tracking-[0.18em] mb-3">Título / descripción</p>
                  <input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Ej: Vista panorámica de París"
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-5 py-3.5 text-[#f5e6cc] text-base placeholder:text-white/25 outline-none focus:border-[#a66d03]/50 transition-colors"
                  />
                </div>

                {uploadErr && (
                  <p className="text-red-400 text-sm font-semibold">{uploadErr}</p>
                )}

                {/* Acciones */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={!file || uploading}
                    className="flex-1 py-4 btn-gold text-white text-sm font-bold uppercase tracking-widest rounded-full disabled:opacity-50"
                  >
                    {uploading ? "Subiendo..." : "Subir imagen"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-7 py-4 border border-white/12 text-white/45 text-sm font-bold uppercase tracking-widest rounded-full hover:border-white/25 hover:text-white/65 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
