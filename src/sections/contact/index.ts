import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const contactVariants: VariantMap = {
  A: { name: "Panel con shader", direction: D.A, idea: "Un panel oscuro con un shader de ruido neuronal en tonos de marca sobre el showreel, el titular a la izquierda y el formulario en una tarjeta de cristal.", source: { id: 27553, name: "CTA Section with Noise Shader", author: "shadcnui-blocks" }, Component: lazy(() => import("./ContactA")) },
  B: { name: "Galería flotante", direction: D.B, idea: "Fotos reales flotando en un plano inclinado que se desplaza en parallax y sigue al puntero, junto a un botón orbital que despliega el formulario.", source: { id: 29769, name: "CTA Section With Floating Gallery", author: "scrollxui" }, Component: lazy(() => import("./ContactB")) },
  C: { name: "Marquesina gigante", direction: D.C, idea: "«Trabajemos juntos» cruza la pantalla a tamaño gigante detrás de una declaración centrada con un sello giratorio que baja al formulario.", source: { id: 26705, name: "Worth Keeping CTA", author: "ziegfiroyt" }, Component: lazy(() => import("./ContactC")) },
  D: { name: "Dos columnas serenas", direction: D.D, idea: "Cabecera y canales con líneas finas a la izquierda y el formulario en una tarjeta limpia a la derecha.", source: { id: 35258, name: "Contact Form" }, Component: lazy(() => import("./ContactD")) },
  E: { name: "Titular en ráfaga", direction: D.E, idea: "Un titular que entra palabra a palabra con foto inclinable y servicios que se suceden, y un campo de email que despliega el formulario completo.", source: { id: 31727, name: "CTA Email Subscribe Section" }, Component: lazy(() => import("./ContactE")) },
  F: { name: "Marquesina de trabajos", direction: D.F, idea: "Dos cintas de vídeos y fotos reales corren en sentidos opuestos junto a un botón que se descifra letra a letra y lleva al formulario.", source: { id: 8382, name: "CTA with Marquee", author: "Dali Agents UI" }, Component: lazy(() => import("./ContactF")) },
  G: { name: "Consulta con chips", direction: D.G, idea: "Eliges el tipo de proyecto con chips y una galería muestra un trabajo real de ese tipo mientras rellenas la consulta.", source: { id: 25224, name: "Contact 01 - Project Inquiry Form", author: "shadcnspace" }, Component: lazy(() => import("./ContactG")) },
};
