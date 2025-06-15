"use client";
import React from "react";
import { Easing, motion, Variants } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Prisma } from "@prisma/client";

type ProjectsPageProps = {
  projects: Prisma.ProjectsGetPayload<{
    include: { author: { select: { name: true; imageUrl: true } } };
  }>[];
};

 const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as Easing, // Type assertion here
      },
    },
  };

const ProjectGrid: React.FC<ProjectsPageProps> = ({ projects }) => {

  console.log("Projects with authors:", projects.map(p => ({
    title: p.title,
    author: p.author.name,
    imageUrl: p.author.imageUrl
  })));
  return (
    <div className="relative grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects?.length > 0
        ? projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: projects.indexOf(project) * 0.1 }}
            >
              <Link href={`/projects/${project.id}`}>
                <Card
                  className="
                    bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl rounded-2xl overflow-hidden
                    dark:bg-gray-800/80 dark:border dark:border-gray-700
                    group relative transition-all
                    dark:before:absolute dark:before:-inset-[2px] dark:before:z-[-1]
                    dark:before:rounded-[inherit] dark:before:bg-[conic-gradient(from_var(--angle),transparent_20%,rgba(192,132,252,0.6)_50%,transparent_80%)]
                    dark:before:opacity-0 dark:hover:before:opacity-100
                    dark:before:transition-opacity dark:before:duration-500
                    dark:after:absolute dark:after:-inset-[3px] dark:after:z-[-2]
                    dark:after:rounded-[inherit] dark:after:bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.4)_0%,transparent_70%)]
                    dark:after:blur-[12px] dark:after:opacity-0 dark:hover:after:opacity-100
                    dark:after:transition-opacity dark:after:duration-700
                  "
                >
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={project.featuredImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm capitalize text-gray-700 dark:text-gray-300">
                        {project.category}
                      </p>

                      {/* Author & Metadata */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={project.author.imageUrl??""} alt={project.author.name} />
                            <AvatarFallback>
                              {project.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
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
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden dark:bg-gray-800/80 dark:border dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="animate-pulse h-48 w-full bg-gray-200 dark:bg-gray-700" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
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
