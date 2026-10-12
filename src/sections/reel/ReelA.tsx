import { reel } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { useNear } from "@/core/ui";
import { ReelPlayer } from "./ReelPlayer";
import "./reel.css";

/**
 * A — FULLSCREEN FILM. Adaptación del componente 21st.dev «Hero Scroll Video Pin Reveal» (ajith66310, id 25482):
 * titular cinético palabra a palabra, badges con barrido clip-path y el showreel que se abre en círculo
 * desde el centro hasta ocupar la pantalla, con controles discretos al final.
 */
const TAGS = [
  { t: "Stands y ferias", bg: "#99C4E4", c: "#1A1A2E" },
  { t: "Car wrapping", bg: "#ffffff", c: "#1A1A2E" },
  { t: "Corpóreos iluminados", bg: "#2E6CA0", c: "#fff" },
  { t: "Gran formato", bg: "#1E5076", c: "#fff" },
  { t: "Eventos", bg: "rgba(255,255,255,.14)", c: "#fff" },
];

export default function ReelA() {
  const [nearRef, near] = useNear<HTMLDivElement>("900px");
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    const q = gsap.utils.selector(root);
    if (!full) { gsap.set(q(".rA__tag"), { clipPath: "none", opacity: 1 }); gsap.set(q(".rA__box"), { clipPath: "none" }); root.classList.add("is-open"); return; }
    gsap.set(q(".rA__w"), { opacity: 0, rotate: 8, yPercent: 30 });
    gsap.timeline({ scrollTrigger: { trigger: q(".rA__intro")[0], start: "top 75%", end: "bottom 40%", scrub: 1.2 } })
      .to(q(".rA__w"), { opacity: 1, rotate: 0, yPercent: 0, stagger: 0.15, ease: "power1.inOut" })
      .to(q(".rA__tag"), { opacity: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", stagger: 0.25, ease: "circ.out" }, ">-0.3");
    const start = mobile ? 18 : 8;
    gsap.fromTo(q(".rA__box"), { clipPath: `circle(${start}% at 50% 50%)` }, {
      clipPath: "circle(75% at 50% 50%)", ease: "none",
      scrollTrigger: { trigger: q(".rA__pin")[0], start: "top top", end: mobile ? "+=120%" : "+=160%", pin: true, scrub: 1.2,
        onLeave: () => root.classList.add("is-open"), onEnterBack: () => root.classList.remove("is-open") },
    });
    gsap.to(q(".rA__badge"), { rotate: 360, duration: 18, repeat: -1, ease: "none" });
  });

  return (
    <div ref={ref} className="rA is-dark">
      <div className="rA__intro u-wrap">
        <p className="u-eyebrow">{reel.eyebrow}</p>
        <h2 className="rA__h" aria-label={reel.title}>
          {"Imprimimos, rotulamos, montamos. Lo hacemos realidad.".split(" ").map((w, i) => <span key={i} className="rA__w" aria-hidden="true">{w}</span>)}
        </h2>
        <ul className="rA__tags" aria-label="Qué verás en el reel">
          {TAGS.map((t) => <li key={t.t} className="rA__tag" style={{ background: t.bg, color: t.c }}>{t.t}</li>)}
        </ul>
        <p className="rA__lead">{reel.lead}</p>
      </div>
      <div className="rA__pin" ref={nearRef}>
        <div className="rA__box">
          {near ? <ReelPlayer video={reel.main} className="rA__player" /> : <img className="rA__poster" src={reel.main.poster} alt="" />}
          <svg className="rA__badge" viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="rAcircle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text><textPath href="#rAcircle">UNICAL IN MOTION · PROYECTOS REALES · UNICAL IN MOTION · PROYECTOS REALES ·</textPath></text>
          </svg>
        </div>
      </div>
    </div>
  );
}
