import { clients } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { ClientMark } from "./ClientMark";
import "./clients.css";

/** B — PLANO INCLINADO 3D: rejilla de logos sobre un plano en perspectiva que se endereza con el scroll y se orienta con el cursor. */
export default function ClientsB() {
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    const plane = q<HTMLElement>(".clB__plane")[0];
    gsap.fromTo(plane, { rotateX: 55, rotateZ: -12, y: 120 }, { rotateX: 18, rotateZ: -4, y: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "center center", scrub: true } });
    if (!fine) return;
    const ry = gsap.quickTo(plane, "rotateY", { duration: 1, ease: "power3" });
    const m = (e: PointerEvent) => ry((e.clientX / window.innerWidth - 0.5) * 16);
    window.addEventListener("pointermove", m);
    onCleanup(() => window.removeEventListener("pointermove", m));
  });
  return (
    <div ref={ref} className="clB">
      <div className="u-wrap clB__head">
        <p className="u-eyebrow">{clients.eyebrow}</p>
        <h2>{clients.title}</h2>
        <p className="clB__lead">{clients.lead}</p>
      </div>
      <div className="clB__stage">
        <ul className="clB__plane" aria-label="Logotipos de clientes">
          {clients.items.map((c) => <li key={c.name}><ClientMark c={c} /></li>)}
        </ul>
      </div>
      <p className="u-wrap clB__foot">Y <b>{clients.foot}</b> {clients.footText}</p>
    </div>
  );
}
