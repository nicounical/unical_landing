import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type Letter = "A" | "B" | "C" | "D" | "E";
export const LETTERS: Letter[] = ["A", "B", "C", "D", "E"];

export type VariantDef = {
  name: string;
  /** Dirección creativa (A Cinematic · B Immersive 3D · C Experimental · D Minimal luxury · E High-energy). */
  direction: string;
  idea: string;
  Component: LazyExoticComponent<ComponentType>;
};

export type SectionDef = { key: SectionKey; id: string; label: string; variants: Record<Letter, VariantDef> };

export type SectionKey =
  | "hero" | "services" | "reel" | "projects" | "process" | "numbers" | "sectors" | "why" | "clients" | "contact";

const D = {
  A: "Cinematic Premium",
  B: "Immersive 3D",
  C: "Experimental Creative",
  D: "Minimal Luxury",
  E: "High-Energy Motion",
} as const;

/* Cada variante se carga en su propio chunk: solo se descarga la que se está viendo. */
export const SECTIONS: SectionDef[] = [
  {
    key: "hero", id: "inicio", label: "Portada",
    variants: {
      A: { name: "Cinematic Showreel", direction: D.A, idea: "Vídeo a pantalla completa con cortes entre proyectos reales, bandas de cine y dolly-in al hacer scroll.", Component: lazy(() => import("@/sections/hero/HeroA")) },
      B: { name: "Espacio 3D", direction: D.B, idea: "Los proyectos flotan en un espacio con profundidad; el cursor orienta la cámara y el scroll avanza a través de ellos.", Component: lazy(() => import("@/sections/hero/HeroB")) },
      C: { name: "Del vacío al stand", direction: D.C, idea: "Escena fijada: un plano vacío se convierte en plano técnico, se construye, se ilumina y aparece el stand real.", Component: lazy(() => import("@/sections/hero/HeroC")) },
      D: { name: "Editorial Motion", direction: D.D, idea: "Tipografía gigante con el vídeo dentro de las letras; al hacer scroll la máscara se abre a pantalla completa.", Component: lazy(() => import("@/sections/hero/HeroD")) },
      E: { name: "Mosaico dinámico", direction: D.E, idea: "Columnas de proyectos a distintas velocidades; una pieza central crece hasta llenar la pantalla.", Component: lazy(() => import("@/sections/hero/HeroE")) },
    },
  },
  {
    key: "services", id: "servicios", label: "Servicios",
    variants: {
      A: { name: "Capítulos de cine", direction: D.A, idea: "Cada servicio es un plano a pantalla completa; el scroll funde planos con zoom lento y títulos que entran por máscara.", Component: lazy(() => import("@/sections/services/ServicesA")) },
      B: { name: "Carrusel cilíndrico", direction: D.B, idea: "Los seis servicios giran en un cilindro 3D que se mueve con scroll, arrastre y cursor.", Component: lazy(() => import("@/sections/services/ServicesB")) },
      C: { name: "Índice tipográfico", direction: D.C, idea: "Nombres gigantes que se deforman con la velocidad del scroll; la foto sigue al cursor al pasar por encima.", Component: lazy(() => import("@/sections/services/ServicesC")) },
      D: { name: "Lista y cortina", direction: D.D, idea: "Imagen fija a la izquierda que cambia con una cortina; lista de servicios con filetes finos a la derecha.", Component: lazy(() => import("@/sections/services/ServicesD")) },
      E: { name: "Recorrido horizontal", direction: D.E, idea: "Pista horizontal fijada con paneles que escalan, contador y barra de progreso.", Component: lazy(() => import("@/sections/services/ServicesE")) },
    },
  },
  {
    key: "reel", id: "reel", label: "Unical in Motion",
    variants: {
      A: { name: "Fullscreen Film", direction: D.A, idea: "La tarjeta del showreel se expande a pantalla completa con el scroll; controles discretos y sonido opcional.", Component: lazy(() => import("@/sections/reel/ReelA")) },
      B: { name: "Reel por scroll", direction: D.B, idea: "La sección se fija y el scroll controla el avance del vídeo fotograma a fotograma, con capítulos.", Component: lazy(() => import("@/sections/reel/ReelB")) },
      C: { name: "Galería interactiva", direction: D.C, idea: "Mosaico de piezas que se reproducen al pasar el ratón; al elegir una se abre en un reproductor con transición.", Component: lazy(() => import("@/sections/reel/ReelC")) },
      D: { name: "Viaje horizontal", direction: D.D, idea: "Travelling horizontal por proyectos y clips de distintos tamaños con parallax interno.", Component: lazy(() => import("@/sections/reel/ReelD")) },
      E: { name: "Portal inmersivo", direction: D.E, idea: "Cada proyecto se abre con un portal circular que nace del punto donde haces clic.", Component: lazy(() => import("@/sections/reel/ReelE")) },
    },
  },
  {
    key: "projects", id: "proyectos", label: "Proyectos",
    variants: {
      A: { name: "Pila cinematográfica", direction: D.A, idea: "Proyectos a pantalla completa que se apilan: el anterior retrocede y se oscurece mientras entra el siguiente.", Component: lazy(() => import("@/sections/projects/ProjectsA")) },
      B: { name: "Muro inclinado", direction: D.B, idea: "Un muro de proyectos en perspectiva que se endereza al hacer scroll; cada pieza se inclina con el cursor.", Component: lazy(() => import("@/sections/projects/ProjectsB")) },
      C: { name: "Lienzo arrastrable", direction: D.C, idea: "Lienzo libre que se arrastra con inercia en todas direcciones para explorar los trabajos.", Component: lazy(() => import("@/sections/projects/ProjectsC")) },
      D: { name: "Índice con vista previa", direction: D.D, idea: "Lista numerada sobria; la imagen aparece y sigue al cursor, con un proyecto destacado.", Component: lazy(() => import("@/sections/projects/ProjectsD")) },
      E: { name: "Bandas en movimiento", direction: D.E, idea: "Filas de proyectos en direcciones opuestas que aceleran y se inclinan con la velocidad del scroll.", Component: lazy(() => import("@/sections/projects/ProjectsE")) },
    },
  },
  {
    key: "process", id: "proceso", label: "Proceso",
    variants: {
      A: { name: "Fases a pantalla", direction: D.A, idea: "Sección fijada: fondo fotográfico por fase con fundidos, número gigante y línea de progreso.", Component: lazy(() => import("@/sections/process/ProcessA")) },
      B: { name: "Baraja 3D", direction: D.B, idea: "Cuatro tarjetas apiladas en profundidad que se voltean hacia el espectador al avanzar.", Component: lazy(() => import("@/sections/process/ProcessB")) },
      C: { name: "Trazo continuo", direction: D.C, idea: "Una línea se dibuja serpenteando por la sección y va encendiendo cada fase al pasar.", Component: lazy(() => import("@/sections/process/ProcessC")) },
      D: { name: "Anillo", direction: D.D, idea: "El anillo de la landing original, refinado: el arco avanza con el scroll y el centro cambia de fase.", Component: lazy(() => import("@/sections/process/ProcessD")) },
      E: { name: "Palabras en carrera", direction: D.E, idea: "Las cuatro fases cruzan la pantalla a gran escala, sincronizadas con el scroll.", Component: lazy(() => import("@/sections/process/ProcessE")) },
    },
  },
  {
    key: "numbers", id: "cifras", label: "Cifras",
    variants: {
      A: { name: "Cifras sobre vídeo", direction: D.A, idea: "Las cifras cuentan sobre un vídeo real oscurecido, con entrada por máscara.", Component: lazy(() => import("@/sections/numbers/NumbersA")) },
      B: { name: "Volumen 3D", direction: D.B, idea: "Números con volumen (capas extruidas) que giran siguiendo el cursor.", Component: lazy(() => import("@/sections/numbers/NumbersB")) },
      C: { name: "Cifra gigante", direction: D.C, idea: "Una cifra ocupa toda la pantalla y el scroll la hace contar y cambiar a la siguiente.", Component: lazy(() => import("@/sections/numbers/NumbersC")) },
      D: { name: "Rejilla fina", direction: D.D, idea: "Rejilla con filetes, mucho aire y contadores sobrios.", Component: lazy(() => import("@/sections/numbers/NumbersD")) },
      E: { name: "Odómetro", direction: D.E, idea: "Dígitos que ruedan como un cuentakilómetros y una banda en movimiento.", Component: lazy(() => import("@/sections/numbers/NumbersE")) },
    },
  },
  {
    key: "sectors", id: "sectores", label: "Sectores",
    variants: {
      A: { name: "Fondo por sector", direction: D.A, idea: "Al pasar por cada sector, la imagen de fondo cambia con un fundido cinematográfico.", Component: lazy(() => import("@/sections/sectors/SectorsA")) },
      B: { name: "Esfera orbital", direction: D.B, idea: "Los sectores orbitan en una esfera 3D que se orienta con el cursor.", Component: lazy(() => import("@/sections/sectors/SectorsB")) },
      C: { name: "Bolas con gravedad", direction: D.C, idea: "La idea original de la landing: bolas con física que caen, rebotan y se arrastran.", Component: lazy(() => import("@/sections/sectors/SectorsC")) },
      D: { name: "Lista editorial", direction: D.D, idea: "Dos columnas con filetes, numeración y una miniatura que aparece al pasar.", Component: lazy(() => import("@/sections/sectors/SectorsD")) },
      E: { name: "Bandas cruzadas", direction: D.E, idea: "Dos bandas diagonales que se cruzan y aceleran con el scroll.", Component: lazy(() => import("@/sections/sectors/SectorsE")) },
    },
  },
  {
    key: "why", id: "por-que", label: "Por qué Unical",
    variants: {
      A: { name: "Manifiesto en vídeo", direction: D.A, idea: "Vídeo de fondo y pilares que aparecen como subtítulos de película.", Component: lazy(() => import("@/sections/why/WhyA")) },
      B: { name: "Pila con profundidad", direction: D.B, idea: "Tarjetas fijas que se apilan con profundidad 3D (evolución del stack de la landing).", Component: lazy(() => import("@/sections/why/WhyB")) },
      C: { name: "Composición asimétrica", direction: D.C, idea: "«UNICAL» gigante de fondo y pilares desordenados que entran recortados.", Component: lazy(() => import("@/sections/why/WhyC")) },
      D: { name: "Acordeón sobrio", direction: D.D, idea: "Lista con iconos lineales que se despliega con calma; imagen que acompaña.", Component: lazy(() => import("@/sections/why/WhyD")) },
      E: { name: "Escala en cadena", direction: D.E, idea: "Cada pilar entra enorme y se reduce hasta su sitio, en cadena con el scroll.", Component: lazy(() => import("@/sections/why/WhyE")) },
    },
  },
  {
    key: "clients", id: "clientes", label: "Clientes",
    variants: {
      A: { name: "Foco", direction: D.A, idea: "Logos en penumbra; un foco sigue al cursor y los ilumina.", Component: lazy(() => import("@/sections/clients/ClientsA")) },
      B: { name: "Plano inclinado", direction: D.B, idea: "Rejilla de logos sobre un plano 3D que se mueve con el cursor y el scroll.", Component: lazy(() => import("@/sections/clients/ClientsB")) },
      C: { name: "Lluvia de logos", direction: D.C, idea: "Los logos caen y se apilan al entrar en pantalla; se pueden empujar.", Component: lazy(() => import("@/sections/clients/ClientsC")) },
      D: { name: "Rejilla limpia", direction: D.D, idea: "Rejilla con filetes; de gris a color al pasar.", Component: lazy(() => import("@/sections/clients/ClientsD")) },
      E: { name: "Doble marquesina", direction: D.E, idea: "Dos bandas en direcciones opuestas que aceleran con el scroll.", Component: lazy(() => import("@/sections/clients/ClientsE")) },
    },
  },
  {
    key: "contact", id: "contacto", label: "Contacto",
    variants: {
      A: { name: "Plano final", direction: D.A, idea: "Vídeo de fondo y formulario en cristal, como el plano final de una película.", Component: lazy(() => import("@/sections/contact/ContactA")) },
      B: { name: "Tarjeta con relieve", direction: D.B, idea: "Formulario en una tarjeta con capas a distintas profundidades que se inclina con el cursor.", Component: lazy(() => import("@/sections/contact/ContactB")) },
      C: { name: "Revelado con cursor", direction: D.C, idea: "«TRABAJEMOS JUNTOS» en hueco; el cursor descubre la foto del proyecto (idea original).", Component: lazy(() => import("@/sections/contact/ContactC")) },
      D: { name: "Blanco editorial", direction: D.D, idea: "Página en blanco, tipografía grande y campos de línea fina.", Component: lazy(() => import("@/sections/contact/ContactD")) },
      E: { name: "Paso a paso", direction: D.E, idea: "Formulario en tres pasos con transiciones rápidas y barra de progreso.", Component: lazy(() => import("@/sections/contact/ContactE")) },
    },
  },
];
