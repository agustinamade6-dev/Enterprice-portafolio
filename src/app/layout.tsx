import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollStage } from "@/components/ScrollStage";
import { contentRepo } from "@/lib/content";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: el script de abajo agrega una clase al <html> antes de que cargue React
    <html lang="es" className={`${jakarta.variable} antialiased`} suppressHydrationWarning>
      <head>
      </head>
      <body className="min-h-screen font-sans">
        {children}
        <ScrollStage />
      </body>
    </html>
  );
}
