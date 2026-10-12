import { useEffect, useRef, useState } from "react";
import { clients } from "@/content/site";
import { gsap, ScrollTrigger } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import { ClientMark } from "./ClientMark";
import "./clients.css";

/**
 * E — DOBLE MARQUESINA. Adaptación de 21st.dev «Logo Marquee» (ddoemonn, id 23537, accesible): dos bandas en sentidos
 * opuestos que aceleran con el scroll, bordes difuminados, pausa al pasar/enfocar y botón de pausa (WCAG 2.2.2).
 */
export default function ClientsE() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(!fullMotion());
  const tws = useRef<gsap.core.Tween[]>([]);
  const half = Math.ceil(clients.items.length / 2);
  const rows = [clients.items.slice(0, half), clients.items.slice(half)];

  useEffect(() => {
    if (!fullMotion()) return;
    const el = root.current!;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>(".clE__track"));
    tws.current = tracks.map((t, i) => gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 40, ease: "none", repeat: -1 }));
    const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onUpdate: (s) => {
      const v = gsap.utils.clamp(1, 5, 1 + Math.abs(s.getVelocity()) / 500);
      tws.current.forEach((tw) => { if (!tw.paused()) { gsap.to(tw, { timeScale: v, duration: 0.2, overwrite: true }); gsap.to(tw, { timeScale: 1, duration: 1.4, delay: 0.25 }); } });
    } });
    const io = new IntersectionObserver(([e]) => tws.current.forEach((tw) => (e.isIntersecting ? tw.play() : tw.pause())));
    io.observe(el);
    return () => { st.kill(); io.disconnect(); tws.current.forEach((t) => t.kill()); };
  }, []);
  useEffect(() => { tws.current.forEach((t) => (paused ? t.pause() : t.play())); }, [paused]);
  const hover = (on: boolean) => { if (!paused) tws.current.forEach((t) => gsap.to(t, { timeScale: on ? 0.15 : 1, duration: 0.5 })); };

  return (
    <div ref={root} className="clE is-dark">
      <div className="u-wrap clE__head">
        <div><p className="u-eyebrow">{clients.eyebrow}</p><h2>{clients.title}</h2></div>
        <div className="clE__side"><p className="clE__lead">{clients.lead}</p>
          <button className="clE__pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>{paused ? "Reanudar" : "Pausar"} logos</button></div>
      </div>
      <div className="clE__bands" onPointerEnter={() => hover(true)} onPointerLeave={() => hover(false)} onFocus={() => hover(true)} onBlur={() => hover(false)}>
        {rows.map((r, i) => (
          <div key={i} className="clE__band">
            <ul className={`clE__track ${paused ? "is-static" : ""}`} aria-label={i ? undefined : "Logotipos de clientes"}>
              {[...r, ...r].map((c, k) => <li key={k} aria-hidden={k >= r.length}><ClientMark c={c} /></li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="u-wrap clE__foot">Y <b>{clients.foot}</b> {clients.footText}</p>
    </div>
  );
}
