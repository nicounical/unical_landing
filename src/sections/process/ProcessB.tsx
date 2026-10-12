import { process } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { SecHead } from "../common/SecHead";
import "./process.css";

/**
 * B — BARAJA 3D. Inspirado en 21st.dev «CardStack» (ruixen.ui, id 9813): las cuatro fases son cartas apiladas en
 * profundidad; al bajar, la carta de delante se voltea hacia arriba y descubre la siguiente. Usa sticky (sin pin).
 */
export default function ProcessB() {
  const ph = process.phases;
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    root.classList.add("is-live");
    const q = gsap.utils.selector(root);
    const cards = q<HTMLElement>(".prB__card");
    cards.forEach((c, i) => gsap.set(c, { z: -i * 90, y: -i * 26, rotateX: 0, zIndex: ph.length - i }));
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: q(".prB__track")[0], start: "top top", end: "bottom bottom", scrub: 0.8 } });
    cards.slice(0, -1).forEach((c, i) => {
      tl.to(c, { rotateX: 100, y: -260, autoAlpha: 0, duration: 1 }, i);
      cards.slice(i + 1).forEach((n, k) => tl.to(n, { z: -k * 90, y: -k * 26, duration: 1 }, i));
    });
  });

  return (
    <div ref={ref} className="prB">
      <div className="prB__track">
        <div className="prB__sticky u-wrap">
          <div className="prB__left">
            <SecHead eyebrow={process.eyebrow} title={process.title} lead={process.lead} />
          </div>
          <div className="prB__deck">
            {ph.map((p) => (
              <article key={p.n} className="prB__card">
                <div className="prB__photo"><img src={p.img} alt="" loading="lazy" decoding="async" /></div>
                <div className="prB__body">
                  <span className="prB__n">Fase {p.n}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
