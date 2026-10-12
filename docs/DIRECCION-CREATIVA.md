# Dirección creativa — 5 variantes por sección

Generado a partir de `src/config/sections.ts`, que es la fuente de verdad del comparador. Cada variante es un componente independiente en `src/sections/<sección>/<Sección><Letra>.tsx` con su CSS en el mismo directorio.

Las cinco direcciones: **A** Cinematic Premium · **B** Immersive 3D · **C** Experimental Creative · **D** Minimal Luxury · **E** High-Energy Motion.

Las referencias a 21st.dev indican de qué componente del catálogo sale el patrón. El código lo hemos portado a GSAP para no añadir dependencias.


## Portada (`#inicio`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Cinematic Showreel | A | Vídeo a pantalla completa con cortes entre proyectos reales, bandas de cine y dolly-in al hacer scroll. |
| **B** | Órbita de proyectos | B | Los trabajos salen de una pila y se abren en una órbita 3D con escala por profundidad y parallax de cursor (21st.dev Cinematic Orbit Hero). |
| **C** | Del vacío al stand | C | Escena fijada: un plano vacío se convierte en plano técnico, se construye, se ilumina y aparece el stand real. |
| **D** | Editorial Motion | D | Tipografía gigante con el vídeo dentro de las letras; al hacer scroll la máscara se abre a pantalla completa. |
| **E** | Mosaico dinámico | E | Columnas de proyectos a distintas velocidades; una pieza central crece hasta llenar la pantalla. |

## Servicios (`#servicios`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Capítulos de cine | A | Cada servicio es un plano a pantalla completa; el scroll funde planos con zoom lento y títulos que entran por máscara. |
| **B** | Carrusel cilíndrico | B | Los seis servicios giran en un cilindro 3D que se mueve con scroll, arrastre y cursor. |
| **C** | Índice tipográfico | C | Nombres gigantes que se deforman con la velocidad del scroll; la foto sigue al cursor al pasar por encima. |
| **D** | Lista y cortina | D | Imagen fija a la izquierda que cambia con una cortina; lista de servicios con filetes finos a la derecha. |
| **E** | Recorrido horizontal | E | Pista horizontal fijada con paneles que escalan, contador y barra de progreso. |

## Unical in Motion (`#reel`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Fullscreen Film | A | Titular cinético, badges con barrido y el showreel que se abre en círculo hasta llenar la pantalla (21st.dev Hero Scroll Video Pin Reveal). |
| **B** | Reel por scroll | B | La sección se fija y el scroll controla el avance del vídeo fotograma a fotograma, con capítulos. |
| **C** | Galería interactiva | C | Mosaico de piezas que se reproducen al pasar el ratón; al elegir una se abre en un reproductor con transición. |
| **D** | Viaje horizontal | D | Travelling horizontal por proyectos y clips de distintos tamaños con parallax interno. |
| **E** | Portal inmersivo | E | Cada proyecto se abre con un portal circular que nace del punto donde haces clic. |

## Proyectos (`#proyectos`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Pila cinematográfica | A | Proyectos a pantalla casi completa que se apilan (sticky): el anterior retrocede y se oscurece (21st.dev Stacking Cards). |
| **B** | Muro que se despliega | B | Rejilla en perspectiva 3D que se endereza con el scroll, columnas a distinta velocidad y tilt con el cursor (21st.dev Unfurling Gallery). |
| **C** | Lienzo arrastrable | C | Lienzo libre que se arrastra con inercia en todas direcciones para explorar los trabajos. |
| **D** | Índice con vista previa | D | Lista numerada sobria; la imagen aparece y sigue al cursor, con un proyecto destacado. |
| **E** | Zoom parallax | E | Siete trabajos crecen a velocidades distintas con el scroll hasta que uno llena la pantalla (21st.dev Zoom Parallax). |

## Proceso (`#proceso`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Fases a pantalla | A | Sección fijada: fondo fotográfico por fase con fundidos, número gigante y línea de progreso. |
| **B** | Baraja 3D | B | Cuatro tarjetas apiladas en profundidad que se voltean hacia el espectador al avanzar. |
| **C** | Trazo continuo | C | Una línea se dibuja serpenteando por la sección y va encendiendo cada fase al pasar. |
| **D** | Anillo | D | El anillo de la landing original, refinado: el arco avanza con el scroll y el centro cambia de fase. |
| **E** | Palabras en carrera | E | Las cuatro fases cruzan la pantalla a gran escala, sincronizadas con el scroll. |

## Cifras (`#cifras`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Cifras sobre vídeo | A | Las cifras cuentan sobre un vídeo real oscurecido, con entrada por máscara. |
| **B** | Volumen 3D | B | Números con volumen (capas extruidas) que giran siguiendo el cursor. |
| **C** | Cifra gigante | C | Una cifra ocupa toda la pantalla y el scroll la hace contar y cambiar a la siguiente. |
| **D** | Rejilla fina | D | Rejilla con filetes, mucho aire y contadores sobrios. |
| **E** | Odómetro | E | Dígitos que ruedan como un cuentakilómetros y una banda en movimiento. |

## Sectores (`#sectores`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Fondo por sector | A | Al pasar por cada sector, la imagen de fondo cambia con un fundido cinematográfico. |
| **B** | Esfera orbital | B | Los sectores orbitan en una esfera 3D que se orienta con el cursor. |
| **C** | Bolas con gravedad | C | La idea original de la landing: bolas con física que caen, rebotan y se arrastran. |
| **D** | Lista editorial | D | Dos columnas con filetes, numeración y una miniatura que aparece al pasar. |
| **E** | Bandas cruzadas | E | Dos bandas diagonales que se cruzan y aceleran con el scroll. |

## Por qué Unical (`#por-que`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Manifiesto en vídeo | A | Vídeo de fondo y pilares que aparecen como subtítulos de película. |
| **B** | Pila con profundidad | B | Tarjetas fijas que se apilan con profundidad 3D (evolución del stack de la landing). |
| **C** | Composición asimétrica | C | «UNICAL» gigante de fondo y pilares desordenados que entran recortados. |
| **D** | Acordeón sobrio | D | Lista con iconos lineales que se despliega con calma; imagen que acompaña. |
| **E** | Escala en cadena | E | Cada pilar entra enorme y se reduce hasta su sitio, en cadena con el scroll. |

## Clientes (`#clientes`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Foco | A | Logos en penumbra; un foco sigue al cursor y los ilumina. |
| **B** | Plano inclinado | B | Rejilla de logos sobre un plano 3D que se mueve con el cursor y el scroll. |
| **C** | Lluvia de logos | C | Los logos caen y se apilan al entrar en pantalla; se pueden empujar. |
| **D** | Rejilla limpia | D | Rejilla con filetes; de gris a color al pasar. |
| **E** | Doble marquesina | E | Dos bandas en direcciones opuestas que aceleran con el scroll. |

## Contacto (`#contacto`)

| | Variante | Dirección | Concepto e interacción |
|---|---|---|---|
| **A** | Plano final | A | Vídeo de fondo y formulario en cristal, como el plano final de una película. |
| **B** | Tarjeta con relieve | B | Formulario en una tarjeta con capas a distintas profundidades que se inclina con el cursor. |
| **C** | Revelado con cursor | C | «TRABAJEMOS JUNTOS» en hueco; el cursor descubre la foto del proyecto (idea original). |
| **D** | Blanco editorial | D | Página en blanco, tipografía grande y campos de línea fina. |
| **E** | Paso a paso | E | Formulario en tres pasos con transiciones rápidas y barra de progreso. |
