import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const heroVariants: VariantMap = {
  A: { name: "Capítulos de vídeo", direction: D.A, idea: "Vídeos reales a pantalla completa que se funden por capítulos con el scroll; píldora con el capítulo y su progreso.", source: { id: 9701, name: "Scroll-Triggered Video Hero" }, Component: lazy(() => import("./HeroA")) },
  B: { name: "Profundidad espacial", direction: D.B, idea: "Una pila de trabajos estalla en el espacio 3D al hacer scroll; la cámara se inclina con el cursor y cada pieza se enfoca al pasar.", source: { id: 30683, name: "Spatial Depth Hero" }, Component: lazy(() => import("./HeroB")) },
  C: { name: "Morph de proyectos", direction: D.C, idea: "20 trabajos se dispersan, forman línea y círculo; el scroll abre el círculo en un arco que recorre proyectos. Las tarjetas giran al pasar.", source: { id: 9583, name: "Scroll Morph Hero" }, Component: lazy(() => import("./HeroC")) },
  D: { name: "Editorial panorámico", direction: D.D, idea: "Composición editorial en 12 columnas con titular elegante y una banda panorámica de vídeo con máscara degradada.", source: { id: 19075, name: "Editorial Hero (Hero05)" }, Component: lazy(() => import("./HeroD")) },
  E: { name: "Parallax de trabajos", direction: D.E, idea: "Tres filas de proyectos caen inclinadas, se enderezan y se cruzan en sentidos opuestos con el scroll.", source: { id: 1503, name: "Hero Parallax", author: "Aceternity" }, Component: lazy(() => import("./HeroE")) },
  F: { name: "Titular obturador", direction: D.F, idea: "Cada letra entra cortada en tres franjas que barren en sentidos opuestos; rejilla técnica y showreel de fondo.", source: { id: 9989, name: "Hero Shutter Text" }, Component: lazy(() => import("./HeroF")) },
  G: { name: "Tira de fotogramas", direction: D.G, idea: "Filmstrip interactivo: la pieza activa se despliega y todo el fondo se re-tiñe con su color. Arrastre, teclado y autoplay.", source: { id: 24752, name: "Hero Carousel" }, Component: lazy(() => import("./HeroG")) },
};
