"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, FileText, X, Maximize2, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Destination } from "@/types";


interface Props {
  destination: Destination;
}

// ─── Helpers de video ────────────────────────────────────────────────────────

function getVideoSrc(url: string): string {
  // Instagram o Facebook → proxy server-side (extrae video sin UI de IG)
  if (/instagram\.com|facebook\.com/.test(url)) {
    return `/api/video-proxy?url=${encodeURIComponent(url)}`;
  }
  // Path de Supabase Storage (no empieza con http)
  if (!url.startsWith("http")) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/destinations/${url}`;
  }
  // URL directa (mp4, mov, etc.)
  return url;
}

function getVideoEmbed(url: string) {
  if (url.includes("instagram.com")) {
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");
    return { type: "instagram", embedUrl: `${cleanUrl}/embed` };
  }

  // Detectar YouTube Shorts o youtu.be
  const ytMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&?]+)/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?mute=0&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&fs=1`
    };
  }

  return { type: "video", embedUrl: url };
}

// ─── Componente Interno: Tarjeta de Video ────────────────────────────────────

function VideoCard({ url, onExpand }: { url: string; onExpand: (u: string) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const embed = getVideoEmbed(url);

  // Comando genérico a YouTube Iframe API
  const ytCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
    }
  };

  const handleTogglePlay = () => {
    if (embed.type === "youtube") return;

    if (!isActive) {
      // Primera interacción: Iniciar desde cero, desmutear y reproducir
      setIsActive(true);
      setIsPlaying(true);
      setIsMuted(false);

      if (embed.type === "youtube") {
        ytCommand('seekTo', [0, true]);
        ytCommand('unMute');
        ytCommand('playVideo');
      } else if (embed.type === "video" && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play();
      }
    } else {
      // Interacciones siguientes: Alternar Play/Pausa
      setIsPlaying(!isPlaying);
      if (embed.type === "youtube") {
        ytCommand(isPlaying ? 'pauseVideo' : 'playVideo');
      } else if (embed.type === "video" && videoRef.current) {
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar play/pause
    setIsMuted(!isMuted);

    if (embed.type === "youtube") {
      ytCommand(!isMuted ? 'mute' : 'unMute');
    } else if (embed.type === "video" && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pausar y mutear (o volver a reset) la tarjeta en linea antes de expandir
    if (isActive) {
      setIsPlaying(false);
      setIsMuted(true);
      if (embed.type === "video" && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
      }
    }

    if (embed.type === "youtube") {
      ytCommand('pauseVideo');
    }

    onExpand(url);
  };

  return (
    <div
      className="flex-shrink-0 w-60 md:w-72 aspect-[9/16] rounded-2xl overflow-hidden snap-start bg-[#1E1810] shadow-md relative group/card cursor-pointer"
      onClick={handleTogglePlay}
    >
      {/* Contenido del video */}
      <div className="absolute inset-0 overflow-hidden">
        {embed.type === "video" ? (
          <video
            ref={videoRef}
            src={url}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            muted={isMuted}
            loop
          />
        ) : embed.type === "youtube" ? (
          <div className="absolute inset-0 z-10">
            <iframe
              ref={iframeRef}
              src={embed.embedUrl}
              className="w-full h-full"
              style={{ border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              loading="lazy"
              tabIndex={-1}
            />
          </div>
        ) : (
          /* Instagram: Iframe recortado */
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ top: "-58px", bottom: "-80px" }}
          >
            <iframe
              src={embed.embedUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
              allow="encrypted-media"
              loading="lazy"
              scrolling="no"
            />
          </div>
        )}
      </div>

      {/* Controles y Overlays cuando Activo (Solo aplicables si no es YouTube puro) */}
      {isActive && embed.type !== "youtube" && (
        <>
          {/* Botón Mute / Unmute */}
          <button
            onClick={handleToggleMute}
            className="absolute bottom-3 left-3 z-20 w-8 h-8 rounded-full bg-black/60 shadow-lg backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-opacity duration-200"
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </>
      )}

      {/* Botón de expandir (Oculto para YouTube puro ya que tienen sus propios controles) */}
      {embed.type !== "youtube" && (
        <button
          onClick={handleExpand}
          className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 shadow-lg backdrop-blur-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-[#a66d03] text-white/90 hover:text-white"
          aria-label="Ver en pantalla completa"
        >
          <Maximize2 size={16} />
        </button>
      )}
    </div>
  );
}

export default function DestinationContent({ destination }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoScrollRef = useRef<HTMLDivElement>(null);

  function scrollVideos(dir: "left" | "right") {
    const el = videoScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }
  const includes = destination.includes ?? [];
  const itineraryDays = destination.itineraryDays ?? [];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* ── Main ─────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-14">

            {/* Descripción */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#a66d03]" />
                <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">
                  Sobre este viaje
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-[#5c3317] leading-[1.0] mb-6">
                ¿Por qué elegir{" "}
                <span className="text-gold-gradient">{destination.title}?</span>
              </h2>
              <p className="text-[#1E1810]/65 text-lg leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Qué incluye */}
            {includes.length > 0 && (
              <div>
                <h3 className="text-2xl font-black uppercase text-[#5c3317] tracking-wide mb-6">
                  Qué incluye
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {includes.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#f5e6cc]/40 border border-[#a66d03]/10"
                    >
                      <CheckCircle size={16} className="text-[#a66d03] flex-shrink-0 mt-0.5" />
                      <span className="text-base text-[#1E1810]/70 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Botón PDF — debajo de Qué incluye */}
                {destination.itineraryPdfUrl && (
                  <div className="mt-6">
                    <a
                      href={destination.itineraryPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full border border-[#a66d03] text-[#a66d03] font-bold text-sm uppercase tracking-widest hover:bg-[#a66d03] hover:text-white transition-all duration-300 group"
                    >
                      <FileText size={16} className="group-hover:text-white transition-colors" />
                      Ver itinerario completo
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Videos del destino — solo si hay videos */}
            {destination.videoTestimonials && destination.videoTestimonials.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10 bg-[#a66d03]" />
                  <span className="text-[#a66d03] text-sm font-bold uppercase tracking-[0.3em]">
                    Videos
                  </span>
                </div>
                <h3 className="text-xl font-bold uppercase text-[#5c3317] tracking-wide mb-4">
                  Descubrí el destino
                </h3>

                {/* Galería deslizable con flechas */}
                <div className="relative group/gallery">
                  <button
                    onClick={() => scrollVideos("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-[#a66d03]/20 flex items-center justify-center text-[#a66d03] opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-[#a66d03] hover:text-white hover:border-[#a66d03]"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>

                  <div
                    ref={videoScrollRef}
                    className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {destination.videoTestimonials.map((url, i) => {
                      const embed = getVideoEmbed(url);
                      return (
                        <VideoCard key={i} url={url} onExpand={setActiveVideo} />
                      );
                    })}
                  </div>

                  <button
                    onClick={() => scrollVideos("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-[#a66d03]/20 flex items-center justify-center text-[#a66d03] opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-[#a66d03] hover:text-white hover:border-[#a66d03]"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}


          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">

              {/* CTA principal */}
              <div>
                <div className="rounded-2xl bg-[#1E1810] p-6 border border-[#a66d03]/20">
                  <p className="text-[#d9bf8f] text-sm font-bold uppercase tracking-widest mb-1">
                    ¿Te interesa?
                  </p>
                  <h3
                    className="text-2xl font-black uppercase leading-tight mb-4"
                    style={{ color: "#f5e6cc" }}
                  >
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
              </div>



              {/* Mapa del recorrido - Sidebar */}
              {destination.mapImageUrl && (
                <div>
                  <div className="rounded-2xl bg-white p-4 border border-[#a66d03]/20 shadow-sm">
                    <p className="text-[#a66d03] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MapPin size={14} /> Mapa del recorrido
                    </p>
                    <div
                      className="rounded-xl overflow-hidden border border-[#a66d03]/10 bg-[#f5e6cc]/20 relative aspect-[4/3] group cursor-pointer"
                      onClick={() => setIsMapOpen(true)}
                    >
                      <Image
                        src={destination.mapImageUrl}
                        alt={`Mapa del recorrido ${destination.title}`}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 300px"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 p-2 rounded-full text-[#a66d03] shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <Maximize2 size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* ── Modal de video ──────────────────────────────────────────────────── */}
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
                <video
                  src={activeVideo}
                  className="w-full h-full object-contain bg-black"
                  controls
                  playsInline
                />
              ) : getVideoEmbed(activeVideo).type === "youtube" ? (
                <iframe
                  src={getVideoEmbed(activeVideo).embedUrl.replace("mute=1", "mute=0").replace("controls=0", "controls=1")}
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

      <AnimatePresence>
        {isMapOpen && destination.mapImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMapOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-[#a66d03]"
            >
              <button
                onClick={() => setIsMapOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#a66d03] transition-colors"
              >
                <X size={20} />
              </button>
              <Image
                src={destination.mapImageUrl}
                alt={`Mapa del recorrido ${destination.title}`}
                fill
                className="object-contain p-4 bg-[#f5e6cc]/10"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
