import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next vuelve a comprimir cada foto al servirla, y por defecto lo hace al
     * 75. Para los retratos del equipo eso se notaba en la piel y el pelo, así
     * que las fichas piden 92 (`quality={CALIDAD_FOTO}`). Hay que declarar acá
     * cada valor que se use: Next 16 rechaza los que no estén en esta lista.
     */
    qualities: [75, 88, 92],
    /**
     * AVIF primero y WebP de respaldo. Sobre estas fotos —piel, pelo, paredes
     * lisas— AVIF pesa entre un 20% y un 30% menos que WebP a igual calidad
     * percibida, y el navegador que no lo soporta recibe WebP sin más. El
     * costo es que la primera conversión de cada tamaño tarda más; en Vercel
     * queda cacheada y solo la paga la primera visita.
     */
    formats: ["image/avif", "image/webp"],
    /**
     * Las fotos llevan la fecha del archivo en la ruta (ver `rewrites`), así
     * que una imagen nueva es una dirección nueva y nunca hace falta invalidar
     * la caché: se puede guardar por mucho tiempo sin riesgo de servir la
     * anterior. Un año, que es el máximo razonable para contenido inmutable.
     */
    minimumCacheTTL: 31_536_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  /**
   * Las fotos del equipo se piden como `/imagenes/v/<fecha>/...` y se sirven
   * desde `public/images/...`. Ese número en el medio es la fecha del archivo:
   * cambia sola cuando se reemplaza una foto, así que la dirección pasa a ser
   * otra y nadie —ni el navegador ni la caché de Next— sigue mostrando la
   * anterior. Va en la ruta y no como `?v=`, que `next/image` no acepta en
   * imágenes locales.
   */
  async rewrites() {
    return [
      {
        source: "/imagenes/v/:version/:ruta*",
        destination: "/images/:ruta*",
      },
    ];
  },
};

export default nextConfig;
