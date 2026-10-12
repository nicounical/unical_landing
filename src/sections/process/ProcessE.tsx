import { process } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./process.css";

/** E — PALABRAS EN CARRERA: las cuatro fases cruzan la pantalla a gran escala, sincronizadas con el scroll y con su foto dentro. */
export default function ProcessE() {
  const ph = process.phases;
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    q<HTMLElement>(".prE__row").forEach((row, i) => {
      const dir = i % 2 ? 1 : -1;
      gsap.fromTo(row.querySelector(".prE__word"), { xPercent: dir * -30 }, { xPercent: dir * 30, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(row.querySelector(".prE__pic"), { scale: 0.4, rotate: dir * 10 }, { scale: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: row, start: "top 90%", end: "center center", scrub: true } });
      gsap.from(row.querySelectorAll(".prE__info > *"), { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 70%" } });
    });
  });

  return (
    <div ref={ref} className="prE is-dark">
      <div className="u-wrap prE__head">
        <p className="u-eyebrow">{process.eyebrow}</p>
        <h2>{process.title}</h2>
        <p className="prE__lead">{process.lead}</p>
      </div>
      {ph.map((p, i) => (
        <section key={p.n} className={`prE__row ${i % 2 ? "is-r" : ""}`} aria-label={`Fase ${p.n}: ${p.title}`}>
          <div className="prE__word" aria-hidden="true">
            <span>{p.title}</span><span className="prE__pic"><img src={p.img} alt="" loading="lazy" decoding="async" /></span><span className="u-hollow">{p.title}</span>
          </div>
          <div className="prE__info u-wrap">
            <span className="prE__n">{p.n} / 04</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
