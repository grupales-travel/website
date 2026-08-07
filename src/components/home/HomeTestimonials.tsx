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
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center items-center"
          >
            {videos.map((video) => {
              const fullUrl = resolveR2Url(video.url);
              const isCurrentPlaying = isPlaying === video.id;

              return (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-80 max-w-[85vw] aspect-[9/16] rounded-3xl overflow-hidden snap-center bg-black shadow-lg relative group/card cursor-pointer border border-[#a66d03]/30 hover:border-[#a66d03] transition-all duration-300"
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
                    muted={isMuted}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35 z-10 pointer-events-none" />

                  {/* Botón de reproducción cuando está pausado */}
                  {!isCurrentPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-300 group-hover/card:scale-110">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
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
                  <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-[#a66d03] hover:text-white transition-all duration-300"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(null);
                        setActiveVideo(video.url);
                      }}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-[#a66d03] hover:text-white transition-all duration-300"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
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
              className="relative w-full h-full max-h-[85vh] sm:max-h-[90vh] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border border-[#a66d03]"
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
