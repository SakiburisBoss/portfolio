"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";

type ProjectDetailState = {
        project:Prisma.ProjectsGetPayload<{ include: { author: { select: { name: true;email: true; imageUrl: true; }; }; }; }>
}

export const ProjectDetailPage:React.FC<ProjectDetailState> = ({project}) => {


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (!project) {
    return (
      <div
        className={cn(
          "relative container mx-auto px-4 py-8 sm:py-12 min-h-screen",
          "bg-white text-gray-900",
          "dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-950 dark:to-indigo-950 dark:text-white"
        )}
      >
        <div className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[800px] before:w-[800px] before:rounded-full before:blur-3xl dark:before:bg-gradient-to-r dark:before:from-violet-600/20 dark:before:to-indigo-600/20 before:bg-gradient-to-r before:from-blue-400/10 before:to-purple-400/10 z-[-1]" />
        <div className="relative text-center text-xl text-gray-900 dark:text-white">
          Project not found
        </div>
        <Button
          asChild
          className="mt-4 mx-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
        >
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative container mx-auto px-4 py-8 sm:py-12 min-h-screen",
        "bg-white text-gray-900",
        "dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-950 dark:to-indigo-950 dark:text-white"
      )}
    >
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[800px] before:w-[800px] before:rounded-full before:blur-3xl dark:before:bg-gradient-to-r dark:before:from-violet-600/20 dark:before:to-indigo-600/20 before:bg-gradient-to-r before:from-blue-400/10 before:to-purple-400/10 z-[-1]" />

      {/* Header Section */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <h1
          className={cn(
            "text-3xl sm:text-4xl font-extrabold tracking-tight",
            "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent"
          )}
        >
          {project.title}
        </h1>
        <Button
          asChild
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
        >
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>

      {/* Project Details and Live Demo */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="
          bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden
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
        ">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Project Details */}
              <div className="space-y-6">
                {/* Featured Image */}
                <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
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
                </div>

                {/* Project Info */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Details
                  </h2>
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </Label>
                    <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white">
                      {project.category}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </Label>
                    <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white min-h-[120px]">
                      {project.description}
                    </div>
                  </div>
                </div>

                {/* Author & Metadata */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.author.imageUrl || ""} />
                      <AvatarFallback>
                        {project.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.author.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Live Demo Preview */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Live Demo
                </h2>
                <motion.div
                  className={cn(
                    "relative h-[500px] w-full overflow-hidden rounded-xl border",
                    "border-gray-300 bg-gray-100",
                    "dark:border-gray-700 dark:bg-gray-900/30"
                  )}
                  whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
                  transition={{ duration: 0.3 }}
                >
                  {project.liveDemoUrl ? (
                    <iframe
                      src={project.liveDemoUrl}
                      title="Live Demo Preview"
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex flex-col items-center justify-center p-8 text-center",
                        "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400",
                        "dark:from-gray-800/50 dark:to-gray-900/50 dark:text-gray-500"
                      )}
                    >
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4 dark:bg-gray-700 dark:border-gray-600" />
                      <h3 className="text-lg font-medium mb-1">Demo Unavailable</h3>
                      <p className="max-w-xs">This project doesn&apos;t have a live demo</p>
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    asChild
                    className="flex-1 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href={`/projects/${project.id}/edit`}>
                      Edit Project
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 py-6 rounded-xl border-gray-300 text-gray-900 font-bold shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    View Code
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectDetailPage;