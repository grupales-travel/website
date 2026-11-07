import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, OFFICES } from "@/data/company";

export default function Footer() {
  return (
    <footer className="bg-[#1f242c] text-white relative border-t border-[#ba8728]/30">
      {/* Top border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#ba8728] to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">

          {/* Col 1 — Marca */}
          <div>
            <Link href="/">
              <Image
                src="/logo-footer.png"
                alt="Grupales Travel"
                width={240}
                height={72}
                className="h-16 w-auto object-contain mb-6"
              />
            </Link>
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-sm font-medium">
              {COMPANY.description}
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <img src="/wp-icon-gold.png" alt="WhatsApp" className="w-9 h-9 object-contain" />
              </a>
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <img src="/ig-icon.png" alt="Instagram" className="w-9 h-9 object-contain" />
              </a>
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <img src="/fb-icon.png" alt="Facebook" className="w-9 h-9 object-contain" />
              </a>
            </div>
          </div>

          {/* Col 2 — Oficinas */}
          <div>
            <h4 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#c59b3f] mb-6 flex items-center gap-2">
              Nuestras Oficinas
            </h4>
            <ul className="flex flex-col gap-7">
              {OFFICES.map((office) => (
                <li key={office.city} className="space-y-1.5">
                  <p className="text-white font-bold text-lg sm:text-xl tracking-wide">{office.city}</p>
                  <a
                    href={`tel:${office.phone.replace(/[\s-]/g, "")}`}
                    className="text-white/75 text-base sm:text-lg font-semibold hover:text-[#ba8728] transition-colors duration-200 flex items-center gap-2.5"
                  >
                    <Phone size={15} className="text-[#ba8728] shrink-0" />
                    {office.phone}
                  </a>
                  {office.address && office.mapsUrl && (
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 text-base sm:text-lg hover:text-[#ba8728] transition-colors duration-200 flex items-center gap-2.5"
                    >
                      <MapPin size={15} className="text-[#ba8728] shrink-0" />
                      {office.address}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Links + contacto */}
          <div>
            <h4 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#c59b3f] mb-6">
              Información
            </h4>
            <ul className="flex flex-col gap-3.5 mb-8">
              {[
                { label: "Inicio", href: "/" },
                { label: "Quiénes Somos", href: "/quienes-somos" },
                { label: "Nuestro Equipo", href: "/nuestro-equipo" },
                { label: "Beneficios", href: "/ventajas" },
                { label: "Contacto", href: "/contactanos" },
                { label: "Salidas Grupales", href: "/salidas" },
                { label: "Bases Sorteo Primavera", href: "/bases-concurso-primavera-circuito-dulce-francia.pdf" },
                { label: "Condiciones Generales", href: "/condiciones-generales.pdf" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                    rel={link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                    className="text-lg sm:text-[19px] font-semibold text-white/75 hover:text-[#ba8728] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-2.5 text-lg sm:text-xl font-bold text-white/85 hover:text-[#ba8728] transition-colors duration-200"
            >
              <Mail size={18} className="text-[#ba8728]" />
              {COMPANY.email}
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-sm sm:text-base font-medium text-center sm:text-left">
            © {new Date().getFullYear()} Grupales Travel. Todos los derechos reservados.
          </p>
          <p className="text-white/60 text-sm sm:text-base font-semibold text-center sm:text-right">
            Agencia de Viajes y Turismo · Legajo {COMPANY.license} · Desde {COMPANY.founded}
          </p>
        </div>
      </div>
    </footer>
  );
}
