/**
 * CONTACTO A · Cinematic Premium — basado en 21st.dev «CTA Section with Noise Shader» (id 27553, shadcnui-blocks · cta-06).
 * Del original se conserva: panel enmarcado (borde + radio + sombra) con un shader «neuro noise» animado que se
 * desvanece hacia la izquierda (mask-l), titular, texto de apoyo y dos botones (primario con flecha + secundario).
 * Adaptación: @paper-design/shaders-react no está instalado → el NeuroNoise se reimplementa en un <canvas> WebGL
 * propio (mismo algoritmo de capas senoidales rotadas, colores back/mid/front de marca, contraste y escala) que
 * solo se dibuja con la sección en pantalla, a media resolución, y con botón de pausa. Debajo del shader corre el
 * showreel real silenciado (SmartVideo: solo póster en estático). El panel incorpora el formulario real
 * (ContactForm) en una tarjeta de cristal y los canales reales (teléfono, WhatsApp, email). Sin next-themes.
 * Estático / reduced-motion: sin canvas ni vídeo; póster con degradado y el mismo contenido.
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import { motion } from "motion/react";
import { videos } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { SmartVideo } from "@/core/ui";
import { ArrowUpRight, CHANNELS, Channels, CtaTitle, Eyebrow, PauseToggle, TEXT, darkFormCss, useFull } from "./shared";

const CSS = `${darkFormCss("ca-form")}
.ca-form .cf-send{width:100%;background:#fff;color:#16161F}
.ca-form .cf-send:hover{background:#EAF2F9}
.ca-title .u-hollow{-webkit-text-stroke:1.5px rgba(255,255,255,.9)}
.ca-mask{-webkit-mask-image:linear-gradient(to right,transparent 0%,#000 55%);mask-image:linear-gradient(to right,transparent 0%,#000 38%)}
@media (max-width:1023px){.ca-mask{-webkit-mask-image:linear-gradient(to bottom,#000 0%,transparent 70%);mask-image:linear-gradient(to bottom,#000 0%,transparent 70%)}}
`;

/* ---------- NeuroNoise en WebGL (reimplementación del shader de paper-design) ---------- */
const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision mediump float;
uniform vec2 u_res;uniform float u_time;
uniform vec4 u_back;uniform vec4 u_mid;uniform vec4 u_front;
vec2 rot(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
float neuro(vec2 uv,float t){
  vec2 acc=vec2(0.);vec2 res=vec2(0.);float s=8.;
  for(int j=0;j<15;j++){
    uv=rot(uv,1.);acc=rot(acc,1.);
    vec2 layer=uv*s+float(j)+acc-t;
    acc+=sin(layer);
    res+=(.5+.5*cos(layer))/s;
    s*=1.2;
  }
  return res.x+res.y;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;
  uv*=.85;
  float n=neuro(uv,.5*u_time);
  n=pow(n,2.);
  n=pow(n,.7+6.*.55);
  n=min(1.4,n);
  float b=smoothstep(.7,1.4,n);
  vec4 c=mix(u_back,u_mid,min(n,1.));
  c=mix(c,u_front,b);
  gl_FragColor=vec4(c.rgb*c.a,c.a);
}`;

function useNeuroNoise(canvas: RefObject<HTMLCanvasElement>, run: boolean, paused: boolean) {
  const [ok, setOk] = useState(true);
  const pausedRef = useRef(paused);
  const kick = useRef<() => void>(() => {});
  useEffect(() => { pausedRef.current = paused; if (!paused) kick.current(); }, [paused]);
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !run) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) { setOk(false); return; }
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setOk(false); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res"), uTime = gl.getUniformLocation(prog, "u_time");
    // back = transparente, mid = azul de marca, front = blanco (como colorMid/colorFront del original en oscuro)
    gl.uniform4f(gl.getUniformLocation(prog, "u_back"), 0, 0, 0, 0);
    gl.uniform4f(gl.getUniformLocation(prog, "u_mid"), 0.6, 0.77, 0.894, 0.85);
    gl.uniform4f(gl.getUniformLocation(prog, "u_front"), 1, 1, 1, 0.95);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const k = 0.5; // media resolución: el ruido es suave y ahorra GPU
      cv.width = Math.max(1, Math.round(r.width * k));
      cv.height = Math.max(1, Math.round(r.height * k));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let raf = 0, visible = false, t0 = performance.now(), acc = 0;
    const frame = (now: number) => {
      acc += Math.min(50, now - t0); t0 = now;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, acc / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = pausedRef.current ? 0 : requestAnimationFrame(frame);
    };
    const start = () => { cancelAnimationFrame(raf); raf = 0; if (visible && !pausedRef.current) { t0 = performance.now(); raf = requestAnimationFrame(frame); } };
    kick.current = start;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); });
    io.observe(cv);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); kick.current = () => {}; };
  }, [canvas, run]);
  return ok;
}

const rise = (d: number) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-10% 0px" }, transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] as const } });

export default function ContactA() {
  const full = useFull();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const ok = useNeuroNoise(canvas, full, paused);
  const M = full ? motion.div : "div";
  const wa = CHANNELS.find((c) => c.k === "wa")!;

  return (
    <div className="relative bg-night py-[clamp(3.5rem,8vw,7rem)] text-white sm:px-[var(--u-gutter)]">
      <style>{CSS}</style>
      <div className="relative mx-auto max-w-[1240px] overflow-hidden border-y border-white/10 bg-[#0d0d1a] shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)] sm:rounded-2xl sm:border-x">
        {/* Fondo: showreel real + shader */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <SmartVideo video={videos.showreel} className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale-[.3]" ariaLabel="" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d1a] via-[#0d0d1a]/85 to-[#0d0d1a]/40" />
          {full && ok && <canvas ref={canvas} className="ca-mask absolute inset-0 h-full w-full mix-blend-screen" />}
          {(!full || !ok) && <div className="ca-mask absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(153,196,228,.35),transparent_70%)]" />}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0d0d1a]/80 to-transparent" />
        </div>

        <div className="relative isolate grid gap-12 px-[var(--u-gutter)] py-[clamp(2.75rem,6vw,5.5rem)] lg:grid-cols-12 lg:gap-10 lg:px-14">
          <div className="flex flex-col lg:col-span-6">
            <M {...(full ? rise(0) : {})}><Eyebrow className="text-brand" /></M>
            <M {...(full ? rise(0.08) : {})}>
              <CtaTitle className="ca-title mt-6 font-head text-[clamp(2.9rem,6vw,5.6rem)] font-extrabold leading-[.9] tracking-[-0.05em] text-white" />
            </M>
            <M {...(full ? rise(0.16) : {})}>
              <p className="mt-7 max-w-[34ch] text-balance text-[clamp(1.08rem,1.5vw,1.32rem)] leading-normal text-white/75">{TEXT}</p>
            </M>
            <M {...(full ? rise(0.24) : {})} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#ca-form" className="u-btn u-btn--light min-h-[48px]"><span className="u-btn__in">Pedir presupuesto <ArrowUpRight className="h-4 w-4" aria-hidden /></span></a>
              <span className="text-white">
                <a href={wa.href} target="_blank" rel="noopener noreferrer" className="u-btn u-btn--ghost min-h-[48px] w-full sm:w-auto">
                  <span className="u-btn__in"><wa.Icon className="h-4 w-4" aria-hidden /> Escribir por WhatsApp</span>
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </span>
            </M>
            <div className="mt-auto pt-12 text-white/90">
              <Channels itemClass="hover:bg-white/[.06]" className="-ml-2" />
            </div>
          </div>

          <M {...(full ? rise(0.2) : {})} className="lg:col-span-6 lg:pl-6">
            <div id="ca-form" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#11111f]/55 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)] backdrop-blur-xl sm:p-7">
              <ContactForm className="ca-form">
                <p className="mb-5 flex items-center justify-between gap-4 font-head text-lg font-semibold tracking-[-0.02em] text-white">
                  Solicitud de presupuesto
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Sin compromiso</span>
                </p>
              </ContactForm>
            </div>
          </M>
        </div>

        {full && ok && (
          <div className="absolute right-3 top-3 z-10 text-white/80 sm:right-4 sm:top-4">
            <PauseToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="el fondo animado" className="bg-black/20" />
          </div>
        )}
      </div>
    </div>
  );
}
