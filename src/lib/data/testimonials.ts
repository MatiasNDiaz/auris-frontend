import type { Testimonial } from "@/lib/types";

/**
 * Mock temporal. En producción estas reseñas salen de la tabla `testimonials`
 * de Supabase, filtradas por `status = 'approved'`.
 */
export const testimonials: Testimonial[] = [
  {
    authorName: "María Elena G.",
    content:
      "Llegué por una consulta puntual de kinesiología y terminé encontrando un equipo que se comunica entre sí. Es la primera vez que siento que me tratan como una persona y no como un caso.",
    rating: 5,
  },
  {
    authorName: "Fernando A.",
    content:
      "Empecé terapia después de dudarlo durante años. El espacio es tranquilo, la atención es respetuosa y nunca sentí apuro. Me cambió la manera de encarar el día a día.",
    rating: 5,
  },
  {
    authorName: "Julieta R.",
    content:
      "Hice un tratamiento de odontología completo. Me explicaron cada paso antes de hacerlo y me pasaron el presupuesto por escrito. Sin sorpresas, algo que se agradece muchísimo.",
    rating: 5,
  },
  {
    authorName: "Sebastián M.",
    content:
      "El plan de nutrición fue realista desde el primer día. No me pidieron nada imposible de sostener y a los seis meses seguía cumpliéndolo, que era justamente lo que me costaba.",
    rating: 4,
  },
  {
    authorName: "Carla D.",
    content:
      "Llevo a mi hijo a fonoaudiología desde el año pasado. El seguimiento con la escuela y las devoluciones periódicas nos dieron una tranquilidad enorme como familia.",
    rating: 5,
  },
];
