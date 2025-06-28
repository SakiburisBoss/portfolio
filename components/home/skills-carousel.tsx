"use client";
import React from "react";
import { Techs } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Sparkles, Zap } from "lucide-react";

const SkillsCarousel: React.FC<{ techs: Techs[] }> = ({ techs }) => {
  // Limit to first 8 techs for better performance
  const displayTechs = techs.slice(0, 8);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-300/10 dark:bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-300/10 dark:bg-teal-600/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 dark:bg-blue-900/50 border border-purple-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 text-purple-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-blue-300">
              Tech Stack
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technologies I <span className="gradient-text">Master</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From frontend frameworks to backend technologies, I work with the
            latest tools to build exceptional digital experiences.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {displayTechs.map((tech, index) => (
            <div
              key={tech.id}
              className="group animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <Card className="card-modern h-full text-center hover-lift group-hover:scale-105 transition-all duration-500">
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  {/* Tech Icon */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {tech.path ? (
                        <Image
                          src={tech.path}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain filter group-hover:brightness-110 transition-all duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <Sparkles className="w-8 h-8 text-purple-600 dark:text-blue-400" />
                      )}
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 dark:from-blue-500/20 dark:to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Tech Name */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {tech.name}
                    </h3>

                    {/* Experience Level */}
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i < Math.min(tech.experienceLevel || 3, 5)
                              ? "bg-gradient-to-r from-purple-500 to-emerald-500 dark:from-blue-500 dark:to-teal-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="px-3 py-1 rounded-full bg-purple-100/80 dark:bg-blue-900/50 text-xs font-medium text-purple-700 dark:text-blue-300 border border-purple-200/50 dark:border-blue-800/50">
                    {tech.category}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className="text-center mt-12 animate-fade-in-up"
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
