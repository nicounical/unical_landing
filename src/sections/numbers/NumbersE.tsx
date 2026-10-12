import { useEffect, useRef } from "react";
import { numbers, hero } from "@/content/site";
import { Marquee } from "@/core/ui";
import { fullMotion } from "@/core/env";
import { finalText, NumTitle } from "./shared";
import "./numbers.css";

/** E — ODÓMETRO: los dígitos ruedan como un cuentakilómetros al entrar; banda de servicios en movimiento. */
function Odometer({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!fullMotion()) { el.classList.add("is-on"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-on"); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className="nE__odo" aria-label={text}>
      {Array.from(text).map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="nE__col" aria-hidden="true">
            <span className="nE__strip" style={{ ["--d" as string]: ch, transitionDelay: `${i * 0.12}s` }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n}>{n}</span>)}
            </span>
          </span>
        ) : <span key={i} className="nE__ch" aria-hidden="true">{ch}</span>,
      )}
    </span>
  );
}

export default function NumbersE() {
  return (
    <div className="nE is-dark">
      <div className="u-wrap nE__head"><p className="u-eyebrow">{numbers.eyebrow}</p><NumTitle className="nE__t" /></div>
      <div className="u-wrap nE__grid">
        {numbers.items.map((it) => (
          <div key={it.label} className="nE__cell">
            {it.text ? <span className="nE__txt">{it.text}</span> : <Odometer text={finalText(it)} />}
            <span className="nE__l">{it.label}</span>
          </div>
        ))}
      </div>
      <div className="nE__band" aria-hidden="true">
        <Marquee speed={30}>{hero.ticker.map((t) => <span key={t} className="nE__tk">{t}<i>✦</i></span>)}</Marquee>
      </div>
      <p className="u-wrap nE__lead">{numbers.lead}</p>
    </div>
  );
}
