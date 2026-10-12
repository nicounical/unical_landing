import { numbers } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { Count, NumTitle } from "./shared";
import "./numbers.css";

/** B — VOLUMEN 3D: cifras extruidas (capas apiladas) que giran siguiendo el cursor y se inclinan con el scroll. */
export default function NumbersB() {
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    const cells = q<HTMLElement>(".nB__obj");
    cells.forEach((c, i) => gsap.fromTo(c, { rotateX: 50, rotateY: i % 2 ? -30 : 30, z: -300 }, { rotateX: 10, rotateY: 0, z: 0, ease: "power2.out", scrollTrigger: { trigger: c, start: "top bottom", end: "center 60%", scrub: 1 } }));
    if (!fine) return;
    const m = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      cells.forEach((c) => gsap.to(c.querySelector(".nB__num"), { rotateY: x * 40, rotateX: 10 - y * 30, duration: 1, ease: "power3.out" }));
    };
    window.addEventListener("pointermove", m);
    onCleanup(() => window.removeEventListener("pointermove", m));
  });
  return (
    <div ref={ref} className="nB is-dark">
      <div className="u-wrap">
        <div className="nB__head"><p className="u-eyebrow">{numbers.eyebrow}</p><NumTitle className="nB__t" /><p className="nB__lead">{numbers.lead}</p></div>
        <div className="nB__grid">
          {numbers.items.map((it) => (
            <div key={it.label} className="nB__obj">
              <div className="nB__num">
                {[...Array(10)].map((_, k) => <span key={k} className="nB__layer" aria-hidden="true" style={{ transform: `translateZ(${-k * 3}px)`, opacity: 1 - k * 0.07 }}>{it.text ?? `${it.prefix}${it.value}`}</span>)}
                <Count it={it} className="nB__face" />
              </div>
              <span className="nB__l">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
