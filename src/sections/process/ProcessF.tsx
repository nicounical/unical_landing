/**
 * PROCESO F · Editorial Kinetic — basado en 21st.dev «Text Reveal Block» (id 19260).
 * Del original se conserva: el texto se parte en líneas; cada línea va en un contenedor `overflow:hidden` de ancho
 * max-content con un bloque de color absoluto (101 % × 101 %) encima; por línea, una timeline GSAP escala el bloque
 * 0 → 1 desde el origen de entrada (power4.inOut), muestra la línea, cambia el origen al de salida y escala 1 → 0,
 * con `delay + index · stagger`; se dispara una sola vez al entrar en pantalla (≈ «top 90%»); tabla DIRECTION_CONFIG
 * (left/right/up/down) y re-partición al cambiar el ancho; con reduced-motion se muestra el texto sin bloques.
 * Adaptación: SplitText (plugin de pago) se sustituye por una partición propia en React: se pintan las palabras, se
 * agrupan por `offsetTop` y se vuelven a pintar como líneas (sin tocar el DOM a mano); ScrollTrigger → Intersection
 * Observer. Las 4 fases se componen como pliegos editoriales: numeral gigante hueco que se desplaza con el scroll,
 * título y texto con bloques de un color de marca distinto por fase y foto revelada con el mismo barrido.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ElementType } from "react";
import gsap from "gsap";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { CtaLink, Eyebrow, LEAD, N, PHASES, TITLE, pad, useFull } from "./shared";

type Dir = "down" | "left" | "right" | "up";
const DIRECTION_CONFIG = {
  down: { axis: "scaleY", enterOrigin: "bottom center", exitOrigin: "top center" },
  left: { axis: "scaleX", enterOrigin: "left center", exitOrigin: "right center" },
  right: { axis: "scaleX", enterOrigin: "right center", exitOrigin: "left center" },
  up: { axis: "scaleY", enterOrigin: "top center", exitOrigin: "bottom center" },
} as const;

const COLORS = ["#2E6CA0", "#99C4E4", "#1A1A2E", "#1E5076"];

/** Dispara una vez al entrar (equivalente a ScrollTrigger start "top 90%", once). */
function useOnceInView<T extends Element>(enabled: boolean) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(!enabled);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);
  return [ref, inView] as const;
}

/** Timeline por línea, igual que createBlockRevealTimeline del original. */
function wipe(block: HTMLElement, target: HTMLElement, index: number, o: { delay: number; stagger: number; duration: number; direction: Dir }) {
  const { axis, enterOrigin, exitOrigin } = DIRECTION_CONFIG[o.direction];
  gsap.set(target, { opacity: 0 });
  gsap.set(block, { [axis]: 0, transformOrigin: enterOrigin, display: "block" });
  const tl = gsap.timeline({ delay: o.delay + index * o.stagger });
  tl.to(block, { [axis]: 1, duration: o.duration, ease: "power4.inOut" });
  tl.set(target, { opacity: 1 });
  tl.set(block, { transformOrigin: exitOrigin });
  tl.to(block, { [axis]: 0, duration: o.duration, ease: "power4.inOut" });
  return tl;
}

type RevealProps = {
  text: string; as?: ElementType; className?: string; color: string; full: boolean;
  delay?: number; stagger?: number; duration?: number; direction?: Dir;
};

/** TextRevealBlock con partición de líneas propia. */
function TextReveal({ text, as: Tag = "p", className, color, full, delay = 0, stagger = 0.15, duration = 0.75, direction = "left" }: RevealProps) {
  const [ref, inView] = useOnceInView<HTMLElement>(full);
  const words = text.split(" ");
  const [lines, setLines] = useState<string[] | null>(null);
  const played = useRef(false);
  const lineEls = useRef<(HTMLSpanElement | null)[]>([]);
  const blockEls = useRef<(HTMLSpanElement | null)[]>([]);
  const width = useRef(0);

  // 0) esperar a las fuentes (si no, la partición se hace con la tipografía de reserva)
  const [fontsReady, setFontsReady] = useState(() => !full || typeof document === "undefined" || !document.fonts || document.fonts.status === "loaded");
  useEffect(() => {
    if (fontsReady) return;
    let alive = true;
    document.fonts.ready.then(() => { if (alive) setFontsReady(true); });
    return () => { alive = false; };
  }, [fontsReady]);

  // 1) medir: palabras → líneas por offsetTop
  useLayoutEffect(() => {
    if (!full || lines || !fontsReady) return;
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    const out: string[] = [];
    let top = -1;
    spans.forEach((s, i) => {
      if (Math.abs(s.offsetTop - top) > 2) { out.push(words[i]); top = s.offsetTop; }
      else out[out.length - 1] += ` ${words[i]}`;
    });
    width.current = el.clientWidth;
    setLines(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, lines, text, fontsReady]);

  // 2) re-partir si cambia el ancho (como observeWindowResize del original)
  useEffect(() => {
    const el = ref.current;
    if (!full || !el || typeof ResizeObserver === "undefined") return;
    let id = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(id);
      id = window.setTimeout(() => { if (width.current && Math.abs(el.clientWidth - width.current) > 1) setLines(null); }, 150);
    });
    ro.observe(el);
    return () => { ro.disconnect(); window.clearTimeout(id); };
  }, [full, ref]);

  // 3) animar una sola vez al entrar
  useEffect(() => {
    if (!full || !lines || !inView || played.current) return;
    const tls = lines.map((_, i) => {
      const b = blockEls.current[i], l = lineEls.current[i];
      return b && l ? wipe(b, l, i, { delay, stagger, duration, direction }) : null;
    });
    const last = tls[tls.length - 1];
    last?.eventCallback("onComplete", () => { played.current = true; });
    // se interrumpe (StrictMode, re-partición): se mata y el siguiente efecto vuelve a empezar
    return () => { tls.forEach((tl) => tl?.kill()); };
  }, [full, lines, inView, delay, stagger, duration, direction]);

  if (!full) return <Tag className={className}>{text}</Tag>;

  if (!lines) {
    return (
      <Tag ref={ref} className={className}>
        {words.map((w, i) => <span key={i} data-w="" style={{ opacity: 0 }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
      </Tag>
    );
  }
  const hidden = !played.current;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={`${i}-${l}`} className="relative block w-max max-w-full overflow-hidden">
          <span ref={(el) => { lineEls.current[i] = el; }} className="relative block" style={{ opacity: hidden ? 0 : 1 }}>{l}</span>
          <span ref={(el) => { blockEls.current[i] = el; }} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[1] h-[101%] w-[101%] will-change-transform"
            style={{ backgroundColor: color, display: hidden ? "block" : "none", transform: "scaleX(0)" }} />
        </span>
      ))}
    </Tag>
  );
}

/** El mismo barrido aplicado a una foto. */
function ImageReveal({ src, alt, color, full, delay = 0.2, className = "" }: { src: string; alt: string; color: string; full: boolean; delay?: number; className?: string }) {
  const [ref, inView] = useOnceInView<HTMLDivElement>(full);
  const img = useRef<HTMLImageElement>(null);
  const block = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!full || !inView || !img.current || !block.current) return;
    const tl = wipe(block.current, img.current, 0, { delay, stagger: 0, duration: 0.7, direction: "up" });
    return () => { tl.kill(); };
  }, [full, inView, delay]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img ref={img} src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ opacity: full ? 0 : 1 }} />
      {full && <span ref={block} aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ backgroundColor: color, transform: "scaleY(0)" }} />}
    </div>
  );
}

function Spread({ i, full }: { i: number; full: boolean }) {
  const p = PHASES[i];
  const color = COLORS[i % COLORS.length];
  const row = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: row, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], i % 2 ? ["12%", "-12%"] : ["-12%", "12%"]);
  const flip = i % 2 === 1;
  return (
    <li ref={row} className="relative border-t border-ink py-12 md:py-20">
      <motion.span aria-hidden style={full ? { x } : undefined}
        className={cn("u-hollow pointer-events-none absolute top-6 select-none font-head text-[clamp(7rem,22vw,19rem)] font-black leading-[.8] tracking-[-0.07em] opacity-[0.16] md:top-10", flip ? "right-0" : "right-0 md:left-0 md:right-auto")}>
        {p.n}
      </motion.span>
      <div className="relative grid gap-8 md:grid-cols-12 md:gap-10">
        <div className={cn("md:col-span-6 lg:col-span-5", flip ? "md:order-2 md:col-start-7 lg:col-start-8" : "")}>
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
            <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} aria-hidden /> Fase {p.n} / {pad(N)}
          </p>
          <TextReveal as="h3" text={p.title} color={color} full={full} duration={0.6}
            className="mt-5 text-[clamp(2.6rem,6vw,5.2rem)] font-extrabold leading-[.92] tracking-[-0.055em] text-ink" />
          <TextReveal text={p.text} color={color} full={full} delay={0.35} stagger={0.12} duration={0.55}
            className="mt-6 max-w-[38ch] text-[1.12rem] leading-[1.55] text-charcoal" />
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink" aria-label="Incluye">
            {p.tags.map((t) => <li key={t} className="border-b-2 pb-0.5" style={{ borderColor: color }}>{t}</li>)}
          </ul>
        </div>
        <div className={cn("md:col-span-6 lg:col-span-6", flip ? "md:order-1 md:col-start-1" : "lg:col-start-7")}>
          <ImageReveal src={p.img} alt={p.alt} color={color} full={full} className="aspect-[4/3] md:aspect-[5/4]" />
        </div>
      </div>
    </li>
  );
}

export default function ProcessF() {
  const full = useFull();
  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-8 border-b border-ink/10 pb-12 md:pb-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow className="text-brand-strong" />
            <TextReveal as="h2" text={TITLE} color="#1A1A2E" full={full} stagger={0.18}
              className="mt-5 text-[clamp(2.8rem,8vw,7rem)] font-black leading-[.9] tracking-[-0.06em] text-ink" />
          </div>
          <div className="self-end lg:col-span-4">
            <TextReveal text={LEAD} color="#99C4E4" full={full} delay={0.5} stagger={0.08} duration={0.5}
              className="text-[1.05rem] leading-relaxed text-charcoal" />
            <CtaLink className="mt-4 text-brand-strong hover:text-brand-deep" />
          </div>
        </div>
        <ol className="mt-4">
          {PHASES.map((p, i) => <Spread key={p.n} i={i} full={full} />)}
        </ol>
      </div>
    </div>
  );
}
