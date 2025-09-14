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
      "
    >
      {/* Floating blurred shapes */}
      <div className="absolute top-[-4rem] left-[-4rem] w-60 sm:w-80 h-60 sm:h-80 bg-purple-300/30 dark:bg-blue-900/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-4rem] right-[-4rem] w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/30 dark:bg-teal-900/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-200/20 dark:bg-purple-800/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-100/80 dark:bg-blue-900/50 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-4">
            <Zap className="w-4 h-4 text-purple-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-blue-300">
              Tech Stack
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Technologies I <span className="gradient-text">Master</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            From frontend frameworks to backend technologies, I work with the
            latest tools to build exceptional digital experiences.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-3  md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-4 md:gap-6">
          {techs.map((tech, idx) => (
            <div
              key={tech.id}
              className="flex flex-col items-center justify-center animate-bounce rounded-xl p-[2px]
                bg-gradient-to-tr from-purple-200 via-emerald-200 to-blue-200
                dark:from-blue-900 dark:via-purple-800 dark:to-teal-900
                shadow-sm"
              style={{ animationDelay: `${idx * 0.12}s` }}
            >
              <div className="bg-white mb-2 transition-transform duration-300 group hover:scale-105 rounded-xl shadow-sm touch-manipulation">
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border border-gray-200/50 dark:border-gray-700/50">
                  {tech.path ? (
                    <Image
                      src={tech.path}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="object-contain w-8 h-8 sm:w-10 sm:h-10"
                      loading="lazy"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-blue-400" />
                  )}
                </div>
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
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
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 px-2">
            Want to see more of my skills in action?
          </p>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-blue-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-blue-300">
              Check out my projects
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsCarousel;
