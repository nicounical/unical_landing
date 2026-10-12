/**
 * SECTORES E · High-Energy Motion — basado en 21st.dev «Infinite Text Marquee» (id 1944, HextaUI).
 * Del original se conserva: texto gigante repetido que se desplaza en bucle lineal infinito (motion), cambio de color
 * de la palabra bajo el cursor y la tarjeta flotante que sigue al puntero mientras se está encima, rotada según la
 * distancia al centro horizontal (maxRotation 8°, translate(-50%, -140%)).
 * Adaptación: dos pistas en sentidos opuestos (macizo / contorno) con los 8 sectores reales y miniaturas redondas como
 * separadores; la tarjeta flotante muestra la foto del sector señalado en lugar del texto con emoji. El desplazamiento
 * se calcula con useAnimationFrame sobre el ancho medido de una copia (bucle sin saltos a cualquier ancho), se pausa al
 * pasar el cursor, con el foco dentro, fuera de pantalla y con el botón de pausa (WCAG 2.2.2). Teclado: solo la primera
 * copia de cada nombre es enfocable y coloca la tarjeta junto a la palabra; en táctil, tocar un nombre la muestra unos
 * segundos. next/link y styled-jsx eliminados. Sin movimiento: los nombres se muestran en bloque, sin desplazamiento.
 */
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_URL, ArrowUR, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

const MAX_ROT = 8;
type Tip = { i: number; x: number; y: number; rot: number } | null;

function Row({ reverse, hollow, speed, paused, onHot, onFocusWord, focusable }: {
  reverse?: boolean; hollow?: boolean; speed: number; paused: boolean; focusable: boolean;
  onHot: (i: number | null) => void; onFocusWord: (i: number, el: HTMLElement) => void;
}) {
  const group = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const w = useRef(0);
  useEffect(() => {
    const ro = new ResizeObserver(() => { w.current = group.current?.offsetWidth ?? 0; });
    if (group.current) ro.observe(group.current);
    return () => ro.disconnect();
  }, []);
  useAnimationFrame((_, delta) => {
    if (paused || !w.current) return;
    const d = (speed * Math.min(delta, 64)) / 1000;
    let v = x.get() + (reverse ? d : -d);
    if (v <= -w.current) v += w.current;
    if (v > 0) v -= w.current;
    x.set(v);
  });

  const renderGroup = (copy: number) => (
    <div key={copy} ref={copy === 0 ? group : undefined} className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {ITEMS.map((s, i) => {
        const next = ITEMS[(i + 3) % ITEMS.length];
        const tab = focusable && copy === 0;
        return (
          <span key={s.name} className="flex items-center">
            <button type="button" tabIndex={tab ? 0 : -1} aria-label={tab ? `Ver foto del sector ${s.name}` : undefined}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") onHot(i); }}
              onPointerLeave={(e) => { if (e.pointerType === "mouse") onHot(null); }}
              onFocus={(e) => onFocusWord(i, e.currentTarget)}
              data-i={i}
              className={cn("whitespace-nowrap px-[0.18em] py-[0.06em] font-head text-[clamp(3.2rem,10.5vw,9.5rem)] font-bold leading-[1] tracking-[-0.045em] outline-none transition-colors duration-200",
                "focus-visible:text-navy focus-visible:[-webkit-text-stroke:0]",
                hollow ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.85)] hover:text-navy hover:[-webkit-text-stroke:0]" : "text-white hover:text-navy")}>
              {s.name}
            </button>
            <img src={next.img} alt="" loading="lazy" decoding="async" draggable={false}
              className="mx-[0.25em] h-[clamp(2.2rem,6vw,5.5rem)] w-[clamp(2.2rem,6vw,5.5rem)] shrink-0 rounded-full border-2 border-white/40 object-cover" />
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <motion.div className="flex w-max" style={{ x }}>
        {[0, 1, 2].map(renderGroup)}
      </motion.div>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-brand-strong py-[var(--u-section-y)] text-white">
      <Header />
      <ul className="u-wrap mt-12 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Sectores">
        {ITEMS.map((s, i) => (
          <li key={s.name} className="flex items-center gap-4">
            <img src={s.img} alt={s.alt} loading="lazy" className="h-14 w-14 rounded-full border-2 border-white/40 object-cover" />
            <span className={cn("font-head text-[clamp(2rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.045em]", i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_#fff]" : "text-white")}>{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="u-wrap grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <Eyebrow className="text-white/80" />
        <h2 className="mt-4 max-w-[15ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      <div className="md:col-span-5">
        <p className="max-w-[46ch] text-base leading-relaxed text-white/85">{LEAD}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href={CONTACT_URL} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white">
            Cuéntanos tu proyecto <ArrowUR className="h-3.5 w-3.5" />
          </a>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SectorsE() {
  const full = useFull();
  if (!full) return <StaticView />;
  return <Live />;
}

function Live() {
  const box = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [hot, setHot] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);
  const timer = useRef<number>();

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    if (box.current) io.observe(box.current);
    return () => { io.disconnect(); window.clearTimeout(timer.current); };
  }, []);

  const place = (cx: number, cy: number, i: number) => {
    const r = box.current!.getBoundingClientRect();
    const mid = r.width / 2, x = cx - r.left;
    const rot = (Math.abs(x - mid) / mid) * MAX_ROT * (x > mid ? 1 : -1);
    setTip({ i, x, y: cy - r.top, rot });
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    const i = el ? Number(el.dataset.i) : hot;
    if (i === null || i === undefined) { setTip(null); return; }
    place(e.clientX, e.clientY, i);
  };

  /** Táctil: tocar un nombre muestra su foto unos segundos. */
  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    if (!el || (e.nativeEvent as PointerEvent).pointerType === "mouse") return;
    place(e.clientX, e.clientY, Number(el.dataset.i));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTip(null), 2600);
  };

  const onFocusWord = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    place(r.left + r.width / 2, r.top + r.height * 0.3, i);
  };

  const stop = paused || hover || focusIn || !onScreen;
  const t = tip ? ITEMS[tip.i] : null;

  return (
    <div className="relative overflow-hidden bg-brand-strong py-[var(--u-section-y)] text-white">
      <Header>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/40 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10">
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
          {paused ? "Reanudar" : "Pausar"}
        </button>
      </Header>

      <div ref={box} className="relative mt-12 md:mt-16" role="group" aria-label="Sectores en movimiento"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
        onPointerLeave={() => { setHover(false); setHot(null); setTip(null); }}
        onPointerMove={onMove} onClick={onTap}
        onFocus={() => setFocusIn(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setFocusIn(false); setTip(null); } }}>
        <div className="-ml-[5%] w-[110%] -rotate-2 border-y border-white/20 bg-brand-strong py-2">
          <Row speed={90} paused={stop} focusable onHot={setHot} onFocusWord={onFocusWord} />
        </div>
        <div className="-ml-[5%] w-[110%] rotate-1 py-2">
          <Row reverse hollow speed={70} paused={stop} focusable={false} onHot={setHot} onFocusWord={onFocusWord} />
        </div>

        <AnimatePresence>
          {t && tip && (
            <motion.div key="tip" className="pointer-events-none absolute left-0 top-0 z-30" aria-hidden
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ left: tip.x, top: tip.y, transition: "left .12s ease-out, top .12s ease-out" }}>
              <div className="w-[min(62vw,280px)] origin-top-left transition-transform duration-150" style={{ transform: `rotateZ(${tip.rot}deg) translate(-50%, -112%)` }}>
              <div className="overflow-hidden rounded-3xl bg-navy p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
                <img src={t.img} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                <p className="flex items-center justify-between px-3 pb-1.5 pt-2.5 text-sm font-semibold text-white">
                  <span>{t.name}</span><span className="font-mono text-[10px] tracking-[0.18em] text-brand">{pad(tip.i + 1)}</span>
                </p>
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="u-wrap mt-8 text-xs text-white/60">Pasa el cursor o toca un sector para ver un trabajo real.</p>
    </div>
  );
}
