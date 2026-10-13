/**
 * PROYECTOS F · Editorial Kinetic — basado en 21st.dev «Zoom Blur Image Carousel» / Lens Zoom Carousel (id 36186).
 * Del original se conserva: la imagen entrante «llega» como un tirón de zoom (escala depth 1.35 → 1 con blur 14 px
 * y brillo) con dos copias fantasma en `screen` que se desvanecen detrás, mientras la anterior cae al fondo
 * (brightness .42, scale 1.04); hacia atrás el zoom se invierte (1/depth); `onAnimationEnd` confirma el cambio;
 * texto que sube por máscara, contador 01/08, botones circulares, barra de progreso que dispara el autoplay,
 * deslizamiento con el dedo, ←/→, pausa fuera de pantalla o con la pestaña oculta, y anuncio aria-live.
 * Adaptación: paisajes pintados → las fotos reales de los 8 proyectos (título + tipo/cliente); maquetación editorial
 * en papel con índice numerado a la derecha que salta a cualquier proyecto (dirección del zoom según el sentido),
 * enlace «Ver proyecto» del activo y «Ver todos los proyectos». Autoplay con botón de pausa y pausa al pasar el
 * cursor o enfocar. Tipografía serif → Poppins de marca. Sin movimiento: cambio directo, sin autoplay.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AllLink, ArrowUR, COUNT, Chevron, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

const N = ITEMS.length;
const DURATION = 1050, DEPTH = 1.35, AUTOPLAY = 6000;
const wrap = (i: number) => ((i % N) + N) % N;
const ghostScale = (depth: number, g: number) => depth + (depth - 1) * 0.6 * (g + 1);

const CSS = `
.lzp{position:relative;overflow:hidden;background:#0d0d12;color:#fff;user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none}
.lzp:focus-visible{box-shadow:inset 0 0 0 2px #99C4E4}
.lzp-base{position:absolute;inset:0;transition:filter .9s ease,transform 1.4s cubic-bezier(.2,.7,.2,1)}
.lzp[data-moving='1'] .lzp-base{filter:brightness(.42);transform:scale(1.04)}
.lzp-img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;pointer-events:none}
.lzp-in{position:absolute;inset:0;overflow:hidden;animation:lzp-show var(--d) cubic-bezier(.2,.75,.2,1) both}
.lzp-main{animation:lzp-zoom var(--d) cubic-bezier(.16,.8,.2,1) both}
.lzp-ghost{opacity:0;mix-blend-mode:screen;animation:lzp-ghost var(--d) cubic-bezier(.16,.8,.2,1) both}
.lzp-line{display:block;overflow:hidden;padding-bottom:.08em}
.lzp-line>span{display:block;animation:lzp-rise .9s cubic-bezier(.2,.8,.2,1) both}
.lzp-cap>span{animation-delay:.08s}
.lzp-fill{height:100%;background:#fff;transform-origin:left;transform:scaleX(0)}
.lzp-fill[data-run='1']{animation:lzp-fill var(--auto) linear forwards}
.lzp[data-paused='1'] .lzp-fill{animation-play-state:paused}
@keyframes lzp-show{from{opacity:0}35%{opacity:1}to{opacity:1}}
@keyframes lzp-zoom{from{transform:scale(var(--depth));filter:blur(14px) brightness(1.2)}to{transform:none;filter:none}}
@keyframes lzp-ghost{from{transform:scale(var(--g));opacity:.4;filter:blur(6px)}to{transform:scale(1);opacity:0;filter:blur(0)}}
@keyframes lzp-rise{from{transform:translateY(105%)}to{transform:none}}
@keyframes lzp-fill{to{transform:scaleX(1)}}
.lzp[data-static='1'] .lzp-line>span{animation:none}
`;

export default function ProjectsF() {
  const full = useFull();
  const [index, setIndex] = useState(0);
  const [incoming, setIncoming] = useState<null | { to: number; dir: number; id: number }>(null);
  const [offscreen, setOffscreen] = useState(false);
  const [hold, setHold] = useState(false); // cursor encima / foco dentro
  const [userPaused, setUserPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const down = useRef<null | { x: number; y: number }>(null);

  const goTo = (to: number, dir: number) => {
    to = wrap(to);
    if (incoming || to === index) return;
    if (!full) { setIndex(to); return; }
    setIncoming({ to, dir, id: Date.now() });
  };
  const go = (dir: number) => goTo(index + dir, dir);
  const commit = () => { if (incoming) { setIndex(incoming.to); setIncoming(null); } };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = true;
    const sync = () => setOffscreen(!seen || document.hidden);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };
  const onDown = (e: React.PointerEvent) => { down.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e: React.PointerEvent) => {
    const s = down.current;
    down.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
  };

  const shown = incoming ? incoming.to : index;
  const p = ITEMS[shown];
  const autoplay = full && !userPaused;
  const paused = offscreen || hold || userPaused;
  const stop = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <style>{CSS}</style>
      <div className="u-wrap">
        {/* Cabecera editorial */}
        <div className="grid gap-6 border-b border-ink/10 pb-8 md:grid-cols-12 md:items-end md:pb-10">
          <div className="md:col-span-9">
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-5 text-[clamp(2.4rem,5.6vw,5rem)] font-extrabold leading-[.92] tracking-[-0.06em] text-ink">{TITLE}</h2>
          </div>
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-ink/60 md:col-span-3 md:justify-self-end">{LEAD}</p>
        </div>

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:gap-10">
          {/* Carrusel */}
          <div ref={root} className="lzp h-[min(72svh,620px)] min-h-[440px] rounded-[6px] lg:col-span-8"
            style={{ ["--d" as string]: `${DURATION}ms`, ["--auto" as string]: `${AUTOPLAY}ms` }}
            data-moving={incoming ? "1" : "0"} data-paused={paused ? "1" : "0"} data-static={full ? "0" : "1"}
            role="region" aria-roledescription="carrusel" aria-label="Proyectos destacados" tabIndex={0}
            onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp}
            onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
            onFocus={() => setHold(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); }}>
            <div className="lzp-base">
              <img className="lzp-img" src={ITEMS[index].img} alt={ITEMS[index].alt} draggable={false} loading="lazy" />
            </div>
            {incoming && (
              <div className="lzp-in" key={incoming.id} aria-hidden style={{ ["--depth" as string]: String(incoming.dir >= 0 ? DEPTH : 1 / DEPTH) }}
                onAnimationEnd={(e) => e.target === e.currentTarget && commit()}>
                <img className="lzp-img lzp-main" src={ITEMS[incoming.to].img} alt="" draggable={false} />
                {[1, 0].map((g) => (
                  <img key={g} className="lzp-img lzp-ghost" src={ITEMS[incoming.to].img} alt="" draggable={false}
                    style={{ ["--g" as string]: String(ghostScale(incoming.dir >= 0 ? DEPTH : 1 / DEPTH, g)), animationDelay: `${g * 40}ms` }} />
                ))}
              </div>
            )}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

            {/* Texto */}
            <div key={`t${shown}`} className="pointer-events-none absolute bottom-[96px] left-5 right-5 md:bottom-[104px] md:left-8 md:right-8" aria-hidden>
              <span className="lzp-line text-[11px] font-semibold uppercase tracking-[0.22em] text-brand"><span>{p.kind}</span></span>
              <span className="lzp-line mt-2 font-head text-[clamp(1.9rem,4.4vw,3.8rem)] font-extrabold leading-[1] tracking-[-0.045em]"><span>{p.title}</span></span>
              <span className="lzp-line lzp-cap mt-2 text-sm text-white/75"><span>Cliente · {p.client}</span></span>
            </div>

            {/* Contador superior + pausa */}
            <div className="absolute left-5 right-5 top-4 flex items-center justify-between md:left-8 md:right-8 md:top-6">
              <span className="font-mono text-[12px] tracking-[0.14em] text-white/85" aria-hidden>{pad(shown + 1)} / {COUNT}</span>
              {full && (
                <button type="button" onPointerDown={stop} onClick={() => setUserPaused((v) => !v)}
                  aria-label={userPaused ? "Reanudar el pase automático" : "Pausar el pase automático"} aria-pressed={userPaused}
                  className="grid h-11 w-11 place-items-center rounded-full border border-solid border-white/40 text-white backdrop-blur transition hover:bg-white hover:text-ink">
                  {userPaused
                    ? <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M4 2.5v11l9-5.5z" /></svg>
                    : <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg>}
                </button>
              )}
            </div>

            {/* Navegación inferior */}
            <div className="absolute bottom-9 left-5 right-5 flex items-center justify-between gap-4 md:bottom-10 md:left-8 md:right-8">
              <a href={p.href} onPointerDown={stop}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-brand">
                Ver proyecto <span className="sr-only">{p.title}</span>
                <ArrowUR className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <div className="flex items-center gap-3">
                {[-1, 1].map((d) => (
                  <button key={d} type="button" onPointerDown={stop} onClick={() => go(d)} aria-label={d < 0 ? "Proyecto anterior" : "Proyecto siguiente"}
                    className="grid h-11 w-11 place-items-center rounded-full border border-solid border-white/45 text-white transition hover:bg-white hover:text-ink">
                    <Chevron dir={d < 0 ? "left" : "right"} />
                  </button>
                ))}
              </div>
            </div>
            <div aria-hidden className="absolute bottom-4 left-5 right-5 h-px bg-white/25 md:left-8 md:right-8">
              <div key={`f${index}`} className="lzp-fill" data-run={autoplay && !incoming ? "1" : "0"} onAnimationEnd={() => go(1)} />
            </div>
            <div className="sr-only" aria-live="polite">{`Proyecto ${shown + 1} de ${N}: ${p.title}`}</div>
          </div>

          {/* Índice editorial */}
          <div className="flex flex-col lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">Índice</p>
            <ol className="mt-3 border-t border-ink/10">
              {ITEMS.map((it, i) => {
                const on = i === shown;
                return (
                  <li key={it.id} className="border-b border-ink/10">
                    <button type="button" onClick={() => goTo(i, i > shown ? 1 : -1)} aria-current={on ? "true" : undefined}
                      className={cn("group flex min-h-[48px] w-full items-baseline gap-4 py-2.5 text-left transition-colors", on ? "text-ink" : "text-ink/45 hover:text-ink")}>
                      <span className={cn("font-mono text-[11px] tabular-nums", on ? "text-brand-strong" : "text-ink/35")}>{pad(i + 1)}</span>
                      <span className={cn("flex-1 font-head text-[15px] font-semibold tracking-[-0.02em] transition-transform duration-300", on && "translate-x-1.5")}>{it.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 text-ink lg:mt-auto lg:pt-6"><AllLink /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
