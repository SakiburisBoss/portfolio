import ContactPage from "@/components/home/contact-page";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import SkillsCarousel from "@/components/home/skills-carousel";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Techs } from "@prisma/client";

// Cache for techs data
let techsCache: Techs[] | null = null;
let techsCacheTime = 0;
const TECH_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function getTechs(): Promise<Techs[]> {
  const now = Date.now();

  // Return cached data if valid
  if (techsCache && now - techsCacheTime < TECH_CACHE_TTL) {
    return techsCache;
  }

  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not found, returning empty array");
      return techsCache || [];
    }

    const techs = await prisma.techs.findMany({
      orderBy: { id: "asc" },
    });

    // Update cache
    techsCache = techs;
    techsCacheTime = now;

    return techs;
  } catch (error) {
    console.error("Error fetching techs:", error);
    // Return cached data if available, otherwise empty array
    return techsCache || [];
  }
}

export default async function Home() {
  const techs = await getTechs();

  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <HeroSection techs={techs} />
      <Suspense
        fallback={
          <div className="h-20 bg-gradient-to-r from-white to-gray-50 rounded-lg animate-pulse mx-4" />
        }
      >
        <SkillsCarousel techs={techs} />
      </Suspense>
      <ContactPage />
      <Footer />
    </main>
  );
}
