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
    <div className="relative grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3 ">
      {projects?.length > 0
        ? projects.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-in-up group"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <Link href={`/projects/${project.id}`}>
                <Card className="card-modern h-full overflow-hidden group-hover:scale-[1.02] transition-all duration-500">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="image-container h-48 w-full">
                      <Image
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
                            project.category
                          )} text-white text-xs font-semibold`}
                        >
                          <Tag className="w-3 h-3" />
                          {project.category}
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex gap-2">
                          {project.liveDemoUrl && (
                            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                              <ExternalLink className="w-4 h-4 text-white mix-blend-difference" />
                            </div>
                          )}
                          {project.codes && (
                            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                              <Github className="w-4 h-4 text-white mix-blend-difference" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold gradient-text line-clamp-2 mb-2 group-hover:scale-105 transition-transform duration-300">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                        {project.description}
                      </p>

                      {/* Author & Metadata */}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 group/author">
                            <Avatar className="h-8 w-8 ring-2 ring-purple-200 dark:ring-blue-700 group-hover/author:ring-purple-300 dark:group-hover/author:ring-blue-600 transition-all duration-300">
                              <AvatarImage
                                src={project.author.imageUrl ?? ""}
                                alt={project.author.name}
                              />
                              <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-emerald-500 dark:from-blue-500 dark:to-teal-500 text-white">
                                {project.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] group-hover/author:text-purple-600 dark:group-hover/author:text-blue-400 transition-colors duration-300">
                              {project.author.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Gradient Border Bottom */}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-emerald-500 dark:from-blue-500 dark:to-teal-500 group-hover:w-full transition-all duration-500 ease-out" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        : // Modern Skeleton Loading State
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <Card className="h-full overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="h-48 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-shimmer" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-shimmer" />
                      <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-shimmer" />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-shimmer" />
                        <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
    </div>
  );
};

export default ProjectGrid;
