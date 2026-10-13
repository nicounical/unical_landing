/**
 * PROYECTOS E · High-Energy Motion — basado en 21st.dev «Infinite Perspective Slider» (id 26063, hyperiux).
 * Del original se conserva: tira horizontal infinita (posición x de cada tarjeta envuelta con módulo sobre el ancho
 * del bucle y centrada), suavizado por lerp (scrollLerp 0.1, velocityLerp, rotationDamp, rotationLerp,
 * rotationSensitivity 0.025, máx. 80°) que inclina todas las tarjetas en rotateY según la velocidad, perspectiva
 * 2200 px, normalización del desplazamiento cuando se detiene, arrastre con ratón/táctil, revelado de número, título
 * y descripción por líneas enmascaradas (yPercent 100 → 0, stagger 0.06, power3) que se oculta mientras se mueve y
 * vuelve cuando para (scrollStopDelay 180 ms), bucle rAF suspendido fuera de pantalla.
 * Adaptación: el original movía la tira con la rueda en `window` (secuestro); aquí la impulsa el scroll normal de
 * la página mientras la sección está a la vista, más arrastre, botones anterior/siguiente y flechas del teclado.
 * SplitText (GSAP Club) → máscaras por línea con CSS. El revelado se aplica a la tarjeta centrada (vale para táctil
 * y teclado) y, con ratón, también a la que está bajo el cursor. Fotos y textos: los 8 proyectos reales, cada
 * tarjeta enlaza a su proyecto. Sin movimiento: fila desplazable con scroll-snap y textos visibles.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AllLink, Chevron, COUNT, Eyebrow, ITEMS, TITLE, pad, useFull, type Item } from "./shared";

const N = ITEMS.length;
const CFG = { scrollLerp: 0.1, velocityLerp: 0.09, rotationSensitivity: 0.025, rotationDamp: 0.1, rotationLerp: 0.12, maxRotation: 80, stopDelay: 180, pageScroll: 0.9 };
const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function dims(w: number) {
  if (w < 768) return { card: 236, gap: 16 };
  if (w < 1025) return { card: 300, gap: 28 };
  return { card: 360, gap: 40 };
}

/** Línea enmascarada (equivalente al SplitText lines + mask). */
const Line = ({ on, delay, className, children }: { on: boolean; delay: number; className?: string; children: React.ReactNode }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <span className={cn("block transition-transform", on ? "translate-y-0 duration-[350ms] ease-[cubic-bezier(.215,.61,.355,1)]" : "translate-y-[105%] duration-[350ms] ease-[cubic-bezier(.55,.055,.675,.19)]", className)}
      style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}>{children}</span>
  </span>
);

function Card({ p, i, on, step, onHover }: { p: Item; i: number; on: boolean; step: { card: number }; onHover: (i: number | null) => void }) {
  return (
    <a href={p.href} draggable={false} data-card
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(i)} onPointerLeave={() => onHover(null)}
      className="group absolute left-0 top-0 block will-change-transform focus-visible:outline-offset-4"
      style={{ width: step.card, transformOrigin: "center center" }}>
      <span className="mb-2 block font-mono text-lg leading-none tracking-tight text-brand md:text-2xl" aria-hidden>
        <Line on={on} delay={0}>{pad(i + 1)}</Line>
      </span>
      <span className="relative block h-[min(46vh,420px)] min-h-[260px] w-full overflow-hidden bg-ink max-md:h-[38vh]">
        <img src={p.img} alt={p.alt} loading="lazy" draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <span aria-hidden className={cn("absolute inset-0 ring-2 ring-inset ring-brand transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
      </span>
      <span className="mt-3 block space-y-1">
        <span className="block font-head text-lg font-bold uppercase leading-none tracking-[0.02em] text-white md:text-xl"><Line on={on} delay={50}>{p.title}</Line></span>
        <span className="block text-xs leading-none text-white/60 md:text-sm"><Line on={on} delay={110}>{p.kind} · {p.client}</Line></span>
      </span>
    </a>
  );
}

function Head({ index }: { index?: number }) {
  return (
    <div className="u-wrap flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 max-w-[18ch] text-[clamp(2.1rem,4.8vw,4.4rem)] font-extrabold uppercase leading-[.92] tracking-[-0.05em] text-white">{TITLE}</h2>
      </div>
      {index !== undefined && (
        <p className="font-head text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-none tracking-[-0.05em] text-white tabular-nums" aria-hidden>
          {pad(index + 1)}<span className="text-white/25">/{COUNT}</span>
        </p>
      )}
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-navy py-[var(--u-section-y)] text-white">
      <Head />
      <ul className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]" aria-label="Proyectos"
        style={{ paddingInline: "max(var(--u-gutter), calc((100% - var(--u-maxw)) / 2 + var(--u-gutter)))", scrollPaddingInline: "var(--u-gutter)" }}>
        {ITEMS.map((p, i) => (
          <li key={p.id} className="w-[min(78vw,340px)] flex-none snap-start">
            <a href={p.href} className="block">
              <span className="font-mono text-lg text-brand">{pad(i + 1)}</span>
              <img src={p.img} alt={p.alt} loading="lazy" className="mt-2 aspect-[4/5] w-full object-cover" />
              <span className="mt-3 block font-head text-lg font-bold uppercase leading-tight text-white">{p.title}</span>
              <span className="mt-1 block text-sm text-white/60">{p.kind} · {p.client}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="u-wrap mt-8 text-white"><AllLink /></div>
    </div>
  );
}

function MotionView() {
  const box = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(1200);
  const step = dims(W);
  const stepW = step.card + step.gap;
  const [centered, setCentered] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);
  const s = useRef({ current: 0, target: 0, velocity: 0, smooth: 0, rotVel: 0, rot: 0, drag: false, lastX: 0, moved: 0, visible: false, raf: 0, stopT: 0, lastScroll: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const markMoving = useCallback(() => {
    const st = s.current;
    setMoving(true);
    window.clearTimeout(st.stopT);
    st.stopT = window.setTimeout(() => setMoving(false), CFG.stopDelay);
  }, []);

  useEffect(() => {
    const st = s.current;
    const el = box.current, list = strip.current;
    if (!el || !list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-card]"));
    const loopW = N * stepW;
    const centre = W / 2 - step.card / 2;

    const place = () => {
      for (let i = 0; i < cards.length; i++) {
        let x = i * stepW - st.current + centre;
        x = ((x % loopW) + loopW) % loopW;
        if (x > loopW - stepW) x -= loopW;
        cards[i].style.transform = `translate3d(${x}px,0,0) rotateY(${clamp(st.rot, -CFG.maxRotation, CFG.maxRotation)}deg)`;
      }
    };
    let lastCentered = -1;
    const tick = () => {
      st.current = lerp(st.current, st.target, CFG.scrollLerp);
      st.velocity = st.target - st.current;
      st.smooth = lerp(st.smooth, st.velocity, CFG.velocityLerp);
      st.rotVel = lerp(st.rotVel, st.velocity, CFG.rotationDamp);
      st.rot = lerp(st.rot, Math.sign(st.rotVel) * Math.abs(st.rotVel) * CFG.rotationSensitivity, CFG.rotationLerp);
      if (Math.abs(st.current - st.target) < 0.05) {
        const shift = Math.round(st.current / loopW) * loopW;
        st.current -= shift; st.target -= shift;
      }
      place();
      const c = ((Math.round(st.current / stepW) % N) + N) % N;
      if (c !== lastCentered) { lastCentered = c; setCentered(c); }
      st.raf = st.visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!st.raf) st.raf = requestAnimationFrame(tick); };
    place();
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; if (st.visible) { st.lastScroll = window.scrollY; start(); } }, { rootMargin: "200px 0px" });
    io.observe(el);

    // El scroll normal de la página empuja la tira (sin interceptar la rueda).
    st.lastScroll = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - st.lastScroll;
      st.lastScroll = window.scrollY;
      if (!st.visible || st.drag) return;
      st.target += dy * CFG.pageScroll;
      if (Math.abs(dy) > 2) markMoving();
    };
    // Gestos horizontales de trackpad: solo el eje X (el vertical sigue siendo de la página).
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 1) { st.target += e.deltaX; markMoving(); }
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      st.drag = true; st.lastX = e.clientX; st.moved = 0;
    };
    const move = (e: PointerEvent) => {
      if (!st.drag) return;
      const d = e.clientX - st.lastX;
      st.lastX = e.clientX;
      st.moved += Math.abs(d);
      st.target -= d * 1.2;
      if (Math.abs(d) > 1) markMoving();
    };
    const up = () => { st.drag = false; };
    const click = (e: MouseEvent) => { if (st.moved > 6) { e.preventDefault(); e.stopPropagation(); } };

    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      cancelAnimationFrame(st.raf); st.raf = 0;
      window.clearTimeout(st.stopT);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, [W, stepW, step.card, markMoving]);

  const go = (d: number) => {
    const st = s.current;
    st.target = (Math.round(st.target / stepW) + d) * stepW;
    markMoving();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };
  // Al tabular por las tarjetas, la enfocada se centra.
  const onFocusIn = (e: React.FocusEvent) => {
    const a = (e.target as HTMLElement).closest("[data-card]");
    if (!a || !strip.current) return;
    const i = Array.from(strip.current.querySelectorAll("[data-card]")).indexOf(a);
    if (i < 0) return;
    const st = s.current;
    const base = Math.round(st.target / stepW);
    const cur = ((base % N) + N) % N;
    let d = i - cur;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    st.target = (base + d) * stepW;
  };

  return (
    <div className="relative overflow-hidden bg-navy py-[var(--u-section-y)] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-[60%] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(46,108,160,.35),transparent)]" />
      <div className="relative">
        <Head index={centered} />
        <div ref={box} role="region" aria-roledescription="carrusel" aria-label="Proyectos: arrastra o usa las flechas" tabIndex={0} onKeyDown={onKey} onFocus={onFocusIn}
          className="relative mt-10 cursor-grab touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-brand active:cursor-grabbing md:mt-14"
          style={{ perspective: 2200 }}>
          <div ref={strip} className="relative h-[calc(min(46vh,420px)+96px)] min-h-[356px] max-md:h-[calc(max(38vh,260px)+84px)]" style={{ transformStyle: "preserve-3d" }}>
            {ITEMS.map((p, i) => (
              <Card key={p.id} p={p} i={i} step={step} onHover={setHovered}
                on={!moving && (hovered === null ? centered === i : hovered === i)} />
            ))}
          </div>
        </div>
        <div className="u-wrap mt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Proyecto anterior"
              className="grid h-12 w-12 place-items-center rounded-full border border-solid border-white/30 text-white transition hover:bg-white hover:text-navy">
              <Chevron dir="left" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Proyecto siguiente"
              className="grid h-12 w-12 place-items-center rounded-full border border-solid border-white/30 text-white transition hover:bg-white hover:text-navy">
              <Chevron />
            </button>
            <span className="ml-2 hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:inline">Arrastra · desplaza</span>
          </div>
          <div className="text-white"><AllLink /></div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsE() {
  return useFull() ? <MotionView /> : <StaticView />;
}
