"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Prisma } from "@prisma/client";
import { ExternalLink, Github, Calendar, Tag } from "lucide-react";

type ProjectsPageProps = {
  projects: Prisma.ProjectsGetPayload<{
    include: { author: true };
  }>[];
};

const ProjectGrid: React.FC<ProjectsPageProps> = ({ projects }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "web":
        return "from-purple-500 to-emerald-500 dark:from-blue-500 dark:to-teal-500";
      case "mobile":
        return "from-emerald-500 to-purple-500 dark:from-teal-500 dark:to-blue-500";
      case "ai":
        return "from-purple-500 to-pink-500 dark:from-blue-500 dark:to-cyan-500";
      default:
        return "from-purple-500 to-emerald-500 dark:from-blue-500 dark:to-teal-500";
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full">
        {projects?.length > 0
          ? projects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up group w-full"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <Link href={`/projects/${project.id}`} className="block w-full">
                  <Card className="w-full h-full overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl dark:bg-gray-800/80 dark:border dark:border-gray-700 group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-500">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                        <Image
                          src={project.featuredImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          priority={index < 3}
                        />
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(
                              project.category
                            )} shadow-lg`}
                          >
                            <Tag className="w-3 h-3" />
                            {project.category}
                          </span>
                        </div>

                        {/* External Link Badge */}
                        {project.liveDemoUrl && (
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg backdrop-blur-sm">
                              <ExternalLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-4 sm:p-6">
                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow leading-relaxed">
                          {project.description}
                        </p>

                        {/* Author & Date */}
                        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                              <AvatarImage src={project.author.imageUrl || ""} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                {project.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                              {project.author.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(project.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default ProjectGrid;
