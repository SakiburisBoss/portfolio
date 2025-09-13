"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";
import { deleteProject } from "@/actions/projects/delete-project";
import { Loader2, Trash2, ExternalLink, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

type ProjectDetailState = {
  project: Prisma.ProjectsGetPayload<{
    include: {
      author: true;
    };
  }>;
  isProjectOwner: boolean;
};

export const ProjectDetailPage: React.FC<ProjectDetailState> = ({
  project,
  isProjectOwner,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const resetIframe = () => {
    setIframeLoading(true);
    setIframeError(false);
    setIframeKey((prev) => prev + 1); // Force iframe re-render
  };

  // Function to detect actual blocking reason (limited by browser security)
  const detectBlockingReason = (url: string) => {
    // We can only make educated guesses, not detect actual headers
    return {
      platform: detectPlatform(url),
      possibleReasons: [
        "X-Frame-Options: DENY header",
        "X-Frame-Options: SAMEORIGIN header",
        "Content-Security-Policy frame-ancestors directive",
        "Mixed content (HTTP iframe in HTTPS page)",
        "Network/CORS issues",
        "Server error (404, 500, etc.)",
      ],
      honestMessage:
        "Browser security prevents us from knowing the exact reason why this iframe was blocked.",
    };
  };

  // Function to detect the platform/site type
  const detectPlatform = (url: string) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();

      if (
        hostname.includes("sanity.studio") ||
        hostname.includes(".sanity.io")
      ) {
        return "Sanity Studio";
      } else if (
        hostname.includes("google.com") ||
        hostname.includes("docs.google")
      ) {
        return "Google Services";
      } else if (
        hostname.includes("notion.so") ||
        hostname.includes("notion.site")
      ) {
        return "Notion";
      } else if (hostname.includes("airtable.com")) {
        return "Airtable";
      } else if (hostname.includes("figma.com")) {
        return "Figma";
      } else if (hostname.includes("canva.com")) {
        return "Canva";
      } else if (hostname.includes("miro.com")) {
        return "Miro";
      } else if (
        hostname.includes("facebook.com") ||
        hostname.includes("instagram.com")
      ) {
        return "Meta/Facebook";
      } else if (
        hostname.includes("twitter.com") ||
        hostname.includes("x.com")
      ) {
        return "Twitter/X";
      } else if (hostname.includes("linkedin.com")) {
        return "LinkedIn";
      } else if (hostname.includes("youtube.com")) {
        return "YouTube";
      } else if (hostname.includes("vimeo.com")) {
        return "Vimeo";
      } else if (hostname.includes("stripe.com")) {
        return "Stripe";
      } else if (hostname.includes("auth0.com")) {
        return "Auth0";
      } else if (hostname.includes("hubspot.com")) {
        return "HubSpot";
      } else if (hostname.includes("salesforce.com")) {
        return "Salesforce";
      } else if (hostname.includes("slack.com")) {
        return "Slack";
      } else if (hostname.includes("discord.com")) {
        return "Discord";
      } else if (hostname.includes("zoom.us")) {
        return "Zoom";
      } else if (hostname.includes("github.com")) {
        return "GitHub";
      } else if (hostname.includes("gitlab.com")) {
        return "GitLab";
      } else if (
        hostname.includes("clerk.com") ||
        hostname.includes("clerk.dev")
      ) {
        return "Clerk";
      } else if (
        hostname.includes("atlassian.net") ||
        hostname.includes("jira.com")
      ) {
        return "Atlassian/Jira";
      } else if (
        hostname.includes("microsoft.com") ||
        hostname.includes("office.com")
      ) {
        return "Microsoft Services";
      } else {
        return hostname;
      }
    } catch {
      return "This website";
    }
  };

  // Handle iframe timeout for cases where onError doesn't fire
  useEffect(() => {
    if (project.liveDemoUrl && iframeLoading) {
      const timeout = setTimeout(() => {
        if (iframeLoading) {
          console.log("Iframe timeout - likely blocked by security headers");
          setIframeError(true);
          setIframeLoading(false);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [project.liveDemoUrl, iframeLoading]);

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
      console.error("Error deleting project:", error);
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
          "text-gray-900",
          "dark:text-white"
        )}
      >
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
    <div className="relative min-h-screen px-3 sm:px-4 py-6 sm:py-10 dark:text-white">
      {/* Sticky Header Section */}
      <div className="sticky top-12 z-40 bg-white/95 dark:bg-purple-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 mb-6 -mt-6 sm:-mt-10">
        <div className="relative w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative inline-block">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white relative z-10">
              <span className="relative inline-block">
                Project Details
                <span
                  className="absolute bottom-1 left-0 w-full h-2 bg-blue-100 dark:bg-blue-900/50 -z-10 opacity-70"
                  style={{ transform: "skewX(-12deg)" }}
                ></span>
              </span>
            </h2>
            <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>

          <Button
            asChild
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg self-end sm:self-auto"
          >
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-fade-in-up px-2 sm:px-4">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-10">
          {/* Left Column - Project Details */}
          <div className="w-full xl:w-1/2">
            <Card
              className="  
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
    "
            >
              <CardContent className="p-4 sm:p-6">
                {/* Project Details */}
                <div className="space-y-6">
                  {/* Featured Image */}
                  <div className="relative w-full aspect-video max-h-[400px] sm:max-h-[500px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
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
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <h1
                        className={cn(
                          "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight break-words",
                          "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent"
                        )}
                      >
                        {project.title}
                      </h1>
                      <Button
                        variant="outline"
                        disabled={!project.liveDemoUrl}
                        className={`cursor-pointer py-5 rounded-xl font-medium text-base transition-all duration-300 group ${
                          project.liveDemoUrl
                            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md hover:-translate-y-0.5"
                            : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          project.liveDemoUrl &&
                          window.open(
                            project.liveDemoUrl,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${
                              project.liveDemoUrl
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-400"
                            }`}
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" x2="21" y1="14" y2="3" />
                          </svg>
                          <span className="hidden sm:inline">
                            Visit {project.title}
                          </span>
                          <span className="sm:hidden">Visit {project.title}</span>
                        </span>
                      </Button>
                    </div>

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
                      <p className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white min-h-[120px] whitespace-pre-line break-words">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Author & Metadata */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={project.author.imageUrl || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {project.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
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
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Demo Preview */}
          <div className="w-full xl:w-1/2">
            <div className="xl:sticky xl:top-24 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                    Live Preview
                  </h2>
                </div>
                <div
                  className={cn(
                    "relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl border",
                    "border-gray-300 bg-gray-100",
                    "dark:border-gray-700 dark:bg-gray-900/30"
                  )}
                >
                  {project.liveDemoUrl ? (
                    <div className="relative w-full h-full">
                      {/* Loading State */}
                      {iframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Loading preview...
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Error State */}
                      {iframeError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 z-10 p-6 text-center">
                          <AlertTriangle className="h-12 w-12 text-orange-500 mb-3" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Preview Loading Failed
                          </h3>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-sm">
                            <p className="mb-2">
                              <span className="font-semibold text-orange-600 dark:text-orange-400">
                                {detectPlatform(project.liveDemoUrl!)}
                              </span>{" "}
                              could not be loaded in this iframe.
                            </p>
                            <details className="text-xs text-left">
                              <summary className="cursor-pointer font-medium mb-1">
                                Possible reasons (click to expand):
                              </summary>
                              <ul className="list-disc list-inside space-y-1 pl-2">
                                {detectBlockingReason(
                                  project.liveDemoUrl!
                                ).possibleReasons.map((reason, index) => (
                                  <li key={index}>{reason}</li>
                                ))}
                              </ul>
                              <p className="mt-2 italic text-gray-500 dark:text-gray-400">
                                {
                                  detectBlockingReason(project.liveDemoUrl!)
                                    .honestMessage
                                }
                              </p>
                            </details>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                project.liveDemoUrl &&
                                window.open(
                                  project.liveDemoUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in New Tab
                            </Button>
                            <Button
                              variant="outline"
                              onClick={resetIframe}
                              className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Iframe */}
                      <iframe
                        key={`iframe-${iframeKey}`}
                        src={project.liveDemoUrl}
                        title="Live Demo Preview"
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        referrerPolicy="no-referrer-when-downgrade"
                        onLoad={() => {
                          setIframeLoading(false);
                          setIframeError(false);
                        }}
                        onError={(e) => {
                          console.log("Iframe error event:", e);
                          setIframeLoading(false);
                          setIframeError(true);
                        }}
                        style={{
                          opacity: iframeLoading || iframeError ? 0 : 1,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex flex-col items-center justify-center p-8 text-center",
                        "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400",
                        "dark:from-gray-800/50 dark:to-gray-900/50 dark:text-gray-500"
                      )}
                    >
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4 dark:bg-gray-700 dark:border-gray-600" />
                      <h3 className="text-lg font-medium mb-1">
                        Demo Unavailable
                      </h3>
                      <p className="max-w-xs text-sm">
                        This project doesn&apos;t have a live demo
                      </p>
                    </div>
                  )}
                </div>

               

                {/* Additional helpful text for users */}
                {project.liveDemoUrl && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12l2 2 4-4" />
                      </svg>
                      <strong>Preview not working?</strong> Open manually in a
                      new tab using the button below.
                    </p>
                  </div>
                )}

                <Button
                  variant="outline"
                  disabled={!project.liveDemoUrl}
                  className={`cursor-pointer w-full py-5 rounded-xl font-medium text-base transition-all duration-300 group ${
                    project.liveDemoUrl
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md hover:-translate-y-0.5"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    project.liveDemoUrl &&
                    window.open(
                      project.liveDemoUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${
                        project.liveDemoUrl
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400"
                      }`}
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                    <span className="hidden sm:inline">
                      Visit {project.title}
                    </span>
                    <span className="sm:hidden">Visit {project.title}</span>
                  </span>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isProjectOwner && (
                  <Button
                    asChild
                    className="flex-1 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href={`/projects/${project.id}/edit`}>
                      Edit Project
                    </Link>
                  </Button>
                )}

                <Button
                  variant="outline"
                  disabled={!project.codes}
                  className={`cursor-pointer flex-1 py-6 rounded-xl text-gray-900 font-bold shadow-sm transition-all duration-300 ${
                    project.codes
                      ? "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                      : "border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    project.codes &&
                    window.open(project.codes, "_blank", "noopener,noreferrer")
                  }
                >
                  View Code
                </Button>
                {isProjectOwner && (
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={cn(
                      "py-6 rounded-xl text-white font-bold shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer",
                      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
                      "disabled:opacity-70 disabled:cursor-not-allowed"
                    )}
                  >
                    {isDeleting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </span>
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
    </div>
  );
};

export default ProjectDetailPage;
