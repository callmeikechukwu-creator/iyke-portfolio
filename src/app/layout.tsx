import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";
import "./fonts-embedded.css";
import GlobalGatekeeper from "@/components/ui/GlobalGatekeeper";
import Script from "next/script";

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

  /* --- Icons & Favicon --- */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon.svg", color: "#0e1628" },
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
      suppressHydrationWarning
    >
      <head>
        {/* Favicon & App Icons (Gold Standard) */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Windows tile */}
        <meta name="msapplication-TileColor" content="#0e1628" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Safari pinned tab */}
        <link rel="mask-icon" href="/icon.svg" color="#0e1628" />
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
