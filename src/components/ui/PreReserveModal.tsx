"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { Destination } from "@/types";

interface PreReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination;
}

export default function PreReserveModal({ isOpen, onClose, destination }: PreReserveModalProps) {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    pasajeros: "1",
    edades: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("https://n8n.grupalestravel.com.ar/webhook/reservas_correo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          destino: destination.title,
          ...form,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Hubo un error al enviar tu pre-reserva. Por favor intentá nuevamente o escribinos a reservas@grupalestravel.com");
      }
    } catch (error) {
      alert("Hubo un error de conexión. Por favor intentá nuevamente o escribinos a reservas@grupalestravel.com");
    } finally {
      setSending(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#1E1810] border border-[#a66d03]/20 rounded-3xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header decorativo */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a66d03]/60 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(166,109,3,0.15),transparent)] pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-8 sm:p-10 relative z-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-[#a66d03]/20 flex items-center justify-center text-[#a66d03] mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3" style={{ color: "#f5e6cc" }}>
                    ¡Pre-reserva recibida!
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    Recibirás un correo con los detalles en instantes. Pronto un asesor del equipo se pondrá en contacto para coordinar el pago y asegurar tu lugar para {destination.title}.
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-full btn-gold text-white text-sm font-black uppercase tracking-widest"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#a66d03]/20 border border-[#a66d03]/30 text-[#d9bf8f] text-xs font-bold uppercase tracking-widest mb-4">
                      {destination.title}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-3" style={{ color: "#f5e6cc" }}>
                      Pre-reservá <span className="text-gold-gradient">tu lugar</span>
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Dejanos tus datos para asegurar tu lugar sin pagar online. Te contactaremos a la brevedad.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                        placeholder="Ej: juan@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        value={form.telefono}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                        placeholder="Ej: +54 9 11 1234-5678"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                          Pasajeros *
                        </label>
                        <input
                          type="number"
                          name="pasajeros"
                          min="1"
                          required
                          value={form.pasajeros}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                          Edades *
                        </label>
                        <input
                          type="text"
                          name="edades"
                          required
                          value={form.edades}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                          placeholder="Ej: 30, 32"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: sending ? 1 : 1.02 }}
                      whileTap={{ scale: sending ? 1 : 0.98 }}
                      className="mt-4 flex items-center justify-center gap-2.5 w-full py-4 rounded-full btn-gold text-white text-sm font-black uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#a66d03]/25"
                    >
                      {sending ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Confirmar Pre-Reserva
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
