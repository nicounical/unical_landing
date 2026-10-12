import { why } from "@/content/site";
import { Btn, Icon } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./why.css";

/** B — PILA CON PROFUNDIDAD (evolución del «stack sticky» de la landing): cada pilar se fija y los anteriores retroceden en 3D. */
export default function WhyB() {
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    const cards = q<HTMLElement>(".wB__card");
    const meter = q<HTMLElement>(".wB__count b")[0];
    cards.forEach((c, i) => {
      gsap.fromTo(c, { rotateX: -18, y: 80 }, { rotateX: 0, y: 0, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 30%", scrub: true } });
      if (i < cards.length - 1) gsap.to(c, { scale: 0.9, rotateX: 12, opacity: 0.35, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 80%", end: "top 25%", scrub: true } });
      gsap.to({}, { scrollTrigger: { trigger: c, start: "top center", onEnter: () => (meter.textContent = String(i + 1).padStart(2, "0")), onEnterBack: () => (meter.textContent = String(i + 1).padStart(2, "0")) } });
    });
    gsap.fromTo(q(".wB__bar i"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".wB__cards")[0], start: "top center", end: "bottom center", scrub: true } });
  });
  return (
    <div ref={ref} className="wB">
      <div className="wB__bgtext" aria-hidden="true">UNICAL</div>
      <div className="u-wrap wB__grid">
        <div className="wB__text">
          <p className="u-eyebrow">{why.eyebrow}</p>
          <h2>{why.titleA}<em className="u-em">{why.titleEm}</em>{why.titleB}</h2>
          <p>{why.text}</p>
          <Btn href={why.cta.href} kind="primary" magnetic>{why.cta.label}</Btn>
          <div className="wB__meter"><span className="wB__count"><b>01</b> / 04</span><span className="wB__bar"><i /></span></div>
        </div>
        <div className="wB__cards">
          {why.pillars.map((p, i) => (
            <article key={p.n} className="wB__card" style={{ top: `calc(8rem + ${i * 18}px)` }}>
              <div className="wB__top"><span className="wB__ic"><Icon name={p.icon} size={28} /></span><span className="wB__idx">{p.n}</span></div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
