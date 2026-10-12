import { hero } from "@/content/site";
import { Btn, Eyebrow } from "@/core/ui";

/** Bloque comercial común a las 5 portadas: el usuario entiende en 3 s qué hace Unical. */
export function HeroCopy({ className = "", magnetic = true }: { className?: string; magnetic?: boolean }) {
  return (
    <div className={className}>
      <p className="hero-lead">{hero.lead}</p>
      <div className="hero-ctas">
        <Btn href={hero.ctaPrimary.href} kind="primary" magnetic={magnetic}>{hero.ctaPrimary.label} <span aria-hidden>→</span></Btn>
        <Btn href={hero.ctaSecondary.href} kind="ghost" magnetic={magnetic}>{hero.ctaSecondary.label}</Btn>
      </div>
    </div>
  );
}

export const HeroEyebrow = ({ className = "" }: { className?: string }) => <Eyebrow className={`u-eyebrow--light ${className}`}>{hero.eyebrow}</Eyebrow>;

/** H1 único con la keyword. Visualmente se parte en líneas; para lectores de pantalla es una frase. */
export function HeroTitle({ className = "", lineClass = "hl" }: { className?: string; lineClass?: string }) {
  return (
    <h1 className={className} aria-label="Producción visual B2B en Barcelona">
      {hero.titleLines.map((l, i) => (
        <span key={i} aria-hidden="true"><span className="u-wmask"><span className={`${lineClass} ${lineClass}--${i + 1}`}>{l}</span></span>{i < hero.titleLines.length - 1 ? " " : ""}</span>
      ))}
    </h1>
  );
}
