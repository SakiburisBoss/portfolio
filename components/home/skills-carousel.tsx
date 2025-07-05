"use client";
import React from "react";
import { Techs } from "@prisma/client";
import Image from "next/image";
import { Sparkles, Zap } from "lucide-react";

const SkillsCarousel: React.FC<{ techs: Techs[] }> = ({ techs }) => {
  return (
    <section
      className="
        py-8 md:py-12 relative overflow-hidden
        bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50
        dark:from-[#18122B] dark:via-[#22223B] dark:to-[#1A2A2A]
      "
    >
      {/* Modern floating blurred shapes for extra depth */}
      <div className="absolute top-[-4rem] left-[-4rem] w-80 h-80 bg-purple-300/30 dark:bg-blue-900/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-4rem] right-[-4rem] w-96 h-96 bg-emerald-300/30 dark:bg-teal-900/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200/20 dark:bg-purple-800/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 dark:bg-blue-900/50 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-4">
            <Zap className="w-4 h-4 text-purple-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-blue-300">
              Tech Stack
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Technologies I <span className="gradient-text">Master</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From frontend frameworks to backend technologies, I work with the
            latest tools to build exceptional digital experiences.
          </p>
        </div>
        {/* Skills Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {techs.map((tech) => (
            <div key={tech.id}  className="flex flex-col items-center justify-center animate-bounce"
    style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="dark:bg-white mb-2 transition-all duration-300 group hover:scale-110">
                <div className="relative flex items-center justify-center w-12 h-12">
                  {tech.path ? (
                    <Image
                      src={tech.path}
                      alt={tech.name}
                      width={32}
                      height={32}
                      className="object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Sparkles className="w-7 h-7 text-purple-600 dark:text-blue-400" />
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200 text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
        {/* Call to Action */}
        <div
          className="text-center mt-8 animate-fade-in-up"
          style={{ animationDelay: "800ms" }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Want to see more of my skills in action?
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-700 dark:text-blue-300">
              Check out my projects
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsCarousel;
