import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const whyVariants: VariantMap = {
  A: { name: "Manifiesto sobre el reel", direction: D.A, idea: "Sobre el showreel real, el manifiesto de Unical se ilumina palabra a palabra con el scroll y da paso a los cuatro pilares como créditos.", source: { id: 24525, name: "Scroll word reveal", author: "Motion" }, Component: lazy(() => import("./WhyA")) },
  B: { name: "Tarjetas en paralaje 3D", direction: D.B, idea: "Cada pilar es una foto real en perspectiva que gira sobre sí misma al pasar el cursor, con una capa frontal flotando en profundidad.", source: { id: 2195, name: "3D parallax effect on hover", author: "minhxthanh" }, Component: lazy(() => import("./WhyB")) },
  C: { name: "Cortinas de color", direction: D.C, idea: "Dos cortinas de color barren y descubren el titular, cada pilar en tipografía gigante y sus fotos, alternando la dirección fila a fila.", source: { id: 28388, name: "Dual Wipe Reveal", author: "soralabs" }, Component: lazy(() => import("./WhyC")) },
  D: { name: "Rejilla de raíles finos", direction: D.D, idea: "Cuatro tarjetas serenas sobre raíles de un píxel con cruces de replanteo y un foco de luz que sigue al cursor.", source: { id: 26797, name: "Feature Grid Spotlight Cards", author: "Hirael" }, Component: lazy(() => import("./WhyD")) },
  E: { name: "Bordes que brillan", direction: D.E, idea: "El titular entra con muelle y los bordes de las tarjetas se encienden con el color de cada foto siguiendo al puntero por toda la rejilla.", source: { id: 25283, name: "Glow Card Grid" }, Component: lazy(() => import("./WhyE")) },
  F: { name: "Manifiesto editorial", direction: D.F, idea: "Titular, manifiesto y pilares suben por máscaras línea a línea, palabra a palabra y letra a letra en una maqueta de revista.", source: { id: 19257, name: "Text Reveal (Mask)", author: "soralabs" }, Component: lazy(() => import("./WhyF")) },
  G: { name: "Galería central", direction: D.G, idea: "Los pilares flanquean una imagen central que cambia con un barrido al pasar, enfocar o tocar cada uno.", source: { id: 2749, name: "About Us section", author: "uniquesonu" }, Component: lazy(() => import("./WhyG")) },
};
