import { useState } from "react";
import { process } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./process.css";

/**
 * A — FASES A PANTALLA. Inspirado en 21st.dev «Scroll Gallery» (soralabs, id 30118): sección fijada que barre entre
 * fotografías a sangre con una cortina, número gigante por fase y línea de progreso.
 */
export default function ProcessA() {
  const [cur, setCur] = useState(0);
  const ph = process.phases;
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    if (!full) return;
    root.classList.add("is-live");
    const q = gsap.utils.selector(root);
    const imgs = q<HTMLElement>(".prA__img");
    gsap.set(imgs.slice(1), { clipPath: "inset(0% 0% 0% 100%)" });
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
      trigger: root, start: "top top", end: `+=${ph.length * (mobile ? 70 : 90)}%`, pin: true, scrub: 0.6,
      onUpdate: (st) => { setCur(Math.min(ph.length - 1, Math.floor(st.progress * ph.length * 0.999))); gsap.set(q(".prA__bar i"), { scaleY: st.progress }); },
    } });
    imgs.forEach((im, i) => {
      tl.fromTo(im.querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 1 }, i);
      if (i > 0) tl.to(im, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power2.inOut" }, i - 0.25);
    });
  });

  return (
    <div ref={ref} className="prA is-dark">
      <div className="prA__media" aria-hidden="true">
        {ph.map((p) => <div key={p.n} className="prA__img"><img src={p.img} alt="" loading="lazy" decoding="async" /></div>)}
        <div className="prA__shade" />
      </div>
      <div className="prA__ui u-wrap">
        <div className="prA__head"><p className="u-eyebrow">{process.eyebrow}</p><h2>{process.title}</h2></div>
        <div className="prA__body">
          <span className="prA__big" aria-hidden="true" key={cur}>{ph[cur].n}</span>
          <div className="prA__txt" aria-live="polite">
            <h3 key={`t${cur}`}>{ph[cur].title}</h3>
            <p key={`p${cur}`}>{ph[cur].text}</p>
            <ul>{ph[cur].tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
        <ol className="prA__steps">
          {ph.map((p, i) => <li key={p.n} className={i === cur ? "is-on" : i < cur ? "is-done" : ""}><b>{p.n}</b> {p.title}</li>)}
        </ol>
        <p className="prA__lead">{process.lead}</p>
      </div>
      <span className="prA__bar" aria-hidden="true"><i /></span>
      <div className="prA__static u-wrap">
        {ph.map((p) => (
          <article key={p.n}><img src={p.img} alt="" loading="lazy" /><span>{p.n}</span><h3>{p.title}</h3><p>{p.text}</p></article>
        ))}
      </div>
    </div>
  );
}
