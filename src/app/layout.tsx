import type { Metadata } from "next";
import localFont from "next/font/local";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";

const stackSansNotch = localFont({
  src: [
    {
      path: "../../public/fonts/HostGrotesk/HostGrotesk-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-stack-sans-notch",
  preload: false,
});


/* ------------------------------------------------------------
   Local Variable Fonts (Host Grotesk)
   ------------------------------------------------------------ */

const hostGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/HostGrotesk/HostGrotesk-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/HostGrotesk/HostGrotesk-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-host-grotesk",
  preload: false,
});

const ballegaLogo = localFont({
  src: [
    {
      path: "../../public/fonts/Ballega/ballega.otf",
      style: "normal",
    },
  ],
  variable: "--font-logo",
  preload: false,
});

const ballegaLogoOutline = localFont({
  src: [
    {
      path: "../../public/fonts/Ballega/ballega.otf",
      style: "normal",
    },
  ],
  variable: "--font-logo-outline",
  preload: false,
});

/* ------------------------------------------------------------
   Site Viewport & Metadata
   ------------------------------------------------------------ */

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0EDE6" },
    { media: "(prefers-color-scheme: dark)",  color: "#111009" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Ikechukwu Alaeto | Full Stack Developer",
    template: "%s | Ikechukwu Alaeto",
  },
  description:
    "Full Stack Developer in Ibadan, Nigeria. I build things that feel alive — engineering web experiences that turn complex problems into fast, beautiful products.",
  keywords: [
    "full stack developer",
    "web developer",
    "Next.js",
    "React",
    "TypeScript",
    "Ibadan",
    "Nigeria",
    "Ikechukwu Alaeto",
    "IykeVisuals",
  ],
  authors: [{ name: "Ikechukwu Alaeto", url: getBaseUrl() }],
  creator: "Ikechukwu Alaeto",

  /* --- Icons --- */
  icons: {
    icon: [
      { url: "/favicon.ico?v=5", sizes: "any" },
      { url: "/icon.png?v=5", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg?v=5", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=5", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=5", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=5", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon.svg?v=5", color: "#D63A2F" },
    ],
  },

  /* --- Manifest --- */
  manifest: "/site.webmanifest",

  /* --- Apple Web App --- */
  appleWebApp: {
    capable: true,
    title: "Ikechukwu Alaeto",
    statusBarStyle: "default",
  },

  /* --- Open Graph --- */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getBaseUrl(),
    siteName: "Ikechukwu Alaeto",
    title: "Ikechukwu Alaeto | Full Stack Developer",
    description:
      "Full Stack Developer in Ibadan, Nigeria. I build things that feel alive.",
  },

  /* --- Twitter / X --- */
  twitter: {
    card: "summary_large_image",
    title: "Ikechukwu Alaeto | Full Stack Developer",
    description: "Full Stack Developer in Ibadan, Nigeria. I build things that feel alive.",
  },

  /* --- Robots --- */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ------------------------------------------------------------
   Root Layout
   Injects font CSS variables into <html> so they are available
   everywhere via var(--font-host-grotesk)
   suppressHydrationWarning is required for data-theme dark mode toggle
   ------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable} ${stackSansNotch.variable} ${ballegaLogo.variable} ${ballegaLogoOutline.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Windows tile */}
        <meta name="msapplication-TileColor" content="#D63A2F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Safari pinned tab */}
        <link rel="mask-icon" href="/icon.svg" color="#D63A2F" />
      </head>
      <body>{children}</body>
    </html>
  );
}
