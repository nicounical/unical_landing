import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const sectorsVariants: VariantMap = {
  A: { name: "Visor cinematográfico", direction: D.A, idea: "Un visor a sangre en el que la foto del sector cambia al deslizar el cursor (o el dedo) en horizontal, con el nombre a gran escala y una barra de ocho segmentos.", source: { id: 2492, name: "Hover Image Gallery", author: "isaiahbjork" }, Component: lazy(() => import("./SectorsA")) },
  B: { name: "Nube en 3D", direction: D.B, idea: "Esfera 3D de etiquetas y fotos de los sectores que gira con el puntero, se arrastra y trae al frente el sector pulsado mostrando su ficha.", source: { id: 942, name: "Interactive Icon Cloud", author: "dillionverma" }, Component: lazy(() => import("./SectorsB")) },
  C: { name: "Órbitas", direction: D.C, idea: "Los sectores orbitan en tres anillos alrededor de un globo de partículas; al señalar uno, las órbitas se detienen y su foto aparece dentro del globo.", source: { id: 18043, name: "Orbiting Circles with Globe", author: "shadcnspace" }, Component: lazy(() => import("./SectorsC")) },
  D: { name: "Rejilla filtrable", direction: D.D, idea: "Fichas fotográficas serenas sobre papel que se reordenan con suavidad al filtrar por tipo de espacio, con recuento en cada filtro.", source: { id: 23525, name: "Filter Grid", author: "ddoemonn" }, Component: lazy(() => import("./SectorsD")) },
  E: { name: "Marquesina", direction: D.E, idea: "Dos pistas gigantes de sectores en sentidos opuestos; al señalar un nombre aparece una tarjeta con su foto que sigue al cursor inclinándose.", source: { id: 1944, name: "Infinite Text Marquee", author: "HextaUI" }, Component: lazy(() => import("./SectorsE")) },
  F: { name: "Lectura progresiva", direction: D.F, idea: "Un párrafo editorial que se ilumina palabra a palabra con el scroll y termina nombrando los ocho sectores, que abren su miniatura al revelarse.", source: { id: 9386, name: "Reading Text Reveal", author: "waleedkibhen" }, Component: lazy(() => import("./SectorsF")) },
  G: { name: "Mosaico en grises", direction: D.G, idea: "Mosaico de fotos en escala de grises que recuperan el color al pasar y se abren en un visor con anterior y siguiente.", source: { id: 26806, name: "Grayscale Mosaic Gallery", author: "7ovr" }, Component: lazy(() => import("./SectorsG")) },
};
