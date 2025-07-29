import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/home/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import UserSyncTrigger from "@/components/user-sync";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-pi-indol-81.vercel.app"), // Replace with your actual domain
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      //Fallback for Safari
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "any",
      },
    ],
  },
  title: "Sakibur's Portfolio",
  description:
    "A modern web developer's portfolio showcasing my projects built with Next.js, TypeScript, React, Prisma, Neon, Clerk, Zustand, and Tailwind CSS. Explore my projects and learn more about my skills and experience.",
  keywords: [
    "portfolio",
    "web developer",
    "next.js",
    "react",
    "typescript",
    "full-stack",
  ],
  authors: [{ name: "Sakibur Rahman" }],
  creator: "Sakibur Rahman",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-pi-indol-81.vercel.app/", // Replace with your actual domain
    title: "Sakibur's Portfolio",
    description:
      "A modern web developer's portfolio showcasing projects built with Next.js, TypeScript, React, and more.",
    siteName: "Sakibur's Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="container mx-auto">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <NavBar />
            {children}
            <UserSyncTrigger />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
