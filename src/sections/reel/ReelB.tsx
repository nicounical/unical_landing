import { useEffect, useRef, useState } from "react";
import { reel, videos } from "@/content/site";
import { ScrollTrigger } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import { ReelPlayer } from "./ReelPlayer";
import "./reel.css";

/**
 * B — REEL CONTROLADO POR SCROLL. Inspirado en 21st.dev «Scroll-Triggered Video Hero» (daiwiikharihar, id 9701)
 * y «Hero Scrub» (id 12213): la sección se fija y el scroll mueve el vídeo fotograma a fotograma, con capítulos.
 * Vídeo codificado con keyframes cada 8 fotogramas para que el scrub sea fluido.
 */
const CHAPTERS = [
  { at: 0, t: "Arranque", d: "Cabrera de Mar · +25 años · +3.000 proyectos" },
  { at: 3, t: "Lo hacemos realidad", d: "Imprimimos, rotulamos, montamos, instalamos" },
  { at: 6, t: "Rotulación de flotas", d: "TKE · J. Pujol" },
  { at: 12, t: "Car wrapping", d: "Diseños integrales en vinilo" },
  { at: 15, t: "Stands y eventos", d: "Cirsa · Disney · Venca" },
  { at: 27, t: "Corpóreos iluminados", d: "Five Guys" },
  { at: 30, t: "Sin límites", d: "Lexus · car wrapping" },
  { at: 33, t: "Unical", d: "unical.es · 937 50 23 04" },
];
const DUR = 36.8;

export default function ReelB() {
  const root = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [live] = useState(fullMotion);
  const [ch, setCh] = useState(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!live) return;
    const el = root.current!, v = vid.current!;
    v.pause();
    let target = 0, raf = 0;
    const tick = () => {
      // aproximación suave al fotograma objetivo (evita saltos al buscar)
      if (v.readyState >= 1) {
        const cur = v.currentTime, next = cur + (target - cur) * 0.25;
        if (Math.abs(target - cur) > 0.02) v.currentTime = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const st = ScrollTrigger.create({
      trigger: el, start: "top top", end: "+=320%", pin: true, scrub: true,
      onUpdate: (s) => {
        target = s.progress * (DUR - 0.2);
        setP(s.progress);
        let k = 0; CHAPTERS.forEach((c, i) => { if (target >= c.at) k = i; }); setCh(k);
      },
    });
    return () => { st.kill(); cancelAnimationFrame(raf); };
  }, [live]);

  if (!live) {
    return (
      <div className="rB is-dark rB--static">
        <div className="u-wrap"><p className="u-eyebrow">{reel.eyebrow}</p><h2 className="rB__h">{reel.title}</h2><p className="rB__lead">{reel.lead}</p></div>
        <div className="u-wrap"><ReelPlayer video={reel.main} className="rB__player" autoPlay={false} /></div>
      </div>
    );
  }

  return (
    <div ref={root} className="rB is-dark">
      <div className="rB__frame">
        <video ref={vid} className="rB__v" src={videos.showreelScrub.src} poster={videos.showreelScrub.poster} muted playsInline preload="auto" aria-label={videos.showreel.label} />
        <div className="rB__shade" />
      </div>
      <div className="rB__ui u-wrap">
        <div className="rB__top"><p className="u-eyebrow">{reel.eyebrow}</p><h2 className="rB__h">{reel.title}</h2></div>
        <div className="rB__chapter" aria-live="polite">
          <span className="rB__k">Capítulo {String(ch + 1).padStart(2, "0")}</span>
          <b key={ch}>{CHAPTERS[ch].t}</b>
          <em>{CHAPTERS[ch].d}</em>
        </div>
        <ol className="rB__marks" aria-hidden="true">
          {CHAPTERS.map((c, i) => <li key={c.at} className={i <= ch ? "is-on" : ""} style={{ left: `${(c.at / DUR) * 100}%` }} />)}
          <i style={{ transform: `scaleX(${p})` }} />
        </ol>
        <p className="rB__hint">Tú controlas el reel con el scroll</p>
      </div>
    </div>
  );
}
