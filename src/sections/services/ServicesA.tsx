import { services } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./services.css";

/** A — CAPÍTULOS DE CINE: cada servicio es un plano a pantalla completa; el scroll funde planos con zoom lento. */
export default function ServicesA() {
  const items = services.items;
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    if (!full) return;
    root.classList.add("is-live");
    const q = gsap.utils.selector(root);
    const panels = q<HTMLElement>(".sA__panel");
    const rail = q<HTMLElement>(".sA__rail li");
    gsap.set(panels.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(q(".sA__panel img"), { scale: 1.18 });
    gsap.set(panels.slice(1).map((p) => p.querySelectorAll(".sA__reveal")), { yPercent: 110 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root, start: "top top", end: `+=${items.length * (mobile ? 80 : 100)}%`, pin: true, scrub: 0.7,
        onUpdate: (st) => {
          const i = Math.min(items.length - 1, Math.floor(st.progress * items.length * 0.999));
          rail.forEach((li, k) => li.classList.toggle("is-on", k === i));
        },
      },
    });
    panels.forEach((p, i) => {
      const img = p.querySelector("img");
      tl.to(img, { scale: 1, duration: 1 }, i);
      if (i > 0) {
        tl.to(p, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.inOut" }, i - 0.35)
          .to(p.querySelectorAll(".sA__reveal"), { yPercent: 0, stagger: 0.05, duration: 0.35, ease: "power3.out" }, i - 0.05)
          .to(panels[i - 1].querySelectorAll(".sA__reveal"), { yPercent: -110, stagger: 0.03, duration: 0.3 }, i - 0.35);
      }
    });
  });

  return (
    <div ref={ref} className="sA is-dark">
      <div className="sA__head u-wrap"><p className="u-eyebrow">{services.eyebrow}</p><h2>{services.title}</h2></div>
      {items.map((s, i) => (
        <article key={s.n} className="sA__panel" style={{ zIndex: i + 1 }}>
          <img src={s.img} alt={s.alt} loading="lazy" decoding="async" />
          <div className="sA__shade" />
          <div className="sA__txt u-wrap">
            <span className="u-wmask"><span className="sA__reveal sA__n">{s.n}</span></span>
            <h3><span className="u-wmask"><span className="sA__reveal">{s.title}</span></span></h3>
            <span className="u-wmask"><span className="sA__reveal sA__sub">{s.sub}</span></span>
            <span className="u-wmask"><span className="sA__reveal sA__p">{s.text}</span></span>
            <span className="u-wmask"><a className="sA__reveal sA__go" href={s.href}>Ver servicio <span aria-hidden>→</span></a></span>
          </div>
        </article>
      ))}
      <ol className="sA__rail" aria-hidden="true">
        {items.map((s, i) => <li key={s.n} className={i === 0 ? "is-on" : ""}><i />{s.title}</li>)}
      </ol>
    </div>
  );
}
