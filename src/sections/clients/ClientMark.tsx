import type { CSSProperties } from "react";

/**
 * Marca de cliente. No hay logotipos vectoriales de los clientes (solo favicons de 16–128 px, ver
 * docs/RECURSOS-PENDIENTES.md), así que se muestra el nombre como marca tipográfica, igual que la landing original,
 * con el favicon real como pequeño distintivo cuando su resolución lo permite.
 */
const LOWRES = new Set(["catai", "generali", "leo-pharma", "longi", "otis", "rituals"]);

export function ClientMark({ c, icon = true, className = "", style }: { c: { name: string; logo: string }; icon?: boolean; className?: string; style?: CSSProperties }) {
  const slug = c.logo.split("/").pop()!.replace(".png", "");
  return (
    <span className={`cm ${className}`} style={style}>
      {icon && !LOWRES.has(slug) && <img className="cm__i" src={c.logo} alt="" width={22} height={22} loading="lazy" decoding="async" />}
      <span className="cm__n">{c.name}</span>
    </span>
  );
}
