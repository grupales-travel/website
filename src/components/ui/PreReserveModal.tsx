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

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

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
      provincia: "",
      diaNac: "",
      mesNac: "",
      anioNac: "",
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
          newArr.push({ nombre: "", apellido: "", dni: "", provincia: "", diaNac: "", mesNac: "", anioNac: "" });
        }
      } else if (count < prev.length) {
        return newArr.slice(0, count);
      }
      return newArr;
    });
  }, [contactForm.cantidadPasajeros]);

  if (!mounted) return null;

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    let { name, value } = e.target;
    // Solo permitir números y símbolo + en teléfono
    if (name === "telefono") {
      value = value.replace(/[^\d+]/g, "");
    }
    setContactForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePassengerChange(index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    let { name, value } = e.target;
    // Solo permitir números en DNI
    if (name === "dni") {
      value = value.replace(/\D/g, "");
    }
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

    const formattedPassengers = passengers.map(p => ({
      ...p,
      fechaNacimiento: `${p.diaNac}/${p.mesNac}/${p.anioNac}`
    }));

    // Formatear un bloque de texto resumen para enviar al webhook de forma "sistematizada"
    const resumenTexto = `
📍 Destino: ${destination.title}
📧 Email de contacto: ${contactForm.email}
📱 WhatsApp / Teléfono: ${contactForm.telefono}
👥 Cantidad de pasajeros: ${contactForm.cantidadPasajeros}

--- PASAJEROS ---
${formattedPassengers.map((p, i) => `
Pasajero ${i + 1}:
Nombre y Apellido: ${p.nombre} ${p.apellido}
DNI: ${p.dni}
Provincia: ${p.provincia}
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
          pasajeros: formattedPassengers,
          resumenTexto: resumenTexto
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
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px] bg-white border border-[#a66d03]/30 rounded-2xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header decorativo */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a66d03] via-[#d9bf8f] to-[#a66d03]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(166,109,3,0.05),transparent)] pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-5 right-4 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-800 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-8 relative z-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#a66d03]/20 flex items-center justify-center text-[#a66d03] mb-5">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2 text-[#1E1810]">
                    ¡Pre-reserva recibida!
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Pronto un asesor del equipo se comunicará con vos por correo electrónico o WhatsApp para pasarte todos los detalles, coordinar el pago y asegurar tu lugar.
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full btn-gold text-white text-xs font-black uppercase tracking-widest"
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
                  <div className="mb-6 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#a66d03]/10 border border-[#a66d03]/20 text-[#a66d03] text-[9px] font-bold uppercase tracking-widest mb-3">
                      Paso 1 de 2 · Contacto
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight mb-2 text-[#1E1810]">
                      Pre-reservá <span className="text-[#a66d03]">tu lugar</span>
                    </h3>
                  </div>

                  <form onSubmit={handleNextStep} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                        placeholder="Ej: juan@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                        WhatsApp / Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        value={contactForm.telefono}
                        onChange={handleContactChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                        placeholder="Ej: +54 9 11 1234 5678"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                        Cantidad de pasajeros *
                      </label>
                      <div className="relative">
                        <select
                          name="cantidadPasajeros"
                          value={contactForm.cantidadPasajeros}
                          onChange={handleContactChange}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num} className="bg-white text-gray-900">
                              {num} {num === 1 ? "Pasajero" : "Pasajeros"}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                          <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-full btn-gold text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#a66d03]/25"
                    >
                      Siguiente
                      <ChevronRight size={14} />
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
                  <div className="mb-5 flex items-center gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="w-7 h-7 flex shrink-0 items-center justify-center rounded-full bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-800 transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div>
                      <div className="text-[#a66d03] text-[9px] font-bold uppercase tracking-widest mb-0.5">
                        Paso 2 de 2
                      </div>
                      <h3 className="text-lg font-black uppercase leading-tight text-[#1E1810]">
                        Datos de los pasajeros
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
                      {passengers.map((p, index) => (
                        <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#a66d03] mb-3">
                            Pasajero {index + 1}
                          </h4>
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/50 mb-1 ml-1">
                                  Nombre *
                                </label>
                                <input
                                  type="text"
                                  name="nombre"
                                  required
                                  value={p.nombre}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                                  Apellido *
                                </label>
                                <input
                                  type="text"
                                  name="apellido"
                                  required
                                  value={p.apellido}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                                  DNI / Pasaporte *
                                </label>
                                <input
                                  type="text"
                                  name="dni"
                                  required
                                  value={p.dni}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                                  Provincia *
                                </label>
                                <input
                                  type="text"
                                  name="provincia"
                                  required
                                  value={p.provincia}
                                  onChange={(e) => handlePassengerChange(index, e)}
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-1 ml-1">
                                Fecha de Nacimiento *
                              </label>
                              <div className="grid grid-cols-3 gap-2 relative">
                                {/* DÍA */}
                                <div className="relative">
                                  <select
                                    name="diaNac"
                                    required
                                    value={p.diaNac}
                                    onChange={(e) => handlePassengerChange(index, e)}
                                    className="w-full appearance-none bg-black/20 border border-white/5 rounded-lg pl-3 pr-6 py-2.5 text-xs text-white focus:outline-none focus:border-[#a66d03] focus:bg-white/5 transition-all duration-300"
                                  >
                                    <option value="" disabled>Día</option>
                                    {DAYS.map(d => (
                                      <option key={d} value={d} className="bg-[#1E1810] text-white">{d}</option>
                                    ))}
                                  </select>
                                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-white/40">
                                    <svg width="8" height="5" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>

                                {/* MES */}
                                <div className="relative">
                                  <select
                                    name="mesNac"
                                    required
                                    value={p.mesNac}
                                    onChange={(e) => handlePassengerChange(index, e)}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-6 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                                  >
                                    <option value="" disabled>Mes</option>
                                    {MONTHS.map((m, i) => (
                                      <option key={i} value={i + 1} className="bg-white text-gray-900">{m}</option>
                                    ))}
                                  </select>
                                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500">
                                    <svg width="8" height="5" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>

                                {/* AÑO */}
                                <div className="relative">
                                  <select
                                    name="anioNac"
                                    required
                                    value={p.anioNac}
                                    onChange={(e) => handlePassengerChange(index, e)}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-6 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#a66d03] focus:ring-1 focus:ring-[#a66d03] transition-all duration-300 shadow-sm"
                                  >
                                    <option value="" disabled>Año</option>
                                    {YEARS.map(y => (
                                      <option key={y} value={y} className="bg-white text-gray-900">{y}</option>
                                    ))}
                                  </select>
                                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500">
                                    <svg width="8" height="5" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>
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
                      className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-full btn-gold text-white text-xs font-black uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#a66d03]/25"
                    >
                      {sending ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
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
