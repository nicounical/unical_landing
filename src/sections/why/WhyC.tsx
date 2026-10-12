import { why } from "@/content/site";
import { Btn } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./why.css";

/** C — COMPOSICIÓN ASIMÉTRICA: «UNICAL» gigante que se desliza al fondo y pilares desordenados con foto que entran recortados en diagonal. */
export default function WhyC() {
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".wC__giant"), { xPercent: 10 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    q<HTMLElement>(".wC__p").forEach((p, i) => {
      gsap.fromTo(p, { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", rotate: i % 2 ? 3 : -3 }, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", rotate: i % 2 ? -1.5 : 1.5, ease: "power3.out", duration: 1.2, scrollTrigger: { trigger: p, start: "top 82%" } });
      gsap.fromTo(p.querySelector("img"), { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  return (
    <div ref={ref} className="wC">
      <p className="wC__giant" aria-hidden="true">UNICAL</p>
      <div className="u-wrap wC__in">
        <div className="wC__head">
          <p className="u-eyebrow">{why.eyebrow}</p>
          <h2>{why.titleA}<em className="u-em">{why.titleEm}</em>{why.titleB}</h2>
          <p>{why.text}</p>
          <Btn href={why.cta.href} kind="dark" magnetic>{why.cta.label} →</Btn>
        </div>
        <div className="wC__field">
          {why.pillars.map((p, i) => (
            <article key={p.n} className={`wC__p wC__p--${i}`}>
              <figure><img src={p.img} alt="" loading="lazy" decoding="async" /></figure>
              <div><span>{p.n}</span><h3>{p.title}</h3><p>{p.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
