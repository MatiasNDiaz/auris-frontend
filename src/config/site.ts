/**
 * Datos institucionales del centro. Punto único de verdad para contacto,
 * horarios y navegación: reemplazar acá cuando lleguen los datos reales.
 */
export const siteConfig = {
  name: "AURIS",
  tagline: "Espacio de salud y bienestar",
  description:
    "Centro de salud y bienestar en Cerro de las Rosas, Córdoba. Odontología, kinesiología, estética facial y corporal, psicología y fonoaudiología con un enfoque humano, profesional y personalizado.",
  url: "https://auris.com.ar",

  phone: "+54 351 481-0843",
  whatsapp: "+54 351 217-7788",
  email: "contacto@auris.com.ar",

  address: {
    street: "Juan Bautista Daniel 2044",
    /** Barrio: es como se ubica el lugar en Córdoba. */
    neighborhood: "Cerro de las Rosas",
    city: "Córdoba",
    province: "Córdoba",
    postalCode: "X5009IZF",
    country: "Argentina",
    /** Coordenadas reales, usadas por el mapa y el botón "Cómo llegar". */
    lat: -31.3721123,
    lng: -64.2314657,
    /** Ficha del centro en Google Maps. */
    mapsUrl:
      "https://www.google.com/maps/place/Auris+Espacio+de+Salud+y+Bienestar/@-31.3721123,-64.2314657,790m/data=!3m2!1e3!4b1!4m6!3m5!1s0x943299431f0653e7:0x44438f5ebffdc771!8m2!3d-31.3721123!4d-64.2314657!16s%2Fg%2F11zx3c10tr",
  },

  hours: [
    { days: "Lunes a viernes", time: "08:00 – 20:00" },
    { days: "Sábados", time: "09:00 – 14:00" },
    { days: "Domingos y feriados", time: "Cerrado" },
  ],

  social: {
    instagram: "https://www.instagram.com/auris.cerro/",
  },

  /** Mensaje prellenado del botón "Solicitar turno". */
  whatsappMessage:
    "¡Hola AURIS! Me gustaría solicitar un turno. ¿Podrían darme más información?",
} as const;

export const mainNav = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-el-centro", label: "Sobre el centro" },
  { href: "/servicios", label: "Servicios" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/blog", label: "Blog" },
  { href: "/galeria", label: "Galería" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
] as const;
