import { numbers } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { fmt } from "@/core/ui";
import { finalText, NumTitle } from "./shared";
import "./numbers.css";

/** C — CIFRA GIGANTE: cada cifra ocupa la pantalla; el scroll la hace contar y deja paso a la siguiente (sticky, sin pin). */
export default function NumbersC() {
  const items = numbers.items;
  const ref = useGsap<HTMLDivElement>(({ root, full }) => {
    if (!full) return;
    root.classList.add("is-live");
    const q = gsap.utils.selector(root);
    const panels = q<HTMLElement>(".nC__panel");
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: q(".nC__track")[0], start: "top top", end: "bottom bottom", scrub: 0.5 } });
    panels.forEach((p, i) => {
      const it = items[i];
      const big = p.querySelector<HTMLElement>(".nC__big")!;
      const o = { v: 0 };
      if (i > 0) tl.fromTo(p, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, i - 0.15);
      if (it.value) tl.to(o, { v: it.value, duration: 0.7, onUpdate: () => { big.textContent = `${it.prefix ?? ""}${fmt(o.v)}`; } }, i);
      else tl.fromTo(big, { letterSpacing: "0.4em", autoAlpha: 0.2 }, { letterSpacing: "-0.05em", autoAlpha: 1, duration: 0.7 }, i);
      if (i < panels.length - 1) tl.to(p, { autoAlpha: 0, yPercent: -30, duration: 0.3 }, i + 0.85);
    });
  });
  return (
    <div ref={ref} className="nC">
      <div className="u-wrap nC__head"><p className="u-eyebrow">{numbers.eyebrow}</p><NumTitle className="nC__t" /></div>
      <div className="nC__track">
        <div className="nC__sticky">
          {items.map((it) => (
            <div key={it.label} className="nC__panel">
              <span className="nC__big" aria-label={finalText(it)}>{finalText(it)}</span>
              <span className="nC__l">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="u-wrap nC__lead">{numbers.lead}</p>
    </div>
  );
}
