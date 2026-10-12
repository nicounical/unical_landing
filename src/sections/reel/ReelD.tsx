import { reel } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { Pending, SmartVideo } from "@/core/ui";
import "./reel.css";

/**
 * D — VIAJE HORIZONTAL. Inspirado en 21st.dev «Scroll Horizontal Gallery» (motiondotdev, id 24623) y
 * «Zoom Parallax» (efferd, id 5967): travelling lateral con piezas de distintos tamaños y parallax interior.
 */
const SIZES = ["xl", "m", "l", "s", "xl", "m", "l", "m"];

export default function ReelD() {
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    if (!full || mobile) return;
    root.classList.add("is-live");
    const q = gsap.utils.selector(root);
    const track = q<HTMLElement>(".rD__track")[0];
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, { x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    gsap.to(q(".rD__ghost"), { xPercent: -40, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: () => `+=${dist()}`, scrub: true } });
    q<HTMLElement>(".rD__item").forEach((it) => {
      gsap.fromTo(it.querySelector(".rD__media"), { xPercent: -12, scale: 1.25 }, { xPercent: 12, scale: 1.05, ease: "none",
        scrollTrigger: { trigger: it, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
    });
  });

  return (
    <div ref={ref} className="rD is-dark">
      <p className="rD__ghost" aria-hidden="true">UNICAL IN MOTION · UNICAL IN MOTION</p>
      <div className="rD__track">
        <div className="rD__intro">
          <p className="u-eyebrow">{reel.eyebrow}</p>
          <h2 className="rD__h">{reel.title}</h2>
          <p className="rD__lead">{reel.lead}</p>
          <p className="rD__go" aria-hidden="true">Desliza →</p>
        </div>
        {reel.items.map((it, i) => (
          <figure key={it.id} className={`rD__item rD__item--${SIZES[i]} ${i % 2 ? "is-low" : ""}`}>
            <div className="rD__clip">
              {it.video ? <SmartVideo video={it.video} className="rD__media" /> : <img className="rD__media" src={it.img} alt={it.title} loading="lazy" decoding="async" />}
              {it.placeholder && <Pending>Falta vídeo</Pending>}
            </div>
            <figcaption><span>{String(i + 1).padStart(2, "0")} · {it.cat}</span><b>{it.title}</b></figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
