import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next vuelve a comprimir cada foto al servirla, y por defecto lo hace al
     * 75. Para los retratos del equipo eso se notaba en la piel y el pelo, así
     * que las fichas piden 92 (`quality={CALIDAD_FOTO}`). Hay que declarar acá
     * cada valor que se use: Next 16 rechaza los que no estén en esta lista.
     */
    qualities: [75, 92],
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
