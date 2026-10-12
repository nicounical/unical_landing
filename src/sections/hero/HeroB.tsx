import { gallery } from "@/content/site";
import { useGsap } from "@/core/useGsap";
import { gsap, ScrollTrigger } from "@/core/scroll";
import { HeroCopy, HeroEyebrow, HeroTitle } from "./shared";
import "./hero.css";

/**
 * B — IMMERSIVE 3D · «Órbita de proyectos».
 * Adaptación del componente 21st.dev «Cinematic Orbit Hero» (daiwiikharihar, id 32357):
 * los trabajos salen de una pila y se abren en una órbita elíptica con escala por profundidad
 * y parallax de cursor. Portado de motion/react a GSAP para no añadir dependencias.
 */
const IMGS = [gallery[0], gallery[3], gallery[1], gallery[7], gallery[4], gallery[16], gallery[2], gallery[9]];
const N = IMGS.length;
const CARDS = IMGS.map((src, i) => ({
  src,
  a: (i * Math.PI * 2) / N,
  stack: { x: (i - N / 2) * 1.4, y: 24 + (i - N / 2) * 0.9, r: (i - N / 2) * 3 },
}));
const orbitPos = (a: number, mobile: boolean) => {
  const rx = mobile ? 36 : 42, ry = mobile ? 24 : 18;
  const depth = Math.sin(a - Math.PI / 2);
  return {
    x: Math.cos(a - Math.PI / 2) * rx,
    y: depth * ry + (mobile ? 6 : 10),
    s: 0.8 + depth * 0.25,
    r: Math.cos(a - Math.PI / 2) * 15,
    z: Math.round((depth + 1) * 100),
    depth,
  };
};
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export default function HeroB() {
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, mobile, onCleanup }) => {
    const q = gsap.utils.selector(root);
    const cards = q<HTMLElement>(".hB__card");
    gsap.from(q(".hl"), { yPercent: 110, rotate: 4, duration: 1.4, stagger: 0.1, ease: "expo.out", delay: 0.2 });
    gsap.from(q(".hB__copy"), { autoAlpha: 0, y: 30, duration: 1.2, delay: 0.7, ease: "expo.out" });
    gsap.from(q(".hB__card img"), { autoAlpha: 0, scale: 1.3, stagger: 0.05, duration: 1.2, ease: "expo.out", delay: 0.4 });

    let prog = 0, spin = 0, px = 0, py = 0;
    const render = () => {
      const p = ease(Math.min(1, prog));
      cards.forEach((el, i) => {
        const c = CARDS[i];
        const o = orbitPos(c.a + spin, mobile);
        const depthFactor = 0.2 + o.z / 200;
        const x = c.stack.x + (o.x - c.stack.x) * p - px * 5 * depthFactor * p;
        const y = c.stack.y + (o.y - c.stack.y) * p - py * 5 * depthFactor * p;
        const s = 0.6 + (o.s - 0.6) * p;
        const r = c.stack.r + (o.r - c.stack.r) * p;
        el.style.transform = `translate(calc(-50% + ${x}vw), calc(-50% + ${y}vh)) rotate(${r}deg) scale(${s})`;
        el.style.zIndex = String(p > 0.5 ? o.z : 10 + i);
        el.style.filter = p > 0.5 ? `brightness(${(0.55 + (o.depth + 1) * 0.25).toFixed(2)})` : "";
      });
    };
    if (!full) { prog = 1; render(); return; }
    render();

    ScrollTrigger.create({
      trigger: root, start: "top top", end: mobile ? "+=160%" : "+=230%", pin: true, scrub: 0.8,
      onUpdate: (st) => {
        // 0–0,6: la pila se abre en órbita · 0,6–1: la órbita gira un cuarto de vuelta
        prog = Math.min(1, st.progress / 0.6);
        spin = Math.max(0, (st.progress - 0.6) / 0.4) * (Math.PI / 2);
        render();
      },
    });

    if (fine) {
      const st = { x: 0, y: 0 };
      const move = (e: PointerEvent) => {
        gsap.to(st, {
          x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2,
          duration: 1.2, ease: "power3.out", overwrite: true, onUpdate: () => { px = st.x; py = st.y; render(); },
        });
      };
      window.addEventListener("pointermove", move, { passive: true });
      onCleanup(() => window.removeEventListener("pointermove", move));
    }
  });

  return (
    <div ref={ref} className="hB is-dark">
      <div className="hB__glow" aria-hidden="true" />
      <div className="hB__center u-wrap">
        <HeroEyebrow />
        <HeroTitle className="hB__title" />
        <HeroCopy className="hB__copy" />
      </div>
      <div className="hB__orbit" aria-hidden="true">
        {CARDS.map((c, i) => (
          <figure key={i} className="hB__card"><img src={c.src} alt="" loading={i < 4 ? "eager" : "lazy"} decoding="async" draggable={false} /></figure>
        ))}
      </div>
      <p className="hB__hint" aria-hidden="true">Haz scroll · mueve el cursor</p>
    </div>
  );
}
