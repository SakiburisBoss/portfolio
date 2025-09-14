"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";
import { deleteProject } from "@/actions/projects/delete-project";
import { Loader2, Trash2, ExternalLink, AlertTriangle, RefreshCw } from "lucide-react";

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
  const [errorType, setErrorType] = useState<"network" | "timeout" | "blocked" | "cors">("network");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const errorCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect platform for better error messages
  const detectPlatform = useCallback((url: string) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      if (hostname.includes("sanity.studio")) return "Sanity Studio";
      if (hostname.includes("google.com") || hostname.includes("docs.google")) return "Google Services";
      if (hostname.includes("notion.so") || hostname.includes("notion.site")) return "Notion";
      if (hostname.includes("youtube.com")) return "YouTube";
      if (hostname.includes("vimeo.com")) return "Vimeo";
      if (hostname.includes("github.com")) return "GitHub";
      if (hostname.includes("figma.com")) return "Figma";
      return hostname;
    } catch {
      return "This website";
    }
  }, []);

  // Reset iframe state
  const resetIframe = useCallback(() => {
    setIframeLoading(true);
    setIframeError(false);
    setErrorType("network");
    
    if (iframeRef.current && project.liveDemoUrl) {
      // Force reload by adding a timestamp to bypass cache
      iframeRef.current.src = `${project.liveDemoUrl}?ts=${Date.now()}`;
    }
  }, [project.liveDemoUrl]);

  // Handle iframe load events with comprehensive error detection
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !project.liveDemoUrl) return;

    const handleLoad = () => {
      console.log("Iframe loaded successfully");
      setIframeLoading(false);
      setIframeError(false);
      if (errorCheckTimeout.current) {
        clearTimeout(errorCheckTimeout.current);
      }
    };

    const handleError = () => {
      console.log("Iframe error detected");
      setIframeLoading(false);
      setIframeError(true);
      setErrorType("network");
      if (errorCheckTimeout.current) {
        clearTimeout(errorCheckTimeout.current);
      }
    };

    // Add event listeners
    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    
    // Set a timeout to detect if iframe is blocked or not loading
    errorCheckTimeout.current = setTimeout(() => {
      if (iframeLoading) {
        console.log("Iframe loading timeout - likely blocked or CORS issue");
        setIframeLoading(false);
        setIframeError(true);
        setErrorType("timeout");
        
        // Additional check for CORS/blocking issues
        try {
          // This will throw an error if cross-origin and blocked
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            setErrorType("blocked");
          }
        } catch (error) {
          setErrorType("cors");
        }
      }
    }, 8000); // 8 second timeout

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      if (errorCheckTimeout.current) {
        clearTimeout(errorCheckTimeout.current);
      }
    };
  }, [project.liveDemoUrl, iframeLoading, detectPlatform]);

  // Immediate check for known problematic URLs
  useEffect(() => {
    if (project.liveDemoUrl) {
      const url = project.liveDemoUrl.toLowerCase();
      const problematicDomains = [
        "google.com", "facebook.com", "instagram.com", "twitter.com", "x.com",
        "linkedin.com", "youtube.com", "github.com", "notion.so", "figma.com",
        "stripe.com", "auth0.com", "clerk.com", "clerk.dev"
      ];

      const isProblematic = problematicDomains.some(domain => url.includes(domain));
      
      if (isProblematic) {
        // For known problematic domains, show error immediately
        const fastCheck = setTimeout(() => {
          if (iframeLoading) {
            setIframeError(true);
            setIframeLoading(false);
            setErrorType("blocked");
          }
        }, 1000);

        return () => clearTimeout(fastCheck);
      }
    }
  }, [project.liveDemoUrl, iframeLoading]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action is irreversible")) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteProject(project.id);
    } catch (error) {
      console.error("Error deleting project:", error);
      setDeleteError(error instanceof Error ? error.message : "Failed to delete project");
      setIsDeleting(false);
    }
  };

  // Function to get appropriate error message
  const getErrorMessage = () => {
    const platform = detectPlatform(project.liveDemoUrl || "");
    
    switch (errorType) {
      case "timeout":
        return {
          title: "Loading Timeout",
          description: `${platform} is taking too long to load. This may indicate the site is blocking iframe embedding or is temporarily unavailable.`,
          icon: "⏱️"
        };
      case "blocked":
        return {
          title: "Content Blocked",
          description: `${platform} has blocked iframe embedding for security reasons. This is common with many popular platforms.`,
          icon: "🚫"
        };
      case "cors":
        return {
          title: "Security Restrictions",
          description: `Browser security policies prevent loading this content in an iframe. This is typically due to cross-origin restrictions.`,
          icon: "🛡️"
        };
      default:
        return {
          title: "Connection Failed",
          description: `Unable to connect to ${platform}. This could be due to network issues, the site being down, or security restrictions.`,
          icon: "❌"
        };
    }
  };

  if (!project) {
    return (
      <div className={cn("relative px-4 py-8 min-h-screen", "text-gray-900", "dark:text-white")}>
        <div className="relative text-center text-xl text-gray-900 dark:text-white">Project not found</div>
        <Button asChild className="mt-4 mx-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  // Render iframe with proper error handling
  const renderIframe = () => {
    if (!project.liveDemoUrl) {
      return (
        <div className={cn(
          "w-full h-full flex flex-col items-center justify-center p-8 text-center",
          "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400",
          "dark:from-gray-800/50 dark:to-gray-900/50 dark:text-gray-500"
        )}>
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4 dark:bg-gray-700 dark:border-gray-600" />
          <h3 className="text-lg font-medium mb-1">Demo Unavailable</h3>
          <p className="max-w-xs text-sm">This project doesn&apos;t have a live demo</p>
        </div>
      );
    }

    const errorMessage = getErrorMessage();

    return (
      <div className="relative w-full h-full">
        {/* Loading State */}
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 z-10 p-6 text-center border border-red-200 dark:border-red-800 rounded-xl">
            <div className="text-4xl mb-3">{errorMessage.icon}</div>
            <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{errorMessage.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-md text-center">
              {errorMessage.description}
            </p>
            
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 text-left mb-4 w-full max-w-md">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-xs uppercase tracking-wide">Common Reasons:</h4>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Security headers (X-Frame-Options, CSP)</li>
                <li>• Site doesn&apos;t allow iframe embedding</li>
                <li>• Cross-origin restrictions (CORS)</li>
                <li>• Network connectivity issues</li>
                <li>• Server temporarily unavailable</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button
                onClick={() => window.open(project.liveDemoUrl!, "_blank", "noopener,noreferrer")}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant="outline"
                onClick={resetIframe}
                className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
              💡 Most sites work better when opened directly in a new tab
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={project.liveDemoUrl}
          title={`Live preview of ${project.title}`}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            opacity: iframeLoading || iframeError ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
          // Additional attributes for better error handling
          onLoad={() => {
            setIframeLoading(false);
            setIframeError(false);
          }}
          onError={() => {
            setIframeLoading(false);
            setIframeError(true);
            setErrorType("network");
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative min-h-screen px-3 sm:px-4 py-6 sm:py-10 dark:text-white">
      {/* Your existing UI components */}
      {/* ... */}
      
      {/* Live Demo Preview Section */}
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
        <div className={cn(
          "relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl border",
          "border-gray-300 bg-gray-100",
          "dark:border-gray-700 dark:bg-gray-900/30"
        )}>
          {renderIframe()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
