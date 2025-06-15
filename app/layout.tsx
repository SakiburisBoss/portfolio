import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/home/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import UserSyncTrigger from "@/components/user-sync";

export const metadata: Metadata = {
  icons: {
    icon: [
      { 
        url: "/favicon.svg", 
        type: "image/svg+xml" 
      },
      //Fallback for Safari
      { 
        url: "/favicon.ico", 
        type: "image/x-icon", 
        sizes: "any"
      }
    ]
  },
  title: "Sakibur's Portfolio",
  description:
    "A modern web developer's portfolio showcasing my projects built with Next.js, TypeScript, React, Prisma, Neon, Clerk, Zustand, and Tailwind CSS. Explore my projects and learn more about my skills and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {" "}
      <html lang="en" suppressHydrationWarning>
        <body className="container">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
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
