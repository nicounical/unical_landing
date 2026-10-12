import { why, videos } from "@/content/site";
import { SmartVideo, Btn, Icon } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./why.css";

/**
 * A — MANIFIESTO EN VÍDEO. El texto se ilumina palabra a palabra con el scroll (patrón 21st.dev «Reading Text Reveal»,
 * waleedkibhen, id 9386) sobre un vídeo real; los pilares aparecen como subtítulos de película.
 */
export default function WhyA() {
  const words = why.text.split(" ");
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    const q = gsap.utils.selector(root);
    if (!full) { gsap.set(q(".wA__w"), { opacity: 1 }); return; }
    gsap.fromTo(q(".wA__w"), { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: q(".wA__manifesto")[0], start: "top 75%", end: "bottom 45%", scrub: true } });
    gsap.from(q(".wA__p"), { y: 40, autoAlpha: 0, stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: q(".wA__subs")[0], start: "top 80%" } });
  });
  return (
    <div ref={ref} className="wA is-dark">
      <div className="wA__bg" aria-hidden="true"><SmartVideo video={videos.heroPanther} className="wA__v" /></div>
      <div className="wA__shade" aria-hidden="true" />
      <div className="u-wrap wA__in">
        <p className="u-eyebrow">{why.eyebrow}</p>
        <h2 className="wA__t">{why.titleA}<em className="u-em">{why.titleEm}</em>{why.titleB}</h2>
        <p className="wA__manifesto">{words.map((w, i) => <span key={i} className="wA__w">{w} </span>)}</p>
        <div className="wA__subs">
          {why.pillars.map((p) => (
            <article key={p.n} className="wA__p">
              <span className="wA__ic"><Icon name={p.icon} size={26} /></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <Btn href={why.cta.href} kind="light" magnetic>{why.cta.label} →</Btn>
      </div>
    </div>
  );
}
