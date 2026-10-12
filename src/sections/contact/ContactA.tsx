import { cta, videos } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { SmartVideo } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { ContactMeta, CtaTitle } from "./shared";
import "./contact.css";

/** A — PLANO FINAL: vídeo real de fondo y formulario en cristal, como el plano final de una película. */
export default function ContactA() {
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    gsap.from(q(".ctA__copy > *"), { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    gsap.from(q(".ctA__glass"), { y: 60, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 65%" } });
  });
  return (
    <div ref={ref} className="ctA is-dark">
      <div className="ctA__bg" aria-hidden="true"><SmartVideo video={videos.cirsa} className="ctA__v" /></div>
      <div className="ctA__shade" aria-hidden="true" />
      <div className="u-wrap ctA__in">
        <div className="ctA__copy">
          <p className="u-eyebrow">{cta.eyebrow}</p>
          <CtaTitle className="ctA__t" />
          <p>{cta.text}</p>
          <ContactMeta className="ctA__meta" />
        </div>
        <div className="ctA__glass"><ContactForm className="cf--dark" /></div>
      </div>
    </div>
  );
}
