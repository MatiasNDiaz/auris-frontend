import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ViewTransitionProvider } from "@/components/providers/ViewTransitionProvider";
import { RevealScript } from "@/components/shared/RevealScript";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "centro de salud",
    "bienestar integral",
    "psicología",
    "odontología",
    "kinesiología",
    "fonoaudiología",
    siteConfig.address.city,
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
      // `RevealScript` agrega la clase `js-reveal` a este mismo nodo antes de
      // que React hidrate, así que el `className` del servidor y el del cliente
      // no coinciden. Es el patrón estándar para scripts que corren antes de la
      // hidratación —el mismo que usan los switches de tema— y solo silencia
      // este nodo, no el árbol.
      suppressHydrationWarning
    >
      <head>
        {/* Antes del primer pintado: activa el scroll-reveal y lo dispara sin
            esperar a que se hidrate React. Ver `RevealScript`. */}
        <RevealScript />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-primary-600 focus:px-5 focus:py-2.5 focus:text-cream-50"
        >
          Saltar al contenido
        </a>

        {/* Coordina las View Transitions. Va acá, en el layout raíz, porque
            tiene que sobrevivir a los cambios de ruta. */}
        <ViewTransitionProvider>
          <Navbar />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
          {/* Flotante, en todas las páginas. */}
          <ScrollToTop />
        </ViewTransitionProvider>
      </body>
    </html>
  );
}
