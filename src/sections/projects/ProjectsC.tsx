import { useEffect, useRef, useState } from "react";
import { projects, gallery } from "@/content/site";
import { fullMotion } from "@/core/env";
import "./projects.css";

/**
 * C — LIENZO ARRASTRABLE INFINITO. Inspirado en 21st.dev «Infinite Drag + Scroll Gallery» (rylenlobo, id 2481):
 * un lienzo sin bordes que se arrastra con inercia en todas direcciones. Teclado: flechas.
 */
const TILES = [...projects.items.map((p) => ({ ...p, real: true })), ...gallery.slice(0, 8).map((img, i) => ({ title: "", client: "", kind: "", href: projects.allHref, img, real: false, k: i }))];
const COLS = 6, ROWS = 5, TW = 340, TH = 260, GAP = 28;

export default function ProjectsC() {
  const stage = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const st = stage.current!, g = grid.current!;
    const cells = Array.from(g.children) as HTMLElement[];
    const W = COLS * (TW + GAP), H = ROWS * (TH + GAP);
    let x = -W / 2 + st.clientWidth / 2, y = -H / 2 + st.clientHeight / 2, vx = 0, vy = 0, drag = false, lx = 0, ly = 0, moved = 0;
    const wrap = (v: number, m: number) => ((v % m) + m) % m;
    const layout = () => {
      cells.forEach((c, i) => {
        const cx = (i % COLS) * (TW + GAP) + ((Math.floor(i / COLS) % 2) * (TW / 2));
        const cy = Math.floor(i / COLS) * (TH + GAP);
        const px = wrap(cx + x + TW, W) - TW, py = wrap(cy + y + TH, H) - TH;
        c.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      });
    };
    layout();
    let raf = 0;
    const loop = () => {
      if (!drag) { x += vx; y += vy; vx *= 0.94; vy *= 0.94; }
      layout();
      raf = requestAnimationFrame(loop);
    };
    if (fullMotion()) raf = requestAnimationFrame(loop);
    const down = (e: PointerEvent) => { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; st.setPointerCapture(e.pointerId); st.classList.add("is-drag"); setHint(false); };
    const move = (e: PointerEvent) => { if (!drag) return; vx = e.clientX - lx; vy = e.clientY - ly; moved += Math.abs(vx) + Math.abs(vy); x += vx; y += vy; lx = e.clientX; ly = e.clientY; if (!fullMotion()) layout(); };
    const up = () => { drag = false; st.classList.remove("is-drag"); };
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    const key = (e: KeyboardEvent) => {
      const d = 160; if (e.key === "ArrowLeft") vx = 18; else if (e.key === "ArrowRight") vx = -18; else if (e.key === "ArrowUp") vy = 18; else if (e.key === "ArrowDown") vy = -18; else return;
      e.preventDefault(); if (!fullMotion()) { x += Math.sign(vx) * d; y += Math.sign(vy) * d; vx = vy = 0; layout(); }
    };
    st.addEventListener("pointerdown", down); st.addEventListener("pointermove", move); st.addEventListener("pointerup", up); st.addEventListener("pointercancel", up);
    st.addEventListener("click", click, true); st.addEventListener("keydown", key);
    // Entrada: clase CSS al entrar en pantalla (el transform lo controla el bucle de arrastre)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { st.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(st);
    return () => { io.disconnect(); cancelAnimationFrame(raf); st.removeEventListener("pointerdown", down); st.removeEventListener("pointermove", move); st.removeEventListener("pointerup", up); st.removeEventListener("pointercancel", up); st.removeEventListener("click", click, true); st.removeEventListener("keydown", key); };
  }, []);

  return (
    <div className="pC is-dark">
      <div className="pC__head u-wrap">
        <div><p className="u-eyebrow">{projects.eyebrow}</p><h2 className="pC__h">{projects.title}</h2></div>
        <a className="u-btn u-btn--light" href={projects.allHref}><span className="u-btn__in">Ver todos →</span></a>
      </div>
      <div ref={stage} className="pC__stage" tabIndex={0} aria-label="Lienzo de proyectos: arrastra o usa las flechas para explorar">
        <div ref={grid} className="pC__grid">
          {Array.from({ length: COLS * ROWS }, (_, i) => TILES[i % TILES.length]).map((t, i) => (
            <a key={i} href={t.href} className={`pC__tile ${t.real ? "is-real" : ""}`} draggable={false} style={{ width: TW, height: TH }} tabIndex={-1} aria-hidden={!t.real || i >= TILES.length}>
              <img src={t.img} alt={t.real ? t.title : ""} loading="lazy" decoding="async" draggable={false} />
              {t.real && <span className="pC__cap"><i>{t.kind}</i><b>{t.title}</b></span>}
            </a>
          ))}
        </div>
        <div className={`pC__hint ${hint ? "" : "is-off"}`} aria-hidden="true"><span>Arrastra para explorar</span></div>
        <div className="pC__vign" aria-hidden="true" />
      </div>
      <ul className="u-sr">{projects.items.map((p) => <li key={p.title}><a href={p.href}>{p.title}</a></li>)}</ul>
    </div>
  );
}
