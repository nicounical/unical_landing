import { useState } from "react";
import { projects } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { SecHead } from "../common/SecHead";
import "./projects.css";

/**
 * D — ÍNDICE CON VISTA PREVIEW. Lista sobria y numerada; la imagen del proyecto aparece y sigue al cursor
 * (patrón de 21st.dev «Image Trail» / hover reveal, id 1018) con un proyecto destacado arriba.
 */
export default function ProjectsD() {
  const [hover, setHover] = useState<number | null>(null);
  const feat = projects.items[0];
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    const q = gsap.utils.selector(root);
    if (full) gsap.from(q(".pD__feat img"), { scale: 1.2, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true } });
    if (!fine || !full) return;
    const pv = q<HTMLElement>(".pD__pv")[0];
    const xTo = gsap.quickTo(pv, "x", { duration: 0.55, ease: "power3" }), yTo = gsap.quickTo(pv, "y", { duration: 0.55, ease: "power3" });
    const m = (e: PointerEvent) => { const r = root.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top); };
    root.addEventListener("pointermove", m);
    onCleanup(() => root.removeEventListener("pointermove", m));
  });

  return (
    <div ref={ref} className="pD">
      <div className="u-wrap">
        <div className="pD__top">
          <SecHead eyebrow={projects.eyebrow} title={projects.title} />
          <a className="pD__all" href={projects.allHref}>Ver todos los proyectos <span aria-hidden>→</span></a>
        </div>
        <a className="pD__feat" href={feat.href}>
          <img src={feat.img} alt={feat.title} loading="lazy" decoding="async" />
          <span className="pD__featcap"><i>Destacado · {feat.kind}</i><b>{feat.title}</b></span>
        </a>
        <ol className="pD__list" onPointerLeave={() => setHover(null)}>
          {projects.items.map((p, i) => (
            <li key={p.title} className={hover === i ? "is-on" : hover !== null ? "is-dim" : ""} onPointerEnter={() => setHover(i)}>
              <a href={p.href} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
                <span className="pD__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="pD__t">{p.title}</span>
                <span className="pD__k">{p.kind}</span>
                <span className="pD__c">{p.client}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className={`pD__pv ${hover !== null ? "is-on" : ""}`} aria-hidden="true">
        {projects.items.map((p, i) => <img key={p.title} src={p.img} alt="" className={hover === i ? "is-on" : ""} loading="lazy" decoding="async" />)}
      </div>
    </div>
  );
}
