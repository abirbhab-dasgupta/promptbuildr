import type { Metadata } from "next";
import "./globals.css";

// ── SEO METADATA ──────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://promptbuildr.io"),

  title: {
    default: "PromptBuildr — Forge Your Ideas Into Powerful AI Prompts",
    template: "%s | PromptBuildr",
  },

  description:
    "Turn any raw idea into a model-specific, optimized AI prompt in seconds. Built for engineers, students, and builders. No login. No data stored on servers. 100% private.",

  keywords: [
    "AI prompt generator",
    "prompt builder",
    "prompt engineering",
    "ChatGPT prompts",
    "Claude prompts",
    "Gemini prompts",
    "Midjourney prompts",
    "AI tools",
    "prompt optimizer",
    "prompt smith",
    "promptbuildr",
    "free AI tools",
    "prompt writing",
  ],

  authors: [{ name: "Abirbhab Dasgupta", url: "https://abirbhabdasgupta.vercel.app" }],
  creator: "Abirbhab Dasgupta",
  publisher: "PromptBuildr",

  // ── OPEN GRAPH ──────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://promptbuildr.io",
    siteName: "PromptBuildr",
    title: "PromptBuildr — Forge Your Ideas Into Powerful AI Prompts",
    description:
      "Turn any raw idea into a model-specific, optimized AI prompt in seconds. No login. No data stored on servers. 100% private.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PromptBuildr — Forge Your Ideas Into Powerful AI Prompts",
      },
    ],
  },

  // ── TWITTER / X ─────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "PromptBuildr — Forge Your Ideas Into Powerful AI Prompts",
    description:
      "Turn any raw idea into a model-specific, optimized AI prompt in seconds. No login. No data stored. 100% private.",
    images: ["/og-image.png"],
    creator: "@promptbuildr",
  },

  // ── ROBOTS ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── ICONS ───────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // ── CANONICAL ───────────────────────────────────────────
  alternates: {
    canonical: "https://promptbuildr.io",
  },

  // ── MANIFEST ────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── VERIFICATION (add later) ─────────────────────────────
  // verification: {
  //   google: "your-google-site-verification-token",
  // },
};

// ── JSON-LD STRUCTURED DATA ───────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PromptBuildr",
  url: "https://promptbuildr.io",
  description:
    "Turn any raw idea into a model-specific, optimized AI prompt in seconds. No login required. 100% private — all data stored locally.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Abirbhab Dasgupta",
    url: "https://abirbhabdasgupta.vercel.app",
  },
  featureList: [
    "Model-specific prompt generation",
    "ChatGPT, Claude, Gemini, Midjourney support",
    "6 prompt modes: Code, Image, Writing, Agent, Study, General",
    "Explainability layer — learn why each prompt works",
    "100% private — zero server storage",
    "Local history — save and reload prompts",
  ],
};

// ── ROOT LAYOUT ───────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#6b3a2a" />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}