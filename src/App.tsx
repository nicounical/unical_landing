import { Suspense, lazy, useEffect, useLayoutEffect, useState } from "react";
import { SECTIONS, LETTERS, type SectionDef, type Letter } from "@/config/sections";
import { Header, Footer, WhatsAppFloat } from "@/core/Chrome";
import { initSmoothScroll, refreshScroll } from "@/core/scroll";
import { PREVIEW } from "@/core/env";
import { useSelection } from "@/preview/selection";

// El selector solo existe en desarrollo / preview: en producción este import desaparece del bundle.
const VariantDock = PREVIEW ? lazy(() => import("@/preview/VariantDock")) : null;

const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
const EMBED = PREVIEW && params.get("embed") === "1";
const GALLERY = PREVIEW ? params.get("gallery") : null;

function Mounted({ onMount }: { onMount: () => void }) {
  useLayoutEffect(onMount, [onMount]);
  return null;
}

function SectionSlot({ def, letter, labelled = false }: { def: SectionDef; letter: Letter; labelled?: boolean }) {
  const V = def.variants[letter];
  return (
    <section id={labelled ? `${def.id}-${letter}` : def.id} className="sec" data-sec={def.key} data-variant={letter} aria-label={def.label}>
      {labelled && (
        <div className="pv-label"><b>{def.label} · {letter}</b> {V.name} <i>{V.direction}</i></div>
      )}
      <Suspense fallback={<div className="sec__loading" style={{ minHeight: "100vh", background: "var(--u-navy)" }} />}>
        <V.Component key={letter} />
        <Mounted onMount={refreshScroll} />
      </Suspense>
    </section>
  );
}

export default function App() {
  const { sel, set, setAll, reset } = useSelection();
  const [, force] = useState(0);
  useEffect(() => initSmoothScroll(), []);
  useEffect(() => {
    document.documentElement.classList.toggle("has-dock", PREVIEW && !EMBED);
    const onResize = () => { refreshScroll(); force((n) => n + 1); };
    window.addEventListener("orientationchange", onResize);
    return () => window.removeEventListener("orientationchange", onResize);
  }, []);

  const gallerySection = GALLERY ? SECTIONS.find((s) => s.key === GALLERY) : undefined;

  return (
    <>
      <Header />
      <main id="main">
        {gallerySection
          ? LETTERS.map((l) => <SectionSlot key={l} def={gallerySection} letter={l} labelled />)
          : SECTIONS.map((def) => <SectionSlot key={def.key} def={def} letter={sel[def.key]} />)}
      </main>
      <Footer />
      <WhatsAppFloat />
      {VariantDock && !EMBED && (
        <Suspense fallback={null}>
          <VariantDock sel={sel} set={set} setAll={setAll} reset={reset} gallery={gallerySection?.key} />
        </Suspense>
      )}
    </>
  );
}
