import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollMotion } from "@/components/ScrollMotion";
import { ScrollStage } from "@/components/ScrollStage";
import { contentRepo } from "@/lib/content";
import { site as defaultSite } from "@/content/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await contentRepo.getSiteData();
  const { seo } = await contentRepo.getPageTexts();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${seo.titleSuffix}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      title: site.name,
      description: site.description,
      locale: "es_AR",
      type: "website",
      siteName: site.name,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}: ${seo.titleSuffix}` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await contentRepo.getSiteData();
  const facebookUrl = site.facebook || defaultSite.facebook;
  const sameAs = [site.instagram, facebookUrl, site.github].filter(Boolean);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo-dark.png`,
    description: site.description,
    email: site.email,
    telephone: site.whatsapp ? `+${site.whatsapp}` : undefined,
    sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tucumán",
      addressRegion: "Tucumán",
      addressCountry: "AR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.whatsapp ? `+${site.whatsapp}` : undefined,
      contactType: "customer service",
      availableLanguage: ["es"],
    },
  };

  return (
    // suppressHydrationWarning: el script de abajo agrega una clase al <html> antes de que cargue React
    <html lang="es" className={`${jakarta.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Oculta lo animable antes del primer pintado para que no parpadee al cargar.
            Solo en la compu (mouse): en el celular los bloques quedan quietos, sin animación */}
        <script
          dangerouslySetInnerHTML={{
            __html: 'if(matchMedia("(hover: hover) and (pointer: fine)").matches)document.documentElement.classList.add("reveal-on")',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen font-sans">
        {children}
        <ScrollStage />
        <ScrollMotion />
      </body>
    </html>
  );
}
