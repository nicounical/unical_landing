import { projects } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./projects.css";

/**
 * E — ZOOM PARALLAX. Adaptación de 21st.dev «Zoom Parallax» (efferd, id 5967):
 * siete trabajos crecen a velocidades distintas mientras haces scroll; la pieza central acaba ocupando la pantalla.
 * Usa position: sticky (sin pin) y escala por transform.
 */
const LAYOUT = [
  { w: 25, h: 25, x: 0, y: 0, s: 4 },
  { w: 35, h: 30, x: 5, y: -30, s: 5 },
  { w: 20, h: 45, x: -25, y: -10, s: 6 },
  { w: 25, h: 25, x: 27.5, y: 0, s: 5 },
  { w: 20, h: 25, x: 5, y: 27.5, s: 6 },
  { w: 30, h: 25, x: -22.5, y: 27.5, s: 8 },
  { w: 15, h: 15, x: 25, y: 22.5, s: 9 },
];

export default function ProjectsE() {
  const items = projects.items.slice(0, LAYOUT.length);
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    const q = gsap.utils.selector(root);
    if (!full) return;
    root.classList.add("is-live");
    q<HTMLElement>(".pE__el").forEach((el, i) => {
      gsap.fromTo(el, { scale: 1 }, { scale: LAYOUT[i].s, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true } });
    });
    gsap.to(q(".pE__title"), { autoAlpha: 0, scale: 0.8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "20% top", scrub: true } });
    gsap.fromTo(q(".pE__end"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: root, start: "75% bottom", end: "92% bottom", scrub: true } });
  });

  return (
    <div ref={ref} className="pE is-dark">
      <div className="pE__sticky">
        {items.map((p, i) => (
          <div key={p.title} className="pE__el">
            <a className="pE__img" href={p.href} style={{ width: `${LAYOUT[i].w}vw`, height: `${LAYOUT[i].h}vh`, transform: `translate(${LAYOUT[i].x}vw, ${LAYOUT[i].y}vh)` }}>
              <img src={p.img} alt={p.title} loading="lazy" decoding="async" />
            </a>
          </div>
        ))}
        <div className="pE__title u-wrap"><p className="u-eyebrow">{projects.eyebrow}</p><h2>{projects.title}</h2></div>
        <div className="pE__end u-wrap">
          <p className="pE__endt">{items[0].title}</p>
          <a className="u-btn u-btn--light" href={projects.allHref}><span className="u-btn__in">Ver todos los proyectos →</span></a>
        </div>
      </div>
      <ul className="pE__list u-wrap">
        {projects.items.map((p) => <li key={p.title}><a href={p.href}><img src={p.img} alt="" loading="lazy" /><span><i>{p.kind}</i><b>{p.title}</b></span></a></li>)}
      </ul>
    </div>
  );
}
