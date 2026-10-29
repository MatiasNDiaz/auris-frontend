import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Las fotos no pasan por ningún optimizador: ya vienen listas del
     * pipeline, en los anchos de la escalera, y `src/lib/image-loader.ts` se
     * limita a elegir cuál corresponde. En producción eso significa que Vercel
     * sirve archivos estáticos desde el CDN en vez de convertir cada foto la
     * primera vez que alguien la pide.
     */
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    /**
     * Las dos calidades con las que el pipeline deja las variantes: 82 para
     * fotos de personas y 88 para banners, portadas e instalaciones. Hay que
     * declarar acá cada valor que se use, o Next 16 rechaza el pedido.
     *
     * Con el loader propio estos números ya no deciden nada para las fotos del
     * sitio —la compresión viene hecha del archivo—, pero siguen valiendo para
     * las remotas, que son las únicas que pasan por el optimizador.
     */
    qualities: [82, 88],
    /**
     * Solo WebP. AVIF comprime mejor, pero el loader devuelve una única URL y
     * no ve la cabecera `Accept`: un Safari viejo —iOS 16.0 a 16.3— recibiría
     * un archivo que no sabe abrir y vería la imagen rota. WebP lo entiende
     * todo lo que está en la calle desde 2020.
     */
    formats: ["image/webp"],
    /**
     * La escalera de anchos, y es la misma lista que genera
     * `optimize-images.mjs`. `next/image` arma el `srcset` con
     * `imageSizes` + `deviceSizes`, así que recortarla acá es lo que hace que
     * el `srcset` apunte solo a variantes que existen de verdad.
     *
     * Eran las quince por defecto. Con un `sizes` sin unidades `vw` —y hay
     * cinco así— Next las usa todas, y eso multiplicaba por quince los
     * archivos a pregenerar y, antes, las conversiones a pagarle a Vercel.
     *
     * `imageSizes` tiene que quedar entero por debajo del primer `deviceSizes`.
     */
    imageSizes: [128, 384],
    deviceSizes: [640, 1080, 1920],
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
