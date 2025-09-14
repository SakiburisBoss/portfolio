"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";
import { deleteProject } from "@/actions/projects/delete-project";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

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

  // iframe state
  const [iframeStatus, setIframeStatus] = useState<
    "loading" | "checking" | "working" | "failed"
  >("loading");
  const [showIframe, setShowIframe] = useState(false);
  const [frameError, setFrameError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Debug: Log iframe status changes
  useEffect(() => {
    // Status change tracking (removed console.log for production)
  }, [iframeStatus]);

  // Debug: Log showIframe changes
  useEffect(() => {
    // showIframe change tracking (removed console.log for production)
  }, [showIframe]);

  const resetIframe = () => {
    setIframeStatus("loading");
    setShowIframe(false);
    setFrameError(null); // Clear any previous frame errors
    // Reset iframe after a brief delay
    setTimeout(() => {
      setShowIframe(true);
      setIframeStatus("checking");
    }, 100);
  };

  const getErrorMessage = () => {
    if (frameError) {
      return {
        title: "Website Blocks Iframe Preview",
        description: (
          <>
            This website has security settings that prevent it from being
            displayed in an iframe preview.
            <br />
            <span className="text-xs opacity-75 mt-1 block">
              Error: {frameError}
            </span>
          </>
        ),
        icon: "🔒",
      };
    }

    return {
      title: "Preview Not Available",
      description: (
        <>
          This website cannot be displayed in an iframe preview for security
          reasons.
        </>
      ),
      icon: "🚫",
    };
  };

  // Initial iframe show delay for UX
  useEffect(() => {
    if (!project.liveDemoUrl) {
      return;
    }
    const timer = setTimeout(() => {
      setShowIframe(true);
      setIframeStatus("checking");
    }, 100);
    return () => clearTimeout(timer);
  }, [project.liveDemoUrl]);

  // Frame blocking detection and timeout handling
  useEffect(() => {
    if (!project.liveDemoUrl) {
      return;
    }

    console.log(
      "� Setting up frame blocking detection for:",
      project.liveDemoUrl
    );

    // Enhanced frame blocking detection - check after a short delay
    const frameCheckTimer = setTimeout(() => {
      console.log("🔍 Checking for frame blocking...");
      const iframe = iframeRef.current;

      if (iframe) {
        try {
          // Try to access iframe document - this will throw if blocked
          const doc = iframe.contentDocument || iframe.contentWindow?.document;

          if (!doc) {
            console.log(
              "🚫 No document access - likely blocked by X-Frame-Options"
            );
            setFrameError(
              "Website blocks iframe embedding (X-Frame-Options: deny)"
            );
            setIframeStatus("failed");
            return;
          }

          // Check if iframe has been redirected to about:blank or error page
          const currentSrc = iframe.contentWindow?.location?.href;
          if (
            currentSrc === "about:blank" ||
            currentSrc?.includes("about:blank")
          ) {
            console.log("🚫 Iframe redirected to about:blank - likely blocked");
            setFrameError(
              "Website blocks iframe embedding (redirected to blank page)"
            );
            setIframeStatus("failed");
            return;
          }

          console.log("✅ Frame access check passed");
        } catch (error) {
          console.log("🚫 Frame access denied:", error);
          setFrameError(
            "Website blocks iframe embedding (frame access denied)"
          );
          setIframeStatus("failed");
          return;
        }
      }
    }, 2000); // Check after 2 seconds

    // fallback timeout - only set once when iframe starts loading
    const timer = setTimeout(() => {
      console.log("⏱️ 5-second timeout reached, checking current status...");
      setIframeStatus((current) => {
        console.log(
          "📊 Current status:",
          current,
          "-> Setting to:",
          current === "working" ? "working" : "failed"
        );
        if (current !== "working") {
          // If we haven't detected a specific frame error, set a generic one
          setFrameError(
            (prev) => prev || "Timeout - website may not allow iframe embedding"
          );
        }
        return current === "working" ? "working" : "failed";
      });
    }, 5000);

    return () => {
      console.log("🧹 Cleaning up frame detection timers");
      clearTimeout(timer);
      clearTimeout(frameCheckTimer);
    };
  }, [project.liveDemoUrl]);

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
      <div className="mb-6 relative">
        <h1 className="text-3xl font-extrabold">Project Details</h1>
        <span
          className="absolute bottom-1 left-0 w-full h-2 bg-blue-100 dark:bg-blue-900/50 -z-10 opacity-70"
          style={{ transform: "skewX(-12deg)" }}
        />
        <Button asChild className="absolute right-0 top-0">
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
                    Visit {project.title}
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
          <div className="xl:sticky xl:top-24 space-y-6">
            <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 mb-4">
                Live Preview
              </h2>

              <div
                className={cn(
                  "relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl border",
                  "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900/30"
                )}
              >
                {project.liveDemoUrl ? (
                  <>
                    {(iframeStatus === "loading" ||
                      iframeStatus === "checking") && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50 dark:bg-gray-800">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {iframeStatus === "loading"
                              ? "Preparing preview..."
                              : "Loading preview..."}
                          </p>
                        </div>
                      </div>
                    )}

                    {iframeStatus === "failed" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center border border-red-200 dark:border-red-800 rounded-xl bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20">
                        <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {getErrorMessage().title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {getErrorMessage().description}
                        </p>
                        <div className="flex gap-3 flex-wrap justify-center">
                          <Button onClick={resetIframe} variant="outline">
                            Retry Preview
                          </Button>
                          <Button
                            onClick={() =>
                              project.liveDemoUrl &&
                              window.open(
                                project.liveDemoUrl,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Preview not working? Open in New Tab
                          </Button>
                        </div>
                      </div>
                    )}

                    {showIframe && iframeStatus !== "failed" && (
                      <iframe
                        ref={iframeRef}
                        src={project.liveDemoUrl ?? undefined}
                        title="Live Demo Preview"
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
                        referrerPolicy="no-referrer-when-downgrade"
                        loading="eager"
                        onLoad={() => {
                          console.log("🎯 Iframe onLoad event fired");

                          // Enhanced blocking detection on load
                          const iframe = iframeRef.current;
                          if (iframe) {
                            try {
                              // Check if we can access the iframe's document
                              const doc =
                                iframe.contentDocument ||
                                iframe.contentWindow?.document;
                              const location = iframe.contentWindow?.location;

                              console.log("🔍 Iframe document check:", {
                                hasDocument: !!doc,
                                locationHref: location?.href,
                                expectedUrl: project.liveDemoUrl,
                              });

                              // If iframe loads but shows about:blank, it's likely blocked
                              if (location?.href === "about:blank" || !doc) {
                                console.log(
                                  "� Iframe blocked - showing about:blank or no document access"
                                );
                                setFrameError(
                                  "Website blocks iframe embedding (X-Frame-Options: deny)"
                                );
                                setIframeStatus("failed");
                                return;
                              }

                              // If location doesn't match what we expected, might be blocked/redirected
                              if (location?.href !== project.liveDemoUrl) {
                                console.log(
                                  "🚫 Iframe URL mismatch - expected:",
                                  project.liveDemoUrl,
                                  "got:",
                                  location?.href
                                );
                                setFrameError(
                                  "Website redirected iframe or blocked embedding"
                                );
                                setIframeStatus("failed");
                                return;
                              }

                              console.log("✅ Iframe content seems accessible");
                            } catch (securityError) {
                              console.log(
                                "🚫 Security error accessing iframe:",
                                securityError
                              );
                              setFrameError(
                                "Website blocks iframe embedding (security restrictions)"
                              );
                              setIframeStatus("failed");
                              return;
                            }
                          }

                          // If we get here, iframe loaded successfully
                          console.log(
                            "✅ Iframe loaded successfully, setting status to working"
                          );
                          setIframeStatus("working");
                        }}
                        onError={() => {
                          console.log("💥 Iframe onError event fired");
                          setIframeStatus("failed");
                        }}
                        style={{
                          opacity: iframeStatus === "working" ? 1 : 0.1,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      />
                    )}
                  </>
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
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isProjectOwner && (
                <Button
                  asChild
                  className="flex-1 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md"
                >
                  <Link href={`/projects/${project.id}/edit`}>
                    Edit Project
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                disabled={!project.codes}
                className="flex-1 py-6 rounded-xl text-gray-900 font-bold shadow-sm"
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
                  className="py-6 rounded-xl text-white font-bold shadow-md bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-70 disabled:cursor-not-allowed"
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
  );
};

export default ProjectDetailPage;
