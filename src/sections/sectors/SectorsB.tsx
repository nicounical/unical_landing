/**
 * SECTORES B · Immersive 3D — basado en 21st.dev «Interactive Icon Cloud» (id 942, dillionverma).
 * Del original se conserva el comportamiento de su TagCanvas (`react-icon-cloud`, no instalado → reimplementado con
 * transformaciones CSS y un bucle rAF): nube esférica 3D que gira sola entre minSpeed y maxSpeed, cuya velocidad y
 * sentido dependen de la posición del puntero respecto al centro (`reverse: true`), arrastre para girarla,
 * `clickToFront: 500` (al pulsar una etiqueta la esfera rota hasta traerla al frente), profundidad con escala y
 * opacidad, sin zoom con la rueda (`wheelZoom: false`) e iconos redondos sobre fondo de tono suave.
 * Adaptación: los iconos de marcas se sustituyen por los 8 sectores reales, cada uno dos veces — como etiqueta
 * tipográfica (tamaño según `size` de site.ts) y como miniatura redonda de su foto. Al traer un sector al frente se
 * muestra su ficha con la foto. Botón de pausa (WCAG 2.2.2), pausa fuera de pantalla, foco de teclado = traer al
 * frente; en táctil el arrastre solo gira en horizontal (touch-action: pan-y no bloquea el scroll).
 * Sin movimiento: nube plana de etiquetas.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_URL, ArrowUR, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

type Node = { kind: "tag" | "img"; s: number };
const NODES: Node[] = [];
ITEMS.forEach((_, i) => {
  NODES.push({ kind: "tag", s: i });
  NODES.push({ kind: "img", s: (i + 3) % ITEMS.length });
});

/** Puntos repartidos en la esfera unidad (espiral de Fibonacci). */
function sphere(n: number) {
  const ga = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, k) => {
    const y = 1 - ((k + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    return { x: Math.cos(k * ga) * r, y, z: Math.sin(k * ga) * r };
  });
}

type P = { x: number; y: number; z: number };
const rotX = (p: P, a: number) => { const c = Math.cos(a), s = Math.sin(a); const y = p.y * c - p.z * s; p.z = p.y * s + p.z * c; p.y = y; };
const rotY = (p: P, a: number) => { const c = Math.cos(a), s = Math.sin(a); const x = p.x * c + p.z * s; p.z = -p.x * s + p.z * c; p.x = x; };
/** Rotación de Rodrigues alrededor de un eje unitario. */
const rotAxis = (p: P, k: P, a: number) => {
  const c = Math.cos(a), s = Math.sin(a), d = k.x * p.x + k.y * p.y + k.z * p.z;
  const cx = k.y * p.z - k.z * p.y, cy = k.z * p.x - k.x * p.z, cz = k.x * p.y - k.y * p.x;
  p.x = p.x * c + cx * s + k.x * d * (1 - c);
  p.y = p.y * c + cy * s + k.y * d * (1 - c);
  p.z = p.z * c + cz * s + k.z * d * (1 - c);
};

const MIN_SPEED = 0.35, MAX_SPEED = 1.6; // rad/s (equivalentes a minSpeed/maxSpeed del original)

function Card({ i }: { i: number }) {
  const s = ITEMS[i];
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_50px_-30px_rgba(22,22,31,.45)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-soft">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img key={s.name} src={s.img} alt={s.alt} loading="lazy" decoding="async"
            initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-strong">Sector {s.n} / {pad(ITEMS.length)}</p>
          <p className="mt-1 truncate font-head text-xl font-semibold tracking-[-0.02em] text-ink" aria-live="polite">{s.name}</p>
        </div>
        <a href={CONTACT_URL} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand-strong" aria-label={`Consultar un proyecto de ${s.name}`}>
          <ArrowUR />
        </a>
      </div>
    </div>
  );
}

function Head() {
  return (
    <>
      <Eyebrow className="text-brand-strong" />
      <h2 className="mt-4 max-w-[14ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-ink">{TITLE}</h2>
      <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-ink/70">{LEAD}</p>
    </>
  );
}

function StaticView() {
  const [sel, setSel] = useState(0);
  return (
    <div className="bg-soft py-[var(--u-section-y)] text-ink">
      <div className="u-wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5"><Head /><div className="mt-8"><Card i={sel} /></div></div>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:col-span-7">
          {ITEMS.map((s, i) => (
            <li key={s.name}>
              <button type="button" aria-pressed={sel === i} onClick={() => setSel(i)}
                className={cn("min-h-[44px] rounded-full px-3 font-head font-semibold tracking-[-0.02em] transition-colors", sel === i ? "text-brand-strong" : "text-ink hover:text-brand-strong")}
                style={{ fontSize: `${1.1 * s.size}rem` }}>{s.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SectorsB() {
  const full = useFull();
  if (!full) return <StaticView />;
  return <Cloud />;
}

function Cloud() {
  const [sel, setSel] = useState(0);
  const [paused, setPaused] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const st = useRef({
    pts: sphere(NODES.length), R: 220, vx: 0.1, vy: -0.1, mx: 0, my: 0, inside: false,
    drag: null as null | { x: number; y: number; moved: number; id: number }, target: -1, paused: false, visible: true,
  });
  st.current.paused = paused;

  useEffect(() => {
    const el = stage.current!;
    const ro = new ResizeObserver(([e]) => { st.current.R = Math.min(e.contentRect.width, e.contentRect.height) * 0.41; });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { st.current.visible = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(el);
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(64, now - last) / 1000; last = now;
      const S = st.current;
      if (!S.visible || document.hidden) return;
      if (S.target >= 0) {
        const p = S.pts[S.target];
        const ang = Math.acos(Math.max(-1, Math.min(1, p.z)));
        if (ang < 0.004) S.target = -1;
        else {
          let k = { x: -p.y, y: p.x, z: 0 }; // p × (0,0,1)
          const len = Math.hypot(k.x, k.y) || 1;
          k = { x: k.x / len, y: k.y / len, z: 0 };
          const step = ang * Math.min(1, dt * 9); // ≈ 500 ms hasta el frente
          for (const q of S.pts) rotAxis(q, k, -step);
        }
        S.vx = 0; S.vy = 0;
      } else if (!S.drag) {
        // Velocidad objetivo: según el puntero (reverse) o giro lento por defecto
        let tx: number, ty: number;
        if (S.paused) { tx = 0; ty = 0; }
        else if (S.inside) { tx = -S.my * MAX_SPEED; ty = S.mx * MAX_SPEED; const m = Math.hypot(tx, ty); if (m < MIN_SPEED) { tx = MIN_SPEED * 0.3; ty = MIN_SPEED; } }
        else { tx = MIN_SPEED * 0.3; ty = MIN_SPEED; }
        S.vx += (tx - S.vx) * Math.min(1, dt * 3);
        S.vy += (ty - S.vy) * Math.min(1, dt * 3);
        for (const q of S.pts) { rotX(q, S.vx * dt); rotY(q, S.vy * dt); }
      }
      S.pts.forEach((q, i) => {
        const n = els.current[i];
        if (!n) return;
        const d = (q.z + 1) / 2;
        n.style.transform = `translate3d(${(q.x * S.R).toFixed(1)}px, ${(-q.y * S.R).toFixed(1)}px, 0) translate(-50%, -50%) scale(${(0.5 + 0.55 * d).toFixed(3)})`;
        n.style.opacity = (0.3 + 0.7 * d * d).toFixed(3);
        n.style.zIndex = String(Math.round(d * 100));
        n.style.filter = d < 0.35 ? `blur(${((0.35 - d) * 4).toFixed(2)}px)` : "none";
      });
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  /** clickToFront: la esfera gira hasta traer el nodo al frente. */
  const front = (node: number) => { st.current.target = node; setSel(NODES[node].s); };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const S = st.current, r = e.currentTarget.getBoundingClientRect();
    S.mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    S.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (S.drag && S.drag.id === e.pointerId) {
      const dx = e.clientX - S.drag.x, dy = e.pointerType === "mouse" ? e.clientY - S.drag.y : 0;
      S.drag.moved += Math.abs(dx) + Math.abs(dy);
      S.drag.x = e.clientX; S.drag.y = e.clientY;
      for (const q of S.pts) { rotY(q, dx * 0.008); rotX(q, -dy * 0.008); }
      S.target = -1;
    }
  };

  return (
    <div className="relative overflow-hidden bg-soft py-[var(--u-section-y)] text-ink">
      <div className="pointer-events-none absolute -right-[20%] top-1/2 aspect-square w-[80vw] max-w-[1100px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(153,196,228,.35),transparent_62%)]" aria-hidden />
      <div className="u-wrap relative grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Head />
          <div className="mt-8 hidden lg:block"><Card i={sel} /></div>
        </div>

        <div className="lg:col-span-7">
          <div ref={stage}
            className="relative mx-auto aspect-square w-full max-w-[620px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
            onPointerEnter={() => { st.current.inside = true; }}
            onPointerLeave={() => { st.current.inside = false; }}
            onPointerMove={onMove}
            onPointerDown={(e) => { st.current.drag = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId }; }}
            onPointerUp={() => { setTimeout(() => { st.current.drag = null; }, 0); }}
            onPointerCancel={() => { st.current.drag = null; }}
            role="group" aria-label="Nube 3D de sectores: pulsa un sector para traerlo al frente">
            {/* esfera guía */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-strong/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.9),rgba(234,242,249,.4)_55%,transparent_70%)]" aria-hidden />
            {NODES.map((nd, i) => {
              const s = ITEMS[nd.s], on = sel === nd.s;
              const click = () => { if ((st.current.drag?.moved ?? 0) > 6) return; front(i); };
              return nd.kind === "tag" ? (
                <button key={i} ref={(el) => { els.current[i] = el; }} type="button" onClick={click} onFocus={() => front(i)}
                  aria-pressed={on} aria-label={`${s.name}: traer al frente`}
                  className={cn("absolute left-1/2 top-1/2 min-h-[44px] whitespace-nowrap rounded-full px-3 py-2 font-head font-semibold leading-none tracking-[-0.03em] outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-brand-strong",
                    on ? "bg-ink text-white" : "text-ink hover:text-brand-strong")}
                  style={{ fontSize: `clamp(.85rem, ${3.4 * s.size}vw, ${1.35 * s.size}rem)` }}>
                  {s.name}
                </button>
              ) : (
                <button key={i} ref={(el) => { els.current[i] = el; }} type="button" onClick={click} tabIndex={-1} aria-hidden
                  className={cn("absolute left-1/2 top-1/2 h-12 w-12 overflow-hidden rounded-full border-2 bg-white p-0 shadow-md will-change-transform md:h-16 md:w-16",
                    on ? "border-brand-strong" : "border-white")}>
                  <img src={s.img} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink">
              {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
              {paused ? "Reanudar giro" : "Pausar giro"}
            </button>
            <span className="hidden text-xs text-ink/50 sm:inline">Arrastra para girar · pulsa un sector</span>
          </div>
          <div className="mt-8 lg:hidden"><Card i={sel} /></div>
        </div>
      </div>
    </div>
  );
}
