# UNICAL GRAPHIC · Landing — contexto para Claude Code

Proyecto: landing premium (nivel Awwwards) para **Unical Graphic** (unical.es), producción visual B2B en
Cabrera de Mar, Barcelona: impresión gran formato, rotulación de vehículos, stands, eventos, letras
corpóreas y retail.

## Estado actual

- **10 secciones × 7 variantes (A–G) = 70 variantes**, ya construidas y funcionando.
- Cada variante parte del **código real de un componente de 21st.dev** adaptado al contenido, medios y
  marca de Unical. El componente de origen está citado en la cabecera de cada archivo y en
  `docs/DIRECCION-CREATIVA.md`.
- Rama de trabajo: `dev`. PR abierta a `main`: #1.
- `npm run build` pasa sin errores. Sin desbordamiento horizontal a 390 y 1440 px.

## Comandos

```bash
npm install --include=dev          # Windows: hace falta --include=dev
npm run dev                        # servidor en 127.0.0.1:8080 (NODE_ENV=development)
npm run build                      # tsc -b && vite build
npm run build:preview              # build con el comparador incluido y rutas relativas
```

Si la página sale en blanco con `_jsxDEV is not a function`, el servidor arrancó con
`NODE_ENV=production`: relanzar con `NODE_ENV=development`. Si los estilos no se aplican (todo
descolocado), el servidor se arrancó antes de instalar Tailwind: reiniciarlo.

## Arquitectura

- Vite 5 + React 18 + TypeScript (SWC) · Tailwind 3.4 · `motion` / framer-motion 12 · GSAP 3 +
  ScrollTrigger · Lenis · lucide-react · `cn` en `@/lib/utils`.
- `src/content/site.ts` — **única fuente de contenido**. Todo es real.
- `src/config/sections.ts` — registro de secciones; cada carpeta `src/sections/<key>/index.ts` exporta
  `<key>Variants: VariantMap` con `name`, `direction`, `idea`, `source` (id y nombre del componente de
  21st.dev) y `Component` cargado con `lazy()`.
- `src/config/directions.ts` — las 7 direcciones creativas: A Cinematic Premium · B Immersive 3D ·
  C Experimental Creative · D Minimal Luxury · E High-Energy Motion · F Editorial Kinetic ·
  G Interactive Gallery. La misma letra mantiene el mismo carácter en todas las secciones.
- `src/config/final-selection.ts` — **combinación que se publica**. En producción el comparador no
  existe (se excluye del bundle) y se renderiza exactamente esta combinación.
- `src/preview/` — comparador, solo en desarrollo/preview.
- `src/core/` — Header/Footer, formulario, `SmartVideo`, `Btn`, `Icon`, scroll suave, detección de
  reduced-motion (`fullMotion()`).

### Comparador (solo desarrollo)

- `?gallery=<key>` apila las 7 variantes de una sección (`hero`, `services`, `reel`, `projects`,
  `process`, `numbers`, `sectors`, `why`, `clients`, `contact`).
- `?<key>=<letra>` fija una variante, p. ej. `?hero=C`.
- Teclas 1–7 cambian la variante de la sección visible. «Copiar configuración» copia el contenido de
  `final-selection.ts`.
- `?motion=full` y `?motion=static` fuerzan el modo de animación para revisar las alternativas estáticas.

## Reglas del proyecto (no romper)

1. **No inventar nada**: ni clientes, ni cifras, ni premios, ni certificaciones, ni testimonios, ni
   valoraciones, ni años de experiencia, ni fotografías de trabajos. Solo lo que hay en `site.ts`.
2. **Un `<h1>` en la portada y un `<h2>` por sección.** Los titulares partidos en líneas llevan
   `aria-label` con la frase completa.
3. **No secuestrar la rueda del ratón** ni atrapar el scroll. Escenas fijadas ≤ ~300vh y máximo 1–2 en
   toda la página.
4. **Reduced motion / equipos modestos**: `fullMotion()` debe devolver una versión estática legible
   (estado final de la animación), nunca una pantalla vacía.
5. Objetivos táctiles ≥44 px, foco visible, soporte de teclado, sin iconos emoji, alternativa táctil
   para lo que solo funcione con hover.
6. Debe verse bien a 1440×900 y a 390×844, sin desbordamiento horizontal.
7. **Vídeo**: siempre empieza silenciado; el sonido solo si lo activa el usuario. Carga diferida y pausa
   fuera de pantalla (`SmartVideo` ya lo hace).
8. No publicar en producción ni tocar DNS o dominios sin autorización explícita.
9. Higgsfield solo como referencia creativa; no gastar créditos sin aprobación explícita.

## 21st.dev

Plan Builder (búsqueda y descarga de componentes ilimitadas). MCP por HTTP:

```bash
claude mcp add --transport http 21st https://mcp.21st.dev/mcp --header "x-api-key: TU_CLAVE"
```

La clave no debe commitearse nunca al repositorio. Hay componentes ya descargados en `.cache21/`
(ignorado por git) desde una sesión anterior.

## Pendiente

- **Elegir la combinación final** y volcarla en `src/config/final-selection.ts`.
- **Calidad del vídeo de portada** (`public/media/video/hero-lexus-panther.mp4`): decidir entre retoque
  con ffmpeg, upscale 4K con Higgsfield (gasta créditos, requiere aprobación) o material original.
- **Promesa de respuesta**: `cta.note` dice «Te respondemos en menos de 24 horas laborables». Viene de la
  landing actual; quitarlo si no se puede garantizar.
- **Foto con persona**: en `mural-tomates.webp` (mural de McDonald's) se ve a una persona con la cara
  tapada en una esquina. Aparece en algunas variantes de «Por qué Unical». Recortar o sustituir.
- **Fotos de baja resolución**: las dos de Goofretti son de 640 px de ancho y se ven blandas a gran tamaño.
- **Fuentes**: solo están cargados Poppins ≥600 e Inter 400. Las variantes que querían pesos ligeros usan
  Inter 400. Si se quieren pesos finos, añadir los `@fontsource` correspondientes.
- **Probar en navegador real**: el navegador de pruebas headless no reproduce H.264, así que la
  reproducción de vídeo, el reel controlado por scroll (Unical in Motion B) y los fondos WebGL no se han
  podido verificar en movimiento.
- `docs/RECURSOS-PENDIENTES.md` lista el material audiovisual que falta.

## Convención de commits

Mensajes en español, imperativo, explicando el porqué cuando no sea obvio.
