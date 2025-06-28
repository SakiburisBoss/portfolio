"use client";
import React from "react";
import AutoPlay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import type { Techs } from "@prisma/client";

const SkillsCarousel = ({ techs }: { techs: Techs[] }) => {
  // Limit techs to first 10 for better performance
  const displayTechs = techs.slice(0, 10);

  return (
    <Carousel
      plugins={[
        AutoPlay({
          delay: 3000, // Increased from 2000ms for better performance
          stopOnInteraction: false,
        }),
      ]}
      className="bg-gradient-to-r from-white to-gray-50 pl-10 -mr-2 rounded-lg shadow-md"
      opts={{
        loop: true,
        align: "start",
      }}
    >
      <CarouselContent>
        {displayTechs.map((tech) => (
          <CarouselItem
            key={tech.id}
            className="basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <div className="flex items-center justify-center p-2">
              <Image
                src={tech.path}
                alt={tech.name}
                width={120}
                height={40}
                className="object-contain h-8 sm:h-10 w-auto"
                loading="lazy"
                sizes="(max-width: 768px) 80px, 120px"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SkillsCarousel;
