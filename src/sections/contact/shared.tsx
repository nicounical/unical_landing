import { useState, type ComponentType, type SVGProps } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Pause, Phone, Play } from "lucide-react";
import { contact, cta, gallery, hero, sectors, services } from "@/content/site";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

export const ContactMeta = ({ className = "" }: { className?: string }) => (
  <div className={`ctm ${className}`}>
    <a href={contact.phoneHref}>{contact.phone}</a>
    <a href={`mailto:${contact.email}`}>{contact.email}</a>
    <span>{contact.address}</span>
  </div>
);

export const CtaTitle = ({ className = "" }: { className?: string }) => (
  <h2 className={className}><span className="u-hollow">{cta.titleHollow}</span><br />{cta.titleSolid}</h2>
);

/* ---------- Utilidades comunes a las variantes ---------- */
export const useFull = () => fullMotion();
export const EYEBROW = cta.eyebrow;
export const TEXT = cta.text;
export const pad = (n: number) => String(n).padStart(2, "0");

/** Eyebrow con raya (mismo patrón que el resto de secciones). */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Número de WhatsApp legible, sacado del propio enlace de site.ts (wa.me/34XXXXXXXXX). */
const waDigits = (contact.whatsapp.match(/wa\.me\/34(\d{9})/) ?? [])[1] ?? "";
export const WA_NUMBER = waDigits ? `${waDigits.slice(0, 3)} ${waDigits.slice(3, 5)} ${waDigits.slice(5, 7)} ${waDigits.slice(7)}` : "WhatsApp";

type Ico = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }>;
export type Channel = { k: "phone" | "wa" | "mail"; label: string; value: string; href: string; Icon: Ico; external?: boolean };

/** Canales reales: teléfono, WhatsApp y email (site.ts → contact). */
export const CHANNELS: Channel[] = [
  { k: "phone", label: "Teléfono", value: contact.phone, href: contact.phoneHref, Icon: Phone },
  { k: "wa", label: "WhatsApp", value: WA_NUMBER, href: contact.whatsapp, Icon: MessageCircle, external: true },
  { k: "mail", label: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: Mail },
];
export const ADDRESS = { lines: contact.addressFull, short: contact.address, Icon: MapPin };
export { ArrowUpRight };

/** Color actual con transparencia (Tailwind 3 no aplica opacidad a currentColor). */
export const mix = (p: number) => `color-mix(in srgb, currentColor ${p}%, transparent)`;

/** Lista de canales en fila o columna; el color se hereda del contenedor. */
export function Channels({ className = "", itemClass = "", layout = "row" }: { className?: string; itemClass?: string; layout?: "row" | "col" }) {
  return (
    <ul className={cn("flex gap-2", layout === "row" ? "flex-wrap" : "flex-col", className)}>
      {CHANNELS.map(({ k, label, value, href, Icon, external }) => (
        <li key={k}>
          <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn("group inline-flex min-h-[44px] items-center gap-3 rounded-full py-2 pl-2 pr-4 transition-colors", itemClass)}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: mix(10), boxShadow: `inset 0 0 0 1px ${mix(22)}` }} aria-hidden>
              <Icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">{label}</span>
              <span className="block text-[0.92rem] font-medium">{value}</span>
            </span>
            {external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Botón de pausa para animaciones en bucle (marquesinas, shader). */
export function PauseToggle({ paused, onToggle, className = "", label = "animación" }: { paused: boolean; onToggle: () => void; className?: string; label?: string }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={paused}
      style={{ boxShadow: `inset 0 0 0 1px ${mix(35)}` }}
      className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full backdrop-blur transition-opacity hover:opacity-80", className)}>
      {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
      <span className="sr-only">{paused ? `Reanudar ${label}` : `Pausar ${label}`}</span>
    </button>
  );
}

export const usePaused = () => useState(false);

/* ---------- Media real por tipo de proyecto (opciones del formulario → foto de site.ts) ---------- */
const svc = (n: string) => services.items.find((s) => s.n === n)!;
const sector = (name: string) => sectors.items.find((s) => s.name === name)!;
export const OPTION_MEDIA: Record<string, { img: string; alt: string }> = {
  "Impresión gran formato": { img: svc("01").img, alt: svc("01").alt },
  "Rotulación de vehículos": { img: svc("02").img, alt: svc("02").alt },
  "Car wrapping": { img: hero.slides[0], alt: "Lexus con car wrapping de Black Panther" },
  "Stands para ferias": { img: svc("03").img, alt: svc("03").alt },
  "PLV y retail": { img: svc("06").img, alt: svc("06").alt },
  "Señalética y vinilos": { img: sector("Oficinas").img, alt: "Señalética corporativa en oficina" },
  Otro: { img: svc("04").img, alt: svc("04").alt },
};

/** Fotos reales para galerías/marquesinas (con alt descriptivo). */
export const PHOTOS: { src: string; alt: string }[] = [
  ...services.items.map((s) => ({ src: s.img, alt: s.alt })),
  { src: gallery[0], alt: "Lexus con car wrapping de Black Panther" },
  { src: gallery[1], alt: "Túnel de Vodafone ambientado" },
  { src: gallery[2], alt: "Rotulación interior de Five Guys" },
  { src: gallery[4], alt: "Rótulo de neón LCKY" },
  { src: gallery[6], alt: "Proyecto de Disney" },
  { src: gallery[7], alt: "Lanzamiento de coche en evento" },
  { src: gallery[9], alt: "Letras corpóreas de Maher" },
  { src: gallery[16], alt: "Stand de Danone" },
];

/** Estilos del formulario compartido sobre fondo oscuro, acotados a una clase de la variante. */
export const darkFormCss = (c: string, accent = "#99C4E4") => `
.${c} .cf-label{color:rgba(255,255,255,.72)}
.${c} input:not([type=checkbox]):not([type=radio]),.${c} select,.${c} textarea{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);color:#fff;transition:border-color .25s,background .25s}
.${c} input:not([type=checkbox]):not([type=radio]):hover,.${c} select:hover,.${c} textarea:hover{border-color:rgba(255,255,255,.32)}
.${c} input:focus,.${c} select:focus,.${c} textarea:focus{outline-color:${accent};background:rgba(255,255,255,.09)}
.${c} select option{color:#16161F;background:#fff}
.${c} ::placeholder{color:rgba(255,255,255,.38)}
.${c} .cf-check{color:rgba(255,255,255,.72)}
.${c} .cf-check input{accent-color:${accent}}
.${c} .cf-note{color:rgba(255,255,255,.6);opacity:1}
.${c} .cf-ok{background:rgba(153,196,228,.16);color:#fff}
`;
