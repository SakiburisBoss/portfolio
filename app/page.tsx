import ContactPage from "@/components/home/contact-page";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import SkillsCarousel from "@/components/home/skills-carousel";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

export default async function Home() { 
  const techs = await prisma.techs.findMany();
 

  return (
    <main>
      <HeroSection techs={techs} />
      <Suspense fallback={<div>Loading...</div>}>
        <SkillsCarousel techs={techs} />
      </Suspense>
      <ContactPage />
      <Footer />
    </main>
  );
}
