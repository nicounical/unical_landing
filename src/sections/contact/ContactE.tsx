/**
 * CONTACTO E · High-Energy Motion — basado en 21st.dev «CTA Email Subscribe Section» (id 31727).
 * Del original se conserva: titular centrado en dos líneas que entra palabra a palabra (FadeUp: y 20 → 0,
 * 0.6 s, ease [0.22,1,0.36,1], retardos escalonados), con piezas intercaladas en la frase —una miniatura con
 * inclinación 3D y brillo al pasar el puntero (useSpring sobre rotateX/rotateY/scale), un asterisco de color y
 * una pastilla con borde—, subtítulo y una fila de campo + botón en píldora con escala al pulsar.
 * Adaptación: la miniatura es una foto real (cta.revealImg) y la pastilla recorre una vez los servicios reales
 * del formulario y se detiene. La suscripción se sustituye por el arranque del formulario real: el email se
 * valida, se despliega ContactForm con ese email ya escrito y el foco pasa al nombre. La fila de «social proof»
 * (avatares + «11.5k devs») se elimina y en su lugar van los canales reales. Fondo tinta.
 * Estático: titular completo, sin rotación ni tilt, y el formulario ya desplegado.
 */
import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Asterisk } from "lucide-react";
import { cta } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Channels, TEXT, darkFormCss, useFull } from "./shared";

const CSS = `${darkFormCss("ce-form")}
.ce-form .cf-send{width:100%;background:#99C4E4;color:#16161F}
.ce-form .cf-send:hover{background:#fff}
`;
const SERVICES = cta.serviceOptions.filter((o) => o !== "Otro");

function FadeUp({ children, delay = 0, full, className = "" }: { children: ReactNode; delay?: number; full: boolean; className?: string }) {
  if (!full) return <span className={cn("inline-block", className)}>{children}</span>;
  return (
    <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={cn("inline-block", className)}>
      {children}
    </motion.span>
  );
}

function HoverImage({ full }: { full: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [18, -18]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-18, 18]), { stiffness: 300, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 22 });
  const live = full && finePointer();
  const move = (e: MouseEvent<HTMLSpanElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
    rawY.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
    scale.set(1.18);
  };
  const leave = () => { rawX.set(0); rawY.set(0); scale.set(1); };
  return (
    <motion.span ref={ref} onMouseMove={live ? move : undefined} onMouseLeave={live ? leave : undefined}
      style={live ? { rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 600 } : undefined}
      whileHover={live ? { boxShadow: "0 0 32px 8px rgba(153,196,228,.28)" } : undefined}
      className="relative -top-1 inline-block h-[0.9em] w-[1.5em] overflow-hidden rounded-[0.2em] align-middle shadow-lg ring-1 ring-white/20">
      <img src={cta.revealImg} alt="" className="pointer-events-none h-full w-full object-cover" loading="lazy" decoding="async" />
    </motion.span>
  );
}

/** Pastilla que recorre los servicios una vez y se queda en el primero. */
function ServicePill({ full }: { full: boolean }) {
  const [i, setI] = useState(0);
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!full) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [full]);
  useEffect(() => {
    if (!run) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setI(n % SERVICES.length);
      if (n >= SERVICES.length) window.clearInterval(id);
    }, 1100);
    return () => window.clearInterval(id);
  }, [run]);
  return (
    <span ref={ref} className="relative inline-flex h-[1.5em] items-center overflow-hidden rounded-full border-2 border-brand px-[0.45em] align-middle text-[0.44em] tracking-[-0.02em] leading-none text-brand">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={i} initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-110%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }} className="block whitespace-nowrap">
          {SERVICES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function ContactE() {
  const full = useFull();
  const [open, setOpen] = useState(!full);
  const [email, setEmail] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    if (!open || !box.current) return;
    const root = box.current;
    const t = window.setTimeout(() => {
      const mail = root.querySelector<HTMLInputElement>('input[name="email"]');
      if (mail && email && !mail.value) mail.value = email;
      if (focusOnOpen.current) root.querySelector<HTMLInputElement>('input[name="nombre"]')?.focus({ preventScroll: false });
    }, 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const start = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    focusOnOpen.current = true;
    setOpen(true);
  };

  const d = (k: number) => 0.06 + k * 0.05;
  return (
    <div className="relative overflow-hidden bg-ink py-[var(--u-section-y)] text-white">
      <style>{CSS}</style>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-strong/25 blur-[120px]" aria-hidden />
      <div className="u-wrap relative flex flex-col items-center text-center">
        <FadeUp full={full} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">Contacto</FadeUp>
        <h2 className="mt-6 font-head text-[clamp(2.3rem,6vw,5.2rem)] font-bold leading-[1.08] tracking-[-0.045em] text-white" style={{ perspective: 800 }}>
          <span className="sr-only">{cta.eyebrow} {cta.titleHollow.toLowerCase()} {cta.titleSolid.toLowerCase()}</span>
          <span aria-hidden className="mb-2 flex flex-wrap items-center justify-center gap-x-[0.22em] gap-y-2">
            <FadeUp full={full} delay={d(0)}>¿Tienes</FadeUp>
            <FadeUp full={full} delay={d(1)}>un</FadeUp>
            <FadeUp full={full} delay={d(2)}><HoverImage full={full} /></FadeUp>
            <FadeUp full={full} delay={d(3)}><em className="font-bold italic text-brand">proyecto?</em></FadeUp>
            <FadeUp full={full} delay={d(4)} className="font-light text-white/60">←</FadeUp>
          </span>
          <span aria-hidden className="flex flex-wrap items-center justify-center gap-x-[0.22em] gap-y-2">
            <FadeUp full={full} delay={d(5)}>Trabajemos</FadeUp>
            <FadeUp full={full} delay={d(6)}>
              <motion.span className="inline-block text-brand" initial={false} whileInView={full ? { rotate: 180 } : undefined} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <Asterisk className="h-[0.8em] w-[0.8em]" strokeWidth={3} />
              </motion.span>
            </FadeUp>
            <FadeUp full={full} delay={d(7)}>juntos</FadeUp>
            <FadeUp full={full} delay={d(8)}><ServicePill full={full} /></FadeUp>
            <FadeUp full={full} delay={d(9)}>.</FadeUp>
          </span>
        </h2>

        <motion.p initial={full ? { opacity: 0, y: 10 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.5 }}
          className="mt-8 max-w-[52ch] text-[1.02rem] leading-relaxed text-white/70">{TEXT}</motion.p>

        {/* Campo + botón en píldora: arranca el formulario real */}
        <AnimatePresence initial={false} mode="wait">
          {!open ? (
            <motion.form key="start" onSubmit={start} noValidate
              initial={full ? { opacity: 0, y: 16 } : false} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center" aria-label="Empezar solicitud de presupuesto">
              <label htmlFor="ce-email" className="sr-only">Tu email</label>
              <input id="ce-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@empresa.com" autoComplete="email"
                className="min-h-[54px] flex-1 rounded-full border border-white/15 bg-white px-6 text-[0.95rem] text-ink outline-none placeholder:text-ink/40 focus-visible:ring-2 focus-visible:ring-brand" />
              <motion.button type="submit" whileHover={full ? { scale: 1.04 } : undefined} whileTap={full ? { scale: 0.96 } : undefined}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-7 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-white">
                Pedir presupuesto <ArrowUpRight className="h-4 w-4" aria-hidden />
              </motion.button>
            </motion.form>
          ) : (
            <motion.div key="form" ref={box} initial={full ? { opacity: 0, y: 24, scale: 0.98 } : false} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur sm:p-8">
              <ContactForm className="ce-form" button="Enviar solicitud" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <button type="button" onClick={() => { focusOnOpen.current = true; setOpen(true); }}
            className="mt-3 min-h-[44px] text-sm text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white">
            o abre el formulario completo
          </button>
        )}

        <div className="mt-10 text-white/90">
          <Channels className="justify-center" itemClass="hover:bg-white/[.06]" />
        </div>
      </div>
    </div>
  );
}
