"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/** Nombre único del elemento compartido: la foto del profesional. */
export const PHOTO_VT_NAME = "auris-professional-photo";

/**
 * Tope del fotograma congelado. `startViewTransition` mantiene una captura de
 * la vista anterior pegada sobre la pantalla hasta que resolvemos su promesa,
 * y esa promesa espera a que la ruta destino se comprometa. Si el destino es
 * pesado (la Home), esa espera se ve como la ficha —con su foto gigante—
 * clavada un segundo antes de que arranque el morph.
 *
 * Con este tope cerramos igual pasado el plazo: en producción, con el
 * `prefetch` del origen, el commit real gana la carrera y el morph corre
 * entero; este valor es solo la red de seguridad para que la pantalla no
 * quede congelada más de medio segundo.
 */
const NAV_TIMEOUT_MS = 500;

type StartViewTransition = (
  callback: () => void | Promise<void>,
) => { finished: Promise<void>; ready: Promise<void> };

function getStartViewTransition(): StartViewTransition | null {
  if (typeof document === "undefined") return null;
  const doc = document as Document & {
    startViewTransition?: StartViewTransition;
  };
  return typeof doc.startViewTransition === "function"
    ? doc.startViewTransition.bind(doc)
    : null;
}

/**
 * Marca si hay una View Transition en curso.
 *
 * Lo consume `app/template.tsx`: su animación de entrada aplica un `translateY`
 * al contenedor de la página, y un transform en un ancestro desplaza la
 * geometría que el navegador captura para el elemento compartido.
 */
let viewTransitionActive = false;

export function isViewTransitionActive() {
  return viewTransitionActive;
}

/**
 * Revela de inmediato el scroll-reveal que ya está en pantalla.
 *
 * Se llama justo después de que React commitea la ruta nueva y justo ANTES de
 * resolver la promesa de `startViewTransition`, que es el instante en que el
 * navegador fotografía el estado destino.
 *
 * Sin esto la foto sale en blanco: los `[data-reveal]` de la ruta entrante son
 * nodos nuevos, todavía sin `data-reveal-shown`, y el CSS los tiene en
 * `opacity:0` hasta que dispare el IntersectionObserver — que es asíncrono y
 * corre un frame más tarde, o sea después de la captura.
 *
 * Solo alcanza a lo que entra en el viewport: lo de más abajo conserva su
 * revelado por scroll.
 */
function revealVisibleNow() {
  const height = window.innerHeight;
  document
    .querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-shown])")
    .forEach((el) => {
      const box = el.getBoundingClientRect();
      if (box.bottom > 0 && box.top < height) {
        el.setAttribute("data-reveal-shown", "");
      }
    });
}

type NavigateFn = (href: string, sharedElement?: HTMLElement | null) => void;

type ViewTransitionApi = {
  navigate: NavigateFn;
  /** Ruta desde la que se entró a la ficha actual (para el botón "Volver"). */
  getOrigin: () => string | null;
  /** Slug del profesional en tránsito, para nombrar la card de destino. */
  getActiveSlug: () => string | null;
};

const ViewTransitionContext = createContext<ViewTransitionApi | null>(null);

/**
 * Coordina las View Transitions nativas entre rutas.
 *
 * Va montado en el layout raíz a propósito: la transición se cierra cuando
 * cambia el `pathname`, y ese efecto tiene que vivir en un componente que
 * sobreviva a la navegación. Cuando estaba dentro de la card, la card se
 * desmontaba al navegar, el efecto no volvía a correr y la transición solo
 * cerraba por timeout — que era el delay perceptible antes de que arrancara
 * la animación.
 */
export function ViewTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const pendingRef = useRef<(() => void) | null>(null);
  const markedRef = useRef<HTMLElement | null>(null);
  // Desde dónde se entró a la ficha y a qué profesional, para poder volver
  // al lugar exacto y emparejar la foto en el sentido inverso.
  const originRef = useRef<string | null>(null);
  const originScrollRef = useRef(0);
  const activeSlugRef = useRef<string | null>(null);
  // Si esta navegación es una vuelta al origen: lo consume el efecto de abajo
  // para restaurar el scroll una vez que la ruta nueva ya montó.
  const returningRef = useRef(false);

  // Se dispara cuando la ruta nueva se compromete. Es el cierre de la
  // transición: restaura el scroll, resuelve la promesa de
  // `startViewTransition` (lo que dispara la captura del estado nuevo) y
  // libera el `view-transition-name`.
  useEffect(() => {
    // Al volver, el scroll se restaura ACÁ y antes de resolver: el navegador
    // captura el estado nuevo justo después, así el morph inverso aterriza
    // sobre la card en su posición real. Si la red de seguridad por timeout
    // cerró la transición antes de que la ruta montara, este es el único
    // lugar donde el scroll llega a destino.
    if (returningRef.current) {
      window.scrollTo({ top: originScrollRef.current, behavior: "instant" });
      returningRef.current = false;
    }

    // Después de restaurar el scroll —así se mide contra el viewport final— y
    // antes de resolver, que es cuando el navegador saca la foto del destino.
    revealVisibleNow();

    pendingRef.current?.();
    pendingRef.current = null;

    // Se libera el nombre para que no queden dos elementos con el mismo
    // `view-transition-name` en la próxima transición.
    if (markedRef.current) {
      markedRef.current.style.viewTransitionName = "";
      markedRef.current = null;
    }

    // La bandera se apaga acá y solo acá. Si el timeout cerró la transición
    // mientras la Home todavía se renderizaba, `template.tsx` tiene que seguir
    // viendo `true` al montar para NO encimar su animación de entrada sobre lo
    // que acaba de pasar (era el "efecto raro" al volver).
    viewTransitionActive = false;
    document.documentElement.classList.remove("vt-active");
  }, [pathname]);

  const navigate = useCallback<NavigateFn>(
    (href, sharedElement) => {
      const start = getStartViewTransition();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!start || reduce) {
        router.push(href);
        return;
      }

      const returning = !!originRef.current && href === originRef.current;
      returningRef.current = returning;
      const toProfessional = href.match(/^\/profesionales\/([^/?#]+)/);
      if (toProfessional) {
        // Guardamos el origen solo al entrar a una ficha; al volver se conserva
        // para que un segundo "Volver" siga apuntando bien.
        originRef.current =
          window.location.pathname + window.location.search + window.location.hash;
        // También el scroll: al volver hay que caer en el mismo punto, o el
        // morph inverso aterrizaría sobre una card fuera de pantalla.
        originScrollRef.current = window.scrollY;
        activeSlugRef.current = toProfessional[1];
        // Adelantamos la carga del origen: al volver, el RSC ya está resuelto y
        // la transición no se queda esperando (congelada) a que llegue. En dev
        // el prefetch es no-op; el efecto se nota en producción.
        router.prefetch(originRef.current);
        router.prefetch("/profesionales");
      }

      // Solo un elemento puede llevar un `view-transition-name` dado en el
      // momento de la captura. Al volver de una ficha, la card de origen queda
      // marcada de forma declarativa; si después se clickea otra card habría
      // dos con el mismo nombre y el navegador aborta la transición entera
      // ("Unexpected duplicate view-transition-name"). Se limpia siempre.
      document
        .querySelectorAll<HTMLElement>(`[style*="${PHOTO_VT_NAME}"]`)
        .forEach((el) => {
          if (el !== sharedElement) el.style.viewTransitionName = "";
        });

      if (sharedElement) {
        sharedElement.style.viewTransitionName = PHOTO_VT_NAME;
        markedRef.current = sharedElement;
      }

      viewTransitionActive = true;
      // Mientras dura la transición el scroll tiene que ser instantáneo: el
      // sitio usa `scroll-behavior: smooth` y, sin esto, el scroll-to-top de
      // Next se convierte en una animación de ~700ms que corre por fuera del
      // morph y se ve como un salto.
      document.documentElement.classList.add("vt-active");

      const transition = start(
        () =>
          new Promise<void>((resolve) => {
            let done = false;
            const finish = () => {
              if (done) return;
              done = true;
              resolve();
            };
            pendingRef.current = finish;
            setTimeout(finish, NAV_TIMEOUT_MS);
            // El scroll (tanto la vuelta al origen como el reset al top) lo
            // resuelve el efecto de `pathname`, ya con la ruta nueva montada.
            // La clase `vt-active` lo vuelve instantáneo, dentro del fotograma
            // congelado.
            router.push(href, { scroll: !returning });
          }),
      );

      transition.finished
        .catch(() => {})
        .finally(() => {
          // `viewTransitionActive` la apaga el efecto de `pathname`: esta
          // transición puede haber terminado (por timeout) mientras la ruta
          // nueva todavía se renderizaba, y hasta que monte hay que seguir
          // marcando que la navegación fue con transición. Acá solo bajamos la
          // clase visual, como respaldo.
          document.documentElement.classList.remove("vt-active");
        });
    },
    [router],
  );

  const api = useMemo<ViewTransitionApi>(
    () => ({
      navigate,
      getOrigin: () => originRef.current,
      getActiveSlug: () => activeSlugRef.current,
    }),
    [navigate],
  );

  return (
    <ViewTransitionContext.Provider value={api}>
      {children}
    </ViewTransitionContext.Provider>
  );
}

/** Navegación con morph del elemento compartido. */
export function useViewTransitionRouter(): NavigateFn {
  const api = useContext(ViewTransitionContext);
  const router = useRouter();

  // Fallback si alguien usa el hook fuera del provider.
  return api?.navigate ?? ((href) => router.push(href));
}

/** Ruta desde la que se entró a la ficha actual. */
export function useProfessionalOrigin(): string | null {
  return useContext(ViewTransitionContext)?.getOrigin() ?? null;
}

/**
 * Slug del profesional en tránsito.
 *
 * Lo consumen las cards de los listados: la que coincide se marca con el
 * `view-transition-name` al montar, de modo que al volver desde la ficha el
 * navegador tenga con qué emparejar la foto y el morph corra en reversa.
 */
export function useActiveProfessionalSlug(): string | null {
  return useContext(ViewTransitionContext)?.getActiveSlug() ?? null;
}
