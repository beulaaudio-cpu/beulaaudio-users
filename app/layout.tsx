import type { Metadata, Viewport } from "next";
import { Syne, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

import { LanguageProvider } from "../lib/i18n/LanguageContext";

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "BEULA AUDIO — Professional Event Sound & Production",
  description:
    "Flagship 3D audio setups for weddings, festivals, corporate galas, and live concerts. Featuring VRX line arrays, high-output subwoofers, sharpy beams, and honey comb trusses. 9+ years experience, 1500+ events powered.",
  keywords: [
    "Beula Audio",
    "event sound rental",
    "DJ audio setup",
    "VRX line array",
    "wedding sound system",
    "honeycomb lighting truss",
    "live instrument sound",
    "professional audio production",
  ],
  authors: [{ name: "Beula Audio" }],
  openGraph: {
    title: "BEULA AUDIO",
    description:
      "Engineered for the event. Explore premium DJ, instrument, and custom sound configurations with live date availability.",
    siteName: "Beula Audio",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BEULA AUDIO — Professional Event Sound & Production",
    description: "Sound that shapes the room. 9+ Years of experience, 1500+ events completed.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${cinzel.variable} ${jetbrainsMono.variable} dark antialiased`}
    >
      <body className="bg-[#050508] text-[#f8fafc] min-h-screen relative selection:bg-amber-500/30 selection:text-white">
        <LanguageProvider>
          <div className="film-grain" aria-hidden="true" />
          <div className="stage-vignette" aria-hidden="true" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
