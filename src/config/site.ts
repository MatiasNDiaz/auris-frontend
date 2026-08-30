/**
 * Datos institucionales del centro. Punto único de verdad para contacto,
 * horarios y navegación: reemplazar acá cuando lleguen los datos reales.
 */
export const siteConfig = {
  name: "AURIS",
  tagline: "Espacio de salud y bienestar",
  description:
    "Espacio de salud y bienestar integral. Psicología, odontología, estética, nutrición, kinesiología, fonoaudiología y talleres para adultos mayores con un enfoque humano, profesional y personalizado.",
  url: "https://auris.com.ar",

  phone: "+54 11 4000-0000",
  whatsapp: "+54 9 11 4000-0000",
  email: "contacto@auris.com.ar",

  address: {
    street: "Av. Siempreviva 1234",
    city: "Buenos Aires",
    province: "Buenos Aires",
    postalCode: "C1425",
    country: "Argentina",
    /** Coordenadas usadas por el mapa y el botón "Cómo llegar". */
    lat: -34.5885,
    lng: -58.4104,
  },

  hours: [
    { days: "Lunes a viernes", time: "08:00 – 20:00" },
    { days: "Sábados", time: "09:00 – 14:00" },
    { days: "Domingos y feriados", time: "Cerrado" },
  ],

  social: {
    instagram: "https://instagram.com/auris.centro",
    facebook: "https://facebook.com/auris.centro",
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
