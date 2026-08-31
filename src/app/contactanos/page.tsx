"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { COMPANY, OFFICES } from "@/data/company";
import { motion } from "framer-motion";
import { Phone, MapPin, Send, CheckCircle, Navigation } from "lucide-react";

export default function ContactanosPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/ventas@grupalestravel.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Nombre: form.name,
          Teléfono: form.phone,
          Email: form.email,
          Mensaje: form.message,
          _subject: `Nueva Consulta Web de ${form.name}`,
          _template: "table"
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Hubo un error al enviar tu consulta. Por favor escribinos por correo directo a ventas@grupalestravel.com");
      }
    } catch (error) {
      alert("Hubo un error de conexión. Por favor intentá nuevamente o escribinos a ventas@grupalestravel.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />
      <main>

        {/* Hero compacto */}
        <section className="relative pt-24 pb-10 px-6 bg-[#1E1810] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(219,88,53,0.18),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#db5835]/50 to-transparent" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-[#72500c]" />
              <span className="text-[#db5835] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Estamos para ayudarte
              </span>
              <div className="h-px w-10 bg-[#72500c]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black uppercase leading-tight text-white"
            >
              Hablemos de <span className="text-[#db5835]">tu próximo viaje</span>
            </motion.h1>
          </div>
        </section>

        {/* Banner flotante — sin fondo */}
        <div className="relative z-10 flex justify-center -mt-3 sm:-mt-[18px] -mb-3 sm:-mb-[18px] px-6">
          <Image
            src="/iconos-beneficios.png"
            alt="Beneficios incluidos en cada viaje"
            width={220}
            height={40}
            className="h-6 sm:h-9 w-auto object-contain block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Main content */}
        <section className="pt-16 pb-16 px-6 bg-[#fafaf8]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

            {/* Form — 3 cols */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <h2 className="text-3xl font-black uppercase mb-8 leading-tight text-[#72500c]">
                  Envianos una <span className="text-[#db5835]">consulta</span>
                </h2>
              </AnimatedSection>

              {submitted ? (
                <AnimatedSection direction="up">
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#db5835]/10 flex items-center justify-center text-[#db5835] mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black uppercase text-[#1E1810] mb-3">
                      ¡Consulta recibida!
                    </h3>
                    <p className="text-[#1E1810]/55 text-sm max-w-sm leading-relaxed">
                      Gracias por escribirnos. Nos pondremos en contacto en menos de 24 horas.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                      className="mt-8 text-[#db5835] text-sm font-bold uppercase tracking-widest hover:underline"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                </AnimatedSection>
              ) : (
                <AnimatedSection delay={0.1}>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-[0.15em] text-[#db5835] mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Juan García"
                          className="w-full bg-white border border-[#1E1810]/10 rounded-2xl px-5 py-4 text-[#1E1810] text-base placeholder:text-[#1E1810]/25 focus:outline-none focus:border-[#db5835] focus:shadow-[0_0_0_3px_rgba(219,88,53,0.08)] transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-[0.15em] text-[#db5835] mb-2">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          placeholder="+54 9 266 000-0000"
                          className="w-full bg-white border border-[#1E1810]/10 rounded-2xl px-5 py-4 text-[#1E1810] text-base placeholder:text-[#1E1810]/25 focus:outline-none focus:border-[#db5835] focus:shadow-[0_0_0_3px_rgba(219,88,53,0.08)] transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.15em] text-[#db5835] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="juan@ejemplo.com"
                        className="w-full bg-white border border-[#1E1810]/10 rounded-2xl px-5 py-4 text-[#1E1810] text-base placeholder:text-[#1E1810]/25 focus:outline-none focus:border-[#db5835] focus:shadow-[0_0_0_3px_rgba(219,88,53,0.08)] transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.15em] text-[#db5835] mb-2">
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Contanos adónde querés ir, cuántas personas viajan, fechas tentativas..."
                        className="w-full bg-white border border-[#1E1810]/10 rounded-2xl px-5 py-4 text-[#1E1810] text-base placeholder:text-[#1E1810]/25 focus:outline-none focus:border-[#db5835] focus:shadow-[0_0_0_3px_rgba(219,88,53,0.08)] transition-all duration-300 resize-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: sending ? 1 : 1.03 }}
                      whileTap={{ scale: sending ? 1 : 0.97 }}
                      className="self-start flex items-center gap-2.5 px-10 py-4 rounded-full btn-gold text-white text-sm font-black uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#db5835]/25"
                    >
                      {sending ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Enviar consulta
                        </>
                      )}
                    </motion.button>
                  </form>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar — 2 cols — panel tarjetas Naranja #db5835 */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-[#72500c] p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(219,88,53,0.25),transparent)] pointer-events-none" />

                {OFFICES.map((office) => (
                  <div key={office.city} className="relative z-10 rounded-2xl bg-[#db5835] p-5 flex flex-col gap-3 text-white shadow-md">

                      <h3 className="text-lg font-black uppercase tracking-wide text-center text-white">
                        {office.city}
                      </h3>

                      <a href={`tel:${office.phone.replace(/[\s-]/g, "")}`} className="group flex items-center gap-3 hover:opacity-90">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Phone size={13} className="text-white" />
                        </div>
                        <span className="text-white font-bold text-sm">
                          {office.phone}
                        </span>
                      </a>

                      {office.address && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <MapPin size={13} className="text-white" />
                          </div>
                          <span className="text-white/95 text-sm font-semibold">{office.address}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-white/20">
                        {office.whatsapp && (
                          <a
                            href={office.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-[#db5835] text-xs font-black uppercase tracking-wider hover:bg-white/90 transition-all duration-200"
                          >
                            <img src="/wp-icon.png" alt="WhatsApp" className="w-3.5 h-3.5 object-contain" />
                            WhatsApp
                          </a>
                        )}
                        {office.mapsUrl && (
                          <a
                            href={office.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/30 transition-all duration-200"
                          >
                            <Navigation size={12} />
                            Mapa
                          </a>
                        )}
                      </div>
                    </div>
                ))}

              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
