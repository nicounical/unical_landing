import { clients } from "@/content/site";
import { ClientMark } from "./ClientMark";
import "./clients.css";

/** D — REJILLA LIMPIA: filetes finos, logos en gris que recuperan su color al pasar. */
export default function ClientsD() {
  return (
    <div className="clD">
      <div className="u-wrap">
        <div className="clD__head">
          <div><p className="u-eyebrow">{clients.eyebrow}</p><h2>{clients.title}</h2></div>
          <p className="clD__lead">{clients.lead}</p>
        </div>
        <ul className="clD__grid" aria-label="Logotipos de clientes">
          {clients.items.map((c) => <li key={c.name}><ClientMark c={c} /></li>)}
          <li className="clD__more"><b>{clients.foot}</b><span>{clients.footText}</span></li>
        </ul>
      </div>
    </div>
  );
}
