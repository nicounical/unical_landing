import { useEffect, useRef } from "react";
import { clients } from "@/content/site";
import { fullMotion } from "@/core/env";
import { ClientMark } from "./ClientMark";
import "./clients.css";

/** C — LLUVIA DE LOGOS: al entrar en pantalla los logos caen, rebotan y se apilan; el cursor los empuja. */
type B = { el: HTMLElement; x: number; y: number; vx: number; vy: number; w: number; h: number; r: number; vr: number };

export default function ClientsC() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = box.current!;
    const els = Array.from(st.querySelectorAll<HTMLElement>(".clC__chip"));
    if (!fullMotion()) { st.classList.add("is-static"); return; }
    let W = st.clientWidth, H = st.clientHeight, raf = 0, run = false, mx = -999, my = -999;
    const bs: B[] = els.map((el, i) => ({ el, w: el.offsetWidth, h: el.offsetHeight, x: Math.random() * (W - el.offsetWidth), y: -80 - i * 45, vx: 0, vy: 0, r: (Math.random() - 0.5) * 30, vr: 0 }));
    const step = () => {
      bs.forEach((b) => {
        b.vy += 0.45; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.vx *= 0.98; b.vr *= 0.95;
        const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy);
        if (d < 140) { b.vx += (dx / d) * 1.4; b.vy += (dy / d) * 1.4; b.vr += dx > 0 ? 1 : -1; }
        if (b.y + b.h > H) { b.y = H - b.h; b.vy *= -0.35; b.vx *= 0.85; b.r *= 0.9; }
        if (b.x < 0) { b.x = 0; b.vx *= -0.6; }
        if (b.x + b.w > W) { b.x = W - b.w; b.vx *= -0.6; }
      });
      // apilado simple: separa solapes verticales
      for (let i = 0; i < bs.length; i++) for (let j = 0; j < bs.length; j++) {
        if (i === j) continue; const a = bs[i], c = bs[j];
        if (a.x < c.x + c.w && a.x + a.w > c.x && a.y < c.y + c.h && a.y + a.h > c.y) {
          const oy = a.y + a.h - c.y, ox = Math.min(a.x + a.w - c.x, c.x + c.w - a.x);
          if (oy < ox && a.y < c.y) { a.y -= oy; if (a.vy > 0) a.vy *= -0.2; } else { const s = a.x < c.x ? -1 : 1; a.x += s * ox / 2; c.x -= s * ox / 2; }
        }
      }
      bs.forEach((b) => (b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.r}deg)`));
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !run) { run = true; raf = requestAnimationFrame(step); } else if (!e.isIntersecting && run) { run = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.3 });
    io.observe(st);
    const mv = (e: PointerEvent) => { const r = st.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const lv = () => { mx = my = -999; };
    const rs = () => { W = st.clientWidth; H = st.clientHeight; };
    st.addEventListener("pointermove", mv); st.addEventListener("pointerleave", lv); window.addEventListener("resize", rs);
    return () => { cancelAnimationFrame(raf); io.disconnect(); st.removeEventListener("pointermove", mv); st.removeEventListener("pointerleave", lv); window.removeEventListener("resize", rs); };
  }, []);
  return (
    <div className="clC">
      <div className="u-wrap clC__head">
        <div><p className="u-eyebrow">{clients.eyebrow}</p><h2>{clients.title}</h2></div>
        <p className="clC__lead">{clients.lead}</p>
      </div>
      <div ref={box} className="clC__box" aria-label="Logotipos de clientes" role="list">
        {clients.items.map((c) => <div key={c.name} className="clC__chip" role="listitem"><ClientMark c={c} /></div>)}
        <p className="clC__big" aria-hidden="true">{clients.foot}</p>
      </div>
      <p className="u-wrap clC__foot">Y <b>{clients.foot}</b> {clients.footText}</p>
    </div>
  );
}
