"use client";
import React from "react";
import { Techs } from "@prisma/client";
import Image from "next/image";
import { Sparkles, Zap } from "lucide-react";

const SkillsCarousel: React.FC<{ techs: Techs[] }> = ({ techs }) => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 dark:bg-blue-900/50 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-4">
            <Zap className="w-4 h-4 text-purple-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-blue-300">
              Tech Stack
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
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
            <div key={tech.id} className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 flex items-center justify-center mb-2">
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
