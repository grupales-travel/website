"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import {
  CheckCircle, MapPin, FileText, X, Maximize2,
  ChevronLeft, ChevronRight, Volume2, VolumeX, ChevronDown,
} from "lucide-react";
import { Destination } from "@/types";

// ─── Helpers de video ────────────────────────────────────────────────────────

function getVideoEmbed(url: string) {
  if (url.includes("instagram.com")) {
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");
    return { type: "instagram", embedUrl: `${cleanUrl}/embed` };
  }
  const ytMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&?]+)/);
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?mute=0&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&fs=1`,
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
  const embed = getVideoEmbed(url);

  const ytCommand = (func: string, args: any[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  const handleTogglePlay = () => {
    if (embed.type === "youtube") return;
    if (!isActive) {
      setIsActive(true); setIsPlaying(true); setIsMuted(false);
      if (embed.type === "video" && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play();
      }
    } else {
      setIsPlaying(!isPlaying);
      if (embed.type === "video" && videoRef.current) {
        isPlaying ? videoRef.current.pause() : videoRef.current.play();
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
      className="flex-shrink-0 w-28 sm:w-44 md:w-72 aspect-[9/16] rounded-2xl overflow-hidden snap-start bg-[#1E1810] shadow-md relative group/card cursor-pointer"
      onClick={handleTogglePlay}
    >
      <div className="absolute inset-0 overflow-hidden">
        {embed.type === "video" ? (
          <video ref={videoRef} src={url} className="w-full h-full object-cover" preload="metadata" playsInline muted={isMuted} loop />
        ) : embed.type === "youtube" ? (
          <div className="absolute inset-0 z-10">
            <iframe ref={iframeRef} src={embed.embedUrl} className="w-full h-full" style={{ border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullScreen loading="lazy" tabIndex={-1} />
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
        <button onClick={handleExpand} className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-[#a66d03] text-white/90 hover:text-white">
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
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showAllIncludes, setShowAllIncludes] = useState(false);
  const videoScrollRef = useRef<HTMLDivElement>(null);

  // Map zoom/pan — motion values para performance sin re-renders
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(1);
  const mapScaleRef = useRef(1);
  const mapModalRef = useRef<HTMLDivElement>(null);
  const isDraggingMap = useRef(false);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchRef = useRef<number | null>(null);

  // Sync scale ref
  useEffect(() => {
    const unsub = mapScale.on("change", v => { mapScaleRef.current = v; });
    return unsub;
  }, [mapScale]);

  // Opening animation — pan lento desde posición offset
  useEffect(() => {
    if (isMapOpen) {
      mapX.set(-60); mapY.set(40); mapScale.set(1.5);
      mapScaleRef.current = 1.5;
      const t = setTimeout(() => {
        animate(mapX, 0, { duration: 2, ease: [0.25, 0.1, 0.25, 1] });
        animate(mapY, 0, { duration: 2, ease: [0.25, 0.1, 0.25, 1] });
        animate(mapScale, 1, { duration: 2, ease: [0.25, 0.1, 0.25, 1] });
      }, 50);
      return () => clearTimeout(t);
    } else {
      mapX.set(0); mapY.set(0); mapScale.set(1);
      mapScaleRef.current = 1;
    }
  }, [isMapOpen]);

  // Wheel zoom (non-passive)
  useEffect(() => {
    const el = mapModalRef.current;
    if (!el || !isMapOpen) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const newScale = Math.min(5, Math.max(0.2, mapScaleRef.current * (1 - e.deltaY * 0.002)));
      mapScale.set(newScale);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [isMapOpen]);

  // Touch zoom/pan (non-passive for pinch)
  useEffect(() => {
    const el = mapModalRef.current;
    if (!el || !isMapOpen) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastPinchRef.current = null;
      } else if (e.touches.length === 2) {
        lastPinchRef.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        lastTouchRef.current = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && lastTouchRef.current) {
        mapX.set(mapX.get() + e.touches[0].clientX - lastTouchRef.current.x);
        mapY.set(mapY.get() + e.touches[0].clientY - lastTouchRef.current.y);
        lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && lastPinchRef.current !== null) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const newScale = Math.min(5, Math.max(0.2, mapScaleRef.current * (dist / lastPinchRef.current)));
        mapScale.set(newScale);
        lastPinchRef.current = dist;
      }
    };

    const onTouchEnd = () => { lastTouchRef.current = null; lastPinchRef.current = null; };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMapOpen]);

  function scrollVideos(dir: "left" | "right") {
    videoScrollRef.current?.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }

  const includes = destination.includes ?? [];
  const itineraryDays = destination.itineraryDays ?? [];
  const INCLUDES_PREVIEW = 5;
  const visibleIncludes = showAllIncludes ? includes : includes.slice(0, INCLUDES_PREVIEW);

  function closeMap() {
    setIsMapOpen(false);
  }

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
              <h2 className="text-4xl md:text-5xl font-black uppercase text-[#5c3317] leading-[1.0] mb-6">
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
                  className="rounded-2xl overflow-hidden border border-[#a66d03]/20 bg-[#f5e6cc]/20 relative aspect-[4/3] group cursor-pointer shadow-sm"
                  onClick={() => setIsMapOpen(true)}
                >
                  <Image
                    src={destination.mapImageUrl}
                    alt={`Mapa del recorrido ${destination.title}`}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[92vh] aspect-[9/16] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:bg-[#a66d03] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              {getVideoEmbed(activeVideo).type === "video" ? (
                <video src={activeVideo} className="w-full h-full object-contain bg-black" controls playsInline />
              ) : getVideoEmbed(activeVideo).type === "youtube" ? (
                <iframe
                  src={getVideoEmbed(activeVideo).embedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                />
              ) : (
                <iframe
                  src={getVideoEmbed(activeVideo).embedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal de mapa — pantalla completa con zoom/pan ─────────────────── */}
      <AnimatePresence>
        {isMapOpen && destination.mapImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
            style={{ height: "100dvh" }}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeMap}
              className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#a66d03] transition-colors duration-200"
            >
              <X size={20} />
            </button>

            {/* Hint zoom */}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/40 text-xs uppercase tracking-widest pointer-events-none select-none">
              Pellizca para hacer zoom · Arrastrá para mover
            </p>

            {/* Zona interactiva */}
            <div
              ref={mapModalRef}
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => { isDraggingMap.current = true; lastMouseRef.current = { x: e.clientX, y: e.clientY }; }}
              onMouseMove={(e) => {
                if (!isDraggingMap.current || !lastMouseRef.current) return;
                mapX.set(mapX.get() + e.clientX - lastMouseRef.current.x);
                mapY.set(mapY.get() + e.clientY - lastMouseRef.current.y);
                lastMouseRef.current = { x: e.clientX, y: e.clientY };
              }}
              onMouseUp={() => { isDraggingMap.current = false; }}
              onMouseLeave={() => { isDraggingMap.current = false; }}
            >
              <motion.div
                style={{ x: mapX, y: mapY, scale: mapScale, originX: "50%", originY: "50%" }}
                className="relative flex items-center justify-center"
              >
                <img
                  src={destination.mapImageUrl}
                  alt={`Mapa del recorrido ${destination.title}`}
                  className="max-w-[95vw] max-h-[95dvh] object-contain pointer-events-none"
                  draggable={false}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
