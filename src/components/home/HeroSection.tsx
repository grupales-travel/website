"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Compass } from "lucide-react";
import { COMPANY } from "@/data/company";
import { type HeroImageResolved } from "@/lib/supabase";

const WORDS = ["VIAJAR", "POR EL MUNDO", "EN GRUPO", "ES MEJOR"];

const FALLBACK: HeroImageResolved = {
  id: 0,
  storage_path: "",
  publicUrl:
    "https://grupalestravel.com.ar/wp-content/uploads/2024/11/alma-europea-q2jelpfed7gmkgrwmkmavjweh1waz3cmq833kz0cm0.jpg",
  alt: "Grupales Travel",
  order: 0,
  active: true,
  created_at: "",
};

export default function HeroSection({ initialImages = [] }: { initialImages?: HeroImageResolved[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Si el servidor falla al darnos imágenes, usamos el FALLBACK de seguridad
  const [images] = useState<HeroImageResolved[]>(
    initialImages.length > 0 ? initialImages : [FALLBACK]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Solo un useTransform liviano: fade de opacidad al hacer scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Slideshow automático
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % images.length),
      6000
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[680px] overflow-hidden bg-[#1E1810]"
    >
      {/* ── Fondo estático + crossfade GPU ── */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="absolute inset-0"
            style={{ willChange: "opacity" }}
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={{ opacity: i === currentIndex ? 1 : 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <Image
              src={img.publicUrl}
              alt={img.alt || "Grupales Travel Hero"}
              fill
              priority={i === 0}
              unoptimized
              className="object-cover object-center"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxRTE4MTAiLz48L3N2Zz4="
            />
          </motion.div>
        ))}

        {/* Overlays — siempre visibles, no animados */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1810]/60 via-transparent to-transparent" />
      </div>

      {/* Grain — archivo estático cacheado */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: "url('/grain.svg')" }}
      />

      {/* Gold accent línea vertical */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#a66d03] to-transparent opacity-60 z-20" />

      {/* Dots indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-10 right-8 z-30 flex flex-col gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Imagen ${i + 1}`}
              className={`w-1.5 rounded-full transition-all duration-500 ${i === currentIndex
                ? "h-6 bg-[#a66d03]"
                : "h-1.5 bg-white/30 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      )}

      {/* ── Contenido — fade-out al hacer scroll (solo opacity, no y) ── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 h-full flex flex-col justify-center px-6 max-w-7xl mx-auto pt-20 md:pt-28"
      >
        <div className="max-w-3xl">

          {/* Headline — animaciones rápidas para que aparezca inmediatamente */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.88] tracking-tight mb-4 md:mb-5">
            {WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,          // 0, 0.07, 0.14, 0.21s — aparece muy rápido
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="block text-white"
              >
                {i === 3 ? (
                  <span className="text-gold-gradient">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/65 text-base sm:text-xl md:text-2xl leading-tight max-w-xl mb-5 md:mb-6 font-light"
          >
            Coordinadores desde Argentina · Vuelos incluidos · Excursiones en español.
            Descubrí el mundo sin preocuparte por nada.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              href="#destinos"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full btn-gold text-white text-sm font-bold uppercase tracking-widest"
            >
              <Compass size={16} />
              Explorar Destinos
            </motion.a>

            <motion.a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-transparent text-white text-sm font-bold uppercase tracking-widest border border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              <img src="/wp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
              Hablar con un Asesor
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4 sm:gap-8 mt-6 md:mt-8 flex-wrap"
          >
            {[
              { value: "+500", label: "Viajeros" },
              { value: "+23", label: "Destinos" },
              { value: "+8", label: "Años" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-black text-[#f5e6cc]/80 leading-none">
                  {stat.value}
                </span>
                <span className="text-white/35 text-sm uppercase tracking-widest mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
            <div className="h-8 w-px bg-white/15 mx-2 hidden sm:block" />
            <div className="hidden sm:flex flex-col">
              <span className="text-white/40 text-xs uppercase tracking-widest">Legajo</span>
              <span className="text-white/60 text-sm font-semibold mt-1">EVyT 19182</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} className="text-[#a66d03]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
