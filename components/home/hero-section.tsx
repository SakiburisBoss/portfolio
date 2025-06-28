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
  Sparkles,
  Zap,
} from "lucide-react";
import { Techs } from "@prisma/client";

const HeroSection = ({ techs }: { techs: Techs[] }) => {
  // Limit techs to first 5 for better performance
  const displayTechs = techs.slice(0, 5);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-emerald-50 dark:from-gray-900 dark:via-blue-950 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/20 dark:bg-teal-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/10 to-emerald-400/10 dark:from-blue-600/10 dark:to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        {/* Additional purple glow elements */}
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 py-16 md:flex-row md:py-24">
        {/* Content */}
        <div className="flex-1 space-y-8 text-center md:text-left animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 dark:bg-blue-900/50 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-blue-300">
              Full-Stack Developer
            </span>
          </div>

          {/* Project Explorer Subtitle */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
            <Code
              className="inline-block mr-2 h-6 w-6 text-purple-600 dark:text-blue-400 animate-bounce"
              aria-hidden="true"
            />
            You are enjoying a powerful{" "}
            <span className="gradient-text font-bold">Project Explorer</span>{" "}
            with side-by-side live demos and code views
          </h2>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Hi, I&apos;m <span className="gradient-text">Sakibur Rahman</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Building modern, scalable web applications using{" "}
            {displayTechs.map((tech, index) => (
              <strong
                key={tech.id}
                className="text-purple-600 dark:text-blue-400 hover:text-purple-700 dark:hover:text-blue-300 transition-colors duration-300"
              >
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
            <Button asChild size="lg" variant="purple-glow" className="group">
              <Link href="/projects">
                <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                View Projects
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/#contact">
                <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Get In Touch
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 max-w-md mx-auto md:mx-0">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-emerald-500 dark:from-blue-600 dark:to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text">2+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Years Experience
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-purple-500 dark:from-teal-600 dark:to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text">10+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Projects Built
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-emerald-500 dark:from-blue-600 dark:to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 flex-1 md:mt-0 animate-scale-in">
          <div className="relative mx-auto w-80 h-80 md:w-96 md:h-96">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-emerald-600 dark:from-blue-600 dark:to-teal-600 rounded-full blur-2xl opacity-20 animate-pulse-glow"></div>

            {/* Image container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden glass border border-purple-200/30 dark:border-blue-700/30 shadow-2xl hover-lift">
              <div className="image-container w-full h-full rounded-3xl">
                <Image
                  src="/portfolio.webp"
                  alt="Sakibur Rahman - Full Stack Developer"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 320px, 384px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>

              {/* Floating tech icons */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-600/90 dark:bg-blue-600/90 flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-emerald-600/90 dark:bg-teal-600/90 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
