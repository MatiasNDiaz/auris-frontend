import {
  BookOpen,
  Briefcase,
  Building2,
  Check,
  GraduationCap,
  HandHeart,
  Leaf,
  Medal,
  MessageCircle,
  Microscope,
  Phone,
  Plus,
  Presentation,
  Quote,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { CountUp } from "./CountUp";
import { LeafSprig } from "./LeafSprig";
import { Reveal } from "./Reveal";
import { CALIDAD_FOTO } from "@/lib/calidad-foto";
import type { FotosProfesional } from "@/lib/fotos-profesional";
import type { Ficha, IconoHito, Professional, Trayectoria } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Ficha extendida de un profesional: las tres secciones que siguen al hero.
 *
 *   1. Formación y trayectoria — línea de tiempo + grilla de fotos.
 *   2. Banner de su enfoque — foto de fondo con overlay de color.
 *   3. Cifras — foto grande + números de su bio, servicios y contacto.
 *
 * Es la misma plantilla para todo el equipo: todo lo que cambia entre una
 * persona y otra viene de su `Ficha`, su `Trayectoria` y sus fotos.
 *
 * Paleta: la ficha entera va en el color de la persona —azul para varones,
 * rosa para mujeres—, igual que el hero. Es la única página del sitio que se
 * sale del verde, beige y marrón.
 */

const iconos: Record<IconoHito, LucideIcon> = {
  formacion: GraduationCap,
  experiencia: UserRound,
  especializacion: Plus,
  tecnologia: Microscope,
  institucion: Building2,
  docencia: Presentation,
  publicacion: BookOpen,
  proyecto: Briefcase,
  certificacion: Medal,
  equipo: Users,
  acompanamiento: HandHeart,
};

/**
 * Curva y duraciones de todos los hovers de la ficha: salen rápido y frenan
 * largo, sin rebote. Es la misma sensación que las tarjetas de la home.
 */
const suave =
  "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/**
 * Clases por género. Van escritas enteras —nada de `bg-${color}-100`— porque
 * Tailwind solo genera las clases que encuentra literales en el código.
 *
 * Banner: en pantallas anchas la foto ocupa el lado derecho y se funde hacia el
 * color sólido de la izquierda, donde va el texto. En el teléfono el texto cae
 * encima de la foto, así que ahí va un overlay parejo y más cargado.
 */
const paletas = {
  male: {
    fondo: "bg-[#f8fafd]",
    fondoRing: "ring-[#f8fafd]",
    fondoCifras: "bg-clinic-50",
    etiqueta: "text-clinic-700",
    acento: "text-clinic-500",
    regla: "bg-clinic-500",
    linea: "bg-clinic-200",
    icono:
      "bg-clinic-100 text-clinic-700 group-hover:bg-clinic-700 group-hover:text-white",
    placeholder: "from-clinic-100 via-clinic-200 to-clinic-50",
    placeholderIcono: "text-clinic-500 ring-clinic-300/60",
    borde: "border-clinic-100",
    cajaFuerte: "bg-clinic-700 text-white",
    numero: "text-clinic-700",
    sufijo: "text-clinic-400",
    bloque: "bg-clinic-200/70",
    firma: "from-clinic-900/80 via-clinic-900/30",
    check: "text-clinic-500",
    separador: "border-clinic-200",
    contacto: "bg-clinic-100 text-clinic-700 ring-clinic-200",
    foco: "focus-visible:ring-clinic-400",
    hoja: "clinic",
    tallo: "var(--color-clinic-400)",
    tituloHover: "group-hover:text-clinic-700",
    bordeHover: "hover:border-clinic-200",
    bannerFondo: "bg-[#0c1b38]",
    overlayMovil: "rgba(12, 27, 56, 0.82)",
    overlayDesktop:
      "linear-gradient(90deg, rgba(12, 27, 56, 1) 0%, rgba(12, 27, 56, 0.97) 18%, rgba(12, 27, 56, 0.72) 42%, rgba(12, 27, 56, 0.38) 70%, rgba(12, 27, 56, 0.18) 100%)",
  },
  female: {
    fondo: "bg-[#fdf8fb]",
    fondoRing: "ring-[#fdf8fb]",
    fondoCifras: "bg-rose-50",
    etiqueta: "text-rose-700",
    acento: "text-rose-500",
    regla: "bg-rose-500",
    linea: "bg-rose-200",
    icono:
      "bg-rose-100 text-rose-700 group-hover:bg-rose-700 group-hover:text-white",
    placeholder: "from-rose-100 via-rose-200 to-rose-50",
    placeholderIcono: "text-rose-500 ring-rose-300/60",
    borde: "border-rose-100",
    cajaFuerte: "bg-rose-700 text-white",
    numero: "text-rose-700",
    sufijo: "text-rose-400",
    bloque: "bg-rose-200/70",
    firma: "from-rose-900/80 via-rose-900/30",
    check: "text-rose-500",
    separador: "border-rose-200",
    contacto: "bg-rose-100 text-rose-700 ring-rose-200",
    foco: "focus-visible:ring-rose-400",
    hoja: "rose",
    tallo: "var(--color-rose-400)",
    tituloHover: "group-hover:text-rose-700",
    bordeHover: "hover:border-rose-200",
    bannerFondo: "bg-[#3e102a]",
    overlayMovil: "rgba(62, 16, 42, 0.82)",
    overlayDesktop:
      "linear-gradient(90deg, rgba(62, 16, 42, 1) 0%, rgba(62, 16, 42, 0.97) 18%, rgba(62, 16, 42, 0.72) 42%, rgba(62, 16, 42, 0.38) 70%, rgba(62, 16, 42, 0.18) 100%)",
  },
} as const;

type Paleta = (typeof paletas)[keyof typeof paletas];

const EN_ACTUALIZACION = "Información en actualización.";

/** "Dra. Carla Fernández" → "CF". Se saltean los títulos con punto. */
function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter((parte) => parte && !parte.endsWith("."))
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * La frase del banner puede ser un tramo suelto de una oración de la bio: se
 * cierra con punto para que se lea como frase, y arranca con mayúscula por si
 * el tramo es el segundo —el de Santiago empieza en "buscando"—. El párrafo
 * que la sigue, igual. Las palabras no se tocan.
 */
const cerrarFrase = (frase: string) =>
  /[.!?…]$/.test(frase) ? frase : `${frase.replace(/[,:;]$/, "")}.`;
const conMayuscula = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

/**
 * Lugar de una foto que todavía no se subió: un bloque del color de la persona
 * con sus iniciales o un ícono, del mismo tamaño que la foto. Se reemplaza solo
 * cuando aparece el archivo (ver
 * `docs/modus-operandi-imagenes-profesionales.md`).
 */
function FotoPendiente({
  p,
  texto,
  grande = false,
}: {
  p: Paleta;
  /** Iniciales; sin ellas va el ícono. */
  texto?: string;
  grande?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex size-full items-center justify-center overflow-hidden bg-linear-to-br",
        p.placeholder,
      )}
    >
      {/* Un brillo arriba a la izquierda, para que el bloque no quede plano. */}
      <span className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_10%,rgba(255,255,255,0.65),transparent_60%)]" />
      {texto ? (
        <span
          className={cn(
            "relative font-serif leading-none font-semibold tracking-tight opacity-70 transition-[scale] duration-1200 group-hover:scale-110",
            suave,
            p.placeholderIcono,
            grande ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl",
          )}
        >
          {texto}
        </span>
      ) : (
        <span
          className={cn(
            "relative inline-flex size-12 items-center justify-center rounded-2xl bg-white/70 ring-1 transition-[rotate,scale] duration-700 group-hover:scale-110 group-hover:rotate-6",
            suave,
            p.placeholderIcono,
          )}
        >
          <Leaf className="size-5" strokeWidth={1.6} />
        </span>
      )}
    </div>
  );
}

type ProfessionalFichaProps = {
  professional: Professional;
  /** Su bio. Sin ella, la ficha sale con la información en actualización. */
  trayectoria?: Trayectoria;
  ficha: Ficha;
  /** Fotos de `public/images/profesionales/<slug>/`, por lugar. */
  fotos: FotosProfesional;
  /** Lado de la foto en la sección de cifras, para variar el ritmo. */
  fotoCifras?: "izquierda" | "derecha";
};

export function ProfessionalFicha({
  professional,
  trayectoria,
  ficha,
  fotos,
  fotoCifras = "izquierda",
}: ProfessionalFichaProps) {
  const p = paletas[professional.gender];
  const siglas = iniciales(professional.name);
  const nombre = professional.name.split(" ").slice(1).join(" ");
  const contactos = trayectoria?.contactos ?? [];
  const frase = cerrarFrase(conMayuscula(ficha.enfoque.frase));

  return (
    <>
      {/* ───────── Formación y trayectoria ───────── */}
      <section
        className={cn("relative overflow-hidden py-20 lg:py-28", p.fondo)}
      >
        <LeafSprig
          palette={p.hoja}
          stem={p.tallo}
          size="md"
          seed={21}
          className="-bottom-1 left-2 h-40 opacity-45"
        />

        <div className="container-auris relative grid gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <p
                className={cn(
                  "text-xs font-semibold tracking-[0.24em] uppercase",
                  p.etiqueta,
                )}
              >
                {ficha.trayectoriaTitulo ?? "Formación y trayectoria"}
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-balance text-ink-900 sm:text-4xl">
                {trayectoria?.titulo ?? professional.specialty}
              </h2>
              <p
                className={cn(
                  "mt-3 max-w-xl text-base leading-relaxed text-pretty",
                  p.acento,
                )}
              >
                {trayectoria?.especialidad ?? EN_ACTUALIZACION}
              </p>
              <span
                aria-hidden
                className={cn("mt-6 block h-1 w-16 rounded-full", p.regla)}
              />
            </Reveal>

            <ol className="relative mt-12">
              {/* La línea corre por detrás de los íconos, de centro a centro. */}
              <span
                aria-hidden
                className={cn("absolute top-6 bottom-6 left-6 w-px", p.linea)}
              />

              {ficha.hitos.map((hito, index) => {
                const Icono = iconos[hito.icono];

                return (
                  <Reveal
                    as="li"
                    key={hito.titulo}
                    delay={index * 0.08}
                    className="group relative flex gap-6 pb-10 last:pb-0"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "relative inline-flex size-12 shrink-0 items-center justify-center rounded-full ring-6 transition-[background-color,color,scale] duration-500 group-hover:scale-110",
                        suave,
                        p.icono,
                        p.fondoRing,
                      )}
                    >
                      <Icono
                        className={cn(
                          "size-5 transition-[rotate] duration-500 group-hover:-rotate-8",
                          suave,
                        )}
                        strokeWidth={1.7}
                      />
                    </span>

                    <div
                      className={cn(
                        "pt-1 transition-[translate] duration-500 group-hover:translate-x-1",
                        suave,
                      )}
                    >
                      {hito.marca && (
                        <p
                          className={cn(
                            "text-xs font-semibold tracking-[0.16em] uppercase",
                            p.acento,
                          )}
                        >
                          {hito.marca}
                        </p>
                      )}
                      <h3
                        className={cn(
                          "mt-1 font-serif text-xl leading-snug text-ink-900 transition-colors duration-500",
                          suave,
                          p.tituloHover,
                        )}
                      >
                        {hito.titulo}
                      </h3>
                      {hito.texto.map((parrafo) => (
                        <p
                          key={parrafo}
                          className="mt-2 text-base leading-relaxed text-pretty text-ink-700/85"
                        >
                          {parrafo}
                        </p>
                      ))}
                      {hito.texto.length === 0 && (
                        <p
                          className={cn(
                            "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                            p.contacto,
                            "ring-1",
                          )}
                        >
                          En actualización
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>

          {/* Mosaico: una grande arriba, dos chicas abajo lado a lado. Más
              alto que ancho —4:5, como un retrato— y con la grande pesando el
              doble que cada chica, para que se note quién manda en el grupo. */}
          <Reveal from="right" className="relative pb-10 sm:pb-12">
            <div className="grid aspect-4/5 grid-rows-[2fr_1fr] gap-3 sm:gap-4">
              <div
                className={cn(
                  "group relative overflow-hidden rounded-3xl shadow-[0_4px_10px_-2px_rgba(43,43,40,0.12),0_18px_40px_-12px_rgba(43,43,40,0.25)] transition-[translate,box-shadow] duration-700 hover:-translate-y-1.5 hover:shadow-[0_8px_16px_-4px_rgba(43,43,40,0.16),0_30px_60px_-14px_rgba(43,43,40,0.35)]",
                  suave,
                )}
              >
                {fotos.grilla[0] ? (
                  <Image
                    src={fotos.grilla[0]}
                    alt={`${professional.name} en AURIS`}
                    fill
                    // Más que el ancho de la celda por la misma razón que el
                    // hero: una foto apaisada se recorta y muestra menos.
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    quality={CALIDAD_FOTO}
                    style={
                      ficha.grillaFoco?.[0]
                        ? { objectPosition: ficha.grillaFoco[0] }
                        : undefined
                    }
                    className={cn(
                      "object-cover transition-transform duration-1200 group-hover:scale-[1.06]",
                      suave,
                    )}
                  />
                ) : (
                  <FotoPendiente p={p} texto={siglas} />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {fotos.grilla.slice(1).map((src, index) => (
                  <div
                    key={index}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl shadow-[0_4px_10px_-2px_rgba(43,43,40,0.12),0_18px_40px_-12px_rgba(43,43,40,0.25)] transition-[translate,box-shadow] duration-700 hover:-translate-y-1.5 hover:shadow-[0_8px_16px_-4px_rgba(43,43,40,0.16),0_30px_60px_-14px_rgba(43,43,40,0.35)]",
                      suave,
                    )}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={`${professional.name}, foto ${index + 2}`}
                        fill
                        sizes="(max-width: 1024px) 70vw, 560px"
                        quality={CALIDAD_FOTO}
                        style={
                          ficha.grillaFoco?.[index + 1]
                            ? { objectPosition: ficha.grillaFoco[index + 1] }
                            : undefined
                        }
                        className={cn(
                          "object-cover transition-transform duration-1200 group-hover:scale-[1.06]",
                          suave,
                        )}
                      />
                    ) : (
                      <FotoPendiente p={p} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {ficha.destacado && (
              <div
                className={cn(
                  "group absolute bottom-0 left-4 max-w-68 rounded-2xl border bg-white p-5 shadow-[0_8px_30px_-8px_rgba(43,43,40,0.3)] transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-10px_rgba(43,43,40,0.4)] sm:left-8",
                  suave,
                  p.borde,
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-[scale] duration-500 group-hover:scale-110",
                      suave,
                      p.cajaFuerte,
                    )}
                  >
                    <Sparkles
                      className={cn(
                        "size-5 transition-[rotate] duration-700 group-hover:rotate-12",
                        suave,
                      )}
                      strokeWidth={1.7}
                    />
                  </span>
                  <div>
                    <p className="font-serif text-base leading-snug text-ink-900">
                      {ficha.destacado.titulo}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-ink-700/75">
                      {ficha.destacado.texto}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ───────── Banner del enfoque ───────── */}
      <section
        className={cn("group relative isolate overflow-hidden", p.bannerFondo)}
      >
        {fotos.banner ? (
          <>
            {/* Foto a la derecha. En pantallas anchas se desvanece por la
                izquierda hacia el color sólido: el difuminado ocupa más de la
                mitad del ancho de la foto, así el empalme con el color no se
                lee como un corte. */}
            <div className="absolute inset-y-0 right-0 -z-20 w-full overflow-hidden lg:w-[62%] lg:mask-[linear-gradient(to_right,transparent_0%,transparent_34%,rgba(0,0,0,0.5)_58%,black_82%)]">
              <Image
                src={fotos.banner}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 62vw"
                quality={CALIDAD_FOTO}
                // El banner es una franja baja y la foto es vertical: de toda
                // la foto se ve una tira finita, así que dónde cae la cara la
                // decide `bannerFoco` (alto) y `bannerCorrimiento` (ancho).
                style={
                  {
                    objectPosition: ficha.bannerFoco ?? "center 40%",
                    "--foco-x": ficha.bannerCorrimiento ?? "14%",
                  } as CSSProperties
                }
                className={cn(
                  "object-cover transition-transform duration-2000 group-hover:scale-105 lg:translate-x-(--foco-x)",
                  suave,
                )}
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 lg:hidden"
              style={{ backgroundColor: p.overlayMovil }}
            />
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 -z-10 hidden w-[62%] lg:block"
              style={{ backgroundImage: p.overlayDesktop }}
            />
          </>
        ) : (
          // Sin foto: el mismo color de fondo, con una luz suave y las
          // iniciales grandes y tenues donde iría la foto.
          <div
            aria-hidden
            className="absolute inset-0 -z-10 overflow-hidden bg-[radial-gradient(60%_90%_at_78%_50%,rgba(255,255,255,0.12),transparent_70%)]"
          >
            <span
              className={cn(
                "absolute top-1/2 right-[8%] hidden -translate-y-1/2 font-serif text-[15rem] leading-none font-semibold tracking-tight text-white/[0.07] transition-[scale] duration-2000 group-hover:scale-105 lg:block",
                suave,
              )}
            >
              {siglas}
            </span>
          </div>
        )}

        <LeafSprig
          palette={p.hoja}
          stem={p.tallo}
          size="md"
          flip
          seed={33}
          className="-bottom-1 right-3 h-36 opacity-30"
        />

        {/* La franja va lo más baja posible: el texto ocupa algo más de la
            mitad del ancho —así la frase entra en menos renglones— y los
            espacios entre bloques son cortos. */}
        <div className="container-auris relative py-10 sm:py-12 lg:py-14">
          <div className="max-w-2xl lg:max-w-[54%]">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.24em] text-white/75 uppercase">
                {ficha.enfoque.etiqueta}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Quote
                aria-hidden
                className={cn(
                  "mt-4 size-7 text-white/45 transition-[color,scale] duration-700 group-hover:scale-110 group-hover:text-white/70",
                  suave,
                )}
                strokeWidth={1.4}
              />
              <blockquote
                className={cn(
                  "mt-2 font-serif leading-[1.15] text-balance text-white",
                  // Las frases largas bajan un escalón para no llenar el banner.
                  frase.length > 95
                    ? "text-[1.55rem] sm:text-[1.8rem] lg:text-[2rem]"
                    : "text-[1.75rem] sm:text-3xl lg:text-[2.35rem]",
                )}
              >
                {frase}
              </blockquote>
            </Reveal>
            <Reveal delay={0.2}>
              <span
                aria-hidden
                className={cn(
                  "mt-5 block h-1 w-16 rounded-full bg-white/60 transition-[width,background-color] duration-700 group-hover:w-28 group-hover:bg-white/85",
                  suave,
                )}
              />
              {ficha.enfoque.texto.map((parrafo) => (
                <p
                  key={parrafo}
                  className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-white/90 sm:text-base"
                >
                  {conMayuscula(parrafo)}
                </p>
              ))}
              {ficha.enActualizacion && (
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/75 sm:text-base">
                  {EN_ACTUALIZACION}
                </p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Cifras ───────── */}
      <section
        className={cn("relative overflow-hidden py-20 lg:py-28", p.fondoCifras)}
      >
        <LeafSprig
          palette={p.hoja}
          stem={p.tallo}
          size="md"
          flip={fotoCifras === "izquierda"}
          seed={44}
          className={cn(
            "-bottom-1 h-40 opacity-45",
            fotoCifras === "izquierda" ? "right-3" : "left-3",
          )}
        />

        <div className="container-auris relative grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal
            from={fotoCifras === "izquierda" ? "left" : "right"}
            className={cn(
              "group relative mx-auto w-full max-w-md lg:max-w-none",
              fotoCifras === "derecha" && "lg:order-2",
            )}
          >
            {/* Bloque desplazado por detrás: le da profundidad a la foto, y al
                pasar el cursor se abre un poco más. */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 translate-y-5 rounded-3xl transition-[translate] duration-700 group-hover:translate-y-7",
                suave,
                p.bloque,
                fotoCifras === "izquierda"
                  ? "-translate-x-5 group-hover:-translate-x-7"
                  : "translate-x-5 group-hover:translate-x-7",
              )}
            />
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-[0_4px_10px_-2px_rgba(43,43,40,0.16),0_22px_45px_-10px_rgba(43,43,40,0.30)]">
              {fotos.cifras ? (
                <Image
                  src={fotos.cifras}
                  alt={`Retrato de ${professional.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  quality={CALIDAD_FOTO}
                  // Va como `transform` y no como `scale` para que se combine
                  // con el `scale` del hover en vez de pisarlo.
                  style={
                    ficha.cifrasZoom
                      ? { transform: `scale(${ficha.cifrasZoom})` }
                      : undefined
                  }
                  className={cn(
                    "object-cover transition-transform duration-1200 group-hover:scale-[1.05]",
                    suave,
                  )}
                />
              ) : (
                <FotoPendiente p={p} texto={siglas} grande />
              )}
              {ficha.cifras?.firma && (
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent px-7 pt-20 pb-7",
                    p.firma,
                  )}
                >
                  <p className="font-serif text-2xl text-white italic">
                    {ficha.cifras.firma}
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p
                className={cn(
                  "text-xs font-semibold tracking-[0.24em] uppercase",
                  p.etiqueta,
                )}
              >
                {ficha.cifras || ficha.enActualizacion
                  ? "Trayectoria en cifras"
                  : "Su práctica en AURIS"}
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-balance text-ink-900 sm:text-4xl">
                {ficha.cifras
                  ? "Experiencia que respalda cada tratamiento"
                  : ficha.enActualizacion
                    ? "Información en actualización"
                    : "Cómo acompaña a cada paciente"}
              </h2>
              <span
                aria-hidden
                className={cn("mt-6 block h-1 w-16 rounded-full", p.regla)}
              />
              {ficha.enActualizacion && (
                <p className="mt-6 max-w-lg text-base leading-relaxed text-pretty text-ink-700/85">
                  Estamos completando la trayectoria de {nombre}. Mientras
                  tanto, podés consultar su disponibilidad con el botón de
                  turnos de más arriba.
                </p>
              )}
            </Reveal>

            {ficha.cifras && (
              <ul
                className={cn(
                  "mt-10 grid gap-4 sm:grid-cols-2",
                  ficha.cifras.items.length === 3 && "xl:grid-cols-3",
                )}
              >
                {ficha.cifras.items.map((cifra, index) => (
                  <Reveal as="li" key={cifra.etiqueta} delay={index * 0.08}>
                    {/* El hover va en un div propio y no en el `li`: el `Reveal`
                      lleva la transición de entrada de `globals.css`, que es
                      más específica y pisaba esta, así que la tarjeta subía
                      y cambiaba de sombra de golpe. */}
                    <div
                      className={cn(
                        "group h-full rounded-3xl border bg-white px-6 py-7 shadow-[0_1px_3px_rgba(43,43,40,0.08)] transition-[translate,box-shadow,border-color] duration-500 will-change-transform hover:-translate-y-1.5 hover:shadow-[0_6px_14px_-4px_rgba(43,43,40,0.12),0_22px_40px_-14px_rgba(43,43,40,0.22)] motion-reduce:hover:translate-y-0",
                        suave,
                        p.borde,
                        p.bordeHover,
                      )}
                    >
                      <p
                        className={cn(
                          "origin-left font-serif text-4xl leading-none font-semibold tabular-nums transition-[scale] duration-500 group-hover:scale-[1.04] sm:text-[2.75rem]",
                          suave,
                          p.numero,
                        )}
                      >
                        {cifra.prefijo && (
                          <span className={p.sufijo}>{cifra.prefijo}</span>
                        )}
                        {cifra.anio ? (
                          cifra.valor
                        ) : (
                          <CountUp to={cifra.valor} delay={index * 0.12} />
                        )}
                        {cifra.sufijo && (
                          <span aria-hidden className={p.sufijo}>
                            {cifra.sufijo}
                          </span>
                        )}
                      </p>
                      <p className="mt-3 text-sm leading-snug text-balance text-ink-700/75">
                        {cifra.etiqueta}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}

            {ficha.servicios && (
              <Reveal className={ficha.cifras ? "mt-12" : "mt-10"}>
                <h3 className="flex items-center gap-3 font-serif text-xl text-ink-900">
                  <span
                    aria-hidden
                    className={cn("h-0.5 w-6 shrink-0 rounded-full", p.regla)}
                  />
                  {ficha.servicios.titulo}
                </h3>

                {ficha.servicios.intro?.map((parrafo) => (
                  <p
                    key={parrafo}
                    className="mt-4 text-base leading-relaxed text-pretty text-ink-700/85"
                  >
                    {parrafo}
                  </p>
                ))}

                {ficha.servicios.grupos.map((grupo, index) => (
                  <div key={grupo.titulo ?? index} className="mt-5">
                    {grupo.titulo && (
                      <p
                        className={cn(
                          "mb-3 text-xs font-semibold tracking-[0.18em] uppercase",
                          p.acento,
                        )}
                      >
                        {grupo.titulo}
                      </p>
                    )}
                    <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {grupo.items.map((item) => (
                        <li
                          key={item}
                          className={cn(
                            "group flex gap-2.5 text-[0.9375rem] leading-snug text-pretty text-ink-700/85 transition-[translate,color] duration-500 hover:translate-x-1 hover:text-ink-900",
                            suave,
                          )}
                        >
                          <Check
                            aria-hidden
                            className={cn(
                              "mt-0.5 size-4 shrink-0 transition-[scale] duration-500 group-hover:scale-125",
                              suave,
                              p.check,
                            )}
                            strokeWidth={2.2}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {ficha.servicios.cierre?.map((parrafo) => (
                  <p
                    key={parrafo}
                    className="mt-5 text-base leading-relaxed text-pretty text-ink-700/85"
                  >
                    {parrafo}
                  </p>
                ))}
              </Reveal>
            )}

            {contactos.length > 0 && (
              <Reveal>
                <ul
                  className={cn(
                    "mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:flex-wrap sm:gap-x-8",
                    p.separador,
                  )}
                >
                  {contactos.map((contacto) => {
                    const Icono =
                      contacto.tipo === "whatsapp" ? MessageCircle : Phone;
                    const externo = contacto.tipo === "whatsapp";

                    return (
                      <li key={contacto.href}>
                        <a
                          href={contacto.href}
                          target={externo ? "_blank" : undefined}
                          rel={externo ? "noopener noreferrer" : undefined}
                          className={cn(
                            "group inline-flex items-center gap-3 rounded-xl text-base text-ink-700/85 focus-visible:ring-2 focus-visible:outline-none",
                            p.foco,
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "inline-flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 transition-[translate] duration-200 group-hover:-translate-y-0.5",
                              p.contacto,
                            )}
                          >
                            <Icono className="size-4.5" strokeWidth={1.7} />
                          </span>
                          <span>
                            {contacto.etiqueta}:{" "}
                            <strong className="font-semibold text-ink-900 tabular-nums">
                              {contacto.numero}
                            </strong>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
