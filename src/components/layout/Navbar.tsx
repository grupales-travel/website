"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/data/company";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Salidas Grupales", href: "/salidas" },
  { label: "Beneficios", href: "/ventajas" },
  { label: "Contacto", href: "/contactanos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#1E1810]/95 backdrop-blur-md border-b border-[#a66d03]/30 py-2"
            : "bg-transparent py-3"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Image
                src="/logo-navbar.png"
                alt="Grupales Travel"
                width={440}
                height={132}
                className="h-8 md:h-11 w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-full text-base font-bold tracking-widest uppercase transition-all duration-200 text-white/85 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — social + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition-opacity duration-200"
              >
                <img src="/ig-icon.png" alt="Instagram" className="w-7 h-7 object-contain" />
              </a>
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition-opacity duration-200"
              >
                <img src="/fb-icon.png" alt="Facebook" className="w-7 h-7 object-contain" />
              </a>
            </div>
            <motion.a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-full btn-gold text-white text-xs font-bold uppercase tracking-widest"
            >
              <img src="/wp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
              Consultar
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors duration-200"
            aria-label="Menú"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-[#1E1810]"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#a66d03] via-[#bf8b2a] to-[#a66d03]" />
            <div className="flex-1 flex flex-col justify-center px-8 py-20">
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-3xl font-black text-white/90 hover:text-[#d9bf8f] uppercase tracking-tight transition-colors duration-200 block py-1"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-12 flex flex-col gap-4"
              >
                <a
                  href={COMPANY.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full btn-gold text-white font-bold text-sm uppercase tracking-widest"
                >
                  <img src="/wp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                  Consultar por WhatsApp
                </a>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><img src="/ig-icon.png" alt="Instagram" className="w-8 h-8 object-contain" /></a>
                  <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><img src="/fb-icon.png" alt="Facebook" className="w-8 h-8 object-contain" /></a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
