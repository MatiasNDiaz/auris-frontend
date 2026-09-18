"use client";

import { useReducedMotion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type VideoEnBucleProps = {
  src: string;
  poster: string;
  /** Qué se ve en el video, para quien no puede verlo. */
  descripcion: string;
  /** Frase sobre el borde de abajo, en un degradé. Sin esto no se dibuja. */
  pie?: string;
  className?: string;
};

/**
 * Video que se repite solo, sin sonido, con los dos únicos controles que
 * hacen falta: encender el audio y pausar.
 *
 * Arranca mudo a propósito y no solo por cortesía: un video con sonido no
 * puede autorreproducirse —los navegadores lo bloquean— y quedaría detenido
 * en el póster. Mudo arranca en todos, y quien quiera escucharlo lo enciende.
 *
 * Con `prefers-reduced-motion` no arranca solo: queda en el póster con el
 * botón de reproducir, como el resto de las animaciones del sitio.
 */
export function VideoEnBucle({
  src,
  poster,
  descripcion,
  pie,
  className,
}: VideoEnBucleProps) {
  const video = useRef<HTMLVideoElement>(null);
  const menosMovimiento = useReducedMotion() ?? false;
  const [sonido, setSonido] = useState(false);
  const [pausado, setPausado] = useState(menosMovimiento);

  // `muted` se maneja como propiedad y no como atributo: React no lo
  // actualiza después del primer render, y el video se quedaría mudo para
  // siempre por más que el botón cambie de estado.
  useEffect(() => {
    if (video.current) video.current.muted = !sonido;
  }, [sonido]);

  const alternarPausa = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPausado(false);
    } else {
      v.pause();
      setPausado(true);
    }
  };

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <video
        ref={video}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        autoPlay={!menosMovimiento}
        preload="metadata"
        aria-label={descripcion}
        onPlay={() => setPausado(false)}
        onPause={() => setPausado(true)}
        className="size-full object-cover"
      />

      {/* Botón de reproducir, solo cuando está detenido. Ocupa todo el cuadro
          para que se pueda pausar tocando en cualquier lado. */}
      <button
        type="button"
        onClick={alternarPausa}
        aria-label={pausado ? "Reproducir el video" : "Pausar el video"}
        className="absolute inset-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
      >
        <span
          aria-hidden
          className={cn(
            "inline-flex size-18 items-center justify-center rounded-full bg-cream-50/95 text-primary-700 shadow-lg transition-all duration-300",
            pausado
              ? "scale-100 opacity-100"
              : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100",
          )}
        >
          {pausado ? (
            <Play className="ml-1 size-7 fill-current" strokeWidth={0} />
          ) : (
            <Pause className="size-7 fill-current" strokeWidth={0} />
          )}
        </span>
      </button>

      {/* La frase va por encima del botón que ocupa todo el cuadro, así que no
          puede recibir clics: si no, tocar sobre ella no pausaría el video.
          El hueco de la derecha es para que no choque con el botón de sonido. */}
      {pie && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-primary-900/85 via-primary-900/35 to-transparent px-7 pt-20 pr-20 pb-7"
        >
          <p className="font-serif text-xl leading-snug text-balance text-cream-50 italic">
            {pie}
          </p>
        </div>
      )}

      {/* Sonido: va aparte del botón de pausa —y por encima— para que se pueda
          encender sin detener el video. */}
      <button
        type="button"
        onClick={() => setSonido((antes) => !antes)}
        aria-pressed={sonido}
        aria-label={sonido ? "Silenciar el video" : "Activar el sonido"}
        className="absolute right-4 bottom-4 inline-flex size-11 items-center justify-center rounded-full bg-ink-900/55 text-cream-50 backdrop-blur-sm transition-colors duration-300 hover:bg-ink-900/75 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
      >
        {sonido ? (
          <Volume2 className="size-5" strokeWidth={1.8} aria-hidden />
        ) : (
          <VolumeX className="size-5" strokeWidth={1.8} aria-hidden />
        )}
      </button>
    </div>
  );
}
