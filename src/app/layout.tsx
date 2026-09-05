import type { Metadata } from "next";
import localFont from "next/font/local";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";
import GlobalGatekeeper from "@/components/ui/GlobalGatekeeper";
import Script from "next/script";

/* ------------------------------------------------------------
   Local Fonts (Studio Feixen Superfamily):
   - Studio Feixen Edgy (Display / Headings / Monogram / Numbers)
   - Studio Feixen Sans (Body / Paragraphs / UI)
   ------------------------------------------------------------ */

const studioFeixenEdgy = localFont({
  src: [
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Ultralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Book.ttf",
      weight: "350",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/2 Studio Feixen Edgy Family TRIAL/2 TTF/StudioFeixenEdgyTRIAL-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-studio-feixen-edgy",
  display: "swap",
  preload: false,
});

const studioFeixenSans = localFont({
  src: [
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Ultralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-UltralightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Book.ttf",
      weight: "350",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-BookItalic.ttf",
      weight: "350",
      style: "italic",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-SemiboldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Studio Feixen/1 Studio Feixen Sans Family TRIAL/2 TTF/StudioFeixenSansTRIAL-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-studio-feixen-sans",
  display: "swap",
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
   everywhere via var(--font-studio-feixen-edgy) and var(--font-studio-feixen-sans)
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
      className={`${studioFeixenEdgy.variable} ${studioFeixenSans.variable} ${ballegaLogo.variable} ${ballegaLogoOutline.variable}`}
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
