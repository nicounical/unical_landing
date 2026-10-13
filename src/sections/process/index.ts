import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const processVariants: VariantMap = {
  A: { name: "Tablero de chinchetas", direction: D.A, idea: "Cuatro tarjetas fotográficas clavadas en zigzag sobre una pizarra nocturna, unidas por un trazo que se dibuja con el scroll.", source: { id: 19861, name: "How It Works", author: "chamaac" }, Component: lazy(() => import("./ProcessA")) },
  B: { name: "Hoja de ruta 3D", direction: D.B, idea: "Un suelo en perspectiva donde el camino se traza con el scroll y cada fase se alza como una valla con su foto al alcanzarla.", source: { id: 8113, name: "Hero Section (Animated Roadmap)", author: "ravikatiyar162" }, Component: lazy(() => import("./ProcessB")) },
  C: { name: "Stepper elástico", direction: D.C, idea: "Un stepper con línea de muelle y un punto viajero que se estira al moverse; la foto se revela en círculo desde ese punto.", source: { id: 28558, name: "Animated Progress Stepper" }, Component: lazy(() => import("./ProcessC")) },
  D: { name: "Línea de tinta", direction: D.D, idea: "Línea de tiempo serena que se rellena de tinta con el scroll y marca cada fase con un check al alcanzarla.", source: { id: 28381, name: "Process Timeline" }, Component: lazy(() => import("./ProcessD")) },
  E: { name: "Asistente en marcha", direction: D.E, idea: "Un asistente que recorre las fases solo, con transiciones según la dirección, raíl clicable y pausa.", source: { id: 23576, name: "Wizard Steps" }, Component: lazy(() => import("./ProcessE")) },
  F: { name: "Pliegos con barrido", direction: D.F, idea: "Cada fase es un pliego editorial cuyas líneas aparecen bajo un bloque de color que barre el texto y la foto.", source: { id: 19260, name: "Text Reveal Block" }, Component: lazy(() => import("./ProcessF")) },
  G: { name: "Visor por pasos", direction: D.G, idea: "Lista de fases que avanza sola con barra de progreso y un visor fotográfico que gira en 3D, con miniaturas clicables.", source: { id: 1368, name: "Feature Section" }, Component: lazy(() => import("./ProcessG")) },
};
