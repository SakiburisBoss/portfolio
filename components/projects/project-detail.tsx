"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { deleteProject } from "@/actions/projects/delete-project";
import { Loader2, Trash2, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";

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

  const [iframeStatus, setIframeStatus] = useState<
    "loading" | "working" | "failed"
  >("loading");
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset iframe manually
  const resetIframe = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIframeStatus("loading");
    setShowIframe(false);
    setTimeout(() => setShowIframe(true), 100);
  };

  // Show iframe after small delay
  useEffect(() => {
    if (!project.liveDemoUrl) return;
    const t = setTimeout(() => {
      setShowIframe(true);
      setIframeStatus("loading");
    }, 100);
    return () => clearTimeout(t);
  }, [project.liveDemoUrl]);

  // Listen for iframe handshake
  useEffect(() => {
    if (!showIframe || !project.liveDemoUrl) return;

    let hasResponded = false;
    const expectedOrigin = new URL(project.liveDemoUrl).origin;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === expectedOrigin && event.data === "iframe-ready") {
        console.log("✅ Handshake received from iframe");
        hasResponded = true;
        setIframeStatus("working");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };

    window.addEventListener("message", handleMessage);

    // timeout fallback
    timeoutRef.current = setTimeout(() => {
      if (!hasResponded) {
        console.log("⏰ No handshake from iframe, marking failed");
        setIframeStatus("failed");
      }
    }, 4000);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showIframe, project.liveDemoUrl]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action is irreversible")) {
      return;
    }
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

  return (
    <div className="relative min-h-screen px-3 sm:px-4 py-6 sm:py-10 dark:text-white">
      {/* --- Project info --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
      </div>

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
              {/* Loading state */}
              {iframeStatus === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Loading preview...
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {iframeStatus === "failed" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 z-10 p-6 text-center border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Preview Not Available
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                    This website cannot be displayed in an iframe preview for security reasons.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <Button
                      onClick={() =>
                        project.liveDemoUrl &&
                        window.open(
                          project.liveDemoUrl,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetIframe}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {/* Iframe */}
              {showIframe && iframeStatus !== "failed" && (
                <iframe
                  ref={iframeRef}
                  src={project.liveDemoUrl}
                  title="Live Demo Preview"
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{
                    opacity: iframeStatus === "working" ? 1 : 0.2,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete button for owner */}
      {isProjectOwner && (
        <div className="mt-6">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Project
          </Button>
          {deleteError && (
            <p className="text-red-600 mt-2">{deleteError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
