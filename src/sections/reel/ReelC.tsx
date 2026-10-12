import { useEffect, useMemo, useRef, useState } from "react";
import { reel, type ReelItem } from "@/content/site";
import { gsap } from "@/core/scroll";
import { Pending, SmartVideo, Icon } from "@/core/ui";
import { fullMotion, finePointer } from "@/core/env";
import { ReelPlayer } from "./ReelPlayer";
import "./reel.css";

/** C — GALERÍA INTERACTIVA: mosaico de piezas que cobran vida al pasar; al elegir una se abre con una transición desde su tarjeta. */
export default function ReelC() {
  const cats = useMemo(() => ["Todo", ...Array.from(new Set(reel.items.map((i) => i.cat)))], []);
  const [cat, setCat] = useState("Todo");
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<{ item: ReelItem; rect: DOMRect } | null>(null);
  const layer = useRef<HTMLDivElement>(null);
  const items = reel.items.filter((i) => cat === "Todo" || i.cat === cat);

  useEffect(() => {
    if (!open || !layer.current) return;
    const el = layer.current;
    const r = open.rect, W = window.innerWidth, H = window.innerHeight;
    if (fullMotion()) {
      gsap.fromTo(el.querySelector(".rC__modal"), {
        x: r.left + r.width / 2 - W / 2, y: r.top + r.height / 2 - H / 2, scaleX: r.width / (W * 0.86), scaleY: r.height / (H * 0.8), borderRadius: 40,
      }, { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 18, duration: 0.8, ease: "expo.out" });
      gsap.from(el.querySelector(".rC__meta"), { autoAlpha: 0, y: 20, delay: 0.35, duration: 0.6 });
    }
    (el.querySelector(".rC__close") as HTMLButtonElement)?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", esc);
    document.documentElement.classList.add("is-menu-open");
    return () => { window.removeEventListener("keydown", esc); document.documentElement.classList.remove("is-menu-open"); };
  }, [open]);

  return (
    <div className="rC is-dark">
      <div className="u-wrap rC__head">
        <div><p className="u-eyebrow">{reel.eyebrow}</p><h2 className="rC__h">{reel.title}</h2></div>
        <div className="rC__filters" role="group" aria-label="Filtrar piezas">
          {cats.map((c) => <button key={c} className={c === cat ? "is-on" : ""} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>
      <div className="u-wrap">
        <ul className="rC__grid">
          {items.map((it, i) => (
            <li key={it.id} className={`rC__cell rC__cell--${i % 5}`}>
              <button className="rC__card" onPointerEnter={() => finePointer() && setHover(it.id)} onPointerLeave={() => setHover(null)}
                onClick={(e) => setOpen({ item: it, rect: e.currentTarget.getBoundingClientRect() })} aria-label={`Ver ${it.title}`}>
                <img src={it.img} alt="" loading="lazy" decoding="async" />
                {it.video && hover === it.id && <SmartVideo video={it.video} className="rC__vid" eager />}
                {it.placeholder && <Pending>Falta vídeo · se muestra foto real</Pending>}
                <span className="rC__cap"><i>{it.cat}</i><b>{it.title}</b></span>
                <span className="rC__play" aria-hidden="true"><Icon name="play" size={14} /></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open && (
        <div ref={layer} className="rC__layer" role="dialog" aria-modal="true" aria-label={open.item.title} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="rC__modal">
            {open.item.video
              ? <ReelPlayer video={open.item.video} className="rC__player" onClose={() => setOpen(null)} />
              : <div className="rC__still"><img src={open.item.img} alt={open.item.title} /><Pending>Vídeo pendiente: foto real del proyecto</Pending></div>}
            <div className="rC__meta"><i>{open.item.cat}</i><b>{open.item.title}</b></div>
            <button className="rC__close" onClick={() => setOpen(null)} aria-label="Cerrar"><Icon name="close" size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
