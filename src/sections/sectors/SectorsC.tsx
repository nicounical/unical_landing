/**
 * SECTORES C · Experimental Creative — basado en 21st.dev «Orbiting Circles with Globe» (id 18043, shadcnspace).
 * Del original se conserva: anillos concéntricos con borde fino, elementos que orbitan con las mismas keyframes CSS
 * (`orbit-cw/ccw` sobre un brazo con origin-bottom y `counter-cw/ccw` para mantenerlos derechos), sentido alterno por
 * anillo, ángulos de partida por elemento y un globo de partículas en canvas en el centro.
 * Adaptación: el globo (`ParticleSphereAnimation`, util no incluida) se reimplementa en canvas 2D con puntos en espiral
 * de Fibonacci y profundidad; el sistema se centra (en el original quedaba medio oculto abajo) para que los 8 sectores
 * sean siempre visibles; los iconos de integraciones pasan a ser las fotos reales de cada sector con su nombre.
 * Al pasar el cursor o enfocar un sector, las órbitas se detienen y su foto aparece dentro del globo. Botón de pausa,
 * pausa al pasar por el escenario y fuera de pantalla; radios calculados según el ancho (sin desbordes en móvil),
 * leyenda de botones bajo el escenario en móvil. Sin movimiento: órbitas quietas en su ángulo inicial.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

/** Reparto de los 8 sectores en 3 anillos (2 · 3 · 3) con su ángulo de partida. */
const ORBITS = [
  { k: 0.5, duration: 36, items: [{ s: 0, a: -40 }, { s: 4, a: 140 }] },
  { k: 0.75, duration: 48, items: [{ s: 1, a: 20 }, { s: 5, a: 140 }, { s: 3, a: 260 }] },
  { k: 1, duration: 60, items: [{ s: 2, a: -80 }, { s: 6, a: 40 }, { s: 7, a: 160 }] },
];

const KEYFRAMES = `
@keyframes sc-orbit-cw { from { transform: rotate(var(--a)) } to { transform: rotate(calc(var(--a) + 360deg)) } }
@keyframes sc-orbit-ccw { from { transform: rotate(var(--a)) } to { transform: rotate(calc(var(--a) - 360deg)) } }
@keyframes sc-counter-cw { from { transform: rotate(calc(var(--a) * -1)) } to { transform: rotate(calc(var(--a) * -1 - 360deg)) } }
@keyframes sc-counter-ccw { from { transform: rotate(calc(var(--a) * -1)) } to { transform: rotate(calc(var(--a) * -1 + 360deg)) } }
`;

/** Globo de partículas (canvas 2D). */
function Globe({ running }: { running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const run = useRef(running);
  run.current = running;
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const N = 520, ga = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, k) => {
      const y = 1 - ((k + 0.5) / N) * 2, r = Math.sqrt(1 - y * y);
      return [Math.cos(k * ga) * r, y, Math.sin(k * ga) * r];
    });
    let rot = 0.6, raf = 0, last = performance.now(), visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(c);
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.46, cx = w / 2, cy = h / 2;
      const cs = Math.cos(rot), sn = Math.sin(rot), tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
      for (const [x0, y0, z0] of pts) {
        const x = x0 * cs + z0 * sn, z1 = -x0 * sn + z0 * cs;
        const y = y0 * ct - z1 * st, z = y0 * st + z1 * ct;
        const d = (z + 1) / 2;
        ctx.globalAlpha = 0.12 + 0.88 * d * d;
        ctx.fillStyle = d > 0.72 ? "#ffffff" : "#99C4E4";
        ctx.beginPath();
        ctx.arc(cx + x * R, cy - y * R, 0.5 + 1.5 * d, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(64, now - last) / 1000; last = now;
      if (!visible || document.hidden || !run.current) return;
      rot += dt * 0.25;
      draw();
    };
    draw();
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => draw());
    ro.observe(c);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export default function SectorsC() {
  const full = useFull();
  const stage = useRef<HTMLDivElement>(null);
  const [R, setR] = useState(300);
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = stage.current!;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width, h = e.contentRect.height;
      setR(Math.max(130, Math.min(w / 2 - 40, h / 2 - 40, 340)));
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const moving = full && !paused && !hover && active === null && onScreen;
  const play: CSSProperties["animationPlayState"] = moving ? "running" : "paused";
  const small = R < 220;
  const globe = R * 0.36;

  return (
    <div className="relative overflow-hidden bg-navy py-[var(--u-section-y)] text-white">
      <style>{KEYFRAMES}</style>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_58%,rgba(46,108,160,.35),transparent_70%)]" aria-hidden />
      <div className="u-wrap relative text-center">
        <Eyebrow className="justify-center text-brand" />
        <h2 className="mx-auto mt-4 max-w-[18ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-white/70">{LEAD}</p>
      </div>

      <div ref={stage} className="u-wrap relative mt-8 h-[min(92vw,460px)] md:mt-10 md:h-[760px]"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
        onPointerLeave={(e) => { setHover(false); if (e.pointerType === "mouse") setActive(null); }}>
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {/* Globo con la foto del sector activo dentro */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full" style={{ width: globe * 2, height: globe * 2 }}>
            <AnimatePresence>
              {active !== null && (
                <motion.img key={ITEMS[active].name} src={ITEMS[active].img} alt={ITEMS[active].alt}
                  initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 0.85, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}
                  className="absolute inset-0 h-full w-full object-cover" />
              )}
            </AnimatePresence>
            <div className={cn("absolute inset-0 transition-opacity duration-500", active !== null && "opacity-60")}><Globe running={full && !paused && onScreen} /></div>
          </div>
          <AnimatePresence>
            {active !== null && (
              <motion.p key={ITEMS[active].name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="pointer-events-none absolute left-0 w-[60vw] max-w-[260px] -translate-x-1/2 text-center font-head text-sm font-semibold tracking-[-0.01em] text-white md:text-base"
                style={{ top: globe + 10 }} aria-hidden>
                {ITEMS[active].name}
              </motion.p>
            )}
          </AnimatePresence>

          {ORBITS.map((o, oi) => {
            const r = R * o.k, cw = oi % 2 === 0;
            return (
              <div key={oi} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" style={{ width: r * 2, height: r * 2 }}>
                {o.items.map(({ s: si, a }) => {
                  const s = ITEMS[si], on = active === si;
                  return (
                    <div key={si} className="absolute left-1/2 top-0 h-1/2 w-0 origin-bottom"
                      style={{ "--a": `${a}deg`, transform: `rotate(${a}deg)`, animation: full ? `${cw ? "sc-orbit-cw" : "sc-orbit-ccw"} ${o.duration}s linear infinite` : undefined, animationPlayState: play } as CSSProperties}>
                      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: on ? 30 : 10 }}>
                        <div style={{ "--a": `${a}deg`, transform: `rotate(${-a}deg)`, animation: full ? `${cw ? "sc-counter-cw" : "sc-counter-ccw"} ${o.duration}s linear infinite` : undefined, animationPlayState: play } as CSSProperties}>
                          <button type="button" onMouseEnter={() => setActive(si)} onFocus={() => setActive(si)} onBlur={() => setActive(null)}
                            onClick={() => setActive(si)} aria-label={`Sector ${s.n}: ${s.name}`} aria-pressed={on}
                            className={cn("group flex items-center gap-2 rounded-full border bg-night/90 p-1 text-left outline-none backdrop-blur transition-[border-color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-brand",
                              small ? "" : "pr-4", on ? "scale-110 border-brand shadow-[0_0_0_6px_rgba(153,196,228,.15)]" : "border-white/20 hover:border-white/50")}>
                            <img src={s.img} alt="" loading="lazy" decoding="async" className={cn("shrink-0 rounded-full object-cover", small ? "h-10 w-10" : "h-12 w-12")} />
                            {!small && <span className="whitespace-nowrap text-sm font-semibold text-white">{s.name}</span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="u-wrap relative mt-6 flex flex-col items-center gap-5">
        {small && (
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Sectores">
            {ITEMS.map((s, i) => (
              <li key={s.name}>
                <button type="button" onClick={() => setActive(active === i ? null : i)} aria-pressed={active === i}
                  className={cn("min-h-[44px] rounded-full border px-3 text-xs font-semibold transition-colors", active === i ? "border-brand bg-brand text-navy" : "border-white/20 text-white/80")}>
                  <span className="mr-1.5 font-mono text-[10px] opacity-70">{pad(i + 1)}</span>{s.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {full && (
          <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10">
            {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            {paused ? "Reanudar órbitas" : "Pausar órbitas"}
          </button>
        )}
      </div>
    </div>
  );
}
