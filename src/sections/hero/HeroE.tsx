import { gallery, videos } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { HeroCopy, HeroEyebrow, HeroTitle } from "./shared";
import "./hero.css";

/** E — DYNAMIC PROJECT MOSAIC: columnas de proyectos a velocidades distintas; la pieza central crece hasta ocupar la pantalla. */
const COLS = [0, 1, 2, 3, 4].map((c) => {
  const items = gallery.filter((_, i) => i % 5 === c);
  return { items: [...items, ...gallery.slice(c, c + 2)], speed: 26 + c * 7, rev: c % 2 === 1 };
});

export default function HeroE() {
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".hE__col"), { yPercent: (i) => (i % 2 ? -30 : 30), autoAlpha: 0, duration: 1.6, stagger: 0.08, ease: "expo.out" });
    gsap.from(q(".hl"), { yPercent: 110, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.4 });
    gsap.from(q(".hE__feature"), { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: "expo.out", delay: 0.3 });
    if (!full) return;
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: mobile ? "+=120%" : "+=170%", pin: true, scrub: 0.6 } })
      .to(q(".hE__col"), { xPercent: (i) => (i - 2) * 45, autoAlpha: 0.15, filter: "blur(6px)", ease: "power2.in", duration: 1 }, 0)
      .to(q(".hE__panel"), { yPercent: 40, autoAlpha: 0, ease: "power1.in", duration: 0.6 }, 0)
      .to(q(".hE__feature"), { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
      .to(q(".hE__featurecap"), { autoAlpha: 1, y: 0, duration: 0.3 }, 0.8);
  });

  return (
    <div ref={ref} className="hE is-dark">
      <div className="hE__mosaic" aria-hidden="true">
        {COLS.map((c, ci) => (
          <div key={ci} className={`hE__col ${c.rev ? "is-rev" : ""}`} style={{ ["--spd" as string]: `${c.speed}s` }}>
            <div className="hE__colin">
              {[...c.items, ...c.items].map((src, i) => (
                <figure key={i} className="hE__tile"><img src={src} alt="" loading={i < 3 ? "eager" : "lazy"} decoding="async" /></figure>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="hE__feature">
        <SmartVideo video={videos.showreel} className="hE__fv" eager />
        <p className="hE__featurecap">Unical in Motion · proyectos reales</p>
      </div>
      <div className="hE__panel">
        <HeroEyebrow />
        <HeroTitle className="hE__title" />
        <HeroCopy className="hE__copy" />
      </div>
    </div>
  );
}
