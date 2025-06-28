"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Prisma } from "@prisma/client";

type ProjectsPageProps = {
  projects: Prisma.ProjectsGetPayload<{
    include: { author: true };
  }>[];
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const ProjectGrid: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <div className="relative grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects?.length > 0
        ? projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: Math.min(index * 0.05, 0.5) }} // Reduced delay for faster loading
            >
              <Link href={`/projects/${project.id}`}>
                <Card
                  className="
                    bg-white/90 backdrop-blur-sm border-0 hover:shadow-xl rounded-xl overflow-hidden
                    dark:bg-gray-800/80 dark:border dark:border-gray-700
                    group relative transition-all duration-300
                    hover:scale-[1.02]
                  "
                >
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm capitalize text-gray-700 dark:text-gray-300">
                        {project.category}
                      </p>

                      {/* Author & Metadata */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={project.author.imageUrl ?? ""}
                              alt={project.author.name}
                            />
                            <AvatarFallback className="text-xs">
                              {project.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                            {project.author.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        : // Skeleton Loading State
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-xl overflow-hidden dark:bg-gray-800/80 dark:border dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="animate-pulse h-40 w-full bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
    </div>
  );
};

export default ProjectGrid;
