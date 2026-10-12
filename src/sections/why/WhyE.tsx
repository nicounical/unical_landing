import { why } from "@/content/site";
import { Btn, Icon } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./why.css";

/** E — ESCALA EN CADENA: cada pilar entra enorme, a sangre, y se reduce hasta su sitio en la rejilla, en cadena con el scroll. */
export default function WhyE() {
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    q<HTMLElement>(".wE__cell").forEach((c, i) => {
      gsap.fromTo(c, { scale: 1.9, yPercent: 30, autoAlpha: 0, zIndex: 5 - i }, { scale: 1, yPercent: 0, autoAlpha: 1, ease: "power2.out", scrollTrigger: { trigger: q(".wE__grid")[0], start: `top ${85 - i * 8}%`, end: `top ${40 - i * 6}%`, scrub: 0.8 } });
    });
    gsap.fromTo(q(".wE__t"), { letterSpacing: "0.08em" }, { letterSpacing: "-0.045em", ease: "none", scrollTrigger: { trigger: root, start: "top 90%", end: "top 30%", scrub: true } });
  });
  return (
    <div ref={ref} className="wE is-dark">
      <div className="u-wrap">
        <div className="wE__head">
          <p className="u-eyebrow">{why.eyebrow}</p>
          <h2 className="wE__t">{why.titleA}<em className="u-em">{why.titleEm}</em>{why.titleB}</h2>
        </div>
        <div className="wE__grid">
          {why.pillars.map((p) => (
            <article key={p.n} className="wE__cell">
              <img src={p.img} alt="" loading="lazy" decoding="async" />
              <div className="wE__body">
                <span className="wE__ic"><Icon name={p.icon} size={26} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="wE__foot"><p>{why.text}</p><Btn href={why.cta.href} kind="light" magnetic>{why.cta.label} →</Btn></div>
      </div>
    </div>
  );
}
