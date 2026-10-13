import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const projectsVariants: VariantMap = {
  A: { name: "Proyecto destacado", direction: D.A, idea: "Pestañas accesibles con los ocho proyectos: cada una revela su foto con una máscara y un zoom lento sobre un fondo nocturno teñido por la imagen activa.", source: { id: 37282, name: "Featured Project Hero", author: "ibrandify" }, Component: lazy(() => import("./ProjectsA")) },
  B: { name: "Arco panorámico", direction: D.B, idea: "Las fotos de proyecto parten apiladas como polaroids y, con el scroll, se despliegan en un arco panorámico en 3D que se inclina con el cursor.", source: { id: 30669, name: "Panoramic Spread Hero" }, Component: lazy(() => import("./ProjectsB")) },
  C: { name: "Campo infinito", direction: D.C, idea: "Un lienzo sin bordes de trabajos reales que se recorre con el cursor o arrastrando; el índice de proyectos lleva la cámara hasta cada uno.", source: { id: 18268, name: "Infinite Image Field" }, Component: lazy(() => import("./ProjectsC")) },
  D: { name: "Índice con portada", direction: D.D, idea: "Un índice tipográfico sereno sobre papel en el que la portada de cada proyecto flota junto al cursor solo mientras se recorre su fila.", source: { id: 30554, name: "Project Index", author: "ssych ui" }, Component: lazy(() => import("./ProjectsD")) },
  E: { name: "Tira en perspectiva", direction: D.E, idea: "Tira infinita de proyectos que se inclina en 3D según la velocidad, impulsada por el scroll de la página, el arrastre o los botones.", source: { id: 26063, name: "Infinite Perspective Slider", author: "hyperiux" }, Component: lazy(() => import("./ProjectsE")) },
  F: { name: "Zoom editorial", direction: D.F, idea: "Carrusel en el que cada proyecto llega con un tirón de zoom desenfocado y estelas fantasma, junto a un índice editorial numerado.", source: { id: 36186, name: "Zoom Blur Image Carousel" }, Component: lazy(() => import("./ProjectsF")) },
  G: { name: "Masonry con visor", direction: D.G, idea: "Rejilla masonry de proyectos y trabajos reales que crece hasta un visor a pantalla completa con navegación y enlace a cada proyecto.", source: { id: 26223, name: "Masonry Lightbox" }, Component: lazy(() => import("./ProjectsG")) },
};
