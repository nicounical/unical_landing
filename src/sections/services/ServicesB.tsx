/**
 * SERVICIOS B · Immersive 3D — basado en 21st.dev «Linear Carousel» (id 20150, animbits).
 * Del original se conserva: carrusel horizontal con scroll nativo, bucle infinito por duplicado de tarjetas,
 * arrastre con ratón (mismo cálculo pageX → scrollLeft), autoplay que avanza scrollLeft y se pausa al pasar/tocar,
 * botones anterior/siguiente, entrada escalonada de las tarjetas y la foto en escala de grises con degradado inferior.
 * Adaptación: profundidad 3D real (rotateY + translateZ por tarjeta según su distancia al centro, la foto recupera
 * el color al llegar al centro), triple copia para poder girar en ambos sentidos, acumulador de posición para que el
 * autoplay no se atasque en píxeles fraccionarios, botón de pausa (WCAG 2.2.2), teclado ← →, foco que centra la
 * tarjeta, pausa fuera de pantalla. Las tarjetas son enlaces al servicio. Sin scroll-behavior CSS (rompía el bucle).
 */
import { useCallback, useEffect, useRef, useState, type MouseEvent as RMouseEvent } from "react";
import { animate, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowUR, Eyebrow, ITEMS, TITLE, pad, useFull } from "./shared";

const COPIES = 3;
const LOOPED = Array.from({ length: COPIES }, (_, c) => ITEMS.map((s, i) => ({ s, i, c }))).flat();

function CardBody({ i }: { i: number }) {
  const s = ITEMS[i];
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3/4 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      <span className="absolute left-5 top-5 z-30 font-mono text-[11px] tracking-[0.18em] text-white/80">{s.n} / {pad(ITEMS.length)}</span>
      <div className="relative z-30 w-full p-6 md:p-7">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-brand">{s.sub}</p>
        <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,2rem)] font-bold leading-[1.02] tracking-[-0.035em] text-white [text-wrap:balance]">{s.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-snug text-white/75">{s.text}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          Ver servicio <ArrowUR className="h-3.5 w-3.5" />
        </span>
      </div>
    </>
  );
}

const btn = "flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 disabled:opacity-40";

function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="u-wrap flex flex-wrap items-end justify-between gap-8">
      <div>
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 max-w-[15ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      {children}
    </div>
  );
}

function StaticView() {
  const ref = useRef<HTMLDivElement>(null);
  const by = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.7), behavior: "auto" });
  return (
    <div className="bg-navy py-[var(--u-section-y)] text-white">
      <Header>
        <div className="flex gap-3">
          <button type="button" className={btn} onClick={() => by(-1)} aria-label="Servicio anterior"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" className={btn} onClick={() => by(1)} aria-label="Servicio siguiente"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </Header>
      <div ref={ref} className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--u-gutter)] pb-4 [scrollbar-width:none]">
        {ITEMS.map((s, i) => (
          <a key={s.n} href={s.href} className="relative flex h-[26rem] w-[min(78vw,340px)] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl bg-white/5">
            <img src={s.img} alt={s.alt} loading="lazy" className="absolute inset-0 z-10 h-full w-full object-cover" />
            <CardBody i={i} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ServicesB() {
  const full = useFull();
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const geo = useRef({ set: 0, offs: [] as number[], w: 0 });
  const pos = useRef(0);
  const busy = useRef(false); // animación de flechas en curso
  const drag = useRef({ on: false, x: 0, left: 0, moved: 0 });
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const curRef = useRef(0);
  curRef.current = current;

  /** Aplica la profundidad 3D a cada tarjeta según su distancia al centro del carrusel. */
  const paint = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const { offs, w } = geo.current;
    const mid = el.scrollLeft + el.clientWidth / 2;
    const half = el.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.current.forEach((card, k) => {
      if (!card) return;
      const d = Math.max(-1.6, Math.min(1.6, (offs[k] + w / 2 - mid) / half));
      const a = Math.abs(d);
      if (a < bestD) { bestD = a; best = k; }
      card.style.transform = `perspective(1100px) translateZ(${-a * 150}px) rotateY(${-d * 34}deg)`;
      card.style.opacity = String(1 - Math.max(0, a - 0.6) * 0.45);
      card.style.zIndex = String(100 - Math.round(a * 50));
      const img = imgs.current[k];
      if (img) img.style.filter = `grayscale(${Math.min(1, a * 1.6)}) brightness(${1 - Math.min(0.35, a * 0.25)})`;
    });
    setCurrent(best % ITEMS.length);
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    const first = cards.current[0];
    const twin = cards.current[ITEMS.length];
    if (!el || !first || !twin) return;
    // se mide el envoltorio (no la tarjeta): las tarjetas transformadas alteran offsetParent
    const left = (c: HTMLElement | null) => (c?.parentElement as HTMLElement | null)?.offsetLeft ?? 0;
    geo.current = { set: left(twin) - left(first), offs: cards.current.map(left), w: first.offsetWidth };
  }, []);

  /** Mantiene la posición dentro de la copia central (bucle infinito en ambos sentidos). */
  const wrap = useCallback(() => {
    const el = track.current;
    const { set } = geo.current;
    if (!el || !set) return;
    if (el.scrollLeft < set * 0.5) el.scrollLeft += set;
    else if (el.scrollLeft > set * 1.5) el.scrollLeft -= set;
    pos.current = el.scrollLeft;
  }, []);

  const centerOn = useCallback((k: number, instant = false) => {
    const el = track.current;
    if (!el) return;
    const { offs, w } = geo.current;
    const to = offs[k] + w / 2 - el.clientWidth / 2;
    if (instant) { el.scrollLeft = to; pos.current = to; paint(); return; }
    busy.current = true;
    animate(el.scrollLeft, to, {
      type: "spring", stiffness: 140, damping: 26,
      onUpdate: (v) => { el.scrollLeft = v; pos.current = v; },
      onComplete: () => { busy.current = false; wrap(); paint(); },
    });
  }, [paint, wrap]);

  const step = useCallback((dir: number) => {
    const el = track.current;
    if (!el) return;
    const { offs, w } = geo.current;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestD = Infinity;
    offs.forEach((o, k) => { const d = Math.abs(o + w / 2 - mid); if (d < bestD) { bestD = d; best = k; } });
    centerOn(best + dir);
  }, [centerOn]);

  useEffect(() => {
    if (!full) return;
    const el = track.current;
    if (!el) return;
    const init = () => { measure(); centerOn(ITEMS.length, true); };
    init();
    const ro = new ResizeObserver(() => { measure(); centerOn(ITEMS.length + curRef.current, true); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full]);

  // Autoplay (pausa al pasar, enfocar, tocar, arrastrar, fuera de pantalla o con el botón)
  const running = full && visible && !hover && !paused;
  useEffect(() => {
    if (!running) return;
    const el = track.current;
    if (!el) return;
    let raf = 0;
    pos.current = el.scrollLeft;
    const tick = () => {
      if (!busy.current && !drag.current.on) {
        if (Math.abs(el.scrollLeft - pos.current) > 2) pos.current = el.scrollLeft;
        pos.current += 0.55;
        el.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const onScroll = () => { if (!busy.current) wrap(); paint(); };

  const onMouseDown = (e: RMouseEvent) => {
    const el = track.current;
    if (!el) return;
    drag.current = { on: true, x: e.pageX, left: el.scrollLeft, moved: 0 };
  };
  const onMouseMove = (e: RMouseEvent) => {
    const el = track.current;
    if (!el || !drag.current.on) return;
    e.preventDefault();
    const walk = (e.pageX - drag.current.x) * 1.5;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(walk));
    el.scrollLeft = drag.current.left - walk;
    pos.current = el.scrollLeft;
    if (el.scrollLeft < geo.current.set * 0.5 || el.scrollLeft > geo.current.set * 1.5) { wrap(); drag.current.left = el.scrollLeft + walk; }
  };
  const endDrag = () => { drag.current.on = false; };

  if (!full) return <StaticView />;

  return (
    <div className="relative overflow-hidden bg-navy py-[var(--u-section-y)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(46,108,160,.28),transparent_60%)]" aria-hidden />
      <Header>
        <div className="flex items-center gap-3">
          <p className="mr-2 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 md:block">Arrastra · ← →</p>
          <button type="button" className={btn} onClick={() => step(-1)} aria-label="Servicio anterior"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" className={btn} onClick={() => setPaused((p) => !p)} aria-label={paused ? "Reanudar desplazamiento automático" : "Pausar desplazamiento automático"} aria-pressed={paused}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button type="button" className={btn} onClick={() => step(1)} aria-label="Servicio siguiente"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </Header>

      <div className="relative mt-6 md:mt-10"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); endDrag(); }}
        onTouchStart={() => setHover(true)} onTouchEnd={() => setHover(false)}
        onFocus={() => setHover(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}
        onKeyDown={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); step(e.key === "ArrowLeft" ? -1 : 1); } }}>
        <div ref={track} role="region" aria-roledescription="carrusel" aria-label="Servicios de Unical"
          onScroll={onScroll} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={endDrag}
          onClickCapture={(e) => { if (drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); drag.current.moved = 0; } }}
          onDragStart={(e) => e.preventDefault()}
          className="relative flex w-full cursor-grab select-none overflow-x-scroll py-12 [scrollbar-width:none] active:cursor-grabbing md:py-16 [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-row gap-3 px-[10vw] md:gap-5">
            {LOOPED.map(({ s, i, c }, k) => {
              const real = c === 1;
              return (
                <motion.div key={`${c}-${s.n}`} className="shrink-0"
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}>
                  <a ref={(el) => { cards.current[k] = el; }} href={s.href}
                    tabIndex={real ? 0 : -1} aria-hidden={real ? undefined : true}
                    onFocus={() => real && centerOn(k)}
                    className={cn("relative flex h-[min(62vh,27rem)] w-[min(72vw,330px)] flex-col items-start justify-end overflow-hidden rounded-3xl bg-white/5 text-left outline-none ring-brand ring-offset-4 ring-offset-navy will-change-transform focus-visible:ring-2 md:h-[28rem] md:w-[330px]")}>
                    <img ref={(el) => { imgs.current[k] = el; }} src={s.img} alt={real ? s.alt : ""} loading="lazy" decoding="async" draggable={false}
                      className="absolute inset-0 z-10 h-full w-full object-cover" />
                    <CardBody i={i} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[200] w-[8vw] bg-gradient-to-r from-navy to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[200] w-[8vw] bg-gradient-to-l from-navy to-transparent" aria-hidden />
      </div>

      <div className="u-wrap flex items-center gap-4" aria-hidden>
        <span className="font-mono text-xs tabular-nums text-white/80">{pad(current + 1)}</span>
        <div className="relative h-px flex-1 bg-white/15">
          <motion.div className="absolute inset-y-0 bg-brand" style={{ width: `${100 / ITEMS.length}%` }} animate={{ left: `${(current / ITEMS.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
        </div>
        <span className="font-mono text-xs tabular-nums text-white/40">{pad(ITEMS.length)}</span>
      </div>
    </div>
  );
}
