"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Destination } from "@/types";

interface PreReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination;
}

export default function PreReserveModal({ isOpen, onClose, destination }: PreReserveModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // Step 1
  const [contactForm, setContactForm] = useState({
    email: "",
    telefono: "",
    cantidadPasajeros: "1",
  });

  // Step 2
  const [passengers, setPassengers] = useState(
    Array.from({ length: 1 }, () => ({
      nombre: "",
      apellido: "",
      dni: "",
      nacionalidad: "",
      fechaNacimiento: "",
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset form if desired after fully closing
      setTimeout(() => {
        if (!isOpen) {
          setStep(1);
          setSubmitted(false);
        }
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle passenger count change
  useEffect(() => {
    const count = parseInt(contactForm.cantidadPasajeros, 10);
    setPassengers((prev) => {
      const newArr = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          newArr.push({ nombre: "", apellido: "", dni: "", nacionalidad: "", fechaNacimiento: "" });
        }
      } else if (count < prev.length) {
        return newArr.slice(0, count);
      }
      return newArr;
    });
  }, [contactForm.cantidadPasajeros]);

  if (!mounted) return null;

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePassengerChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPassengers((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  }

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    // Formatear un bloque de texto resumen para enviar al webhook de forma "sistematizada"
    const resumenTexto = `
📍 Destino: ${destination.title}
📧 Email de contacto: ${contactForm.email}
📱 WhatsApp / Teléfono: ${contactForm.telefono}
👥 Cantidad de pasajeros: ${contactForm.cantidadPasajeros}

--- PASAJEROS ---
${passengers.map((p, i) => `
Pasajero ${i + 1}:
Nombre y Apellido: ${p.nombre} ${p.apellido}
DNI/Pasaporte: ${p.dni}
Nacionalidad: ${p.nacionalidad}
Fecha de Nacimiento: ${p.fechaNacimiento}
`).join("\n")}
    `.trim();

    try {
      const response = await fetch("https://n8n.grupalestravel.com.ar/webhook/reservas_correo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          destino: destination.title,
          contacto: contactForm,
          pasajeros: passengers,
          resumenTexto: resumenTexto // Campo extra para que puedan pegarlo directamente en el email
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
            className="relative w-full max-w-xl bg-[#1E1810] border border-[#a66d03]/20 rounded-3xl shadow-2xl overflow-hidden my-auto"
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
              ) : step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-8 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#a66d03]/20 border border-[#a66d03]/30 text-[#d9bf8f] text-[10px] font-bold uppercase tracking-widest mb-4">
                      Paso 1 de 2 · Datos de contacto
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-3" style={{ color: "#f5e6cc" }}>
                      Pre-reservá <span className="text-gold-gradient">tu lugar</span>
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Seleccioná para cuántas personas es la reserva de {destination.title}.
                    </p>
                  </div>

                  <form onSubmit={handleNextStep} className="flex flex-col gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleContactChange}
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
                        value={contactForm.telefono}
                        onChange={handleContactChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                        placeholder="Ej: +54 9 11 1234-5678"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                        Cantidad de pasajeros *
                      </label>
                      <div className="relative">
                        <select
                          name="cantidadPasajeros"
                          value={contactForm.cantidadPasajeros}
                          onChange={handleContactChange}
                          className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#a66d03] focus:bg-white/10 transition-all duration-300"
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num} className="bg-[#1E1810] text-white">
                              {num} {num === 1 ? "Pasajero" : "Pasajeros"}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-white/50">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 flex items-center justify-center gap-2.5 w-full py-4 rounded-full btn-gold text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-[#a66d03]/25"
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div>
                      <div className="text-[#d9bf8f] text-[10px] font-bold uppercase tracking-widest mb-0.5">
                        Paso 2 de 2
                      </div>
                      <h3 className="text-xl font-black uppercase leading-tight" style={{ color: "#f5e6cc" }}>
                        Datos de los pasajeros
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
                      {passengers.map((p, index) => (
                        <div key={index} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#d9bf8f] mb-4">
                            Pasajero {index + 1}
                          </h4>
                          <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                                  Nombre *
                                </label>
                                <input
                                  type="text"
                                  name="nombre"
                                  required
                                  value={p.nombre}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                                  Apellido *
                                </label>
                                <input
                                  type="text"
                                  name="apellido"
                                  required
                                  value={p.apellido}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                                DNI / Pasaporte *
                              </label>
                              <input
                                type="text"
                                name="dni"
                                required
                                value={p.dni}
                                onChange={(e) => handlePassengerChange(index, e)}
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                                  Nacionalidad *
                                </label>
                                <input
                                  type="text"
                                  name="nacionalidad"
                                  required
                                  value={p.nacionalidad}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                                  Fecha de Nacimiento *
                                </label>
                                <input
                                  type="date"
                                  name="fechaNacimiento"
                                  required
                                  value={p.fechaNacimiento}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300 [&::-webkit-calendar-picker-indicator]:invert-[0.5]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: sending ? 1 : 1.02 }}
                      whileTap={{ scale: sending ? 1 : 0.98 }}
                      className="mt-2 flex items-center justify-center gap-2.5 w-full py-4 rounded-full btn-gold text-white text-sm font-black uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#a66d03]/25"
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
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
