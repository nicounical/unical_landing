import { numbers } from "@/content/site";
import { Count, NumTitle } from "./shared";
import "./numbers.css";

/** D — REJILLA FINA: filetes, mucho aire, contadores sobrios y tipografía protagonista. */
export default function NumbersD() {
  return (
    <div className="nD">
      <div className="u-wrap">
        <div className="nD__head">
          <p className="u-eyebrow">{numbers.eyebrow}</p>
          <NumTitle className="nD__t" />
          <p className="nD__lead">{numbers.lead}</p>
        </div>
        <dl className="nD__grid">
          {numbers.items.map((it, i) => (
            <div key={it.label} className="nD__cell">
              <dt>{String(i + 1).padStart(2, "0")} — {it.label}</dt>
              <dd><Count it={it} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
