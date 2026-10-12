import { hero, videos } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { HeroCopy } from "./shared";
import "./hero.css";

/** D — EDITORIAL MOTION: el vídeo vive dentro de las letras gigantes; el scroll entra por el punto final hasta llenar la pantalla. */
export default function HeroD() {
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".hD__line"), { yPercent: 105, duration: 1.4, stagger: 0.1, ease: "expo.out", delay: 0.15 });
    gsap.from(q(".hD__side > *"), { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1, delay: 0.8, ease: "expo.out" });
    if (!full) return;
    const dot = q<HTMLElement>(".hD__dot")[0];
    const paper = q<HTMLElement>(".hD__paper")[0];
    const setOrigin = () => {
      const r = dot.getBoundingClientRect();
      const p = paper.getBoundingClientRect();
      paper.style.transformOrigin = `${r.left - p.left + r.width / 2}px ${r.top - p.top + r.height * 0.72}px`;
    };
    setOrigin();
    gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: mobile ? "+=150%" : "+=200%", pin: true, scrub: 0.7, onRefresh: setOrigin },
    })
      .to(q(".hD__side"), { autoAlpha: 0, y: -30, duration: 0.25 }, 0)
      .to(paper, { scale: mobile ? 90 : 140, ease: "power2.in", duration: 1 }, 0.05)
      .to(paper, { autoAlpha: 0, duration: 0.15 }, 0.92)
      .fromTo(q(".hD__caption"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.95);
  });

  return (
    <div ref={ref} className="hD">
      <SmartVideo video={videos.heroPanther} className="hD__video" eager staticFallback />
      <div className="hD__paper">
        <h1 className="hD__title" aria-label="Producción visual B2B en Barcelona">
          {hero.titleLines.map((l, i) => (
            <span key={i} className="hD__mask" aria-hidden="true">
              <span className={`hD__line hD__line--${i + 1}`}>
                {i === 2 ? <>B2B<span className="hD__dot">.</span></> : l}
              </span>
            </span>
          ))}
        </h1>
      </div>
      <div className="hD__side">
        <p className="hD__kicker"><span>{hero.eyebrow}</span><span>Est. +25 años</span></p>
        <HeroCopy className="hD__copy" />
        <ul className="hD__index">
          {hero.ticker.slice(0, 6).map((t, i) => <li key={t}><i>{String(i + 1).padStart(2, "0")}</i>{t}</li>)}
        </ul>
      </div>
      <div className="hD__caption u-wrap is-dark">
        <p className="u-eyebrow u-eyebrow--light">En pantalla</p>
        <p className="hD__captiont">{videos.heroPanther.label}</p>
        <a className="hD__captionl" href={hero.ctaPrimary.href}>Ver más proyectos →</a>
      </div>
    </div>
  );
}
