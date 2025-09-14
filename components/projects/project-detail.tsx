"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";
import { deleteProject } from "@/actions/projects/delete-project";
import { Loader2, Trash2 } from "lucide-react";

type ProjectDetailState = {
  project: Prisma.ProjectsGetPayload<{ include: { author: true } }>;
  isProjectOwner: boolean;
};

export const ProjectDetailPage: React.FC<ProjectDetailState> = ({
  project,
  isProjectOwner,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action is irreversible"
      )
    )
      return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteProject(project.id);
    } catch (error) {
      console.error(error);
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete project"
      );
      setIsDeleting(false);
    }
  };

  if (!project) {
    return (
      <div
        className={cn(
          "relative px-4 py-8 min-h-screen",
          "text-gray-900 dark:text-white"
        )}
      >
        Project not found
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Sticky Header */}
      <div className="sticky top-10 z-40 bg-white/95 dark:bg-purple-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 mb-4 px-4 py-6 flex justify-between items-center -mt-8">
        <h1 className="text-3xl font-extrabold">Project Details</h1>
        <span
          className="absolute bottom-1 left-0 w-full h-2 bg-blue-100 dark:bg-blue-900/50 -z-10 opacity-70"
          style={{ transform: "skewX(-12deg)" }}
        />
        <Button asChild className="">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 lg:gap-10">
        {/* Left Column */}
        <div className="w-full xl:w-1/2">
          <Card className="bg-white/90 dark:bg-gray-800/80 shadow-xl rounded-2xl border dark:border-gray-700 overflow-hidden">
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Featured Image */}
              <div className="relative w-full aspect-video max-h-[500px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <Image
                  src={project.featuredImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain hover:scale-105 transition-all duration-300"
                  priority
                />
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent break-words">
                    {project.title}
                  </h2>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    disabled={!project.liveDemoUrl}
                    onClick={() =>
                      project.liveDemoUrl &&
                      window.open(
                        project.liveDemoUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Visit{" "}
                      <span className="font-bold text-xl bg-gradient-to-r from-red-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent animate-text-shimmer">
                        {project.title}
                      </span>
                    </span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white">
                    {project.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <p className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white min-h-[120px] whitespace-pre-line break-words">
                    {project.description}
                  </p>
                </div>

                {/* Author */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.author.imageUrl || ""} />
                      <AvatarFallback>
                        {project.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{project.author.name}</span>
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <div className="w-full xl:w-1/2">
          <div className="xl:sticky xl:top-36 space-y-6">
            <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <span className="font-extrabold text-3xl bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent animate-text-shimmer">
                Live Preview
              </span>

              <div
                className={cn(
                  "relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl border",
                  "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900/30 mt-4"
                )}
              >
                {project.liveDemoUrl ? (
                  <iframe
                    src={project.liveDemoUrl}
                    title={project.title}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 text-gray-400 dark:text-gray-500 rounded-xl border-2 border-dashed dark:border-gray-600">
                    <h3 className="text-lg font-medium mb-1">
                      Demo Unavailable
                    </h3>
                    <p className="max-w-xs text-sm">
                      This project doesn&apos;t have a live demo
                    </p>
                  </div>
                )}
              </div>

              {/* Modern Preview Actions Section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <div className="flex  gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Preview not working?
                    </p>
                  </div>

                  <button
                    disabled={!project.liveDemoUrl}
                    className={cn(
                      "cursor-pointer group relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg",
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                      "text-white hover:shadow-xl transform hover:-translate-y-0.5",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md",
                      "disabled:bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-500"
                    )}
                    onClick={() =>
                      project.liveDemoUrl &&
                      window.open(
                        project.liveDemoUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Open in New Tab
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-between">
              {isProjectOwner && (
                <Button
                  asChild
                  className="group relative overflow-hidden flex-1 py-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                >
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Project
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                disabled={!project.codes}
                className={cn(
                  "cursor-pointer group relative overflow-hidden flex-1 py-6 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1",
                  "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700",
                  "border-2 border-emerald-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-gray-500",
                  "text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300",
                  "hover:shadow-xl hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-gray-700 dark:hover:to-gray-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md disabled:bg-gray-100 dark:disabled:bg-gray-800"
                )}
                onClick={() =>
                  project.codes &&
                  window.open(project.codes, "_blank", "noopener,noreferrer")
                }
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  View Code
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              {isProjectOwner && (
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={cn(
                    "cursor-pointer group relative overflow-hidden py-6 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0",
                    "bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700",
                    "hover:shadow-xl hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md",
                    isDeleting ? "cursor-not-allowed bg-gray-500" : ""
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>Delete</span>
                      </>
                    )}
                  </span>
                  {!isDeleting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Button>
              )}
            </div>

            {deleteError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                {deleteError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
