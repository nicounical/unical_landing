import { projects } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { SecHead } from "../common/SecHead";
import "./projects.css";

/**
 * B — MURO 3D QUE SE DESPLIEGA. Inspirado en 21st.dev «3D Parallax Unfurling Gallery» (piyushxdev, id 20039)
 * y «Parallax Grid Scroll» (id 1224): la rejilla entra inclinada en 3D, se endereza con el scroll y
 * cada columna viaja a una velocidad; las piezas se inclinan con el cursor.
 */
export default function ProjectsB() {
  const cols = [0, 1, 2].map((c) => projects.items.filter((_, i) => i % 3 === c));
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".pB__plane"), { rotateX: 38, rotateZ: -8, scale: 0.82, yPercent: 6 }, {
      rotateX: 0, rotateZ: 0, scale: 1, yPercent: 0, ease: "none",
      scrollTrigger: { trigger: root, start: "top 85%", end: "top 5%", scrub: 1 },
    });
    q<HTMLElement>(".pB__col").forEach((c, i) => {
      gsap.fromTo(c, { yPercent: [10, -6, 14][i] }, { yPercent: [-10, 8, -14][i], ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    });
    if (!fine) return;
    q<HTMLElement>(".pB__card").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      const m = (e: PointerEvent) => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 14); rx(-((e.clientY - r.top) / r.height - 0.5) * 14); };
      const l = () => { rx(0); ry(0); };
      card.addEventListener("pointermove", m); card.addEventListener("pointerleave", l);
      onCleanup(() => { card.removeEventListener("pointermove", m); card.removeEventListener("pointerleave", l); });
    });
  });

  return (
    <div ref={ref} className="pB">
      <div className="u-wrap pB__head">
        <SecHead eyebrow={projects.eyebrow} title={projects.title} />
        <a className="pB__all" href={projects.allHref}>Ver todos los proyectos →</a>
      </div>
      <div className="pB__stage">
        <div className="pB__plane u-wrap">
          {cols.map((col, ci) => (
            <div key={ci} className="pB__col">
              {col.map((p) => (
                <a key={p.title} href={p.href} className="pB__card">
                  <img src={p.img} alt={p.title} loading="lazy" decoding="async" />
                  <span className="pB__cap"><i>{p.kind}</i><b>{p.title}</b></span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
