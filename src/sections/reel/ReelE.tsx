import { useEffect, useRef, useState } from "react";
import { reel, type ReelItem } from "@/content/site";
import { gsap } from "@/core/scroll";
import { fullMotion, finePointer } from "@/core/env";
import { Icon, Pending } from "@/core/ui";
import { ReelPlayer } from "./ReelPlayer";
import "./reel.css";

/** E — PORTAL INMERSIVO: cada proyecto se abre con un portal circular que nace en el punto del clic. */
export default function ReelE() {
  const [open, setOpen] = useState<{ item: ReelItem; x: number; y: number } | null>(null);
  const [hover, setHover] = useState(0);
  const portal = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !portal.current) return;
    const el = portal.current;
    if (fullMotion()) {
      gsap.fromTo(el, { clipPath: `circle(0px at ${open.x}px ${open.y}px)` }, { clipPath: `circle(150% at ${open.x}px ${open.y}px)`, duration: 1.1, ease: "expo.inOut" });
      gsap.from(el.querySelectorAll(".rE__in > *"), { y: 40, autoAlpha: 0, stagger: 0.08, delay: 0.55, duration: 0.8, ease: "expo.out" });
    }
    (el.querySelector(".rE__close") as HTMLButtonElement)?.focus();
    document.documentElement.classList.add("is-menu-open");
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.documentElement.classList.remove("is-menu-open"); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    if (!portal.current || !open || !fullMotion()) { setOpen(null); return; }
    gsap.to(portal.current, { clipPath: `circle(0px at ${open.x}px ${open.y}px)`, duration: 0.7, ease: "expo.inOut", onComplete: () => setOpen(null) });
  };

  useEffect(() => {
    if (!finePointer() || !fullMotion()) return;
    const c = cursor.current!;
    const xTo = gsap.quickTo(c, "x", { duration: 0.5, ease: "power3" }), yTo = gsap.quickTo(c, "y", { duration: 0.5, ease: "power3" });
    const m = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, []);

  return (
    <div className="rE is-dark">
      <div className="rE__bg" aria-hidden="true">
        {reel.items.map((it, i) => <img key={it.id} src={it.img} alt="" className={i === hover ? "is-on" : ""} loading="lazy" decoding="async" />)}
      </div>
      <div className="u-wrap rE__wrap">
        <div className="rE__head"><p className="u-eyebrow">{reel.eyebrow}</p><h2 className="rE__h">{reel.title}</h2><p className="rE__lead">{reel.lead}</p></div>
        <ol className="rE__list">
          {reel.items.map((it, i) => (
            <li key={it.id}>
              <button onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)}
                onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOpen({ item: it, x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2 }); }}>
                <span className="rE__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="rE__t">{it.title}</span>
                <span className="rE__c">{it.cat}{it.video ? " · vídeo" : ""}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div ref={cursor} className="rE__cursor" aria-hidden="true">Abrir</div>
      {open && (
        <div ref={portal} className="rE__portal" role="dialog" aria-modal="true" aria-label={open.item.title}>
          {open.item.video
            ? <ReelPlayer video={open.item.video} className="rE__player" showControls />
            : <div className="rE__still"><img src={open.item.img} alt={open.item.title} /><Pending>Vídeo pendiente · foto real</Pending></div>}
          <div className="rE__in u-wrap">
            <p className="u-eyebrow">{open.item.cat}</p>
            <h3>{open.item.title}</h3>
          </div>
          <button className="rE__close" onClick={close} aria-label="Cerrar"><Icon name="close" size={22} /></button>
        </div>
      )}
    </div>
  );
}
