import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const reelVariants: VariantMap = {
  A: { name: "Expansión cinematográfica", direction: D.A, idea: "El showreel nace como una ventana vertical en el centro y, con el scroll normal de la página, crece hasta ocupar toda la pantalla mientras el titular se abre en dos.", source: { id: 1932, name: "Scroll media expansion hero" }, Component: lazy(() => import("./ReelA")) },
  B: { name: "Escenario en profundidad", direction: D.B, idea: "Un marco en perspectiva que se endereza al hacer scroll mientras el scroll recorre el montaje fotograma a fotograma, con un botón para verlo completo con controles.", source: { id: 19344, name: "Scroll-Linked Video Scrubber" }, Component: lazy(() => import("./ReelB")) },
  C: { name: "Mosaico con previsualización", direction: D.C, idea: "Mosaico asimétrico de piezas que se previsualizan al pasar el cursor y se abren en un reproductor que se despliega con un recorte desde el centro.", source: { id: 28516, name: "Interactive Video Player" }, Component: lazy(() => import("./ReelC")) },
  D: { name: "Marco editorial", direction: D.D, idea: "Un único marco sereno sobre papel con controles propios, atajos de teclado y un índice de escenas que cambia el vídeo.", source: { id: 4057, name: "Video Player" }, Component: lazy(() => import("./ReelD")) },
  E: { name: "Cortinilla en franjas", direction: D.E, idea: "Pantalla fija en la que cada vídeo entra con una cortinilla de veinte franjas y un zoom, mientras el título cambia por una máscara.", source: { id: 30118, name: "Scroll Gallery" }, Component: lazy(() => import("./ReelE")) },
  F: { name: "Índice sincronizado", direction: D.F, idea: "Panel editorial en el que la lista de piezas y la pista de vídeos se desplazan sincronizadas con el scroll; solo suena y se mueve la pieza activa.", source: { id: 24368, name: "Interactive Video Portfolio Scroller" }, Component: lazy(() => import("./ReelF")) },
  G: { name: "Acordeón con modal", direction: D.G, idea: "Lamas en acordeón que se abren al pasar el cursor y crecen hasta un reproductor modal al pulsarlas.", source: { id: 24830, name: "Gallery Modal Accordion" }, Component: lazy(() => import("./ReelG")) },
};
