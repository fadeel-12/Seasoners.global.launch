import "./globals.css";

export const metadata = {
  title: "Seasoners — Live. Work. Explore!",
  description:
    "Find seasonal work and short-term stays across Austria. Global next.",
  metadataBase: new URL("https://seasoners.eu"),
  applicationName: "Seasoners",
  keywords: ["seasonal work", "short-term stays", "travel work", "hospitality jobs", "austria", "seasonal housing"],
  authors: [{ name: "Seasoners Team" }],
  creator: "Seasoners",
  publisher: "Seasoners",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://seasoners.eu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Seasoners — Live. Work. Explore!",
    description: "Seasonal work and short-term stays worldwide. Connect with global opportunities in hospitality and tourism.",
    url: "https://seasoners.eu",
    siteName: "Seasoners",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/seasoner-mountain-logo.png",
        width: 800,
        height: 600,
        alt: "Seasoners Mountain Logo",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seasoners — Live. Work. Explore!',
    description: 'Find seasonal work and short-term stays across Austria. Global next.',
    images: ['/seasoner-mountain-logo.png'],
  },
  icons: {
    icon: '/seasoner-mountain-logo.png',
    apple: '/seasoner-mountain-logo.png',
  },
};

// Per Next.js guidance, themeColor belongs in the `viewport` export
export const viewport = {
  themeColor: "#0EA5E9",
};

// Force dynamic rendering for the app to avoid prerendering client-only
// components that use client hooks (like LanguageProvider) during build.
export const dynamic = "force-dynamic";

import nextDynamic from 'next/dynamic';

// Load providers dynamically on the client only so `metadata` can remain
// on this server layout and client hooks (useContext) are not invoked
// during prerendering.
const AppProviders = nextDynamic(() => import('./providers'), { ssr: false });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="fixed inset-0 bg-black -z-10" />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
