# Unical Graphic — Landing experience

Landing de **Unical Graphic** (unical.es) con **7 variantes funcionales de cada sección** (A–G), cada una basada en un componente real de 21st.dev,, la nueva sección **Unical in Motion** y un **comparador** para combinarlas y elegir la versión definitiva.

- Contenido y estructura: `webunical/Final/Landing-Home/unical-home-FINAL_v29.html` (fuente de verdad), volcados en `src/content/site.ts`.
- Stack: el mismo del repo original `unicales` (Vite 5 + React 18 + TypeScript), más GSAP + ScrollTrigger y Lenis. Las tipografías (Poppins e Inter) se sirven desde el propio sitio.
- Diseño: skill **unical-ui** (marca), **ui-ux-pro-max** (sistema en `docs/design-system/`) y patrones de **21st.dev** (ver `docs/DIRECCION-CREATIVA.md`).

## Instalación y ejecución

```bash
npm install
npm run dev          # http://localhost:8080 — con selector de variantes
npm run build        # versión pública: sin selector, usa src/config/final-selection.ts
npm run build:preview  # build de revisión CON selector (para un deploy de preview)
npm run preview      # sirve el build local
```

## Comparador de variantes (solo dev / preview)

Barra inferior: «Variantes» abre el panel completo.
- **A | B | C | D | E** por sección: cambia la implementación completa sin recargar.
- Atajo: teclas **1–7** cambian la sección que estás viendo.
- **Ver las 7**: muestra las siete variantes de una sección una debajo de otra (`?gallery=hero`).
- **Escritorio / Tablet / Móvil / Los tres**: vista en marcos de 1440, 820 y 390 px.
- La selección se guarda en el navegador y en la URL (`?hero=B&services=D…`). **Copiar enlace** sirve para compartirla.
- **Restaurar inicial** vuelve a la combinación de `final-selection.ts`.
- `?motion=static` / `?motion=full` fuerzan la versión estática o animada para revisarlas.

## Elegir la combinación definitiva y publicar

1. En el comparador, elige una variante por sección.
2. Pulsa **Copiar configuración** y pega el resultado en `src/config/final-selection.ts`.
3. `npm run build`. El selector no se incluye en la versión pública.
4. Publicar: el proyecto está listo para Vercel (`vercel.json`). **No** se ha publicado ni se han tocado dominios ni DNS.

Recomendación de ui-ux-pro-max: no más de 1–2 secciones fijadas con *pin* por página. La propuesta inicial solo fija el reel.

## Estructura

```
src/
  content/site.ts           contenido real (textos, servicios, proyectos, clientes, contacto, media)
  config/sections.ts        registro de secciones y variantes (nombre, dirección, idea, componente lazy)
  config/final-selection.ts combinación pública
  core/                     scroll (Lenis+ScrollTrigger), useGsap, entorno, UI común, formulario, cabecera/pie
  sections/<sección>/       <Sección>A…E.tsx + css propio (cada variante se carga en su propio chunk)
  preview/                  comparador (excluido del build público)
public/media/               fotos y vídeos reales optimizados (webp / mp4 H.264 faststart)
docs/                       dirección creativa, sistema de diseño, recursos pendientes, prompts Higgsfield
```

## Accesibilidad y rendimiento

- `prefers-reduced-motion` y equipos modestos/ahorro de datos → versión estática legible (sin pin ni scrub, póster en lugar de vídeo).
- Vídeos silenciados en autoplay, carga diferida y solo se descargan si se van a reproducir. El reel tiene control de sonido para el usuario.
- Un único H1, JSON-LD Organization, metadatos OG y saltar al contenido.

## Pendiente

Ver `docs/RECURSOS-PENDIENTES.md`. El formulario valida y muestra el aviso, igual que la landing actual. Falta conectar el envío real, por ejemplo a la función `send-contact` de Supabase del repo `unicales`.
