import { services } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import "./services.css";

/** E — RECORRIDO HORIZONTAL: pista fijada con paneles que escalan, contador y barra de progreso. */
export default function ServicesE() {
  const items = services.items;
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    if (!full || mobile) return;
    root.classList.add("is-live");
    const q = gsap.utils.selector(root);
    const track = q<HTMLElement>(".sE__track")[0];
    const dist = () => track.scrollWidth - window.innerWidth;
    const count = q<HTMLElement>(".sE__count b")[0];
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: root, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (st) => {
          gsap.set(q(".sE__bar i"), { scaleX: st.progress });
          count.textContent = String(Math.min(items.length, Math.floor(st.progress * items.length) + 1)).padStart(2, "0");
        },
      },
    });
    q<HTMLElement>(".sE__panel").forEach((p) => {
      gsap.fromTo(p.querySelector("img"), { scale: 1.35, xPercent: -8 }, { scale: 1, xPercent: 8, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      gsap.from(p.querySelectorAll(".sE__k"), { yPercent: 120, autoAlpha: 0, stagger: 0.06, ease: "expo.out", duration: 1, scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 70%" } });
      gsap.fromTo(p.querySelector(".sE__big"), { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
    });
  });

  return (
    <div ref={ref} className="sE is-dark">
      <div className="sE__top u-wrap">
        <div><p className="u-eyebrow">{services.eyebrow}</p><h2>{services.title}</h2></div>
        <div className="sE__meter"><span className="sE__count"><b>01</b> / {String(items.length).padStart(2, "0")}</span><span className="sE__bar"><i /></span></div>
      </div>
      <div className="sE__track">
        {items.map((s) => (
          <a key={s.n} href={s.href} className="sE__panel">
            <span className="sE__media"><img src={s.img} alt={s.alt} loading="lazy" decoding="async" /></span>
            <span className="sE__big" aria-hidden>{s.n}</span>
            <span className="sE__txt">
              <span className="u-wmask"><span className="sE__k sE__sub">{s.sub}</span></span>
              <span className="u-wmask"><span className="sE__k sE__t">{s.title}</span></span>
              <span className="u-wmask"><span className="sE__k sE__p">{s.text}</span></span>
              <span className="u-wmask"><span className="sE__k sE__go">Ver servicio →</span></span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
