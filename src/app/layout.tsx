import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Upraze - Momentum of Me",
  description: "Privacy-first personal analytics app that quantifies your momentum across health, focus, output, learning, and mood.",
  keywords: ["productivity", "analytics", "momentum", "personal growth", "health tracking"],
  authors: [{ name: "Simone" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#3B82F6",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.svg",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "Upraze - Momentum of Me",
    description: "Track your momentum across all life domains",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upraze - Momentum of Me",
    description: "Track your momentum across all life domains",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Upraze" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
