import { process } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./process.css";

/** C — TRAZO CONTINUO: una línea de plotter serpentea por la sección y enciende cada fase al pasar. */
export default function ProcessC() {
  const ph = process.phases;
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    const q = gsap.utils.selector(root);
    const path = q<SVGPathElement>(".prC__path")[0];
    if (!full) { root.classList.add("is-done"); return; }
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: q(".prC__route")[0], start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
    q<HTMLElement>(".prC__step").forEach((s) => {
      gsap.from(s.querySelectorAll(".prC__in > *"), { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 65%", toggleClass: { targets: s, className: "is-on" } } });
    });
  });

  return (
    <div ref={ref} className="prC">
      <div className="u-wrap prC__head">
        <p className="u-eyebrow">{process.eyebrow}</p>
        <h2>{process.title}</h2>
        <p className="prC__lead">{process.lead}</p>
      </div>
      <div className="prC__route u-wrap">
        <svg className="prC__svg" viewBox="0 0 1000 1600" preserveAspectRatio="none" aria-hidden="true">
          <path className="prC__ghost" d="M500 0 C 500 120, 120 160, 120 330 S 880 560, 880 760 S 120 980, 120 1180 S 500 1420, 500 1600" />
          <path className="prC__path" d="M500 0 C 500 120, 120 160, 120 330 S 880 560, 880 760 S 120 980, 120 1180 S 500 1420, 500 1600" />
        </svg>
        {ph.map((p, i) => (
          <article key={p.n} className={`prC__step prC__step--${i % 2 ? "r" : "l"}`}>
            <span className="prC__dot" aria-hidden="true" />
            <div className="prC__in">
              <span className="prC__n">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <figure className="prC__fig"><img src={p.img} alt="" loading="lazy" decoding="async" /></figure>
          </article>
        ))}
      </div>
    </div>
  );
}
