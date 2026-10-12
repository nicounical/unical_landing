import { clients } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { ClientMark } from "./ClientMark";
import "./clients.css";

/** A — FOCO. Inspirado en 21st.dev «Spotlight» (ibelick, id 1652): los logos esperan en penumbra y un foco que sigue al cursor los ilumina. */
export default function ClientsA() {
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    const q = gsap.utils.selector(root);
    if (full) gsap.from(q(".clA__logo"), { autoAlpha: 0, y: 20, stagger: { each: 0.03, from: "random" }, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: q(".clA__wall")[0], start: "top 80%" } });
    if (!fine) { root.classList.add("is-lit"); return; }
    const wall = q<HTMLElement>(".clA__wall")[0];
    const m = (e: PointerEvent) => { const r = wall.getBoundingClientRect(); wall.style.setProperty("--x", `${e.clientX - r.left}px`); wall.style.setProperty("--y", `${e.clientY - r.top}px`); };
    wall.addEventListener("pointermove", m);
    onCleanup(() => wall.removeEventListener("pointermove", m));
  });
  return (
    <div ref={ref} className="clA is-dark">
      <div className="u-wrap">
        <div className="clA__head">
          <p className="u-eyebrow">{clients.eyebrow}</p>
          <h2>{clients.title}</h2>
          <p className="clA__lead">{clients.lead}</p>
        </div>
        <ul className="clA__wall" aria-label="Logotipos de clientes">
          {clients.items.map((c) => <li key={c.name} className="clA__logo"><ClientMark c={c} /></li>)}
        </ul>
        <p className="clA__foot">Y <b>{clients.foot}</b> {clients.footText}</p>
      </div>
    </div>
  );
}
