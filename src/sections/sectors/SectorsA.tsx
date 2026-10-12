import { useState } from "react";
import { sectors } from "@/content/site";
import "./sectors.css";

/** A — FONDO POR SECTOR: al pasar (o enfocar) cada sector, la imagen de fondo cambia con un fundido cinematográfico. */
export default function SectorsA() {
  const [cur, setCur] = useState(0);
  return (
    <div className="seA is-dark">
      <div className="seA__bg" aria-hidden="true">
        {sectors.items.map((s, i) => <img key={s.name} src={s.img} alt="" className={i === cur ? "is-on" : ""} loading="lazy" decoding="async" />)}
        <div className="seA__shade" />
      </div>
      <div className="u-wrap seA__in">
        <div className="seA__head">
          <p className="u-eyebrow">{sectors.eyebrow}</p>
          <h2>{sectors.title}</h2>
          <p className="seA__lead">{sectors.lead}</p>
        </div>
        <ul className="seA__list">
          {sectors.items.map((s, i) => (
            <li key={s.name}>
              <button className={i === cur ? "is-on" : ""} onPointerEnter={() => setCur(i)} onFocus={() => setCur(i)} onClick={() => setCur(i)} aria-pressed={i === cur}>
                <span className="seA__n">{String(i + 1).padStart(2, "0")}</span>{s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
