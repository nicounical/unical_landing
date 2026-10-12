import { numbers, videos } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { Count, NumTitle } from "./shared";
import "./numbers.css";

/** A — CIFRAS SOBRE VÍDEO: las cifras cuentan sobre un vídeo real oscurecido, con entrada por máscara y foco de luz. */
export default function NumbersA() {
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    gsap.from(q(".nA__cell b"), { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q(".nA__grid")[0], start: "top 75%" } });
    gsap.fromTo(q(".nA__bg"), { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  });
  return (
    <div ref={ref} className="nA is-dark">
      <div className="nA__bg" aria-hidden="true"><SmartVideo video={videos.lexusRx} className="nA__v" /></div>
      <div className="nA__shade" aria-hidden="true" />
      <div className="u-wrap nA__in">
        <p className="u-eyebrow">{numbers.eyebrow}</p>
        <NumTitle className="nA__t" />
        <p className="nA__lead">{numbers.lead}</p>
        <div className="nA__grid">
          {numbers.items.map((it) => (
            <div key={it.label} className="nA__cell">
              <span className="u-wmask"><b><Count it={it} /></b></span>
              <span className="nA__l">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
