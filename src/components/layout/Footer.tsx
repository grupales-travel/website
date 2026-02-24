import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, OFFICES } from "@/data/company";

export default function Footer() {
  return (
    <footer className="bg-[#1E1810] text-white relative">
      {/* Gold top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#a66d03] to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Col 1 — Marca */}
          <div>
            <Link href="/">
              <Image
                src="/logo-footer.png"
                alt="Grupales Travel"
                width={220}
                height={66}
                className="h-14 w-auto object-contain mb-5"
              />
            </Link>
            <p className="text-white/55 text-base leading-relaxed mb-6 max-w-xs">
              {COMPANY.description}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity duration-200"
              >
                <img src="/wp-icon-gold.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
              </a>
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity duration-200"
              >
                <img src="/ig-icon.png" alt="Instagram" className="w-8 h-8 object-contain" />
              </a>
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity duration-200"
              >
                <img src="/fb-icon.png" alt="Facebook" className="w-8 h-8 object-contain" />
              </a>
            </div>
          </div>

          {/* Col 2 — Oficinas */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#d9bf8f] mb-6">
              Nuestras Oficinas
            </h4>
            <ul className="flex flex-col gap-6">
              {OFFICES.map((office) => (
                <li key={office.city}>
                  <p className="text-[#f5e6cc]/70 font-semibold text-base mb-1.5">{office.city}</p>
                  <a
                    href={`tel:${office.phone.replace(/[\s-]/g, "")}`}
                    className="text-white/55 text-sm hover:text-[#d9bf8f] transition-colors duration-200 flex items-center gap-2 mb-1"
                  >
                    <Phone size={13} className="text-[#a66d03] shrink-0" />
                    {office.phone}
                  </a>
                  {office.address && office.mapsUrl && (
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/55 text-sm hover:text-[#d9bf8f] transition-colors duration-200 flex items-center gap-2"
                    >
                      <MapPin size={13} className="text-[#a66d03] shrink-0" />
                      {office.address}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Links + contacto */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#d9bf8f] mb-6">
              Información
            </h4>
            <ul className="flex flex-col gap-3 mb-8">
              {[
                { label: "Inicio", href: "/" },
                { label: "Beneficios", href: "/ventajas" },
                { label: "Contacto", href: "/contactanos" },
                { label: "Salidas Grupales", href: "/salidas" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base text-white/55 hover:text-[#d9bf8f] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-2 text-base text-white/55 hover:text-[#d9bf8f] transition-colors duration-200"
            >
              <Mail size={15} className="text-[#a66d03]" />
              {COMPANY.email}
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Grupales Travel. Todos los derechos reservados.
          </p>
          <p className="text-white/30 text-xs text-center sm:text-right">
            Agencia de Viajes y Turismo · Legajo {COMPANY.license} · Desde {COMPANY.founded}
          </p>
        </div>
      </div>
    </footer>
  );
}
