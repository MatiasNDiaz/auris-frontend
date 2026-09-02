import type { Testimonial } from "@/lib/types";

/**
 * Mock temporal. En producción estas reseñas salen de la tabla `testimonials`
 * de Supabase, filtradas por `status = 'approved'`.
 *
 * La cinta de la Home las repite en bucle, así que conviene sostener al menos
 * ocho: con menos, la vuelta se nota enseguida.
 */
export const testimonials: Testimonial[] = [
  {
    authorName: "María Elena Gómez",
    content:
      "Llegué por una consulta puntual de estética y terminé encontrando un equipo que se comunica entre sí. Es la primera vez que siento que me tratan como una persona y no como un caso.",
    rating: 5,
  },
  {
    authorName: "Fernando Álvarez",
    content:
      "Empecé terapia después de dudarlo durante años. El espacio es tranquilo, la atención es respetuosa y nunca sentí apuro. Me cambió la manera de encarar el día a día.",
    rating: 5,
  },
  {
    authorName: "Julieta Ramírez",
    content:
      "Hice un tratamiento de odontología completo. Me explicaron cada paso antes de hacerlo y me pasaron el presupuesto por escrito. Sin sorpresas, algo que se agradece muchísimo.",
    rating: 5,
  },
  {
    authorName: "Sebastián Molina",
    content:
      "El acompañamiento kinesiológico después del tratamiento fue realista desde el primer día. Me explicaron cuántas sesiones necesitaba y por qué, y el resultado se mantuvo tal cual me lo habían anticipado.",
    rating: 4,
  },
  {
    authorName: "Carla Ferreyra",
    content:
      "Llevo a mi hijo a fonoaudiología desde el año pasado. El seguimiento con la escuela y las devoluciones periódicas nos dieron una tranquilidad enorme como familia.",
    rating: 5,
  },
  {
    authorName: "Rodrigo Sandoval",
    content:
      "Vine por un dolor de espalda que arrastraba hacía meses. Me explicaron por qué me pasaba y me dieron ejercicios para hacer en casa. A las seis semanas ya dormía bien.",
    rating: 5,
  },
  {
    authorName: "Lorena Peralta",
    content:
      "Mi mamá va al taller de adultos mayores y le cambió la semana. Volvió a tener con quién charlar y nosotros la notamos más despierta y más animada.",
    rating: 5,
  },
  {
    authorName: "Diego Castellanos",
    content:
      "Hice un tratamiento facial por ciclos. Me gustó que no me prometieran resultados imposibles y que en cada sesión revisáramos si valía la pena seguir.",
    rating: 4,
  },
];
