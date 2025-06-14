"use client";
import React from "react";
import AutoPlay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import type { Techs } from "@prisma/client";


const SkillsCarousel = ({ techs }: { techs: Techs[] }) => {
  return (
    <Carousel
      plugins={[
        AutoPlay({
          delay: 2000,
        }),
      ]}
      className="bg-gradient-to-r from-white to-gray-50 pl-10 -mr-2 rounded-lg shadow-md"
    >
      <CarouselContent>
        {techs.map((tech) => (
          <CarouselItem key={tech.id} className="basis-1/3">
            <Image
              src={tech.path}
              alt={tech.name}
              width={200}
              height={56}
              className="object-contain h-9 sm:h-14 w-auto"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SkillsCarousel;
