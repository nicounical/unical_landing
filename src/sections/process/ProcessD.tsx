import { useEffect, useRef, useState } from "react";
import { process } from "@/content/site";
import { ScrollTrigger } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import "./process.css";

/** D — ANILLO (idea original de la landing, refinada): el arco avanza con el scroll y el centro cambia de fase; también se navega con los botones. */
const R = 150, C = 2 * Math.PI * R;

export default function ProcessD() {
  const ph = process.phases;
  const root = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [prog, setProg] = useState(0);
  const st = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!fullMotion()) return;
    st.current = ScrollTrigger.create({
      trigger: root.current!, start: "top top", end: "+=260%", pin: true, scrub: true,
      onUpdate: (s) => { setProg(s.progress); setCur(Math.min(ph.length - 1, Math.floor(s.progress * ph.length * 0.999))); },
    });
    return () => { st.current?.kill(); st.current = null; };
  }, [ph.length]);

  const go = (i: number) => {
    const s = st.current;
    if (s) window.scrollTo({ top: s.start + ((i + 0.5) / ph.length) * (s.end - s.start), behavior: "smooth" });
    else { setCur(i); setProg((i + 1) / ph.length); }
  };

  return (
    <div ref={root} className="prD is-dark">
      <div className="u-wrap prD__in">
        <div className="prD__left">
          <p className="u-eyebrow">{process.eyebrow}</p>
          <h2>{process.title}</h2>
          <ul className="prD__list">
            {ph.map((p, i) => (
              <li key={p.n}><button className={i === cur ? "is-on" : ""} aria-current={i === cur} onClick={() => go(i)}><span>{p.n}</span>{p.title}</button></li>
            ))}
          </ul>
          <p className="prD__lead">{process.lead}</p>
        </div>
        <div className="prD__ring">
          <svg viewBox="0 0 360 360" aria-hidden="true">
            <circle cx="180" cy="180" r={R} className="prD__track" />
            <circle cx="180" cy="180" r={R} className="prD__arc" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - (st.current ? prog : (cur + 1) / ph.length)) }} />
            {ph.map((_, i) => {
              const a = (i / ph.length) * Math.PI * 2 - Math.PI / 2;
              return <circle key={i} cx={180 + Math.cos(a) * R} cy={180 + Math.sin(a) * R} r="7" className={`prD__node ${i <= cur ? "is-on" : ""}`} />;
            })}
          </svg>
          <article className="prD__card" key={cur} aria-live="polite">
            <span className="prD__n">Fase {ph[cur].n}</span>
            <h3>{ph[cur].title}</h3>
            <p>{ph[cur].text}</p>
            <ul>{ph[cur].tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </article>
        </div>
      </div>
    </div>
  );
}
