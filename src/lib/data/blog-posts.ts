import type { BlogPost } from "@/lib/types";

/**
 * Mock temporal. En producción los artículos salen de la tabla `blog_posts`
 * de Supabase, gestionados desde el panel de administración.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "senales-de-que-es-momento-de-empezar-terapia",
    title: "Cinco señales de que es momento de empezar terapia",
    excerpt:
      "No hace falta tocar fondo para pedir ayuda. Repasamos las señales cotidianas que suelen indicar que un espacio terapéutico puede hacer la diferencia.",
    coverImageUrl: "/images/blog/empezar-terapia.jpg",
    publishedAt: "2025-07-14",
    content: `Una de las preguntas que más escuchamos en las entrevistas de admisión es la misma: "¿No estaré exagerando?". La idea de que la terapia es un recurso para situaciones extremas sigue muy instalada, y hace que muchas personas posterguen durante años una consulta que podrían haber hecho mucho antes.

## No se trata de gravedad, sino de malestar sostenido

El criterio no es qué tan grave parece un problema desde afuera, sino cuánto tiempo llevás conviviendo con un malestar que no cede. Si algo te viene ocupando la cabeza durante semanas y las estrategias que solías usar dejaron de funcionar, eso ya es motivo suficiente.

## Señales frecuentes

La primera es el cansancio que no se resuelve durmiendo: descansás, pero seguís sin energía. La segunda es la irritabilidad con las personas más cercanas, que suele ser la primera en aparecer y la última en reconocerse.

La tercera tiene que ver con el retraimiento: dejás de hacer cosas que antes disfrutabas, no porque no te gusten, sino porque te dan pereza de golpe. La cuarta son los síntomas físicos sin causa clara —contracturas, problemas digestivos, dificultad para dormir— que el médico clínico ya descartó.

La quinta, y quizás la más importante, es la sensación de estar repitiendo el mismo patrón: los mismos conflictos, en distintos vínculos, una y otra vez.

## Qué esperar de la primera entrevista

La primera consulta es un espacio de encuentro, no un interrogatorio. Se conversa sobre el motivo que te trae, un poco de tu historia y qué esperás del proceso. De ahí salen los objetivos de trabajo y la frecuencia propuesta, siempre acordados con vos.

Empezar no implica un compromiso indefinido. Implica darte la oportunidad de mirar lo que te pasa con alguien formado para acompañarte.`,
  },
  {
    slug: "cuando-consultar-por-el-lenguaje-de-un-chico",
    title: "Cuándo consultar por el lenguaje de un chico",
    excerpt:
      "«Ya va a hablar» es el consejo más repetido y el que más consultas demora. Repasamos qué es esperable a cada edad y cuándo conviene una evaluación.",
    coverImageUrl: "/images/blog/lenguaje-infantil.jpg",
    publishedAt: "2025-06-02",
    content: `La frase se escucha en casi todas las primeras entrevistas: alguien de la familia dijo que no había que preocuparse, que ya iba a hablar. A veces es cierto. El problema es que, cuando no lo es, esa espera se lleva meses en los que el tratamiento habría sido mucho más corto.

## Los rangos son amplios, pero existen

Cada chico tiene su tiempo y las diferencias entre hermanos son normales. Aun así hay referencias razonables: hacia el año suelen aparecer las primeras palabras con intención, cerca de los dos años empiezan las combinaciones de dos palabras, y alrededor de los tres el habla ya se entiende para alguien de afuera de la familia.

No cumplir uno de esos puntos no es un diagnóstico. Es motivo de consulta, que es otra cosa.

## Señales que conviene mirar

Más que el vocabulario, miramos la intención comunicativa: si el chico busca la mirada, señala lo que quiere, responde a su nombre y comparte la atención con el adulto. Un chico con pocas palabras pero mucha intención comunicativa preocupa menos que uno que dejó de intentarlo.

También prestamos atención a los retrocesos: perder palabras que ya usaba siempre amerita una consulta, a cualquier edad.

## Qué pasa en una evaluación

No es un examen ni el chico tiene que rendir nada. Se juega, se observa cómo se comunica y se conversa con la familia sobre la historia y la rutina. De ahí sale una devolución concreta: si hay que tratar, si alcanza con pautas para casa o si simplemente hay que volver a mirar en unos meses.

Consultar temprano no adelanta un problema. En la mayoría de los casos lo que hace es descartarlo.`,
  },
  {
    slug: "como-prevenir-lesiones-si-volves-a-entrenar",
    title: "Cómo prevenir lesiones si volvés a entrenar después de un parate",
    excerpt:
      "La mayoría de las lesiones al retomar la actividad física aparecen en las primeras semanas. Estas son las pautas que trabajamos desde kinesiología.",
    coverImageUrl: "/images/blog/volver-a-entrenar.jpg",
    publishedAt: "2025-04-21",
    content: `Retomar la actividad física después de meses de inactividad es una de las causas más frecuentes de consulta kinesiológica. El entusiasmo inicial suele llevar a hacer en la primera semana el volumen que el cuerpo estaba preparado para tolerar recién en el segundo mes.

## El tejido se adapta más lento que la motivación

El sistema cardiovascular mejora rápido: en dos o tres semanas ya notás diferencia. Pero los tendones, los ligamentos y el cartílago se adaptan mucho más despacio. Esa diferencia de velocidades es exactamente donde aparece la lesión: te sentís en condiciones de hacer más de lo que tus tejidos toleran.

## Progresión, no intensidad

La regla práctica es aumentar la carga semanal de forma gradual y sostenida, en lugar de dar saltos. Si corriste 10 kilómetros esta semana, la próxima no deberían ser 20.

Sumá al menos dos sesiones semanales de trabajo de fuerza. No es opcional ni complementario: es lo que prepara al tendón para absorber carga.

## Señales de alarma

Un dolor que aparece durante la actividad y desaparece al terminar suele ser adaptativo. Un dolor que persiste más de 24 horas, que aumenta sesión a sesión o que te hace modificar la forma de moverte, no lo es. Ese es el momento de consultar, no cuando ya no podés apoyar el pie.`,
  },
  {
    slug: "salud-bucal-lo-que-el-control-periodico-previene",
    title: "Salud bucal: lo que un control periódico te ahorra",
    excerpt:
      "Dos consultas al año detectan a tiempo la mayoría de los problemas que, sin control, terminan en tratamientos largos y costosos.",
    coverImageUrl: "/images/blog/salud-bucal.jpg",
    publishedAt: "2025-03-08",
    content: `La consulta odontológica todavía se asocia al dolor: se va cuando algo molesta. El problema es que, para cuando una caries duele, ya avanzó lo suficiente como para necesitar un tratamiento bastante más complejo que una restauración simple.

## Lo que se ve en un control

Un control periódico incluye la revisión clínica, el estudio radiográfico cuando corresponde y la limpieza profesional. En esa revisión se detectan caries incipientes, retracción de encías, desgastes por bruxismo y lesiones en tejidos blandos que la persona no percibe.

## El costo de esperar

Una caries detectada temprano se resuelve en una sesión. La misma caries un año después puede requerir endodoncia y corona, con varias sesiones y un costo considerablemente mayor. La diferencia no está en la técnica: está en el momento de la consulta.

## Higiene entre controles

El cepillado dos veces por día es la base, pero es insuficiente por sí solo: el cepillo no llega a las caras interproximales, donde se inicia buena parte de las caries. El uso diario de hilo dental o cepillos interdentales es lo que completa la higiene.

Dos controles al año son suficientes para la mayoría de las personas. Quienes tengan antecedentes de enfermedad periodontal o alto riesgo de caries pueden necesitar una frecuencia mayor, que se define caso por caso.`,
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

/** Ordenados del más reciente al más antiguo, como los devolvería Supabase. */
export function getPublishedPosts() {
  return [...blogPosts].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}
