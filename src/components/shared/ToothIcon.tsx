import type { LucideProps } from "lucide-react";

/**
 * Muela, en el lenguaje de lucide: trazo de 24×24, sin relleno, con las puntas
 * y las uniones redondeadas. Lucide no trae un ícono de diente, así que este
 * dibuja la corona y las dos raíces con un solo trazo cerrado.
 *
 * Recibe `LucideProps` para poder usarse desde `renderServiceIcon` igual que
 * los demás íconos de servicio.
 */
export function ToothIcon({
  size = 24,
  strokeWidth = 2,
  ...props
}: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Corona ancha arriba, dos raíces que bajan y afinan. El vértice del
          centro es el punto donde se separan las raíces. */}
      <path d="M12 3.2c-1.9 0-2.7-.9-4.4-.9C5.1 2.3 3.4 4.4 3.4 7.6c0 2 .4 3.5.9 5.2.5 1.7.8 3.3 1 4.9.2 1.7.5 3 1.5 3 1 0 1.3-1.3 1.6-3 .3-1.7.5-3.2.8-4.3.3-1.1.7-1.7 1.4-1.7s1.1.6 1.4 1.7c.3 1.1.5 2.6.8 4.3.3 1.7.6 3 1.6 3 1 0 1.3-1.3 1.5-3 .2-1.6.5-3.2 1-4.9.5-1.7.9-3.2.9-5.2 0-3.2-1.7-5.3-4.2-5.3-1.7 0-2.5.9-4.4.9Z" />
    </svg>
  );
}
