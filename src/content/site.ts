/**
 * CONTENIDO REAL de la landing — fuente: webunical/Final/Landing-Home/unical-home-FINAL_v29.html
 * Todas las variantes leen de aquí. No inventar clientes, cifras, premios ni testimonios.
 * Las imágenes y vídeos son trabajos reales de Unical (carpeta webunical, repo unicales y unical-pro-max).
 */

/** Prefijo de rutas: "/" en producción, "./" en el build de revisión. */
const BASE = import.meta.env.BASE_URL;
const IMG = `${BASE}media/img`;
const VID = `${BASE}media/video`;

export const media = {
  logoLight: `${BASE}media/brand/logo-unical-blanco.svg`, // letras blancas + trazo azul (fondos oscuros)
  logoDark: `${BASE}media/brand/logo-unical.png`, // carbón (fondos claros)
};

export type Video = { src: string; mobile?: string; poster: string; label: string; audio: boolean };

export const videos = {
  heroPanther: {
    src: `${VID}/hero-lexus-panther.mp4`,
    mobile: `${VID}/hero-lexus-panther-mobile.mp4`,
    poster: `${VID}/posters/hero-lexus-panther.webp`,
    label: "Lexus · Car wrapping Black Panther",
    audio: false,
  },
  showreel: {
    src: `${VID}/showreel.mp4`,
    poster: `${VID}/posters/showreel.webp`,
    label: "Showreel Unical (montaje con proyectos reales)",
    audio: false,
  },
  showreelScrub: {
    src: `${VID}/showreel-scrub.mp4`,
    poster: `${VID}/posters/showreel.webp`,
    label: "Showreel (versión para control por scroll)",
    audio: false,
  },
  lexusRx: {
    src: `${VID}/lexus-rx-showroom.mp4`,
    poster: `${VID}/posters/lexus-rx-showroom.webp`,
    label: "Lexus RX · Wrapping en concesionario",
    audio: false,
  },
  cirsa: {
    src: `${VID}/evento-cirsa.mp4`,
    poster: `${VID}/posters/evento-cirsa.webp`,
    label: "Cirsa · Backdrop retroiluminado",
    audio: false,
  },
  lexusEs1: { src: `${VID}/lexus-es-1.mp4`, poster: `${VID}/posters/lexus-es-1.webp`, label: "Lexus ES · Detalle de wrapping", audio: false },
  lexusEs2: { src: `${VID}/lexus-es-2.mp4`, poster: `${VID}/posters/lexus-es-2.webp`, label: "Lexus ES · Lateral", audio: false },
  lexusEs3: { src: `${VID}/lexus-es-3.mp4`, poster: `${VID}/posters/lexus-es-3.webp`, label: "Lexus ES · Trasera", audio: false },
} satisfies Record<string, Video>;

export const contact = {
  phone: "937 50 23 04",
  phoneHref: "tel:+34937502304",
  email: "nico@unical.es",
  address: "Passatge la Carola, 2 · Cabrera de Mar",
  addressFull: ["Passatge la Carola, 2", "08349 – Cabrera de Mar"],
  whatsapp:
    "https://wa.me/34663512014?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta%20sobre%20vuestros%20servicios.",
  instagram: "https://www.instagram.com/unical_graphic/",
  linkedin: "https://es.linkedin.com/company/unical-graphic-sl",
  contactUrl: "/es/contacto",
  projectsUrl: "/es/proyectos",
  privacyUrl: "https://www.unical.es/es/privacidad",
};

export const nav = [
  { label: "Inicio", href: "/es" },
  { label: "Servicios", href: "/es/servicios" },
  { label: "Proyectos", href: "/es/proyectos" },
  { label: "Blog", href: "/es/blog" },
  { label: "Contacto", href: "/es/contacto" },
];

export const hero = {
  eyebrow: "Servicios 360° · Barcelona",
  titleLines: ["PRODUCCIÓN", "VISUAL", "B2B."],
  lead: "Tu partner en impresión digital, rotulación y producción visual. Producción propia, plazos rápidos y montaje profesional en toda España.",
  ctaPrimary: { label: "Ver proyectos", href: "/es/proyectos" },
  ctaSecondary: { label: "Solicitar presupuesto", href: "/es/contacto" },
  ticker: [
    "Impresión Gran Formato",
    "Rotulación de Vehículos",
    "Car Wrapping",
    "Stands para Ferias",
    "PLV y Retail",
    "Señalética Corporativa",
    "Vinilos Decorativos",
    "Publicidad Exterior",
  ],
  slides: [`${IMG}/hero/lexus-marvel.webp`, `${IMG}/hero/lexus.webp`, `${IMG}/hero/mcdonalds-car.webp`],
};

export type Service = { n: string; title: string; sub: string; text: string; href: string; img: string; alt: string };

export const services = {
  eyebrow: "Servicios 360°",
  title: "Producción visual de principio a fin.",
  items: [
    {
      n: "01", title: "Impresión", sub: "Gran formato",
      text: "Vallas, lonas, telas y vinilo a cualquier tamaño con impresión UV de alta resolución.",
      href: "https://www.unical.es/es/servicios/impresion-digital-gran-formato",
      img: `${IMG}/hubs/impresion/lona-fachada.webp`, alt: "Lona de gran formato instalada en fachada",
    },
    {
      n: "02", title: "Rotulación", sub: "Vehículos y flotas",
      text: "Furgonetas, camiones y flotas corporativas con vinilos 3M y Avery, garantía de 5 a 7 años.",
      href: "https://www.unical.es/es/servicios/rotulacion-vehiculos",
      img: `${IMG}/landing/tibau-cabina-izq.webp`, alt: "Camión del Tibau Team rotulado",
    },
    {
      n: "03", title: "Stands", sub: "Ferias y congresos",
      text: "Diseño, producción, transporte y montaje llave en mano para Fira Barcelona y toda España.",
      href: "https://www.unical.es/es/servicios/stands-para-ferias",
      img: `${IMG}/landing/eversense.webp`, alt: "Stand de Eversense en congreso",
    },
    {
      n: "04", title: "Eventos corporativos", sub: "Ambientación y activaciones",
      text: "Photocalls, backdrops, banderolas y montaje integral para presentaciones y eventos de marca.",
      href: "https://www.unical.es/es/servicios",
      img: `${IMG}/hubs/eventos/congreso.webp`, alt: "Escenario y ambientación de un congreso corporativo",
    },
    {
      n: "05", title: "Letras corpóreas", sub: "Rótulos en volumen",
      text: "Letras en PVC, metacrilato y aluminio, con o sin retroiluminación led, para fachada e interior.",
      href: "https://www.unical.es/es/servicios",
      img: `${IMG}/hubs/rotulacion/letras-corporeas-havi.webp`, alt: "Letras corpóreas de HAVI en fachada",
    },
    {
      n: "06", title: "Retail", sub: "PLV y punto de venta",
      text: "Expositores, pop-up stores y material promocional para cadenas y grandes marcas.",
      href: "https://www.unical.es/es/servicios/plv-retail",
      img: `${IMG}/svc/retail-kenzo.webp`, alt: "Espacio de punto de venta para Kenzo",
    },
  ] as Service[],
};

export type Project = { title: string; client: string; kind: string; href: string; img: string };

export const projects = {
  eyebrow: "Nuestro trabajo",
  title: "Trabajos que hablan por sí solos",
  allHref: "https://www.unical.es/es/proyectos",
  items: [
    { title: "Tibau Team · Flota Dakar", client: "Tibau Team", kind: "Rotulación de flota", href: "https://www.unical.es/es/proyecto/tibau-team-dakar", img: `${IMG}/landing/tibau-trasera.webp` },
    { title: "McDonald's · Murales", client: "McDonald's", kind: "Decoración interior", href: "https://www.unical.es/es/proyecto/mcdonalds-decoracion-interior-murales", img: `${IMG}/landing/mcd-cover.webp` },
    { title: "Goofretti · Food Truck", client: "Goofretti", kind: "Food truck wrapping", href: "https://www.unical.es/es/proyecto/goofretti-food-truck-wrapping", img: `${IMG}/landing/goofretti-cover.webp` },
    { title: "Tibau Team · Remolques", client: "Tibau Team", kind: "Rotulación de remolques", href: "https://www.unical.es/es/proyecto/tibau-team-rally-assistance-wrapping", img: `${IMG}/landing/tibau-remolque.webp` },
    { title: "McDonald's · Mural artístico", client: "McDonald's", kind: "Mural interior", href: "https://www.unical.es/es/proyecto/mcdonalds", img: `${IMG}/landing/mcd-08.webp` },
    { title: "Tibau Team · Camión taller", client: "Tibau Team", kind: "Rotulación de camión", href: "https://www.unical.es/es/proyecto/tibau-team-dakar", img: `${IMG}/landing/tibau-camion-taller.webp` },
    { title: "Goofretti · Trasera", client: "Goofretti", kind: "Food truck wrapping", href: "https://www.unical.es/es/proyecto/goofretti-food-truck-wrapping", img: `${IMG}/landing/goofretti-trasera.webp` },
    { title: "Tibau Team · Asistencia", client: "Tibau Team", kind: "Rotulación de vehículo", href: "https://www.unical.es/es/proyecto/tibau-team-rally-assistance-wrapping", img: `${IMG}/landing/tibau-asistencia.webp` },
  ] as Project[],
};

export const process = {
  eyebrow: "Cómo trabajamos",
  title: "Del concepto a la realidad.",
  lead: "Un único interlocutor de principio a fin: diseñamos, producimos e instalamos con equipo y maquinaria propios. Sin intermediarios y sin sorpresas en el plazo.",
  phases: [
    { n: "01", title: "Presupuesto", text: "Escuchamos tus necesidades y proponemos soluciones con una valoración detallada y sin compromiso.", tags: ["Briefing", "Medición", "Sin compromiso"], img: `${IMG}/hubs/rotulacion/comercial-fachada.webp` },
    { n: "02", title: "Diseño", text: "Nuestro equipo creativo realiza los originales y propuestas gráficas adaptadas a tu marca y proyecto.", tags: ["Originales", "Adaptación de marca", "Mockup"], img: `${IMG}/proyectos/3cat.webp` },
    { n: "03", title: "Producción", text: "Máquinas de última generación imprimen, cortan, pegan o sueldan todo lo necesario con la máxima precisión.", tags: ["Gran formato", "Corte CNC", "Control de calidad"], img: `${IMG}/servicios/gran-formato.webp` },
    { n: "04", title: "Instalación", text: "Instaladores experimentados hacen realidad el boceto inicial con los mejores acabados en cualquier ubicación.", tags: ["Equipo propio", "Cobertura nacional", "Llave en mano"], img: `${IMG}/servicios/stands.webp` },
  ],
};

export const numbers = {
  eyebrow: "Por qué elegirnos",
  titleA: "+25 años haciendo ",
  titleEm: "lo imposible",
  titleB: " una realidad.",
  lead: "Producción propia en Cabrera de Mar, instaladores certificados y cobertura en toda España.",
  items: [
    { value: 25, prefix: "+", label: "Años de experiencia" },
    { value: 3000, prefix: "+", label: "Proyectos entregados" },
    { value: 40, prefix: "+", label: "Sectores atendidos" },
    { text: "3M · Avery", label: "Instaladores certificados" },
  ] as { value?: number; prefix?: string; text?: string; label: string }[],
};

export const sectors = {
  eyebrow: "Sectores",
  title: "Trabajamos con todo tipo de empresas.",
  lead: "Soluciones visuales adaptadas a las necesidades específicas de cada sector, con el mismo nivel de exigencia y detalle en todos los proyectos.",
  items: [
    { name: "Vehículos", size: 1.12, img: `${IMG}/hubs/rotulacion/flota-furgonetas.webp` },
    { name: "Stands y Ferias", size: 1.24, img: `${IMG}/hubs/eventos/stand-feria.webp` },
    { name: "Retail y PLV", size: 1.1, img: `${IMG}/proyectos/venca.webp` },
    { name: "Hostelería", size: 1.06, img: `${IMG}/proyectos/five-guys.webp` },
    { name: "Oficinas", size: 1, img: `${IMG}/hubs/rotulacion/senaletica-oficina.webp` },
    { name: "Publicidad Exterior", size: 1.26, img: `${IMG}/svc/impresion-vallas.webp` },
    { name: "Eventos Deportivos", size: 1.28, img: `${IMG}/hubs/eventos/funrun.webp` },
    { name: "Pharma", size: 0.92, img: `${IMG}/hubs/impresion/neurocare.webp` },
  ],
};

export const why = {
  eyebrow: "Por qué Unical",
  titleA: "Hacemos que lo ",
  titleEm: "imposible",
  titleB: " sea, simplemente, una realidad.",
  text: "Trabajar con el corazón es lo que nos permite ofrecer servicios donde la calidad y la profesionalidad priman sobre cualquier otra cosa. Somos tu partner, no solo tu proveedor.",
  cta: { label: "Habla con nosotros", href: "/es/contacto" },
  pillars: [
    { n: "01", icon: "factory", title: "Producción propia", text: "Instalaciones con tecnología de última generación. Sin subcontrataciones: la calidad y los plazos los controlamos nosotros, de principio a fin.", tags: ["Sin intermediarios", "Plazos controlados"], img: `${IMG}/servicios/gran-formato.webp` },
    { n: "02", icon: "pen", title: "Diseño + Fabricación", text: "Servicio integral desde el diseño gráfico hasta la producción y el montaje final del proyecto. Un único equipo, una única responsabilidad.", tags: ["Originales", "Mockup previo"], img: `${IMG}/hubs/impresion/mural-tomates.webp` },
    { n: "03", icon: "badge", title: "Instalación profesional", text: "Red de instaladores certificados 3M & Avery para acabados perfectos en cualquier ubicación, por complicada que sea.", tags: ["Certificados 3M", "Equipo propio"], img: `${IMG}/servicios/car-wrapping.webp` },
    { n: "04", icon: "map", title: "Cobertura nacional", text: "Con base en Barcelona, trabajamos en toda España. Proyectos sin fronteras geográficas y el mismo interlocutor estés donde estés.", tags: ["Toda España", "Llave en mano"], img: `${IMG}/servicios/flotas.webp` },
  ],
};

const LOGO = `${BASE}media/logos`;
export const clients = {
  eyebrow: "Clientes",
  title: "Clientes que confían en nosotros.",
  lead: "Desde startups hasta marcas del Fortune 500. Cada logo es un proyecto que salió como tenía que salir.",
  foot: "+3.000 proyectos",
  footText: "más para empresas de todos los tamaños.",
  items: [
    ["Wella Professionals", "wella"], ["UCB", "ucb"], ["Toyota", "toyota"], ["Straumann Group", "straumann"],
    ["Sony Music", "sony-music"], ["Rituals", "rituals"], ["RFEF", "rfef"], ["Porcelanosa", "porcelanosa"],
    ["Philip Morris", "philip-morris"], ["Otis", "otis"], ["Mitsubishi Electric", "mitsubishi-electric"], ["LOS40", "los40"],
    ["LONGi", "longi"], ["LEO Pharma", "leo-pharma"], ["Generali", "generali"], ["Fibratel", "fibratel"],
    ["Elanco", "elanco"], ["Dial", "dial"], ["CSL Vifor", "csl-vifor"], ["Cruz Roja", "cruz-roja"],
    ["Coca-Cola", "coca-cola"], ["Catai", "catai"], ["Bankinter", "bankinter"], ["Ávoris", "avoris"],
    ["Monster Energy", "monster-energy"],
  ].map(([name, slug]) => ({ name, logo: `${LOGO}/${slug}.png` })),
};

export const cta = {
  eyebrow: "¿Tienes un proyecto?",
  titleHollow: "TRABAJEMOS",
  titleSolid: "JUNTOS.",
  text: "Cuéntanos qué necesitas y te enviamos presupuesto sin compromiso. Producción propia, instalación certificada y cobertura en toda España.",
  revealImg: `${IMG}/landing/tibau-cabina-der.webp`,
  serviceOptions: [
    "Impresión gran formato", "Rotulación de vehículos", "Car wrapping", "Stands para ferias",
    "PLV y retail", "Señalética y vinilos", "Otro",
  ],
  note: "Te respondemos en menos de 24 horas laborables.",
  ok: "Gracias. Hemos recibido tu solicitud y te contactamos enseguida.",
  formAction: "https://www.unical.es/es/contacto",
};

export const footer = {
  text: "Partner de producción visual integral para empresas y agencias. Diseño, impresión digital y rotulación en Barcelona.",
  services: [
    ["Impresión gran formato", "/es/servicios/impresion-digital-gran-formato"],
    ["Rotulación vehículos", "/es/servicios/rotulacion-vehiculos"],
    ["Car Wrapping", "/es/servicios/car-wrapping"],
    ["Stands para ferias", "/es/servicios/stands-para-ferias"],
    ["PLV y Retail", "/es/servicios/plv-retail"],
    ["Señalética", "/es/servicios/senaletica-corporativa"],
  ],
  company: [
    ["Sobre nosotros", "/es/sobre-nosotros"], ["Proyectos", "/es/proyectos"], ["Blog", "/es/blog"], ["Contacto", "/es/contacto"],
  ],
  legal: "© 2026 UNICAL GRAPHIC, S.L. CIF: B-60670809. Todos los derechos reservados.",
  legalLinks: [["Privacidad", "/es/politica-privacidad"], ["Cookies", "/es/politica-cookies"], ["Aviso legal", "/es/aviso-legal"]],
};

/**
 * REEL «UNICAL IN MOTION» — sección nueva. Solo material real.
 * `placeholder: true` = falta el vídeo de esa categoría; se muestra la foto real con un aviso visible en preview.
 */
export type ReelItem = {
  id: string; title: string; cat: string; img: string; video?: Video; placeholder?: boolean; vertical?: boolean;
};

export const reel = {
  eyebrow: "Unical in Motion",
  title: "Lo hacemos realidad.",
  lead: "Imprimimos, rotulamos, montamos e instalamos. Una muestra en movimiento de lo que sale cada semana de nuestro taller de Cabrera de Mar.",
  main: videos.showreel,
  items: [
    { id: "panther", title: "Lexus · Black Panther", cat: "Car wrapping", img: `${IMG}/hero/lexus-marvel.webp`, video: videos.heroPanther },
    { id: "rx", title: "Lexus RX · Concesionario", cat: "Car wrapping", img: `${IMG}/hero/lexus.webp`, video: videos.lexusRx },
    { id: "cirsa", title: "Cirsa · Ilusión une", cat: "Eventos corporativos", img: `${VID}/posters/evento-cirsa.webp`, video: videos.cirsa },
    { id: "es", title: "Lexus ES · Detalle", cat: "Rotulación de vehículos", img: `${VID}/posters/lexus-es-1.webp`, video: videos.lexusEs1, vertical: true },
    { id: "stands", title: "Stands y ferias", cat: "Stands", img: `${IMG}/hubs/eventos/stand-feria.webp`, placeholder: true },
    { id: "corporeos", title: "Corpóreos iluminados", cat: "Letras corpóreas", img: `${IMG}/hubs/rotulacion/neon-lcky.webp`, placeholder: true },
    { id: "gran-formato", title: "Gran formato", cat: "Impresión digital", img: `${IMG}/hubs/impresion/exterior-lona.webp`, placeholder: true },
    { id: "espacios", title: "Decoración de espacios", cat: "Interiorismo gráfico", img: `${IMG}/hubs/eventos/tunel-vodafone.webp`, placeholder: true },
  ] as ReelItem[],
};

/** Galería de apoyo (fotos reales) para mosaicos y fondos. */
export const gallery = [
  `${IMG}/hero/lexus-marvel.webp`, `${IMG}/hubs/eventos/tunel-vodafone.webp`, `${IMG}/proyectos/five-guys.webp`,
  `${IMG}/landing/eversense.webp`, `${IMG}/hubs/rotulacion/neon-lcky.webp`, `${IMG}/proyectos/venca.webp`,
  `${IMG}/proyectos/disney.webp`, `${IMG}/hubs/eventos/lanzamiento-coche.webp`, `${IMG}/proyectos/tke.webp`,
  `${IMG}/svc/letras-maher.webp`, `${IMG}/proyectos/3cat.webp`, `${IMG}/hubs/eventos/congreso.webp`,
  `${IMG}/proyectos/goofretti.webp`, `${IMG}/servicios/publicidad-exterior.webp`, `${IMG}/hubs/rotulacion/luminoso-3cat.webp`,
  `${IMG}/hubs/eventos/stand-feria.webp`, `${IMG}/svc/stand-danone.webp`, `${IMG}/proyectos/mcdonalds.webp`,
];
