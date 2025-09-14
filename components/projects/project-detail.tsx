use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, ExternalLink, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProjectDetailPage = ({ project, isProjectOwner }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef(null);
  const errorCheckTimeout = useRef(null);

  // Reset iframe state
  const resetIframe = () => {
    setIframeLoading(true);
    setIframeError(false);
    // Force reload by updating the key
    if (iframeRef.current) {
      iframeRef.current.src += '';
    }
  };

  // Handle iframe load events
  useEffect(() => {
    const iframe = iframeRef.current;
    
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
      if (errorCheckTimeout.current) {
        clearTimeout(errorCheckTimeout.current);
      }
    };

    if (iframe && project.liveDemoUrl) {
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      // Set a timeout to detect if iframe is blocked or not loading
      errorCheckTimeout.current = setTimeout(() => {
        if (iframeLoading) {
          console.log("Iframe loading timeout - likely blocked");
          setIframeLoading(false);
          setIframeError(true);
        }
      }, 5000);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
        if (errorCheckTimeout.current) {
          clearTimeout(errorCheckTimeout.current);
        }
      };
    }
  }, [project.liveDemoUrl, iframeLoading]);

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
          <p className="max-w-xs text-sm">This project doesn't have a live demo</p>
        </div>
      );
    }

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
            <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Preview Loading Failed</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              The website may be blocking iframe embedding for security reasons.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button
                onClick={() => window.open(project.liveDemoUrl, "_blank", "noopener,noreferrer")}
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
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={project.liveDemoUrl}
          title="Live Demo Preview"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            opacity: iframeLoading || iframeError ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative min-h-screen px-3 sm:px-4 py-6 sm:py-10 dark:text-white">
      {/* Header and other content */}
      
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
