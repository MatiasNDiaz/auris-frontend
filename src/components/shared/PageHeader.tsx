import Image from "next/image";
import { LeafScatter } from "./LeafScatter";
import { LeafSprig } from "./LeafSprig";
import { WaveDivider, type WaveVariant } from "./WaveDivider";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Superficie del bloque, para sostener el ritmo de fondos de la página. */
  surface?: "sage" | "sand" | "base";
  /** Curva del borde inferior; cada página usa una distinta. */
  wave?: WaveVariant;
  /** Color de la curva: tiene que ser el fondo de lo que sigue abajo. */
  waveTone?: "sage" | "sand" | "base";
  /**
   * Foto de fondo, de `bannerDeSeccion()`. Con foto el encabezado cambia de
   * registro: el texto se invierte a claro sobre un velo oscuro y la curva
   * gana su franja, porque contra una foto una sola línea se pierde.
   */
  foto?: string;
  /**
   * Qué parte de la foto se conserva al recortarla, como `object-position`.
   * El encabezado es una franja muy apaisada, así que de una foto normal se
   * ve poco más que el centro: acá se corrige cuando lo que importa está
   * más arriba o más abajo. Por defecto, el centro.
   */
  fotoFoco?: string;
  /** Texto alternativo de la foto. Vacío si es decorativa. */
  fotoAlt?: string;
  /**
   * Da al encabezado con foto un 21% más de alto que el resto.
   *
   * De una foto entra la parte que la franja deja ver, y eso depende de lo
   * alta que sea. La del equipo va de techo a piso: con la altura común
   * entraba la gente y nada más, sin el logo de la pared. Con esta entra todo,
   * y eso que a la foto ya se le sacan antes el techo y parte del piso (ver
   * `ENCUADRE` en `optimize-images.mjs`).
   *
   * El alto de más se compensa subiendo la curva sobre un lienzo más grande,
   * así monta sobre el piso y deja ver la sección que sigue.
   */
  masAlto?: boolean;
};

const surfaces = {
  sage: "bg-surface-sage",
  sand: "bg-surface-sand",
  base: "bg-surface-base",
} as const;

/** La curva se pinta con `currentColor`, de ahí que el tono vaya en `text-`. */
const waveTones = {
  sage: "text-surface-sage",
  sand: "text-surface-sand",
  base: "text-surface-base",
} as const;

/**
 * Franja y filete que acompañan a la curva sobre una foto.
 *
 * La franja va en el marrón claro del logo —más cargado que el arena de las
 * superficies, que contra una foto quedaba casi blanco— y el filete, en el
 * verde institucional de la hoja. No dependen del color de la sección que
 * sigue: ninguno de los dos coincide con las tres superficies, así que
 * siempre se distinguen.
 */
const FRANJA = "text-warm-200";
const FILETE = "text-primary-600";

/**
 * Encabezado de las páginas internas. Reusa `SectionHeading` para que el
 * lenguaje visual del título sea exactamente el mismo en toda la navegación,
 * cambiando solo el nivel semántico a `h1`.
 *
 * Con `foto` el fondo plano se reemplaza por una imagen a sangre. La curva de
 * abajo no cambia: se sigue dibujando encima y con el color de la sección que
 * sigue, así que es ella la que le recorta el borde inferior a la foto y la
 * deja con la forma de la onda.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  surface = "sage",
  wave = "gentle",
  waveTone = "base",
  foto,
  fotoFoco,
  fotoAlt = "",
  masAlto = false,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative isolate overflow-hidden",
        // Con foto el fondo es un plano oscuro: si la imagen tarda o falla, el
        // texto claro sigue siendo legible en vez de quedar sobre el verde.
        //
        // Y va más alto que el encabezado de color. La franja es mucho más
        // apaisada que una foto, así que de la foto entra poco más que una
        // tira del medio: cada píxel de alto que gana la franja es foto que
        // se deja de recortar. Sin foto ese alto sería aire vacío.
        //
        // El `min-h` es lo que hace que las cinco midan igual. Con solo
        // padding el alto lo terminaba de decidir el texto, así que la página
        // de título largo y bajada de tres líneas quedaba bastante más alta
        // que las otras. Es el alto de la más alta, y el `justify-center`
        // reparte el sobrante arriba y abajo en las que tienen menos texto.
        foto
          ? cn(
              // El texto no va centrado sino apoyado arriba, a una distancia
              // fija de la navbar. Centrado se movía con el alto del bloque, y
              // como no todos los banners miden igual, el título saltaba de
              // altura al pasar de una sección a otra.
              "flex flex-col justify-start bg-ink-900 pt-24 pb-36 lg:pt-48 lg:pb-56",
              // El alto crece con el ancho de la pantalla, y no es fijo, porque
              // la foto se escala con el ancho: con un alto fijo, cuanto más
              // grande el monitor más se recortaba la imagen —en una pantalla
              // de 15" el equipo quedaba sin techo ni logo—. En `vw` el
              // encuadre se mantiene igual en todas. Los topes evitan que en un
              // monitor muy ancho el banner se coma la pantalla entera.
              masAlto
                ? "lg:min-h-[clamp(52rem,49vw,64rem)]"
                : "lg:min-h-[clamp(43rem,40.6vw,54rem)]",
            )
          : cn(surfaces[surface], "pt-20 pb-28 lg:pt-28 lg:pb-40"),
      )}
    >
      {foto ? (
        <>
          <Image
            src={foto}
            alt={fotoAlt}
            fill
            /*
             * Declara el ancho al que se dibuja la foto, no el de la pantalla.
             *
             * Los banners van de 1.49 a 2.62 de proporción y la caja es siempre
             * más vertical que eso, así que con `object-cover` manda el alto:
             * en un teléfono la foto se dibuja entre 715 y 1258px de ancho, y
             * en escritorio el banner más apaisado llega a 1800. Con `100vw` se
             * bajaba una variante de 828px y se estiraba al doble.
             */
            sizes="(min-width: 1024px) 1800px, 1260px"
            quality={88}
            priority
            style={fotoFoco ? { objectPosition: fotoFoco } : undefined}
            className="-z-20 object-cover"
          />

          {/* Velo en negro y no en verde: el tinte de color ensuciaba la piel
              y los blancos del centro. Van dos capas —una pareja, que sostiene
              el texto centrado, y una que carga los bordes de arriba y abajo—
              para que la foto se siga leyendo en el medio. */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-black/35" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-t from-black/35 via-transparent to-black/25"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-28 -right-20 size-96 rounded-full bg-primary-200/35 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-warm-200/40 blur-3xl"
          />
          <LeafScatter pattern="b" />
          <LeafSprig
            palette="green"
            size="md"
            flip
            seed={9}
            className="bottom-0 right-4 h-48 opacity-55"
          />
        </>
      )}

      <div className="container-auris relative">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
          tone={foto ? "light" : "dark"}
        />
      </div>

      {/* En el banner alto la curva va sobre un lienzo más grande, que la sube
          dentro de la sección hasta rozar los pies del equipo. Las tiras se
          miden en unidades de ese lienzo, así que ahí van proporcionalmente
          más chicas para seguir viéndose del mismo grosor. */}
      <WaveDivider
        variant={wave}
        className={waveTones[waveTone]}
        underlineClassName={foto ? FRANJA : undefined}
        underlineWidth={masAlto ? 18 : undefined}
        lineaClassName={foto ? FILETE : undefined}
        lineaWidth={masAlto ? 6 : undefined}
        alto={foto ? (masAlto ? "extra" : "alta") : "normal"}
      />
    </header>
  );
}
