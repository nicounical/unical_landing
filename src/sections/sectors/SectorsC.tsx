import { useEffect, useRef } from "react";
import { sectors } from "@/content/site";
import { fullMotion } from "@/core/env";
import "./sectors.css";

/**
 * C — BOLAS CON GRAVEDAD (idea original de la landing, «Arrastra las bolas»): física propia ligera
 * (gravedad, rebote, colisiones y arrastre con lanzamiento). Empieza al entrar en pantalla.
 */
type Ball = { el: HTMLElement; x: number; y: number; vx: number; vy: number; r: number };

export default function SectorsC() {
  const pit = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = pit.current!;
    const els = Array.from(box.querySelectorAll<HTMLElement>(".seC__ball"));
    if (!fullMotion()) { box.classList.add("is-static"); return; }
    let W = box.clientWidth, H = box.clientHeight, raf = 0, running = false;
    const base = () => Math.max(56, Math.min(W, 1100) / 13);
    const balls: Ball[] = els.map((el, i) => {
      const r = base() * sectors.items[i].size;
      el.style.width = el.style.height = `${r * 2}px`;
      return { el, r, x: r + Math.random() * (W - 2 * r), y: -r * (2 + i * 1.6), vx: (Math.random() - 0.5) * 4, vy: 0 };
    });
    let drag: { b: Ball; ox: number; oy: number; lx: number; ly: number } | null = null;
    const step = () => {
      for (const b of balls) {
        if (drag?.b === b) continue;
        b.vy += 0.5; b.vx *= 0.995; b.x += b.vx; b.y += b.vy;
        if (b.y + b.r > H) { b.y = H - b.r; b.vy *= -0.55; b.vx *= 0.9; }
        if (b.x - b.r < 0) { b.x = b.r; b.vx *= -0.7; }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx *= -0.7; }
      }
      for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], c = balls[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy), m = a.r + c.r;
        if (d > 0 && d < m) {
          const nx = dx / d, ny = dy / d, o = (m - d) / 2;
          a.x -= nx * o; a.y -= ny * o; c.x += nx * o; c.y += ny * o;
          const p = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny;
          if (p > 0) { a.vx -= p * nx * 0.9; a.vy -= p * ny * 0.9; c.vx += p * nx * 0.9; c.vy += p * ny * 0.9; }
        }
      }
      for (const b of balls) b.el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(step); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.2 });
    io.observe(box);
    const pos = (e: PointerEvent) => { const r = box.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const down = (e: PointerEvent) => {
      const b = balls.find((k) => k.el === (e.target as HTMLElement).closest(".seC__ball")); if (!b) return;
      const p = pos(e); drag = { b, ox: p.x - b.x, oy: p.y - b.y, lx: p.x, ly: p.y }; box.setPointerCapture(e.pointerId); b.el.classList.add("is-drag");
    };
    const move = (e: PointerEvent) => {
      if (!drag) return; const p = pos(e);
      drag.b.vx = p.x - drag.lx; drag.b.vy = p.y - drag.ly; drag.lx = p.x; drag.ly = p.y;
      drag.b.x = Math.max(drag.b.r, Math.min(W - drag.b.r, p.x - drag.ox)); drag.b.y = Math.max(drag.b.r, Math.min(H - drag.b.r, p.y - drag.oy));
    };
    const up = () => { if (drag) { drag.b.el.classList.remove("is-drag"); drag = null; } };
    const resize = () => { W = box.clientWidth; H = box.clientHeight; };
    box.addEventListener("pointerdown", down); box.addEventListener("pointermove", move); box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); box.removeEventListener("pointerdown", down); box.removeEventListener("pointermove", move); box.removeEventListener("pointerup", up); box.removeEventListener("pointercancel", up); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="seC">
      <div className="u-wrap seC__head">
        <div><p className="u-eyebrow">{sectors.eyebrow}</p><h2>{sectors.title}</h2></div>
        <p className="seC__lead">{sectors.lead}</p>
      </div>
      <div ref={pit} className="seC__pit">
        {sectors.items.map((s, i) => (
          <div key={s.name} className={`seC__ball seC__ball--${i % 4}`} role="img" aria-label={s.name}><span>{s.name}</span></div>
        ))}
      </div>
      <p className="u-wrap seC__hint">Arrastra las bolas</p>
    </div>
  );
}
