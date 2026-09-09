"use client";

import { useEffect, useRef } from "react";
import {
  BLADE,
  MIDRIB,
  VEINS_BOTTOM,
  VEINS_TOP,
  leafPalettes,
  type LeafPalette,
} from "./leaf-art";
import { cn } from "@/lib/utils";

/**
 * Ráfaga de hojas cruzando la sección de izquierda a derecha.
 *
 * Es la misma hoja del isotipo que usa `LeafScatter` —se arma con las mismas
 * constantes de trazado—, pero dibujada en un `<canvas>` en vez de en el DOM.
 * El motivo es la cantidad: `LeafScatter` anima cinco hojas en bucle lento y
 * ahí un SVG por hoja no molesta; acá son más de cuarenta a la vez, cada una
 * con su giro, y justo en el momento en que la sección se engancha al scroll.
 * Cuarenta SVGs con degradé y venas animándose a la vez es exactamente lo que
 * traba esa transición, que es la parte que más rápido arruina el efecto.
 *
 * La hoja se rasteriza una sola vez en dos `Image` —verde y beige— y después
 * cada cuadro son cuarenta `drawImage` con rotación: trabajo constante, sin
 * recalcular estilos ni tocar el layout.
 */

/** Cuántas hojas trae la ráfaga. */
const HOJAS = 46;
/** Cuánto dura, en segundos, desde la primera hoja hasta que se va la última. */
const DURACION = 2.6;

type Hoja = {
  /** Cuándo entra, en segundos desde el disparo. */
  demora: number;
  /** Cuánto tarda en cruzar. */
  vuelo: number;
  /** Altura de partida, en fracción del alto del lienzo. */
  y: number;
  /** Amplitud y fase del vaivén vertical. */
  amplitud: number;
  fase: number;
  /** Largo de la hoja en px. */
  largo: number;
  giro: number;
  /** Vueltas por segundo. */
  vueltas: number;
  opacidad: number;
  beige: boolean;
};

/**
 * Rearma el dibujo de la hoja como SVG suelto para poder rasterizarlo.
 *
 * Usa las mismas constantes que `LeafShape`, así que si se corrige un trazo se
 * corrige en los dos lados. Los colores llegan ya resueltos: dentro de un
 * `data:` URI las variables CSS del documento no existen.
 */
function svgDeHoja(c: Record<string, string>) {
  const venas = [...VEINS_TOP, ...VEINS_BOTTOM]
    .map((d) => `<path d="${d}"/>`)
    .join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 56" width="240" height="112">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="${c.edge}"/>` +
    `<stop offset="42%" stop-color="${c.core}"/>` +
    `<stop offset="58%" stop-color="${c.core}"/>` +
    `<stop offset="100%" stop-color="${c.body}"/>` +
    `</linearGradient></defs>` +
    `<path d="M0 28C2 28 4 28 7 28" stroke="${c.vein}" stroke-width="2" stroke-linecap="round" opacity="0.7" fill="none"/>` +
    `<path d="${BLADE}" fill="url(#g)"/>` +
    `<path d="${MIDRIB}" stroke="${c.vein}" stroke-width="1.6" stroke-linecap="round" opacity="0.55" fill="none"/>` +
    `<g stroke="${c.vein}" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.38">${venas}</g>` +
    `</svg>`
  );
}

/** Resuelve la paleta —que son variables CSS— a colores concretos. */
function coloresDe(paleta: LeafPalette) {
  const raiz = getComputedStyle(document.documentElement);
  const leer = (valor: string) => {
    const nombre = valor.match(/var\((--[^)]+)\)/)?.[1];
    return nombre ? raiz.getPropertyValue(nombre).trim() : valor;
  };
  const p = leafPalettes[paleta];
  return { edge: leer(p.edge), body: leer(p.body), core: leer(p.core), vein: leer(p.vein) };
}

function cargarSprite(paleta: LeafPalette) {
  const img = new Image();
  img.src =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svgDeHoja(coloresDe(paleta)));
  return img;
}

/** Ruido barato y repetible; alcanza para repartir la bandada. */
function azar(semilla: number) {
  const x = Math.sin(semilla * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function bandada(): Hoja[] {
  return Array.from({ length: HOJAS }, (_, i) => {
    const a = (n: number) => azar(i * 7 + n);
    return {
      // Las primeras salen casi juntas y la cola se estira: así entra como
      // golpe de viento y no como desfile parejo.
      demora: a(1) ** 1.6 * 0.85,
      vuelo: 0.95 + a(2) * 0.85,
      y: a(3),
      amplitud: 12 + a(4) * 46,
      fase: a(5) * Math.PI * 2,
      largo: 26 + a(6) ** 1.7 * 74,
      giro: a(7) * Math.PI * 2,
      vueltas: (a(8) - 0.5) * 2.4,
      opacidad: 0.3 + a(9) * 0.4,
      beige: a(10) > 0.62,
    };
  });
}

type LeafGustProps = {
  /**
   * Cada cambio de valor lanza una ráfaga. Es un contador y no un booleano
   * para poder repetirla sin tener que apagarla antes.
   */
  trigger: number;
  className?: string;
};

export function LeafGust({ trigger, className }: LeafGustProps) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const sprites = useRef<HTMLImageElement[] | null>(null);

  useEffect(() => {
    if (trigger <= 0) return;

    const canvas = lienzo.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sprites.current ??= [cargarSprite("green"), cargarSprite("beige")];
    const [verde, beige] = sprites.current;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    ctx.scale(dpr, dpr);

    const hojas = bandada();
    const arranque = performance.now();
    let cuadro = 0;

    const dibujar = (ahora: number) => {
      const t = (ahora - arranque) / 1000;
      ctx.clearRect(0, 0, ancho, alto);

      for (const hoja of hojas) {
        const avance = (t - hoja.demora) / hoja.vuelo;
        if (avance <= 0 || avance >= 1) continue;

        const sprite = hoja.beige ? beige : verde;
        if (!sprite.complete) continue;

        // De fuera del borde izquierdo a fuera del derecho.
        const x = (-0.15 + avance * 1.3) * ancho;
        const y = hoja.y * alto + Math.sin(hoja.fase + avance * 5.5) * hoja.amplitud;
        // Aparece y se desvanece en las puntas del recorrido.
        const alfa = Math.min(1, avance * 6, (1 - avance) * 4) * hoja.opacidad;
        const escala = hoja.largo / 120;

        ctx.save();
        ctx.globalAlpha = alfa;
        ctx.translate(x, y);
        ctx.rotate(hoja.giro + avance * hoja.vueltas * Math.PI * 2);
        ctx.scale(escala, escala);
        ctx.drawImage(sprite, -60, -28, 120, 56);
        ctx.restore();
      }

      if (t < DURACION) {
        cuadro = requestAnimationFrame(dibujar);
      } else {
        ctx.clearRect(0, 0, ancho, alto);
      }
    };

    cuadro = requestAnimationFrame(dibujar);
    return () => {
      cancelAnimationFrame(cuadro);
      ctx.clearRect(0, 0, ancho, alto);
    };
  }, [trigger]);

  return (
    <canvas
      ref={lienzo}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full select-none",
        className,
      )}
    />
  );
}
