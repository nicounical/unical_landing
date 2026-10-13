/**
 * POR QUÉ F · Editorial Kinetic — basado en 21st.dev «Text Reveal (Mask)» (id 19257, soralabs).
 * Del original se conserva: MaskedTextReveal con división en líneas / palabras / letras, medición real de líneas
 * con una capa invisible (offsetTop de cada palabra, ResizeObserver + document.fonts.ready), cada unidad sube
 * desde yPercent 110 dentro de una máscara overflow-hidden con curva EXPO_OUT [0.19, 1, 0.22, 1], duraciones y
 * escalonados por modo (SPLIT_DEFAULTS), disparo useInView una vez con margen −25 %, énfasis con <strong> y
 * aria-label con el texto completo. La división es manual (sin GSAP SplitText).
 * Adaptación: composición editorial sobre papel — titular por palabras, manifiesto por líneas con «Somos tu
 * partner…» destacado, y los cuatro pilares como entradas de revista (numeral por letras, título y texto por
 * líneas, foto real que se descubre con clip-path). Sin movimiento completo: texto final sin máscaras.
 */
import {
  isValidElement, useLayoutEffect, useMemo, useRef, useState,
  type ElementType, type ReactNode, type RefObject,
} from "react";
import { motion, useInView, type UseInViewOptions } from "motion/react";
import { Icon } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ALT, ArrowR, CTA, EYEBROW, PILLARS, TEXT, useFull } from "./shared";
import { why } from "@/content/site";

type SplitBy = "lines" | "words" | "chars";
const SPLIT_DEFAULTS: Record<SplitBy, { duration: number; stagger: number }> = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};
const EXPO_OUT = [0.19, 1, 0.22, 1] as const;
const WS = /\s+/;
type Tok = { text: string; emphasized: boolean };

function collectWords(node: ReactNode, emphasized = false): Tok[] {
  if (typeof node === "string") return node.split(WS).filter(Boolean).map((text) => ({ text, emphasized }));
  if (Array.isArray(node)) return node.flatMap((c) => collectWords(c, emphasized));
  if (isValidElement(node)) {
    const em = emphasized || node.type === "strong" || node.type === "b";
    return collectWords((node.props as { children?: ReactNode }).children, em);
  }
  return [];
}

function useLineGroups(words: Tok[], className: string | undefined, containerRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [groups, setGroups] = useState<number[][] | null>(null);
  const key = `${className ?? ""}:${words.map((w) => `${w.emphasized ? 1 : 0}:${w.text}`).join("\u0000")}`;
  useLayoutEffect(() => {
    const c = containerRef.current, m = measureRef.current;
    if (!enabled || !c || !m) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const w = c.clientWidth || c.parentElement?.clientWidth || 0;
      if (w > 0) m.style.width = `${w}px`;
      const nodes = m.querySelectorAll<HTMLElement>("[data-measure-word]");
      const out: number[][] = [];
      let cur: number[] = [], last = -1;
      nodes.forEach((n, i) => {
        const top = n.offsetTop;
        if (last !== -1 && top > last + 1) { out.push(cur); cur = []; }
        cur.push(i); last = top;
      });
      if (cur.length) out.push(cur);
      setGroups(out.length ? out : [[0]]);
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    return () => { cancelled = true; ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  const layer = (
    <div aria-hidden ref={measureRef} className={cn("pointer-events-none invisible fixed left-[-9999px] top-0 block [overflow-wrap:break-word]", className)}>
      {words.map((w, i) => (
        <span key={i} data-measure-word className={cn("inline-block", i < words.length - 1 && "me-[0.25em]", w.emphasized && "font-semibold")}>{w.text}</span>
      ))}
    </div>
  );
  return { groups, layer };
}

function Unit({ go, children, className, delay, duration, block }: { go: boolean; children: ReactNode; className?: string; delay: number; duration: number; block?: boolean }) {
  return (
    <motion.span className={cn(block ? "block" : "inline-block", "will-change-transform", className)}
      initial={{ y: "110%" }} animate={go ? { y: "0%" } : { y: "110%" }} transition={{ duration, delay, ease: EXPO_OUT }}>
      {children}
    </motion.span>
  );
}

const Line = ({ children }: { children: ReactNode }) => <span className="block overflow-hidden pb-[0.06em]">{children}</span>;
const wordNode = (w: Tok) => (w.emphasized ? <strong>{w.text}</strong> : w.text);

function MaskedTextReveal({ as: Tag = "p", children, className, splitBy = "lines", delay = 0, full }: {
  as?: ElementType; children: ReactNode; className?: string; splitBy?: SplitBy; delay?: number; full: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "0px 0px -25% 0px" as UseInViewOptions["margin"] });
  const words = useMemo(() => collectWords(children), [children]);
  const label = words.map((w) => w.text).join(" ");
  const { groups, layer } = useLineGroups(words, className, root, full);
  const { duration, stagger } = SPLIT_DEFAULTS[splitBy];

  if (!full) return <div ref={root} className="w-full"><Tag className={className}>{children}</Tag></div>;

  const ready = !!groups && groups.length > 0;
  const go = inView && ready;
  let k = 0;
  let content: ReactNode = null;
  if (ready) {
    if (splitBy === "lines") {
      content = groups.map((g, li) => (
        <Line key={li}>
          <Unit block go={go} delay={delay + li * stagger} duration={duration}>
            {g.map((wi) => <span key={wi} className={cn("inline-block", wi < words.length - 1 && "me-[0.25em]")}>{wordNode(words[wi])}</span>)}
          </Unit>
        </Line>
      ));
    } else if (splitBy === "words") {
      content = groups.map((g, li) => (
        <Line key={li}>
          {g.map((wi) => (
            <Unit key={wi} go={go} delay={delay + k++ * stagger} duration={duration} className={cn(wi < words.length - 1 && "me-[0.25em]")}>{wordNode(words[wi])}</Unit>
          ))}
        </Line>
      ));
    } else {
      content = groups.map((g, li) => (
        <Line key={li}>
          {g.flatMap((wi, j) => {
            const chars = Array.from(words[wi].text).map((ch) => (
              <Unit key={`${wi}-${k}`} go={go} delay={delay + k++ * stagger} duration={duration}>{ch}</Unit>
            ));
            if (j < g.length - 1) chars.push(<Unit key={`s-${wi}`} go={go} delay={delay + k++ * stagger} duration={duration}>{" "}</Unit>);
            return chars;
          })}
        </Line>
      ));
    }
  }
  return (
    <div ref={root} className="relative w-full">
      {layer}
      <Tag aria-label={label} className={cn("block [overflow-wrap:break-word]", !ready && "invisible", className)}>
        {ready ? <span aria-hidden className="block">{content}</span> : children}
      </Tag>
    </div>
  );
}

/** Foto que se descubre de abajo arriba al entrar (clip-path). */
function Plate({ src, alt, full }: { src: string; alt: string; full: boolean }) {
  return (
    <motion.div className="overflow-hidden" initial={full ? { clipPath: "inset(100% 0 0 0)" } : false}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }} viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 1.2, ease: EXPO_OUT }}>
      <motion.img src={src} alt={alt} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover"
        initial={full ? { scale: 1.2 } : false} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.6, ease: EXPO_OUT }} />
    </motion.div>
  );
}

const SPLIT_AT = TEXT.indexOf("Somos");
const LEAD_A = SPLIT_AT > 0 ? TEXT.slice(0, SPLIT_AT).trim() : TEXT;
const LEAD_B = SPLIT_AT > 0 ? TEXT.slice(SPLIT_AT).trim() : "";

export default function WhyF() {
  const full = useFull();
  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid grid-cols-2 gap-4 border-y border-ink py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70 md:grid-cols-4">
          <span>{EYEBROW}</span>
          <span className="hidden md:block">Manifiesto</span>
          <span className="hidden md:block">Cabrera de Mar · Barcelona</span>
          <span className="text-right">{PILLARS.length.toString().padStart(2, "0")} pilares</span>
        </div>

        <MaskedTextReveal as="h2" splitBy="words" full={full}
          className="mt-12 text-[clamp(2.5rem,7.4vw,7rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-ink [&_strong]:font-extrabold [&_strong]:italic [&_strong]:text-brand-strong">
          {why.titleA}<strong>{why.titleEm}</strong>{why.titleB}
        </MaskedTextReveal>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            <MaskedTextReveal splitBy="lines" delay={0.2} full={full}
              className="font-head text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.28] tracking-[-0.02em] text-ink/55 [&_strong]:font-semibold [&_strong]:text-ink">
              {LEAD_A} <strong>{LEAD_B}</strong>
            </MaskedTextReveal>
            <a href={CTA.href} className="group mt-9 inline-flex min-h-[44px] items-center gap-3 border-b-2 border-ink pb-1 font-head text-sm font-semibold uppercase tracking-[0.14em] text-ink">
              {CTA.label}<ArrowR className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <ol className="mt-24 border-t border-ink">
          {PILLARS.map((p, i) => (
            <li key={p.n} className="grid gap-6 border-b border-ink/20 py-10 md:grid-cols-12 md:gap-8 md:py-14">
              <div className="md:col-span-2">
                <MaskedTextReveal as="p" splitBy="chars" full={full} className="font-head text-[clamp(3.2rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.06em] text-brand-strong">
                  {p.n}
                </MaskedTextReveal>
              </div>
              <div className="md:col-span-6">
                <div className="flex items-center gap-3 text-ink/60">
                  <Icon name={p.icon} size={20} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{p.tags.join(" · ")}</span>
                </div>
                <MaskedTextReveal as="h3" splitBy="lines" full={full} delay={0.1}
                  className="mt-4 text-[clamp(1.8rem,3.4vw,3rem)] font-extrabold leading-[1] tracking-[-0.045em] text-ink">
                  {p.title}
                </MaskedTextReveal>
                <MaskedTextReveal splitBy="lines" full={full} delay={0.25} className="mt-5 max-w-[46ch] text-[1.02rem] leading-relaxed text-charcoal">
                  {p.text}
                </MaskedTextReveal>
              </div>
              <div className={cn("md:col-span-3 md:col-start-10", i % 2 === 1 && "md:pt-10")}>
                <Plate src={p.img} alt={ALT[p.n]} full={full} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
