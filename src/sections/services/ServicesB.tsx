import { useEffect, useRef, useState } from "react";
import { services } from "@/content/site";
import { gsap, ScrollTrigger } from "@/core/scroll";
import { fullMotion, isMobile, finePointer } from "@/core/env";
import { SecHead } from "../common/SecHead";
import "./services.css";

/** B — CARRUSEL CILÍNDRICO 3D: los seis servicios giran en un cilindro con scroll, arrastre y cursor. */
export default function ServicesB() {
  const items = services.items;
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const step = 360 / items.length;

  useEffect(() => {
    if (!fullMotion() || isMobile()) return;
    setLive(true);
    const el = root.current!, r = ring.current!;
    let base = 0, drag = 0, startX = 0, dragging = false;
    const apply = () => {
      const rot = base + drag;
      gsap.to(r, { rotationY: rot, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      const idx = ((Math.round(-rot / step) % items.length) + items.length) % items.length;
      setActive(idx);
    };
    const st = ScrollTrigger.create({
      trigger: el, start: "top top", end: `+=${items.length * 60}%`, pin: true, scrub: true,
      onUpdate: (s) => { base = -s.progress * step * (items.length - 1); apply(); },
    });
    const down = (e: PointerEvent) => { dragging = true; startX = e.clientX; };
    const move = (e: PointerEvent) => {
      if (dragging) { drag = (e.clientX - startX) * 0.25; apply(); }
      else if (finePointer()) {
        const b = el.getBoundingClientRect();
        gsap.to(el.querySelector(".sB__stage"), { rotationX: ((e.clientY - b.top) / b.height - 0.5) * -8, duration: 1, ease: "power3" });
      }
    };
    const up = () => { if (!dragging) return; dragging = false; base += Math.round(drag / step) * step; drag = 0; apply(); };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { st.kill(); el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); gsap.set(r, { clearProps: "transform" }); };
  }, [items.length, step]);

  const cur = items[active];
  return (
    <div ref={root} className={`sB is-dark ${live ? "is-live" : ""}`}>
      <div className="sB__in u-wrap">
        <SecHead eyebrow={services.eyebrow} title={services.title} />
        <div className="sB__stage">
          <div ref={ring} className="sB__ring">
            {items.map((s, i) => (
              <a key={s.n} href={s.href} className={`sB__card ${i === active ? "is-on" : ""}`} style={{ ["--a" as string]: `${i * step}deg` }} draggable={false}>
                <img src={s.img} alt={s.alt} loading="lazy" decoding="async" draggable={false} />
                <span className="sB__cardt"><i>{s.n}</i>{s.title}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="sB__detail" aria-live="polite">
          <p className="sB__sub">{cur.n} · {cur.sub}</p>
          <h3>{cur.title}</h3>
          <p>{cur.text}</p>
          <a href={cur.href} className="u-btn u-btn--light"><span className="u-btn__in">Ver servicio →</span></a>
        </div>
        <p className="sB__hint" aria-hidden="true">Scroll o arrastra para girar</p>
      </div>
    </div>
  );
}
