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
};

export default nextConfig;
