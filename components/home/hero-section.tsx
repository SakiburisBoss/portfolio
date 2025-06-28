"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Award,
  Briefcase,
  Code,
  Code2,
  LayoutGrid,
  Mail,
  Rocket,
} from "lucide-react";
import { Techs } from "@prisma/client";

const HeroSection = ({ techs }: { techs: Techs[] }) => {
  // Limit techs to first 5 for better performance
  const displayTechs = techs.slice(0, 5);

  return (
    <section
      className={cn(
        "relative min-h-[600px] w-full overflow-hidden",
        // Light mode background
        "bg-white text-gray-900",
        // Dark mode background and text
        "dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-950 dark:to-indigo-950 dark:text-white"
      )}
    >
      {/* Simplified background effect */}
      <div className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[500px] before:w-[500px] before:rounded-full before:blur-3xl dark:before:bg-gradient-to-r dark:before:from-violet-600/20 dark:before:to-indigo-600/20 light:before:bg-gradient-to-r light:before:from-blue-400/10 light:before:to-purple-400/10" />

      <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 py-8 md:flex-row md:py-12">
        {/* Content */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h2
            className={cn(
              "mb-4 text-center text-2xl font-semibold sm:text-3xl md:text-left md:text-4xl",
              "text-gray-700 dark:text-gray-300"
            )}
          >
            <Code
              className="inline-block mr-2 h-6 w-6 text-violet-600 dark:text-violet-400"
              aria-hidden="true"
            />
            You are enjoying a powerful{" "}
            <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              Project Explorer
            </span>{" "}
            with side-by-side live demos and code views
          </h2>

          <h1
            className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
              // Light mode text color
              "text-gray-900",
              // Dark mode gradient text
              "dark:text-white"
            )}
          >
            Hi, I&apos;m{" "}
            <span
              role="text"
              aria-label="Sakibur Rahman"
              className="text-violet-600 dark:text-violet-400"
            >
              Sakibur Rahman
            </span>
            , a{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Full-Stack Developer
            </span>
          </h1>

          <p
            className={cn(
              "mx-auto max-w-2xl text-lg md:text-xl",
              // Light mode paragraph
              "text-gray-700",
              // Dark mode paragraph
              "dark:text-gray-300"
            )}
          >
            Building modern, scalable web applications using{" "}
            {displayTechs.map((tech, index) => (
              <strong key={tech.id}>
                {tech.name}
                {index < displayTechs.length - 2
                  ? ", "
                  : index === displayTechs.length - 2
                  ? " and "
                  : ""}
              </strong>
            ))}
            {displayTechs.length < techs.length && " and more"}. Passionate
            about clean code, performance, and great user experiences.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg dark:text-white"
              variant="journal"
            >
              <Link href="/projects" aria-label="View my projects" passHref>
                View My Projects
                <LayoutGrid
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg dark:text-white"
            >
              <Link href="/#contact" passHref>
                Contact Me
                <Mail
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className={cn(
              "grid grid-cols-3 gap-4 pt-8 md:max-w-md",
              // Light mode stats text
              "text-gray-900",
              // Dark mode stats text
              "dark:text-white"
            )}
          >
            <div className="space-y-2 text-center">
              <Briefcase
                className="inline-block h-6 w-6 text-violet-600 dark:text-violet-400"
                aria-hidden="true"
              />
              <div className="text-2xl font-bold text-primary dark:text-violet-400">
                2+
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Years of Experience
              </div>
            </div>
            <div className="space-y-2 text-center">
              <Rocket
                className="inline-block h-6 w-6 text-violet-600 dark:text-violet-400"
                aria-hidden="true"
              />
              <div className="text-2xl font-bold text-primary dark:text-violet-400">
                10+
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Projects Completed
              </div>
            </div>
            <div className="space-y-2 text-center">
              <Award
                className="inline-block h-6 w-6 text-violet-600 dark:text-violet-400"
                aria-hidden="true"
              />
              <div className="text-2xl font-bold text-primary dark:text-violet-400">
                100%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex-1 md:mt-0">
          <div
            className={cn(
              "relative mx-auto h-64 w-64 rounded-2xl overflow-hidden",
              // Light mode background & border
              "bg-white border border-gray-300 shadow-lg",
              // Dark mode background & border
              "dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent dark:border-primary/20 dark:shadow-indigo-500/10"
            )}
          >
            <Image
              src="/portfolio.webp"
              alt="Portfolio Image"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 256px, 256px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <Code2 className="absolute bottom-2 right-2 w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
