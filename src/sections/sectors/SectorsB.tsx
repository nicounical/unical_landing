import { useEffect, useRef, useState } from "react";
import { sectors } from "@/content/site";
import { fullMotion, finePointer } from "@/core/env";
import "./sectors.css";

/** B — ESFERA ORBITAL 3D: los sectores orbitan sobre una esfera (distribución de Fibonacci) que gira sola y se orienta con el cursor. */
const N = sectors.items.length;
const PTS = sectors.items.map((_, i) => {
  const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
  return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
});

export default function SectorsB() {
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(0);

  useEffect(() => {
    let ax = -0.3, ay = 0, tx = 0.002, ty = 0.004, raf = 0, paused = false;
    const R = () => Math.min(stage.current!.clientWidth, 640) * 0.42;
    const render = () => {
      const r = R(), cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      PTS.forEach((p, i) => {
        const x1 = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
        const el = items.current[i]; if (!el) return;
        const s = 0.65 + (z2 + 1) * 0.35;
        el.style.transform = `translate(-50%, -50%) translate3d(${x1 * r}px, ${y2 * r}px, 0) scale(${s})`;
        el.style.zIndex = String(Math.round((z2 + 1) * 100));
        el.style.opacity = String(0.35 + (z2 + 1) * 0.325);
      });
    };
    render();
    if (!fullMotion()) return;
    const loop = () => { if (!paused) { ay += ty; ax += tx * 0.3; } render(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const st = stage.current!;
    const move = (e: PointerEvent) => {
      if (!finePointer()) return;
      const b = st.getBoundingClientRect();
      ty = ((e.clientX - b.left) / b.width - 0.5) * 0.02;
      tx = -((e.clientY - b.top) / b.height - 0.5) * 0.02;
    };
    const enter = () => { paused = false; };
    st.addEventListener("pointermove", move); st.addEventListener("pointerenter", enter);
    const io = new IntersectionObserver(([e]) => { paused = !e.isIntersecting; });
    io.observe(st);
    return () => { cancelAnimationFrame(raf); io.disconnect(); st.removeEventListener("pointermove", move); st.removeEventListener("pointerenter", enter); };
  }, []);

  return (
    <div className="seB is-dark">
      <div className="u-wrap seB__in">
        <div className="seB__head">
          <p className="u-eyebrow">{sectors.eyebrow}</p>
          <h2>{sectors.title}</h2>
          <p className="seB__lead">{sectors.lead}</p>
          <div className="seB__preview" aria-hidden="true">
            {sectors.items.map((s, i) => <img key={s.name} src={s.img} alt="" className={i === active ? "is-on" : ""} loading="lazy" />)}
          </div>
        </div>
        <div ref={stage} className="seB__stage">
          <div className="seB__core" aria-hidden="true" />
          <ul className="seB__list">
            {sectors.items.map((s, i) => (
              <li key={s.name} ref={(el) => (items.current[i] = el)} className="seB__item">
                <button onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)}>{s.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
