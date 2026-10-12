import { useState } from "react";
import { why } from "@/content/site";
import { Btn, Icon } from "@/core/ui";
import "./why.css";

/** D — ACORDEÓN SOBRIO: lista con iconos lineales que se despliega con calma; la imagen de cada pilar acompaña. */
export default function WhyD() {
  const [open, setOpen] = useState(0);
  return (
    <div className="wD">
      <div className="u-wrap wD__grid">
        <div className="wD__left">
          <p className="u-eyebrow">{why.eyebrow}</p>
          <h2>{why.titleA}<em className="u-em">{why.titleEm}</em>{why.titleB}</h2>
          <p className="wD__lead">{why.text}</p>
          <div className="wD__img">
            {why.pillars.map((p, i) => <img key={p.n} src={p.img} alt="" className={i === open ? "is-on" : ""} loading="lazy" decoding="async" />)}
          </div>
        </div>
        <div className="wD__right">
          <ul className="wD__acc">
            {why.pillars.map((p, i) => (
              <li key={p.n} className={i === open ? "is-open" : ""}>
                <h3>
                  <button aria-expanded={i === open} aria-controls={`wd-${i}`} onClick={() => setOpen(i)}>
                    <span className="wD__ic"><Icon name={p.icon} size={22} /></span>
                    <span className="wD__t">{p.title}</span>
                    <span className="wD__pm" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`wd-${i}`} className="wD__panel" role="region"><div><p>{p.text}</p><ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul></div></div>
              </li>
            ))}
          </ul>
          <Btn href={why.cta.href} kind="dark">{why.cta.label}</Btn>
        </div>
      </div>
    </div>
  );
}
