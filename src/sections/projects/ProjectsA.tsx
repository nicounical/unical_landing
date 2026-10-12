import { projects } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { SecHead } from "../common/SecHead";
import "./projects.css";

/**
 * A — PILA CINEMATOGRÁFICA. Adaptación de 21st.dev «Stacking Cards» (danielpetho, id 25275):
 * cada proyecto se fija (sticky) y, al llegar el siguiente, el anterior retrocede, se encoge y se oscurece.
 * Sin pin de ScrollTrigger: usa position: sticky (más ligero en móvil).
 */
export default function ProjectsA() {
  const items = projects.items;
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    const cards = q<HTMLElement>(".pA__card");
    cards.forEach((c, i) => {
      if (i === cards.length - 1) return;
      gsap.to(c.querySelector(".pA__inner"), {
        scale: 0.9 - (cards.length - i) * 0.008, filter: "brightness(.45)", ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 12%", scrub: true },
      });
      gsap.fromTo(c.querySelector("img"), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top top", scrub: true } });
    });
  });

  return (
    <div ref={ref} className="pA is-dark">
      <div className="u-wrap pA__head">
        <SecHead eyebrow={projects.eyebrow} title={projects.title} />
        <a className="u-btn u-btn--ghost" href={projects.allHref}><span className="u-btn__in">Ver todos los proyectos →</span></a>
      </div>
      <div className="pA__stack u-wrap">
        {items.map((p, i) => (
          <article key={p.title} className="pA__card" style={{ top: `calc(6.5rem + ${i * 14}px)` }}>
            <a href={p.href} className="pA__inner">
              <img src={p.img} alt={p.title} loading="lazy" decoding="async" />
              <span className="pA__shade" />
              <span className="pA__meta">
                <span className="pA__n">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                <span className="pA__kind">{p.kind}</span>
              </span>
              <span className="pA__t">{p.title}</span>
              <span className="pA__go">Ver proyecto →</span>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
