// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/home/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export const metadata: Metadata = {
  title: "Sakibur's Portfolio",
  description:
    "A modern web developer's portfolio showcasing my projects built with Next.js, TypeScript, React, Prisma, Neon, Clerk, Zustand, and Tailwind CSS.",
  metadataBase: new URL("https://sakibur.me"),
  manifest: "/manifest.json",
  authors: [{ name: "Sakibur Rahman" }],
  creator: "Sakibur Rahman",
  keywords: [
    "portfolio",
    "web developer",
    "next.js",
    "react",
    "typescript",
    "full-stack",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sakibur.me",
    title: "Sakibur's Portfolio",
    description:
      "A modern web developer's portfolio showcasing projects built with Next.js, TypeScript, React, and more.",
    siteName: "Sakibur's Portfolio",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Improves iOS add-to-home-screen naming */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="apple-mobile-web-app-title"
            content="Sakibur's Portfolio"
          />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
