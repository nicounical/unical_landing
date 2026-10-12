import { lazy } from "react";
import type { VariantMap } from "@/config/sections";
import { DIRECTIONS as D } from "@/config/directions";

export const numbersVariants: VariantMap = {
  A: { name: "Contadores sobre el showreel", direction: D.A, idea: "Cuatro cifras enormes cuyos dígitos ruedan hasta su valor sobre el showreel real en bucle, bajo un velo nocturno.", source: { id: 21515, name: "Number Ticker Real-Time Metrics Counter" }, Component: lazy(() => import("./NumbersA")) },
  B: { name: "Tarjetas neomórficas", direction: D.B, idea: "Tarjetas en relieve suave que se inclinan en 3D siguiendo el cursor y se hunden al pulsarlas, con las cifras contando al entrar.", source: { id: 24338, name: "Neomorphism Metric Card" }, Component: lazy(() => import("./NumbersB")) },
  C: { name: "Cuadro de instrumentos LCD", direction: D.C, idea: "Pantallas de siete segmentos con brillo de marca que cuentan hasta cada cifra y pueden volver a contar con un botón.", source: { id: 29887, name: "Segmented LCD Number Ticker" }, Component: lazy(() => import("./NumbersC")) },
  D: { name: "Cifras serenas", direction: D.D, idea: "Titular centrado y cuatro tarjetas sobrias en papel con icono, cifra y etiqueta, con un conteo tranquilo.", source: { id: 29870, name: "Stats Section" }, Component: lazy(() => import("./NumbersD")) },
  E: { name: "Banda en azul de marca", direction: D.E, idea: "Banda de cifras en rejilla fina que cuentan en cascada; al pasar el cursor cambia la línea de contexto y se revela una franja de foto real.", source: { id: 35089, name: "Stats Band" }, Component: lazy(() => import("./NumbersE")) },
  F: { name: "Dígitos cinéticos", direction: D.F, idea: "Filas editoriales con cifras a cuerpo enorme cuyos dígitos entran con desenfoque y muelle, y se repiten al pasar el cursor.", source: { id: 20071, name: "Animate Digits", author: "unlumen" }, Component: lazy(() => import("./NumbersF")) },
  G: { name: "Galería con logros", direction: D.G, idea: "Galería de trabajos reales con miniaturas, tarjeta de producción propia, clientes reales y un panel de logros que cuenta al entrar.", source: { id: 2202, name: "About 3", author: "shadcnblocks" }, Component: lazy(() => import("./NumbersG")) },
};
