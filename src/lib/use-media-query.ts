"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query reactiva. Usa `useSyncExternalStore` en vez de un efecto con
 * setState para no provocar renders en cascada y para que el snapshot del
 * servidor sea explícito (siempre `false`, evitando desajustes de hidratación).
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
