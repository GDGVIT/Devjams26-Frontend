import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "lenis/dist/lenis.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";

const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GoogleSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GoogleSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/GoogleSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

const googleSansFlex = localFont({
  src: "../public/fonts/GoogleSansFlex.ttf",
  variable: "--font-google-sans-flex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devjams.gdgvit.com"),
  title: "DevJams '26 | Wham Bam, Lets DevJam!",
  description: "DevJams 2026 - Hack Pack, DevJams' Back. Organized by Google Developer Groups On Campus, VIT Vellore.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-128x128.png", sizes: "128x128", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "128x128", type: "image/png" },
    ],
  },
  openGraph: {
    title: "DevJams '26 | Wham Bam, Lets DevJam!",
    description: "DevJams 2026 - Hack Pack, DevJams' Back. Organized by Google Developer Groups On Campus, VIT Vellore.",
    url: "https://devjams.gdgvit.com",
    siteName: "DevJams '26",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 537,
        alt: "DevJams '26 - Google Developer Groups On Campus VIT Vellore",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevJams '26 | Wham Bam, Lets DevJam!",
    description: "DevJams 2026 - Hack Pack, DevJams' Back. Organized by Google Developer Groups On Campus, VIT Vellore.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${googleSansFlex.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-background text-foreground font-sans"
        suppressHydrationWarning
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}

