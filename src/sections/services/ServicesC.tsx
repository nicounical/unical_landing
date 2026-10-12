import { useState } from "react";
import { services } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap, ScrollTrigger } from "@/core/scroll";
import "./services.css";

/** C — ÍNDICE TIPOGRÁFICO: nombres gigantes que se deforman con la velocidad del scroll; la foto sigue al cursor. */
export default function ServicesC() {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".sC__row > a"), { yPercent: 60, autoAlpha: 0, stagger: 0.07, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    if (!full) return;
    const skew = gsap.quickTo(q(".sC__list"), "skewY", { duration: 0.5, ease: "power3" });
    ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: (st) => skew(gsap.utils.clamp(-6, 6, st.getVelocity() / -320)) });
    if (!fine) return;
    const fx = q<HTMLElement>(".sC__float")[0];
    const xTo = gsap.quickTo(fx, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(fx, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(fx, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const b = root.getBoundingClientRect();
      xTo(e.clientX - b.left); yTo(e.clientY - b.top); rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6)); lastX = e.clientX;
    };
    root.addEventListener("pointermove", move);
    onCleanup(() => root.removeEventListener("pointermove", move));
  });

  return (
    <div ref={ref} className="sC" onPointerLeave={() => setHover(null)}>
      <div className="u-wrap">
        <div className="sC__head"><p className="u-eyebrow">{services.eyebrow}</p><h2>{services.title}</h2></div>
        <ul className="sC__list">
          {services.items.map((s, i) => (
            <li key={s.n} className={`sC__row ${hover === i ? "is-on" : ""} ${hover !== null && hover !== i ? "is-dim" : ""}`} onPointerEnter={() => setHover(i)}>
              <a href={s.href} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
                <span className="sC__n">{s.n}</span>
                <span className="sC__t" data-text={s.title}>{s.title}</span>
                <span className="sC__meta"><b>{s.sub}</b><span>{s.text}</span></span>
                <img className="sC__thumb" src={s.img} alt="" loading="lazy" decoding="async" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={`sC__float ${hover !== null ? "is-on" : ""}`} aria-hidden="true">
        {services.items.map((s, i) => <img key={s.n} src={s.img} alt="" className={hover === i ? "is-on" : ""} loading="lazy" decoding="async" />)}
      </div>
    </div>
  );
}
