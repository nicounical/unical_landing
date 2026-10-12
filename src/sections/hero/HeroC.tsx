import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { HeroCopy, HeroEyebrow, HeroTitle } from "./shared";
import "./hero.css";

/** C — SCROLL-DRIVEN TRANSFORMATION: un espacio vacío se convierte en plano, se construye, se ilumina y aparece un stand real. */
const S = 62; // escala del isométrico
const iso = (x: number, y: number, z: number) => {
  const px = 400 + (x - y) * Math.cos(Math.PI / 6) * S;
  const py = 250 + (x + y) * Math.sin(Math.PI / 6) * S - z * S;
  return `${px.toFixed(1)},${py.toFixed(1)}`;
};
const poly = (pts: [number, number, number][]) => pts.map((p) => iso(...p)).join(" ");

const FLOOR = poly([[0, 0, 0], [6, 0, 0], [6, 4, 0], [0, 4, 0]]);
const BACK = poly([[0, 0, 0], [6, 0, 0], [6, 0, 3], [0, 0, 3]]);
const SIDE = poly([[0, 0, 0], [0, 4, 0], [0, 4, 3], [0, 0, 3]]);
const HEADER = poly([[1, 0, 3], [5, 0, 3], [5, 0, 3.7], [1, 0, 3.7]]);
const C_TOP = poly([[3.4, 2.4, 1.1], [5.4, 2.4, 1.1], [5.4, 3.2, 1.1], [3.4, 3.2, 1.1]]);
const C_FRONT = poly([[3.4, 3.2, 0], [5.4, 3.2, 0], [5.4, 3.2, 1.1], [3.4, 3.2, 1.1]]);
const C_SIDE = poly([[5.4, 2.4, 0], [5.4, 3.2, 0], [5.4, 3.2, 1.1], [5.4, 2.4, 1.1]]);
const SCREEN = poly([[3.6, 0, 1.2], [5.4, 0, 1.2], [5.4, 0, 2.4], [3.6, 0, 2.4]]);
const GRAPHIC = poly([[0.4, 0, 0.4], [3.1, 0, 0.4], [3.1, 0, 2.7], [0.4, 0, 2.7]]);
const gridLines: string[] = [];
for (let i = 0; i <= 6; i++) gridLines.push(`M${iso(i, 0, 0)} L${iso(i, 4, 0)}`);
for (let j = 0; j <= 4; j++) gridLines.push(`M${iso(0, j, 0)} L${iso(6, j, 0)}`);

const STEPS = [
  { k: "01", t: "Un espacio vacío", d: "6 × 4 m en Fira Barcelona. Medimos y escuchamos el briefing." },
  { k: "02", t: "Diseño técnico", d: "Plano, cotas y originales gráficos adaptados a tu marca." },
  { k: "03", t: "Producción y montaje", d: "Imprimimos, cortamos y montamos con equipo propio." },
  { k: "04", t: "Luz y apertura", d: "Iluminación, últimos ajustes y listo para recibir visitas." },
];

export default function HeroC() {
  const ref = useGsap<HTMLDivElement>(({ root, full, mobile }) => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".hl"), { yPercent: 110, duration: 1.3, stagger: 0.08, ease: "expo.out", delay: 0.2 });
    if (!full) { gsap.set(q(".hC__photo"), { clipPath: "inset(0% 0% 0% 0% round 0px)" }); return; }

    q<SVGGeometryElement>(".hC__draw").forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: mobile ? "+=260%" : "+=340%", pin: true, scrub: 0.8 },
    });
    const step = (i: number) => tl.add(() => root.setAttribute("data-step", String(i)));
    step(0);
    tl.to(q(".hC__intro"), { autoAlpha: 0, y: -40, duration: 0.6 }, 0.4)
      .from(q(".hC__grid path"), { autoAlpha: 0, stagger: 0.02, duration: 0.3 }, 0)
      .to(q(".hC__scene"), { scale: 1, duration: 1 }, 0)
      .addLabel("plan");
    step(1);
    tl.to(q(".hC__draw"), { strokeDashoffset: 0, stagger: 0.08, duration: 1 }, "plan")
      .to(q(".hC__dim"), { autoAlpha: 1, stagger: 0.1, duration: 0.4 }, "plan+=0.6")
      .addLabel("build");
    tl.add(() => root.setAttribute("data-step", "2"), "build");
    tl.to(q(".hC__fill"), { fillOpacity: 1, stagger: 0.1, duration: 0.8 }, "build")
      .to(q(".hC__dim"), { autoAlpha: 0, duration: 0.3 }, "build+=0.4")
      .to(q(".hC__brand"), { autoAlpha: 1, duration: 0.5 }, "build+=0.6")
      .addLabel("light");
    tl.add(() => root.setAttribute("data-step", "3"), "light");
    tl.to(q(".hC__beam"), { autoAlpha: 1, stagger: 0.1, duration: 0.5 }, "light")
      .to(q(".hC__scene"), { scale: 1.08, duration: 1 }, "light")
      .to(q(".hC__photo"), { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.1 }, "light+=0.5")
      .to(q(".hC__final"), { autoAlpha: 1, y: 0, duration: 0.6 }, "light+=1.2");
  });

  return (
    <div ref={ref} className="hC is-dark" data-step="0">
      <div className="hC__stage">
        <svg className="hC__scene" viewBox="0 0 800 560" role="img" aria-label="Animación: un espacio vacío se convierte en un stand montado e iluminado">
          <defs>
            <linearGradient id="hcBack" x1="0" x2="1"><stop offset="0" stopColor="#1E5076" /><stop offset="1" stopColor="#2E6CA0" /></linearGradient>
            <linearGradient id="hcGfx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#99C4E4" /><stop offset="1" stopColor="#2E6CA0" /></linearGradient>
            <radialGradient id="hcBeam"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#99C4E4" stopOpacity="0" /></radialGradient>
          </defs>
          <g className="hC__grid">{gridLines.map((d, i) => <path key={i} d={d} />)}</g>
          <polygon className="hC__fill" points={FLOOR} fill="#2a2a44" fillOpacity="0" />
          <polygon className="hC__fill" points={SIDE} fill="#1A1A2E" fillOpacity="0" />
          <polygon className="hC__fill" points={BACK} fill="url(#hcBack)" fillOpacity="0" />
          <polygon className="hC__fill" points={GRAPHIC} fill="url(#hcGfx)" fillOpacity="0" />
          <polygon className="hC__fill" points={SCREEN} fill="#0b0b16" fillOpacity="0" />
          <polygon className="hC__fill" points={HEADER} fill="#fff" fillOpacity="0" />
          <polygon className="hC__fill" points={C_SIDE} fill="#cfd8e6" fillOpacity="0" />
          <polygon className="hC__fill" points={C_FRONT} fill="#fff" fillOpacity="0" />
          <polygon className="hC__fill" points={C_TOP} fill="#E4E9F0" fillOpacity="0" />
          {[BACK, SIDE, HEADER, GRAPHIC, SCREEN, C_TOP, C_FRONT, C_SIDE].map((p, i) => (
            <polygon key={i} className="hC__draw" points={p} />
          ))}
          <g className="hC__dims">
            <text className="hC__dim" x={iso(3, 4.6, 0).split(",")[0]} y={iso(3, 4.6, 0).split(",")[1]}>6,00 m</text>
            <text className="hC__dim" x={iso(-0.7, 2, 0).split(",")[0]} y={iso(-0.7, 2, 0).split(",")[1]}>4,00 m</text>
            <text className="hC__dim" x={iso(6.4, 0, 1.6).split(",")[0]} y={iso(6.4, 0, 1.6).split(",")[1]}>3,00 m</text>
          </g>
          <text className="hC__brand" x={iso(3, 0, 3.25).split(",")[0]} y={iso(3, 0, 3.25).split(",")[1]} transform={`skewY(30)`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>TU MARCA</text>
          {[1.5, 3, 4.5].map((x) => {
            const [cx, cy] = iso(x, 1.2, 2.2).split(",");
            return <ellipse key={x} className="hC__beam" cx={cx} cy={cy} rx="90" ry="120" fill="url(#hcBeam)" />;
          })}
        </svg>
        <div className="hC__photo" aria-hidden="true">
          <img src="/media/img/hubs/eventos/stand-feria.webp" alt="" loading="lazy" decoding="async" />
        </div>
      </div>

      <div className="hC__intro u-wrap">
        <HeroEyebrow />
        <HeroTitle className="hC__title" />
        <HeroCopy className="hC__copy" />
      </div>

      <ol className="hC__steps u-wrap" aria-label="Del concepto al montaje">
        {STEPS.map((s, i) => (
          <li key={s.k} className="hC__step" data-i={i}>
            <span>{s.k}</span><b>{s.t}</b><em>{s.d}</em>
          </li>
        ))}
      </ol>

      <div className="hC__final u-wrap">
        <p className="hC__finalk">Stand real producido por Unical</p>
        <p className="hC__finalt">Así lo hacemos realidad.</p>
        <HeroCopy className="hC__copy2" />
      </div>
    </div>
  );
}
