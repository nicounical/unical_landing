import { useRef, useState } from "react";
import { sectors } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap, ScrollTrigger } from "@/core/scroll";
import "./sectors.css";

/** E — BANDAS CRUZADAS: dos bandas diagonales con los sectores que se cruzan y aceleran con la velocidad del scroll. Botón de pausa accesible. */
export default function SectorsE() {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    const tracks = q<HTMLElement>(".seE__track");
    const tweens = tracks.map((t, i) => gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 28, ease: "none", repeat: -1 }));
    ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      onUpdate: (st) => {
        if (pausedRef.current) return;
        const v = gsap.utils.clamp(1, 6, 1 + Math.abs(st.getVelocity()) / 400);
        tweens.forEach((tw) => { gsap.to(tw, { timeScale: v, duration: 0.2, overwrite: true }); gsap.to(tw, { timeScale: 1, duration: 1.2, delay: 0.2 }); });
      },
    });
    const io = new IntersectionObserver(([e]) => tweens.forEach((tw) => (e.isIntersecting && !pausedRef.current ? tw.play() : tw.pause())));
    io.observe(root);
    (root as HTMLElement & { _tw?: gsap.core.Tween[] })._tw = tweens;
    return () => io.disconnect();
  });
  const toggle = () => {
    const tw = (ref.current as (HTMLDivElement & { _tw?: gsap.core.Tween[] }) | null)?._tw ?? [];
    pausedRef.current = !pausedRef.current; setPaused(pausedRef.current);
    tw.forEach((t) => (pausedRef.current ? t.pause() : t.play()));
  };
  const Row = () => <>{sectors.items.map((s) => <span key={s.name} className="seE__w">{s.name}<img src={s.img} alt="" loading="lazy" /></span>)}</>;
  return (
    <div ref={ref} className="seE is-dark">
      <div className="u-wrap seE__head">
        <div><p className="u-eyebrow">{sectors.eyebrow}</p><h2>{sectors.title}</h2></div>
        <button className="seE__pause" onClick={toggle} aria-pressed={paused}>{paused ? "Reanudar" : "Pausar"} movimiento</button>
      </div>
      <div className="seE__cross" aria-label={`Sectores: ${sectors.items.map((s) => s.name).join(", ")}`}>
        <div className="seE__band seE__band--a"><div className="seE__track"><Row /><Row /></div></div>
        <div className="seE__band seE__band--b"><div className="seE__track"><Row /><Row /></div></div>
      </div>
      <p className="u-wrap seE__lead">{sectors.lead}</p>
    </div>
  );
}
