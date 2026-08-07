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

interface HeroImage {
  id: number;
  storage_path: string;
  alt: string;
  order: number;
  active: boolean;
  publicUrl: string;
}

interface HomeTestimonialsProps {
  destinations: Destination[];
  heroImages: HeroImage[];
}

export default function HomeTestimonials({ destinations, heroImages }: HomeTestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoScrollRef = useRef<HTMLDivElement>(null);
  
  // 1. Videos subidos directamente para la Homepage (en hero_images)
  const homeDirectVideos: TestimonialVideo[] = heroImages
    .filter((img) => img.active && (img.storage_path.includes("testimonios-home") || img.storage_path.endsWith(".mp4") || img.storage_path.endsWith(".mov")))
    .map((img) => ({
      url: img.storage_path,
      destinationTitle: img.alt || "Grupales Travel",
      id: `home-${img.id}`,
    }));

  // 2. Videos de destinos destacados (URLs que inician con "featured::")
  const featuredDestVideos: TestimonialVideo[] = destinations
    .filter((d) => d.videoTestimonials && d.videoTestimonials.length > 0)
    .flatMap((d) => 
      d.videoTestimonials!
        .filter((url) => url.startsWith("featured::"))
        .map((url, idx) => ({
          url: url.replace("featured::", ""),
          destinationTitle: d.title,
          id: `dest-${d.id}-${idx}`,
        }))
    );

  // Consolidar y limitar a 15 testimonios en total
  const videos = [...homeDirectVideos, ...featuredDestVideos].slice(0, 15);

  const [volume, setVolume] = useState(0.5);

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
    <section className="py-12 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative">
        {/* Carrusel */}
        <div className="relative">
          <div
            ref={videoScrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center items-center"
          >
            {videos.map((video) => {
              const fullUrl = resolveR2Url(video.url);
              const isCurrentPlaying = isPlaying === video.id;

              return (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-80 max-w-[85vw] aspect-[9/16] rounded-3xl overflow-hidden snap-center bg-zinc-950 shadow-lg relative group/card cursor-pointer border-2 border-[#d9bf8f]/40 hover:border-[#bf8b2a] hover:shadow-[#bf8b2a]/10 transition-all duration-300"
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
                    src={`${fullUrl}#t=0.1`}
                    className="w-full h-full object-cover absolute inset-0 z-0 bg-zinc-900"
                    preload="auto"
                    playsInline
                    loop
                    muted={isMuted}
                    ref={(el) => {
                      if (el) {
                        el.volume = volume;
                        if (isCurrentPlaying) {
                          el.play().catch((err) => {
                            console.log("Play failed, retrying muted", err);
                            // Fallback para Safari y navegadores móviles que bloquean autoplay con audio
                            el.muted = true;
                            setIsMuted(true);
                            el.play().catch(() => {});
                          });
                        } else {
                          el.pause();
                        }
                      }
                    }}
                  />

                  {/* Overlays decorativos */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 z-10 pointer-events-none" />

                  {/* Botón de reproducción cuando está pausado */}
                  {!isCurrentPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-300 group-hover/card:scale-110">
                      <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                        <Play size={28} fill="white" className="ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Etiqueta del destino */}
                  <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none">
                    <span className="inline-block bg-[#a66d03] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1">
                      {video.destinationTitle}
                    </span>
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mt-1">
                      Testimonio Viajero
                    </p>
                  </div>

                  {/* Botones de Control en la tarjeta */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-[#a66d03] hover:text-white transition-all duration-300 shrink-0"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    
                    {/* Control de barra de volumen */}
                    <div 
                      className="flex-1 bg-black/60 backdrop-blur-md h-10 px-3 rounded-full flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVolume(val);
                          if (val > 0) setIsMuted(false);
                          else setIsMuted(true);
                        }}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#a66d03]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Pantalla Completa (Solo si se necesita, pero ya se maneja internamente en la tarjeta con controles) */}
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
              className="relative w-full h-full max-h-[85vh] sm:max-h-[90vh] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border-2 border-[#d9bf8f]"
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
