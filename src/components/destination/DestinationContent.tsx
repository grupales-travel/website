"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, MapPin, FileText, X, Maximize2,
  ChevronLeft, ChevronRight, Volume2, VolumeX, ChevronDown,
} from "lucide-react";
import { Destination } from "@/types";

// ─── Helpers de video ────────────────────────────────────────────────────────

function getVideoEmbed(url: string, isPreview = false) {
  if (url.includes("instagram.com")) {
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");
    return { type: "instagram", embedUrl: `${cleanUrl}/embed` };
  }
  const ytMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&?]+)/);
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];
    if (isPreview) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&fs=1`,
      };
    }
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&fs=1`,
    };
  }
  return { type: "video", embedUrl: url };
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ url, onExpand }: { url: string; onExpand: (u: string) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const embed = getVideoEmbed(url, true);

  const ytCommand = (func: string, args: any[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (!isActive) {
      setIsActive(true); setIsPlaying(true); setIsMuted(false);
      if (embed.type === "video" && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play();
      } else if (embed.type === "youtube") {
        ytCommand("playVideo");
        ytCommand("unMute");
      }
    } else {
      setIsPlaying(!isPlaying);
      if (embed.type === "video" && videoRef.current) {
        isPlaying ? videoRef.current.pause() : videoRef.current.play();
      } else if (embed.type === "youtube") {
        isPlaying ? ytCommand("pauseVideo") : ytCommand("playVideo");
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (embed.type === "video" && videoRef.current) videoRef.current.muted = !isMuted;
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive && embed.type === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
    if (embed.type === "youtube") ytCommand("pauseVideo");
    onExpand(url);
  };

  return (
    <div
      className="flex-shrink-0 w-52 sm:w-56 md:w-72 aspect-[9/16] rounded-2xl overflow-hidden snap-start bg-[#1E1810] shadow-md relative group/card cursor-pointer"
      onClick={embed.type !== "youtube" ? handleTogglePlay : undefined}
    >
      <div className="absolute inset-0 overflow-hidden">
        {embed.type === "video" ? (
          <video ref={videoRef} src={url} className="w-full h-full object-cover" preload="metadata" playsInline muted={isMuted} loop />
        ) : embed.type === "youtube" ? (
          <div className="absolute inset-0 z-10">
            <iframe ref={iframeRef} src={embed.embedUrl} className="w-full h-full" style={{ border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullScreen loading="lazy" />
          </div>
        ) : (
          <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "-58px", bottom: "-80px" }}>
            <iframe src={embed.embedUrl} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen allow="encrypted-media" loading="lazy" scrolling="no" />
          </div>
        )}
      </div>
      {isActive && embed.type !== "youtube" && (
        <button onClick={handleToggleMute} className="absolute bottom-3 left-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white">
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      )}
      {embed.type !== "youtube" && (
        <button 
          onClick={(e) => { e.stopPropagation(); onExpand(url); }} 
          className={`absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-opacity duration-200 hover:bg-[#a66d03] text-white/90 hover:text-white ${isActive ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"}`}
        >
          <Maximize2 size={16} />
        </button>
      )}
    </div>
  );
}

// ─── CTA Card (reutilizable) ─────────────────────────────────────────────────

function CTACard({ destination }: { destination: Destination }) {
  return (
    <div className="rounded-2xl bg-[#1E1810] p-6 border border-[#a66d03]/20">
      <p className="text-[#d9bf8f] text-sm font-bold uppercase tracking-widest mb-1">¿Te interesa?</p>
      <h3 className="text-2xl font-black uppercase leading-tight mb-4" style={{ color: "#f5e6cc" }}>
        Consultá sin compromiso
      </h3>
      <p className="text-white/50 text-base leading-relaxed mb-6">
        Nuestros asesores responden todas tus preguntas sobre fechas, precios y disponibilidad.
      </p>
      <motion.a
        href={destination.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full btn-gold text-white text-sm font-bold uppercase tracking-widest mb-3"
      >
        <img src="/wp-icon.png" alt="WhatsApp" className="w-[15px] h-[15px] object-contain" />
        WhatsApp
      </motion.a>
      <a
        href="/contactanos"
        className="flex items-center justify-center w-full py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold uppercase tracking-widest hover:bg-white/8 hover:text-white transition-all duration-300"
      >
        Formulario de consulta
      </a>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface Props { destination: Destination; }

export default function DestinationContent({ destination }: Props) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  // null = cerrado | "normal" = modal centrado | "expanded" = pantalla completa
  const [mapMode, setMapMode] = useState<null | "normal" | "expanded">(null);
  const [showAllIncludes, setShowAllIncludes] = useState(false);
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeVideo || mapMode === "expanded") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeVideo, mapMode]);

  function scrollVideos(dir: "left" | "right") {
    videoScrollRef.current?.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }

  const includes = destination.includes ?? [];
  const itineraryDays = destination.itineraryDays ?? [];
  const INCLUDES_PREVIEW = 5;
  const visibleIncludes = showAllIncludes ? includes : includes.slice(0, INCLUDES_PREVIEW);

  return (
    <section className="py-10 md:py-16 lg:py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">

          {/* ── Main ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-10 lg:gap-14">

            {/* 1. Descripción */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#a66d03]" />
                <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">Sobre este viaje</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#5c3317] leading-[1.0] mb-6">
                ¿Por qué elegir <span className="text-gold-gradient">{destination.title}?</span>
              </h2>
              <p className="text-[#1E1810]/65 text-lg leading-relaxed">{destination.description}</p>
            </div>

            {/* 2. CTA — solo mobile */}
            <div className="lg:hidden">
              <CTACard destination={destination} />
            </div>

            {/* 3. Qué incluye */}
            {includes.length > 0 && (
              <div>
                <h3 className="text-2xl font-black uppercase text-[#5c3317] tracking-wide mb-6">Qué incluye</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleIncludes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#f5e6cc]/40 border border-[#a66d03]/10">
                      <CheckCircle size={16} className="text-[#a66d03] flex-shrink-0 mt-0.5" />
                      <span className="text-base text-[#1E1810]/70 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                {includes.length > INCLUDES_PREVIEW && (
                  <button
                    onClick={() => setShowAllIncludes(!showAllIncludes)}
                    className="mt-4 flex items-center gap-2 text-[#a66d03] text-sm font-bold uppercase tracking-widest hover:text-[#bf8b2a] transition-colors duration-200 group"
                  >
                    <motion.span animate={{ rotate: showAllIncludes ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                    {showAllIncludes ? "Ver menos" : `Ver ${includes.length - INCLUDES_PREVIEW} más`}
                  </button>
                )}

                {destination.itineraryPdfUrl && (
                  <div className="mt-6">
                    <a
                      href={destination.itineraryPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full border border-[#a66d03] text-[#a66d03] font-bold text-sm uppercase tracking-widest hover:bg-[#a66d03] hover:text-white transition-all duration-300 group"
                    >
                      <FileText size={16} />
                      Ver itinerario completo
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* 4. Mapa */}
            {destination.mapImageUrl && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-10 bg-[#a66d03]" />
                  <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">Mapa del recorrido</span>
                </div>
                <div
                  className="rounded-2xl overflow-hidden border border-[#a66d03]/20 bg-[#f5e6cc]/20 relative aspect-[4/3] group lg:cursor-pointer shadow-sm"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                      setMapMode("expanded");
                    }
                  }}
                >
                  <Image
                    src={destination.mapImageUrl}
                    alt={`Mapa del recorrido ${destination.title}`}
                    fill
                    className="object-contain lg:group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 hidden lg:flex group-hover:bg-black/20 transition-colors duration-300 items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 p-3 rounded-full text-[#a66d03] shadow-lg">
                      <Maximize2 size={22} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Videos */}
            {destination.videoTestimonials && destination.videoTestimonials.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10 bg-[#a66d03]" />
                  <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">Videos</span>
                </div>
                <h3 className="text-xl font-bold uppercase text-[#5c3317] tracking-wide mb-4">Descubrí el destino</h3>
                <div className="relative group/gallery">
                  <button
                    onClick={() => scrollVideos("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-[#a66d03]/20 flex items-center justify-center text-[#a66d03] opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-[#a66d03] hover:text-white"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <div ref={videoScrollRef} className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {destination.videoTestimonials.map((url, i) => (
                      <VideoCard key={i} url={url} onExpand={setActiveVideo} />
                    ))}
                  </div>
                  <button
                    onClick={() => scrollVideos("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-[#a66d03]/20 flex items-center justify-center text-[#a66d03] opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-[#a66d03] hover:text-white"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ── Sidebar — desktop only ────────────────────────── */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <CTACard destination={destination} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Modal de video ─────────────────────────────────────────────────── */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full sm:h-[92vh] sm:aspect-[9/16] sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-4 sm:top-3 sm:right-3 z-[60] w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:bg-[#a66d03] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              {getVideoEmbed(activeVideo, false).type === "video" ? (
                <video src={activeVideo} className="w-full h-full object-contain bg-black" controls playsInline autoPlay />
              ) : getVideoEmbed(activeVideo, false).type === "youtube" ? (
                <iframe
                  src={getVideoEmbed(activeVideo, false).embedUrl}
                  className="w-full h-full border-0 bg-black"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                />
              ) : (
                <iframe
                  src={getVideoEmbed(activeVideo, false).embedUrl}
                  className="w-full h-full border-0 bg-black"
                  allowFullScreen
                  allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      , document.body)}

      {/* ── Modal de mapa ────────────────────────────────────────────────────── */}
      {mounted && createPortal(
        <AnimatePresence>
          {mapMode === "expanded" && destination.mapImageUrl && (
            <motion.div
              key="map-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 sm:p-12"
              style={{ background: "rgba(245,230,204,0.97)", backdropFilter: "blur(8px)" }}
            >
              {/* X cerrar — círculo marrón con X clarita, siempre visible encima de la imagen */}
              <button
                onClick={() => setMapMode(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[100000] w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-opacity duration-200 hover:opacity-80"
                style={{ background: "#5c3317" }}
              >
                <X size={20} color="#f5e6cc" />
              </button>

              <div className="relative w-full h-full max-h-full max-w-6xl flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl bg-white/70 border-2 border-[#a66d03]/40">
                <img
                  src={destination.mapImageUrl}
                  alt={`Mapa del recorrido ${destination.title}`}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </div>
            </motion.div>
        )}
        </AnimatePresence>
      , document.body)}
    </section>
  );
}
