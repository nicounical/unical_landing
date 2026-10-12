import { useState } from "react";
import { sectors } from "@/content/site";
import "./sectors.css";

/** D — LISTA EDITORIAL: dos columnas con filetes y numeración; una miniatura aparece junto al sector al pasar. */
export default function SectorsD() {
  const [cur, setCur] = useState<number | null>(null);
  return (
    <div className="seD">
      <div className="u-wrap seD__grid">
        <div className="seD__head">
          <p className="u-eyebrow">{sectors.eyebrow}</p>
          <h2>{sectors.title}</h2>
          <p className="seD__lead">{sectors.lead}</p>
        </div>
        <ol className="seD__list" onPointerLeave={() => setCur(null)}>
          {sectors.items.map((s, i) => (
            <li key={s.name} className={cur === i ? "is-on" : ""} onPointerEnter={() => setCur(i)}>
              <span className="seD__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="seD__t">{s.name}</span>
              <span className="seD__th" aria-hidden="true"><img src={s.img} alt="" loading="lazy" decoding="async" /></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
