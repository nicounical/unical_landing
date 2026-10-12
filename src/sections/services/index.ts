import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const servicesVariants: VariantMap = {
  A: { name: "Pila cinematográfica", direction: D.A, idea: "Seis tarjetas se apilan con el scroll sobre un fondo fotográfico que se funde por servicio, mientras el alcance de cada uno se ilumina en bucle.", source: { id: 33309, name: "Services Stack" }, Component: lazy(() => import("./ServicesA")) },
  B: { name: "Carrusel en profundidad", direction: D.B, idea: "Carrusel infinito en 3D: las tarjetas giran y se alejan según su distancia al centro; arrastre, flechas, teclado y autoplay con pausa.", source: { id: 20150, name: "Linear Carousel" }, Component: lazy(() => import("./ServicesB")) },
  C: { name: "Índice con previsualización", direction: D.C, idea: "Un índice tipográfico enorme: al pasar por cada fila aparece la foto del servicio pegada al cursor, inclinada según la velocidad.", source: { id: 28258, name: "Hover Image List" }, Component: lazy(() => import("./ServicesC")) },
  D: { name: "Revelado sereno", direction: D.D, idea: "Panel fotográfico fijo que cambia con un barrido suave mientras los textos se revelan uno a uno al hacer scroll.", source: { id: 952, name: "Sticky Scroll Reveal", author: "Aceternity" }, Component: lazy(() => import("./ServicesD")) },
  E: { name: "Pista horizontal", direction: D.E, idea: "El scroll vertical empuja una pista editorial en horizontal; número, título y texto suben por máscaras y cada foto hace parallax.", source: { id: 26062, name: "Horizontal Feature Reveal" }, Component: lazy(() => import("./ServicesE")) },
  F: { name: "Bandas editoriales", direction: D.F, idea: "Seis bandas fotográficas: la activa se despliega con su texto y el gran numeral editorial cambia con un barrido cinético.", source: { id: 28111, name: "Hover Expand" }, Component: lazy(() => import("./ServicesF")) },
  G: { name: "Acordeón elástico", direction: D.G, idea: "Galería en acordeón: la pieza activa se estira con un rebote elástico y las demás se oscurecen con su título en vertical.", source: { id: 9859, name: "Elastic Gallery" }, Component: lazy(() => import("./ServicesG")) },
};
