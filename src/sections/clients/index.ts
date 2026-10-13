import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const clientsVariants: VariantMap = {
  A: { name: "Tira que se ilumina", direction: D.A, idea: "Una tira serena de los 25 clientes sobre fondo noche que entra desenfocada; la marca señalada se ilumina mientras el resto se apaga, y cierra con la cifra real de proyectos.", source: { id: 28279, name: "Logo Cloud 3", author: "Hirael" }, Component: lazy(() => import("./ClientsA")) },
  B: { name: "Panel en profundidad", direction: D.B, idea: "Un panel con trama de circuito que se endereza en perspectiva con el scroll; cada celda se inclina en 3D, se ilumina bajo el cursor y la cruza un barrido de luz.", source: { id: 24570, name: "Logo Cloud" }, Component: lazy(() => import("./ClientsB")) },
  C: { name: "Ranuras tipográficas", direction: D.C, idea: "Tres ranuras de tipografía enorme sobre azul de marca rotan los clientes con desenfoque escalonado, mientras un índice completo resalta los que están en pantalla.", source: { id: 18220, name: "Logo Carousel", author: "witharc" }, Component: lazy(() => import("./ClientsC")) },
  D: { name: "Rejilla serena", direction: D.D, idea: "Rejilla de 25 celdas con bordes finos y esquinas discontinuas que se desvanecen; los favicons recuperan su color al señalar cada celda.", source: { id: 21468, name: "Logo Cloud 10" }, Component: lazy(() => import("./ClientsD")) },
  E: { name: "Marquesina desenfocada", direction: D.E, idea: "Dos pistas de marcas enormes en sentidos opuestos con bordes de desenfoque progresivo, que aceleran con el scroll y frenan al señalarlas o con el botón de pausa.", source: { id: 20147, name: "Blurred Marquee" }, Component: lazy(() => import("./ClientsE")) },
  F: { name: "Índice cinético", direction: D.F, idea: "Maquetación editorial con dos pistas tipográficas (maciza y en contorno) movidas por física, que frenan al señalarlas o enfocarlas y se recorren con las flechas.", source: { id: 23537, name: "Logo Marquee" }, Component: lazy(() => import("./ClientsF")) },
  G: { name: "Galería con ola", direction: D.G, idea: "Galería de 25 piezas que una ola de barrido y desenfoque recorre periódicamente; al elegir una, su nombre ocupa el panel destacado.", source: { id: 18216, name: "Logo Clouds" }, Component: lazy(() => import("./ClientsG")) },
};
