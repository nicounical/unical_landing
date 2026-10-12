import { useEffect, useMemo, useState } from "react";
import { LETTERS, SECTIONS, type Letter, type SectionKey } from "@/config/sections";
import { scrollToTarget } from "@/core/scroll";
import { selectionToCode, selectionToQuery, type Selection } from "./selection";
import "./dock.css";

type Props = {
  sel: Selection; set: (k: SectionKey, v: Letter) => void; setAll: (v: Letter) => void; reset: () => void; gallery?: SectionKey;
};

type Device = "desktop" | "tablet" | "mobile" | "all";
const DEVICES: Record<Exclude<Device, "all">, { w: number; h: number; label: string }> = {
  desktop: { w: 1440, h: 900, label: "Escritorio" },
  tablet: { w: 820, h: 1180, label: "Tablet" },
  mobile: { w: 390, h: 844, label: "Móvil" },
};

/** Comparador de variantes (solo desarrollo / preview). */
export default function VariantDock({ sel, set, setAll, reset, gallery }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<SectionKey>("hero");
  const [device, setDevice] = useState<Device | null>(null);
  const [toast, setToast] = useState("");

  // Sección visible → selector rápido.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("main > [data-sec]"));
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setCurrent(best.target.getAttribute("data-sec") as SectionKey);
      },
      { threshold: [0.15, 0.4, 0.7] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sel, gallery]);

  // Atajos: teclas 1–5 cambian la variante de la sección visible.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = ["1", "2", "3", "4", "5"].indexOf(e.key);
      if (i >= 0 && !gallery) set(current, LETTERS[i]);
      if (e.key === "Escape") { setDevice(null); setOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, set, gallery]);

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(""), 1800); };
  const copy = async (txt: string, msg: string) => {
    try { await navigator.clipboard.writeText(txt); flash(msg); } catch { window.prompt("Copia el texto:", txt); }
  };

  const cur = SECTIONS.find((s) => s.key === current)!;
  const combo = useMemo(() => SECTIONS.map((s) => sel[s.key]).join(""), [sel]);
  const embedUrl = `${window.location.pathname}?${selectionToQuery(sel)}&embed=1${gallery ? `&gallery=${gallery}` : ""}`;

  return (
    <>
      <div className={`dock ${open ? "is-open" : ""}`} role="region" aria-label="Comparador de variantes (solo preview)">
        <div className="dock__bar">
          <button className="dock__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            <span className="dock__dot" /> Variantes <b>{combo}</b>
          </button>
          {gallery ? (
            <div className="dock__quick">
              <span className="dock__sec">Galería · {SECTIONS.find((s) => s.key === gallery)?.label}</span>
              <a className="dock__btn" href={`${window.location.pathname}?${selectionToQuery(sel)}`}>Volver a la landing</a>
            </div>
          ) : (
            <div className="dock__quick" aria-label={`Variante de ${cur.label}`}>
              <span className="dock__sec">{cur.label}</span>
              <div className="dock__seg" role="radiogroup" aria-label={cur.label}>
                {LETTERS.map((l) => (
                  <button key={l} role="radio" aria-checked={sel[current] === l} className={sel[current] === l ? "is-on" : ""}
                    title={`${l} · ${cur.variants[l].name} — ${cur.variants[l].direction}`} onClick={() => set(current, l)}>{l}</button>
                ))}
              </div>
              <span className="dock__name">{cur.variants[sel[current]].name}</span>
            </div>
          )}
          <div className="dock__dev" role="group" aria-label="Vista por dispositivo">
            {(["desktop", "tablet", "mobile", "all"] as Device[]).map((d) => (
              <button key={d} className="dock__btn" onClick={() => setDevice(d)} title={d === "all" ? "Comparar los tres tamaños" : DEVICES[d].label}>
                <DevIcon d={d} />
                <span className="u-sr">{d === "all" ? "Comparar tamaños" : DEVICES[d].label}</span>
              </button>
            ))}
          </div>
        </div>

        {open && (
          <div className="dock__panel">
            <div className="dock__rows">
              {SECTIONS.map((s) => (
                <div key={s.key} className={`dock__row ${s.key === current ? "is-cur" : ""}`}>
                  <button className="dock__label" onClick={() => { scrollToTarget(`#${s.id}`); setOpen(false); }}>{s.label}</button>
                  <div className="dock__seg" role="radiogroup" aria-label={s.label}>
                    {LETTERS.map((l) => (
                      <button key={l} role="radio" aria-checked={sel[s.key] === l} className={sel[s.key] === l ? "is-on" : ""}
                        title={`${s.variants[l].name} — ${s.variants[l].idea}`} onClick={() => set(s.key, l)} disabled={!!gallery}>{l}</button>
                    ))}
                  </div>
                  <span className="dock__vname">{s.variants[sel[s.key]].name} <i>{s.variants[sel[s.key]].direction}</i></span>
                  <a className="dock__mini" href={`?${selectionToQuery(sel)}&gallery=${s.key}`} title="Ver las 5 variantes de esta sección una debajo de otra">Ver las 5</a>
                </div>
              ))}
            </div>
            <div className="dock__actions">
              <span>Todo:</span>
              {LETTERS.map((l) => <button key={l} className="dock__btn" onClick={() => setAll(l)}>{l}</button>)}
              <button className="dock__btn" onClick={reset}>Restaurar inicial</button>
              <button className="dock__btn" onClick={() => copy(window.location.href, "Enlace copiado")}>Copiar enlace</button>
              <button className="dock__btn dock__btn--hi" onClick={() => copy(selectionToCode(sel), "Configuración copiada")}>Copiar configuración</button>
            </div>
            <p className="dock__hint">Atajo: teclas <kbd>1</kbd>–<kbd>5</kbd> cambian la sección visible. La selección se guarda en este navegador y en la URL.</p>
          </div>
        )}
        {toast && <div className="dock__toast" role="status">{toast}</div>}
      </div>

      {device && (
        <div className="devpv" role="dialog" aria-label="Vista por dispositivo">
          <div className="devpv__bar">
            {(["desktop", "tablet", "mobile", "all"] as Device[]).map((d) => (
              <button key={d} className={`dock__btn ${device === d ? "is-on" : ""}`} onClick={() => setDevice(d)}>{d === "all" ? "Los tres" : DEVICES[d].label}</button>
            ))}
            <button className="dock__btn" onClick={() => setDevice(null)} aria-label="Cerrar">Cerrar ✕</button>
          </div>
          <div className={`devpv__stage ${device === "all" ? "is-all" : ""}`}>
            {(device === "all" ? (["desktop", "tablet", "mobile"] as const) : [device as Exclude<Device, "all">]).map((d) => (
              <Frame key={d} d={d} url={embedUrl} count={device === "all" ? 3 : 1} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Frame({ d, url, count }: { d: Exclude<Device, "all">; url: string; count: number }) {
  const { w, h, label } = DEVICES[d];
  const [vp, setVp] = useState({ W: window.innerWidth, H: window.innerHeight });
  useEffect(() => {
    const on = () => setVp({ W: window.innerWidth, H: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  // Con «Los tres» se usa la misma escala para los tres marcos: así se comparan proporciones reales.
  const scale = count === 3
    ? Math.min((vp.W - 48 - 48) / (1440 + 820 + 390), (vp.H - 140) / 1180)
    : Math.min(1, (vp.H - 140) / h, (vp.W - 48) / w);
  return (
    <figure className="devpv__frame" style={{ width: w * scale, height: h * scale + 28 }}>
      <figcaption>{label} · {w}×{h}</figcaption>
      <iframe title={`Vista ${label}`} src={url} style={{ width: w, height: h, transform: `scale(${scale})` }} />
    </figure>
  );
}

function DevIcon({ d }: { d: Device }) {
  const p = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (d === "desktop") return <svg {...p}><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
  if (d === "tablet") return <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M11 18h2" /></svg>;
  if (d === "mobile") return <svg {...p}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>;
  return <svg {...p}><rect x="2" y="6" width="10" height="12" rx="1.5" /><rect x="14" y="4" width="8" height="16" rx="1.5" /></svg>;
}
