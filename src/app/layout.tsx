import type { Metadata } from "next";
import localFont from "next/font/local";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";
import "./fonts-embedded.css";
import GlobalGatekeeper from "@/components/ui/GlobalGatekeeper";
import Script from "next/script";

/* ------------------------------------------------------------
   Global Typeface: Studio Feixen Sans (Single Universal System)
   ------------------------------------------------------------ */

const studioFeixenSans = localFont({
  src: [
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Ultralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-UltralightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Book.ttf",
      weight: "350",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-BookItalic.ttf",
      weight: "350",
      style: "italic",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-SemiboldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/feixen-sans/StudioFeixenSansTRIAL-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-studio-feixen-sans",
  display: "swap",
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
   Injects font CSS variable into <html> so it is available
   everywhere via var(--font-studio-feixen-sans)
   suppressHydrationWarning is required for data-theme dark mode toggle
   ------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={studioFeixenSans.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Windows tile */}
        <meta name="msapplication-TileColor" content="#D63A2F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Safari pinned tab */}
        <link rel="mask-icon" href="/icon.svg" color="#D63A2F" />
      </head>
      <body>
        {/* Google Analytics Tag Injection */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {children}
      </body>
    </html>
  );
}
