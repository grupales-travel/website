"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2, Play, X } from "lucide-react";
import { Destination } from "@/types";

interface TestimonialVideo {
  url: string;
  destinationTitle: string;
  id: string;
}

interface HomeTestimonialsProps {
  destinations: Destination[];
}

export default function HomeTestimonials({ destinations }: HomeTestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoScrollRef = useRef<HTMLDivElement>(null);
  
  // Compilar los testimonios de video válidos desde todos los destinos activos
  const videos: TestimonialVideo[] = destinations
    .filter((d) => d.videoTestimonials && d.videoTestimonials.length > 0)
    .flatMap((d) => 
      d.videoTestimonials!.map((url, idx) => ({
        url,
        destinationTitle: d.title,
        id: `${d.id}-${idx}`,
      }))
    )
    .slice(0, 15); // Limitar a un máximo de 15 testimonios

  // Lock scroll when video modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeVideo]);

  const scroll = (dir: "left" | "right") => {
    if (videoScrollRef.current) {
      videoScrollRef.current.scrollBy({
        left: dir === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };

  const resolveR2Url = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${url}`;
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 bg-[#FAF7F2] overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(166,109,3,0.04),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#a66d03]" />
              <span className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.3em]">Testimonios</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#5c3317] leading-none">
              Experiencias de <span className="text-[#a66d03]">nuestros viajeros</span>
            </h2>
            <p className="text-[#1E1810]/60 text-sm sm:text-base mt-3 max-w-xl font-light">
              Descubrí los momentos únicos e inolvidables compartidos directamente por quienes ya recorrieron el mundo con nosotros.
            </p>
          </div>

          {/* Flechas de navegación (desktop) */}
          <div className="hidden md:flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full bg-white shadow-md border border-[#a66d03]/10 flex items-center justify-center text-[#a66d03] hover:bg-[#a66d03] hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-white shadow-md border border-[#a66d03]/10 flex items-center justify-center text-[#a66d03] hover:bg-[#a66d03] hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div
            ref={videoScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {videos.map((video) => {
              const fullUrl = resolveR2Url(video.url);
              const isCurrentPlaying = isPlaying === video.id;

              return (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-60 sm:w-64 md:w-72 aspect-[9/16] rounded-3xl overflow-hidden snap-start bg-[#1E1810] shadow-lg relative group/card cursor-pointer border border-[#a66d03]/10 hover:border-[#a66d03]/40 transition-colors duration-300"
                  onClick={() => {
                    if (!isCurrentPlaying) {
                      setIsPlaying(video.id);
                    } else {
                      setIsPlaying(null);
                    }
                  }}
                >
                  {/* Reproductor de Video */}
                  <video
                    src={fullUrl}
                    className="w-full h-full object-cover absolute inset-0 z-0"
                    preload="metadata"
                    playsInline
                    loop
                    muted={true}
                    ref={(el) => {
                      if (el) {
                        if (isCurrentPlaying) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                        }
                      }
                    }}
                  />

                  {/* Overlays decorativos */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />

                  {/* Botón de reproducción cuando está pausado */}
                  {!isCurrentPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-300 group-hover/card:scale-110">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                        <Play size={24} fill="white" className="ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Etiqueta del destino */}
                  <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none">
                    <span className="inline-block bg-[#a66d03]/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1">
                      {video.destinationTitle}
                    </span>
                    <p className="text-white/80 text-xs font-medium font-mono uppercase tracking-widest mt-1">
                      Testimonio Viajero
                    </p>
                  </div>

                  {/* Botón Expandir a pantalla completa */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(null);
                      setActiveVideo(video.url);
                    }}
                    className="absolute top-4 right-4 z-25 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-[#a66d03] hover:text-white transition-all duration-300 opacity-0 group-hover/card:opacity-100"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Pantalla Completa */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-h-[85vh] sm:max-h-[90vh] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border border-[#a66d03]/25"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-[#a66d03] hover:text-white transition-all duration-300 cursor-pointer"
              >
                <X size={18} />
              </button>

              <video
                src={resolveR2Url(activeVideo)}
                className="w-full h-full object-contain"
                controls
                playsInline
                autoPlay
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
