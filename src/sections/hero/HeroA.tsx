import { useEffect, useState } from "react";
import { hero, videos } from "@/content/site";
import { Marquee, SmartVideo } from "@/core/ui";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import { HeroCopy, HeroEyebrow, HeroTitle } from "./shared";
import "./hero.css";

/**
 * A — CINEMATIC SHOWREEL: planos reales encadenados con cortes, bandas de cine y dolly-in con el scroll.
 * Entrada cinética de titular y «badges» con barrido clip-path adaptados del componente 21st.dev
 * «Hero Scroll Video Pin Reveal» (ajith66310, id 25482).
 */
const BADGES = [
  { t: "Diseñamos", bg: "var(--u-blue)", c: "var(--u-navy)" },
  { t: "Imprimimos", bg: "#fff", c: "var(--u-navy)" },
  { t: "Rotulamos", bg: "var(--u-blue-strong)", c: "#fff" },
  { t: "Instalamos", bg: "rgba(255,255,255,.12)", c: "#fff" },
];
const SHOTS = [
  { kind: "video" as const, video: videos.heroPanther, label: "Car wrapping · Lexus Black Panther" },
  { kind: "img" as const, src: `${import.meta.env.BASE_URL}media/img/hubs/eventos/tunel-vodafone.webp`, label: "Eventos · Túnel Vodafone" },
  { kind: "video" as const, video: videos.cirsa, label: "Backdrop retroiluminado · Cirsa" },
  { kind: "img" as const, src: `${import.meta.env.BASE_URL}media/img/landing/eversense.webp`, label: "Stands · Eversense" },
  { kind: "img" as const, src: `${import.meta.env.BASE_URL}media/img/proyectos/five-guys.webp`, label: "Corpóreos iluminados · Five Guys" },
  { kind: "img" as const, src: `${import.meta.env.BASE_URL}media/img/landing/tibau-camion-taller.webp`, label: "Rotulación de flotas · Tibau Team" },
];
const DURATION = 5200;

export default function HeroA() {
  const [shot, setShot] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || !fullMotion()) return;
    const t = window.setInterval(() => setShot((s) => (s + 1) % SHOTS.length), DURATION);
    return () => window.clearInterval(t);
  }, [playing]);

  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    const q = gsap.utils.selector(root);
    if (!full) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(q(".hA__bar"), { scaleY: 3.2, duration: 1.6, ease: "power3.inOut" })
      .from(q(".hl"), { yPercent: 110, rotate: 8, transformOrigin: "0% 100%", duration: 1.3, stagger: 0.09 }, 0.5)
      .fromTo(q(".hA__badge"), { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.9, stagger: 0.12, ease: "circ.out" }, 1.1)
      .from(q(".hA__meta > *"), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.9);
    // Dolly-in + salida al hacer scroll
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } })
      .to(q(".hA__stage"), { scale: 1.08, ease: "none" }, 0)
      .to(q(".hA__content"), { yPercent: -18, autoAlpha: 0, ease: "none" }, 0)
      .to(q(".hA__bar--t"), { yPercent: 60, ease: "none" }, 0)
      .to(q(".hA__bar--b"), { yPercent: -60, ease: "none" }, 0);
  });

  return (
    <div ref={ref} className="hA is-dark">
      <div className="hA__stage" aria-hidden="true">
        {SHOTS.map((s, i) => (
          <div key={i} className={`hA__shot ${i === shot ? "is-on" : ""}`}>
            {s.kind === "video"
              ? <SmartVideo video={s.video} className="hA__media" eager={i === 0} autoPlay={i === shot} />
              : <img src={s.src} alt="" className="hA__media" loading={i < 2 ? "eager" : "lazy"} decoding="async" />}
          </div>
        ))}
        <div className="hA__grade" />
        <div className="hA__grain" />
      </div>
      <div className="hA__bar hA__bar--t" />
      <div className="hA__bar hA__bar--b" />

      <div className="hA__content u-wrap">
        <HeroEyebrow />
        <HeroTitle className="hA__title" />
        <ul className="hA__badges" aria-label="Lo que hacemos">
          {BADGES.map((b) => <li key={b.t} className="hA__badge" style={{ background: b.bg, color: b.c }}>{b.t}</li>)}
        </ul>
        <div className="hA__meta">
          <HeroCopy className="hA__copy" />
          <div className="hA__shotinfo" aria-live="polite">
            <span className="hA__tc">{String(shot + 1).padStart(2, "0")} / {String(SHOTS.length).padStart(2, "0")}</span>
            <span className="hA__shotlabel">{SHOTS[shot].label}</span>
            <div className="hA__dashes">
              {SHOTS.map((s, i) => (
                <button key={i} className={`hA__dash ${i === shot ? "is-on" : ""} ${i < shot ? "is-done" : ""}`}
                  aria-label={`Ver plano ${i + 1}: ${s.label}`} onClick={() => { setShot(i); setPlaying(false); }}
                  style={{ ["--d" as string]: `${DURATION}ms` }}><i /></button>
              ))}
              <button className="hA__pp" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pausar secuencia" : "Reproducir secuencia"}>{playing ? "❚❚" : "▶"}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="hA__ticker" aria-hidden="true">
        <Marquee speed={38}>{hero.ticker.map((t) => <span key={t} className="hA__tk">{t}<i>◆</i></span>)}</Marquee>
      </div>
    </div>
  );
}
