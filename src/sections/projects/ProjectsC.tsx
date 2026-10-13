/**
 * PROYECTOS C · Experimental Creative — basado en 21st.dev «Infinite Image Field» (id 18268).
 * Del original se conserva: lienzo <canvas> con DPR que tesela fotos sin fin en todas direcciones (rango de celdas
 * visible ±1, asignación determinista por celda — fórmula cambiada a coeficientes coprimos para no repetir vecinas), cámara con velocidad que sigue al
 * cursor desde el centro (`(mouse − 0.5)·2·maxSpeed`) suavizada con `smoothing`, esquinas redondeadas con
 * `drawRoundedRect` + clip y trazo fino tipo cristal; ResizeObserver y bucle rAF.
 * Adaptación: fotos de CDN → los 8 proyectos reales + la galería de trabajos de site.ts, recortadas en «cover».
 * El campo vive en un marco contenido (no ocupa la página, no escucha la rueda → nunca atrapa el scroll); se añade
 * arrastre con puntero (touch-action: pan-y, así el dedo sigue desplazando la página en vertical), etiqueta flotante
 * con el nombre de la foto bajo el cursor, clic en una foto de proyecto → su página, y un índice de proyectos
 * accesible: al pasar o enfocar un nombre la cámara viaja hasta la foto más cercana de ese proyecto y la resalta.
 * El rAF se detiene fuera de pantalla. Sin movimiento: mosaico estático del mismo campo con el índice.
 */
import { useEffect, useRef, useState } from "react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { AllLink, ArrowUR, Eyebrow, GALLERY, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

type Tile = { src: string; alt: string; title: string; href?: string; project?: number };
const TILES: Tile[] = [
  ...ITEMS.map((p, i) => ({ src: p.img, alt: p.alt, title: p.title, href: p.href, project: i })),
  ...GALLERY.map((g) => ({ src: g.src, alt: g.alt, title: g.alt })),
];
const N = TILES.length;
/** Asignación determinista (la misma celda siempre muestra la misma foto); coeficientes coprimos con N para no repetir vecinas. */
const tileAt = (col: number, row: number) => (((col * 5 + row * 11) % N) + N) % N;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const c = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + c, y);
  ctx.lineTo(x + w - c, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + c);
  ctx.lineTo(x + w, y + h - c);
  ctx.quadraticCurveTo(x + w, y + h, x + w - c, y + h);
  ctx.lineTo(x + c, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - c);
  ctx.lineTo(x, y + c);
  ctx.quadraticCurveTo(x, y, x + c, y);
  ctx.closePath();
}

const MAX_SPEED = 4.2, SMOOTHING = 0.07, RADIUS = 14;

function Index({ onFocus, active }: { onFocus?: (i: number | null) => void; active?: number | null }) {
  return (
    <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4" onMouseLeave={() => onFocus?.(null)}>
      {ITEMS.map((p, i) => (
        <li key={p.id} className="border-t border-white/10">
          <a href={p.href} onMouseEnter={() => onFocus?.(i)} onFocus={() => onFocus?.(i)} onBlur={() => onFocus?.(null)}
            className={cn("group flex min-h-[52px] items-center gap-3 py-3 text-sm transition-colors", active === i ? "text-white" : "text-white/60 hover:text-white")}>
            <span className={cn("font-mono text-[11px] tabular-nums transition-colors", active === i ? "text-brand" : "text-white/35")}>{pad(i + 1)}</span>
            <span className="min-w-0 flex-1 truncate font-medium">{p.title}</span>
            <ArrowUR className="h-3.5 w-3.5 flex-none opacity-40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </a>
        </li>
      ))}
    </ol>
  );
}

function Head() {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 text-[clamp(2.2rem,5.6vw,5rem)] font-extrabold leading-[.95] tracking-[-0.055em] text-white">
          {TITLE.split(" ").slice(0, 2).join(" ")} <span style={{ color: "transparent", WebkitTextStroke: "1.5px #99C4E4" }}>{TITLE.split(" ").slice(2).join(" ")}</span>
        </h2>
      </div>
      <div className="md:col-span-4 md:pb-2">
        <p className="max-w-[38ch] text-[15px] leading-relaxed text-white/60">{LEAD}</p>
        <div className="mt-3 text-white"><AllLink /></div>
      </div>
    </div>
  );
}

function StaticView() {
  const tiles = Array.from({ length: 12 }, (_, k) => TILES[tileAt(k % 4, Math.floor(k / 4))]);
  return (
    <div className="bg-[#0B0B14] py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <Head />
        <div className="mt-12 grid grid-cols-3 gap-3 overflow-hidden rounded-[22px] border border-white/10 p-3 md:grid-cols-4 md:gap-4 md:p-4" aria-label="Mosaico de trabajos">
          {tiles.map((t, k) => (
            <img key={k} src={t.src} alt={t.alt} loading="lazy" className={cn("aspect-[4/5] w-full rounded-[12px] object-cover", k >= 9 && "max-md:hidden")} />
          ))}
        </div>
        <div className="mt-10"><Index /></div>
      </div>
    </div>
  );
}

function MotionView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const st = useRef({
    w: 0, h: 0, cam: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, mouse: { x: 0.5, y: 0.5 }, inside: false,
    drag: null as null | { x: number; y: number; cx: number; cy: number; moved: number },
    goal: null as null | { x: number; y: number }, focus: -1, hover: -1, dim: 0, visible: false, raf: 0,
  });
  const [label, setLabel] = useState<{ x: number; y: number; t: Tile } | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [cell, setCell] = useState({ w: 220, h: 280, gap: 24 });

  useEffect(() => {
    const set = () => setCell(window.innerWidth < 768 ? { w: 140, h: 180, gap: 14 } : { w: 220, h: 280, gap: 24 });
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Carga diferida de las fotos: solo al acercarse la sección.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      imgs.current = TILES.map((t) => { const im = new Image(); im.decoding = "async"; im.src = t.src; return im; });
      io.disconnect();
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, box = boxRef.current;
    if (!canvas || !box) return;
    const s = st.current;
    const fine = finePointer();
    const { w: IW, h: IH, gap } = cell;
    const cw = IW + gap, ch = IH + gap;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      s.w = r.width; s.h = r.height;
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /** Celda bajo un punto de pantalla. */
    const hit = (px: number, py: number) => {
      const wx = px + s.cam.x - s.w / 2 + IW / 2, wy = py + s.cam.y - s.h / 2 + IH / 2;
      const col = Math.floor(wx / cw), row = Math.floor(wy / ch);
      const lx = wx - col * cw, ly = wy - row * ch;
      if (lx < 0 || ly < 0 || lx > IW || ly > IH) return -1;
      return tileAt(col, row);
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !s.w) { s.raf = requestAnimationFrame(draw); return; }
      const dpr = canvas.width / s.w;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (s.goal) {
        // Viaje hacia la foto pedida desde el índice
        s.vel.x = (s.goal.x - s.cam.x) * 0.08; s.vel.y = (s.goal.y - s.cam.y) * 0.08;
      } else if (!s.drag) {
        const tx = s.inside && fine ? (s.mouse.x - 0.5) * 2 * MAX_SPEED : 0;
        const ty = s.inside && fine ? (s.mouse.y - 0.5) * 2 * MAX_SPEED : 0;
        s.vel.x += (tx - s.vel.x) * SMOOTHING;
        s.vel.y += (ty - s.vel.y) * SMOOTHING;
      }
      if (!s.drag) { s.cam.x += s.vel.x; s.cam.y += s.vel.y; }
      s.dim += ((s.focus >= 0 ? 1 : 0) - s.dim) * 0.12;

      ctx.clearRect(0, 0, s.w, s.h);
      const c0 = Math.floor((s.cam.x - s.w / 2) / cw) - 1, c1 = Math.ceil((s.cam.x + s.w / 2) / cw) + 1;
      const r0 = Math.floor((s.cam.y - s.h / 2) / ch) - 1, r1 = Math.ceil((s.cam.y + s.h / 2) / ch) + 1;
      for (let row = r0; row <= r1; row++) {
        for (let col = c0; col <= c1; col++) {
          const sx = col * cw - s.cam.x + s.w / 2 - IW / 2;
          const sy = row * ch - s.cam.y + s.h / 2 - IH / 2;
          const idx = tileAt(col, row);
          const im = imgs.current[idx];
          ctx.save();
          roundRect(ctx, sx, sy, IW, IH, RADIUS);
          ctx.clip();
          if (im && im.complete && im.naturalWidth) {
            // recorte tipo object-fit: cover
            const r = Math.max(IW / im.naturalWidth, IH / im.naturalHeight);
            const dw = im.naturalWidth * r, dh = im.naturalHeight * r;
            ctx.drawImage(im, sx + (IW - dw) / 2, sy + (IH - dh) / 2, dw, dh);
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.fillRect(sx, sy, IW, IH);
          }
          const isFocus = TILES[idx].project === s.focus;
          const isHover = idx === s.hover;
          const shade = s.dim * (isFocus ? 0 : 0.72) + (!isHover && s.hover >= 0 && s.dim < 0.05 ? 0.25 : 0);
          if (shade > 0.01) { ctx.fillStyle = `rgba(11,11,20,${shade})`; ctx.fillRect(sx, sy, IW, IH); }
          ctx.restore();
          ctx.save();
          roundRect(ctx, sx, sy, IW, IH, RADIUS);
          ctx.strokeStyle = isFocus && s.dim > 0.5 ? "rgba(153,196,228,0.9)" : "rgba(255,255,255,0.08)";
          ctx.lineWidth = isFocus && s.dim > 0.5 ? 2 : 1;
          ctx.stroke();
          ctx.restore();
        }
      }
      s.raf = s.visible ? requestAnimationFrame(draw) : 0;
    };
    const start = () => { if (!s.raf) s.raf = requestAnimationFrame(draw); };

    const vis = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) start(); }, { threshold: 0 });
    vis.observe(box);

    const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const down = (e: PointerEvent) => {
      const p = local(e);
      s.drag = { x: p.x, y: p.y, cx: s.cam.x, cy: s.cam.y, moved: 0 };
      s.goal = null; s.vel.x = 0; s.vel.y = 0;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const p = local(e);
      s.mouse = { x: p.x / s.w, y: p.y / s.h };
      if (s.drag) {
        const dx = p.x - s.drag.x, dy = p.y - s.drag.y;
        s.drag.moved = Math.max(s.drag.moved, Math.hypot(dx, dy));
        const nx = s.drag.cx - dx, ny = s.drag.cy - dy;
        s.vel.x = (nx - s.cam.x) * 0.6; s.vel.y = (ny - s.cam.y) * 0.6;
        s.cam.x = nx; s.cam.y = ny;
      }
      if (e.pointerType === "mouse") {
        const idx = hit(p.x, p.y);
        s.hover = idx;
        setLabel(idx >= 0 ? { x: p.x, y: p.y, t: TILES[idx] } : null);
        canvas.style.cursor = s.drag ? "grabbing" : idx >= 0 && TILES[idx].href ? "pointer" : "grab";
      }
    };
    const up = (e: PointerEvent) => {
      const d = s.drag;
      s.drag = null;
      if (d && d.moved < 6) {
        const p = local(e);
        const idx = hit(p.x, p.y);
        const href = idx >= 0 ? TILES[idx].href : undefined;
        if (href) window.location.assign(href);
      }
    };
    const enter = () => { s.inside = true; };
    const leave = () => { s.inside = false; s.hover = -1; setLabel(null); };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", () => { s.drag = null; });
    canvas.addEventListener("pointerenter", enter);
    canvas.addEventListener("pointerleave", leave);
    start();

    return () => {
      cancelAnimationFrame(s.raf); s.raf = 0;
      ro.disconnect(); vis.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerenter", enter);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [cell]);

  /** Desde el índice: lleva la cámara a la celda más cercana que muestre ese proyecto. */
  const focusProject = (i: number | null) => {
    const s = st.current;
    setActive(i);
    s.focus = i ?? -1;
    if (i === null) { s.goal = null; return; }
    const cw = cell.w + cell.gap, ch = cell.h + cell.gap;
    const cc = Math.round(s.cam.x / cw), cr = Math.round(s.cam.y / ch);
    let best: { x: number; y: number; d: number } | null = null;
    for (let r = cr - 10; r <= cr + 10; r++) for (let c = cc - 10; c <= cc + 10; c++) {
      if (TILES[tileAt(c, r)].project !== i) continue;
      const d = Math.hypot(c - cc, r - cr);
      if (!best || d < best.d) best = { x: c * cw, y: r * ch, d };
    }
    s.goal = best ? { x: best.x, y: best.y } : null;
  };

  return (
    <div className="bg-[#0B0B14] py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <Head />
        <div ref={boxRef} className="relative mt-12 h-[min(72svh,640px)] min-h-[420px] overflow-hidden rounded-[22px] border border-white/10 bg-black/40 md:mt-14">
          <canvas ref={canvasRef} className="block h-full w-full touch-pan-y select-none" role="img"
            aria-label="Campo infinito de fotos de trabajos reales de Unical; arrastra para recorrerlo. Los proyectos están enlazados en el índice inferior." />
          {/* Viñeta + pistas */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_120px_40px_#0B0B14]" />
          <p aria-hidden className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur md:left-5 md:top-5">
            {finePointer() ? "Mueve el cursor · arrastra" : "Arrastra para explorar"}
          </p>
          {label && (
            <div aria-hidden className="pointer-events-none absolute z-10 max-w-[260px] -translate-y-full rounded-lg bg-white px-3 py-2 text-[12px] font-semibold leading-snug text-ink shadow-xl"
              style={{ left: Math.min(label.x + 16, (st.current.w || 0) - 270), top: label.y - 10 }}>
              {label.t.title}
              {label.t.href && <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-brand-strong">Ver proyecto</span>}
            </div>
          )}
        </div>
        <div className="mt-10"><Index onFocus={focusProject} active={active} /></div>
      </div>
    </div>
  );
}

export default function ProjectsC() {
  return useFull() ? <MotionView /> : <StaticView />;
}
