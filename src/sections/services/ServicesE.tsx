/**
 * SERVICIOS E · High-Energy Motion — basado en 21st.dev «Horizontal Feature Reveal» (id 26062).
 * Del original se conserva: sección alta con vista `sticky` de 100vh donde el scroll vertical (scrub) desplaza
 * una pista editorial en horizontal; cabecera cuyas letras llegan dispersas al azar y se recomponen con el scroll;
 * por tarjeta, el número sube letra a letra (y 150 + rotate 10, stagger 0.1), título y texto suben por máscaras de
 * línea con «play/reverse», y la foto hace parallax horizontal dentro de su marco; debajo de 1025px, lista apilada.
 * Adaptación: GSAP ScrollTrigger + SplitText sustituidos por `motion` (useScroll/useTransform) para no depender del
 * plugin; altura reducida de 600vh a 300vh; disparadores calculados por la posición real de cada tarjeta en vez de
 * porcentajes fijos; textos de Unical, número en contorno de marca, barra de progreso y contador.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUR, Eyebrow, ITEMS, SCOPE, TITLE, pad, useFull } from "./shared";

const ease = [0.22, 1, 0.36, 1] as const;
const rnd = (i: number, k: number) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };

/** Letra de la cabecera: parte de una posición aleatoria y se recompone con el scroll (scrub). */
function Char({ c, i, p }: { c: string; i: number; p: MotionValue<number> }) {
  const sy = (rnd(i, 1) < 0.5 ? 1 : -1) * 200 * rnd(i, 2);
  const sx = 160 * rnd(i, 3);
  const y = useTransform(p, [0, 1], [`${sy}%`, "0%"]);
  const x = useTransform(p, [0, 1], [`${sx}%`, "0%"]);
  return <motion.span className="inline-block whitespace-pre" style={{ x, y }}>{c}</motion.span>;
}

/** Máscara de línea: el contenido sube desde abajo cuando `on` (y baja al revertir). */
const Mask = ({ on, delay = 0, children, className = "" }: { on: boolean; delay?: number; children: React.ReactNode; className?: string }) => (
  <span className={cn("block overflow-hidden", className)}>
    <motion.span className="block" initial={false} animate={{ y: on ? "0%" : "105%" }} transition={{ duration: 0.7, delay: on ? delay : 0, ease }}>{children}</motion.span>
  </span>
);

function Card({ i, on, x, vw }: { i: number; on: boolean; x: MotionValue<number>; vw: number }) {
  const s = ITEMS[i];
  const ref = useRef<HTMLElement>(null);
  const [geo, setGeo] = useState({ off: 0, w: 1 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setGeo({ off: el.offsetLeft, w: el.offsetWidth });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Parallax horizontal de la foto mientras la tarjeta cruza la pantalla
  const shift = useTransform(x, (v) => {
    const left = geo.off + v;
    const p = Math.min(1, Math.max(0, (vw - left) / (vw + geo.w)));
    return `${-12 + 24 * p}%`;
  });

  return (
    <article ref={ref} className="flex h-[74vh] w-[min(58vw,920px)] shrink-0 gap-[3.5vw]">
      <div className="relative h-full w-[46%] shrink-0 overflow-hidden rounded-[6px] bg-white/5">
        <motion.img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="absolute inset-y-0 left-[-15%] h-full w-[130%] max-w-none object-cover" style={{ x: shift }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-[2vh]">
        <p className="flex overflow-hidden font-head text-[clamp(4rem,9vw,8.5rem)] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_#99C4E4]" aria-hidden>
          {s.n.split("").map((c, k) => (
            <motion.span key={k} className="inline-block" initial={false}
              animate={on ? { y: 0, rotate: 0 } : { y: 150, rotate: 10 }}
              transition={{ duration: 0.7, delay: on ? k * 0.1 : 0, ease: "easeOut" }}>{c}</motion.span>
          ))}
        </p>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand"><Mask on={on}>{s.sub}</Mask></p>
          <h3 className="mt-3 text-[clamp(2.2rem,4.2vw,4rem)] font-extrabold leading-[1] tracking-[-0.045em] text-white">
            {s.title.split(" ").map((w, k) => <Mask key={k} on={on} delay={0.08 * k} className="pb-[0.06em]">{w}</Mask>)}
          </h3>
          <div className="mt-6 max-w-[40ch] text-[clamp(.95rem,1.1vw,1.08rem)] leading-relaxed text-white/75">
            <Mask on={on} delay={0.3}>{s.text}</Mask>
          </div>
          <Mask on={on} delay={0.4} className="mt-5">
            <span className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
              {SCOPE[s.n].map((c) => <span key={c}>/ {c}</span>)}
            </span>
          </Mask>
          <Mask on={on} delay={0.5} className="mt-6">
            <a href={s.href} className="group inline-flex min-h-[44px] items-center gap-3 rounded-full bg-brand px-5 text-sm font-semibold text-ink transition-colors hover:bg-white">
              Ver servicio <span className="sr-only">{s.title}</span> <ArrowUR className="transition-transform group-hover:rotate-45" />
            </a>
          </Mask>
        </div>
      </div>
    </article>
  );
}

/** Lista apilada (móvil/tablet, como el original por debajo de 1025px, y modo estático). */
function Stack({ animated }: { animated: boolean }) {
  // El disparador es la tarjeta (un hijo enmascarado nunca «entra» en pantalla porque su padre lo recorta).
  const parent = animated ? { initial: "hide", whileInView: "show", viewport: { once: true, margin: "-12% 0px" } } : {};
  const rise = (d = 0) => (animated ? { variants: { hide: { y: "105%" }, show: { y: "0%", transition: { duration: 0.7, delay: d, ease } } } } : {});
  return (
    <div className="bg-ink py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 max-w-[14ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
        <ol className="mt-14 grid gap-16 md:grid-cols-2 md:gap-x-10">
          {ITEMS.map((s) => (
            <motion.li key={s.n} {...parent}>
              <img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[6px] object-cover" />
              <p className="mt-6 overflow-hidden font-head text-6xl font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_#99C4E4]" aria-hidden>
                <motion.span className="block" {...rise()}>{s.n}</motion.span>
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">{s.sub}</p>
              <h3 className="mt-2 overflow-hidden pb-[0.06em] text-[clamp(2rem,7vw,2.8rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white">
                <motion.span className="block" {...rise(0.08)}>{s.title}</motion.span>
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/75">{s.text}</p>
              <a href={s.href} className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand">
                Ver servicio <span className="sr-only">{s.title}</span> <ArrowUR />
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function ServicesE() {
  const full = useFull();
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1025px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1025px)");
    const on = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  if (!full || !wide) return <Stack animated={full} />;
  return <Track />;
}

function Track() {
  const sec = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cardsWrap = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ travel: 0, vw: 1440, offs: [] as number[] });
  const [shown, setShown] = useState(0);
  const { scrollYProgress } = useScroll({ target: sec, offset: ["start start", "end end"] });
  // las letras se recomponen mientras la sección entra (legible al fijarse), como el «start top → 20%» del original
  const { scrollYProgress: enter } = useScroll({ target: sec, offset: ["start 0.95", "start 0.15"] });
  const x = useTransform(scrollYProgress, (p) => -p * m.travel);
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useLayoutEffect(() => {
    const read = () => {
      const t = track.current, w = cardsWrap.current;
      if (!t || !w) return;
      const vw = window.innerWidth;
      setM({ travel: Math.max(0, t.scrollWidth - vw), vw, offs: Array.from(w.children).map((c) => (c as HTMLElement).offsetLeft) });
    };
    read();
    const ro = new ResizeObserver(read);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", read);
    return () => { ro.disconnect(); window.removeEventListener("resize", read); };
  }, []);

  const sync = (v: number) => setShown(m.offs.filter((o) => o + v < m.vw * 0.72).length);
  useMotionValueEvent(x, "change", sync);
  useEffect(() => sync(x.get()), [m]); // eslint-disable-line react-hooks/exhaustive-deps

  const idx = Math.max(0, shown - 1);

  /** Teclado: al enfocar un enlace de una tarjeta fuera de vista, se lleva la página al punto que la muestra. */
  const onFocus = (e: React.FocusEvent) => {
    const card = (e.target as HTMLElement).closest("article");
    const el = sec.current, view = e.currentTarget as HTMLElement;
    view.scrollLeft = 0;
    if (!card || !el || !m.travel) return;
    const i = Array.from(cardsWrap.current?.children ?? []).indexOf(card);
    const p = Math.min(1, Math.max(0, (m.offs[i] - m.vw * 0.12) / m.travel));
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (el.offsetHeight - window.innerHeight), behavior: "auto" });
  };

  return (
    <div ref={sec} className="relative bg-ink text-white" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden" onFocus={onFocus}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(46,108,160,.22),transparent_55%)]" aria-hidden />
        <motion.div ref={track} className="relative flex h-full w-max items-center gap-[6vw] pl-[var(--u-gutter)] pr-[12vw]" style={{ x }}>
          {/* Cabecera con letras que se recomponen */}
          <div className="flex w-[40vw] shrink-0 flex-col justify-center">
            <Eyebrow className="text-brand" />
            <h2 aria-label={TITLE} className="mt-6 text-[clamp(3rem,5.6vw,5.6rem)] font-extrabold leading-[.95] tracking-[-0.05em] text-white">
              {TITLE.split(" ").map((w, wi, arr) => (
                <span key={wi} aria-hidden>
                  <span className="inline-block whitespace-nowrap">
                    {w.split("").map((c, ci) => <Char key={ci} c={c} i={wi * 20 + ci} p={enter} />)}
                  </span>
                  {wi < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </h2>
            <p className="mt-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
              <span className="h-px w-10 bg-white/30" aria-hidden /> Desliza para recorrer los {ITEMS.length} servicios
            </p>
          </div>
          <div ref={cardsWrap} className="flex h-full items-center gap-[5vw]">
            {ITEMS.map((s, i) => <Card key={s.n} i={i} on={i < shown} x={x} vw={m.vw} />)}
          </div>
        </motion.div>

        {/* Progreso */}
        <div className="absolute inset-x-[var(--u-gutter)] bottom-[4vh] flex items-center gap-5" aria-hidden>
          <span className="font-mono text-xs tabular-nums text-white">{pad(idx + 1)}</span>
          <div className="relative h-[2px] flex-1 overflow-hidden bg-white/10">
            <motion.div className="absolute inset-0 origin-left bg-brand" style={{ scaleX: bar }} />
          </div>
          <span className="font-mono text-xs tabular-nums text-white/40">{pad(ITEMS.length)}</span>
        </div>
      </div>
    </div>
  );
}
