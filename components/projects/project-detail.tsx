"use client";

import React, { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  liveDemoUrl: string;
};

export default function ProjectDetailPage({ project }: { project: Project }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [errorType, setErrorType] = useState<
    "network" | "timeout" | "embedBlocked" | null
  >(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Pre-check availability and setup timeout fallback
  useEffect(() => {
    let cancelled = false;

    const checkEmbed = async () => {
      try {
        // Try a HEAD request first
        await fetch(project.liveDemoUrl, { method: "HEAD", mode: "no-cors" });
        // If it passes, do nothing here — iframe will confirm
      } catch (err) {
        if (!cancelled) {
          console.log("Fetch failed → network error");
          setIframeError(true);
          setIframeLoading(false);
          setErrorType("network");
        }
      }
    };

    checkEmbed();

    // Timeout fallback for blocked embeds (refused to connect page)
    const timeout = setTimeout(() => {
      if (!cancelled && iframeLoading) {
        console.log("Iframe stuck → marking embedBlocked");
        setIframeError(true);
        setIframeLoading(false);
        setErrorType("embedBlocked");
      }
    }, 7000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [project.liveDemoUrl, iframeLoading]);

  return (
    <div className="w-full h-screen flex flex-col">
      <h1 className="text-2xl font-bold p-4">{project.title}</h1>
      <p className="px-4">{project.description}</p>

      <div className="flex-1 relative bg-gray-100 mt-4">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <p className="text-gray-500">Loading preview…</p>
          </div>
        )}

        {iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
            {errorType === "network" && (
              <p className="text-red-500">⚠️ Network error — site not reachable.</p>
            )}
            {errorType === "embedBlocked" && (
              <p className="text-yellow-600">
                🚫 This site refused to allow embedding.
              </p>
            )}
            {errorType === "timeout" && (
              <p className="text-orange-500">
                ⏳ Timed out while loading preview.
              </p>
            )}
            <button
              onClick={() => {
                setIframeError(false);
                setIframeLoading(true);
                setIframeKey((k) => k + 1);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}

        <iframe
          key={`iframe-${iframeKey}`}
          src={project.liveDemoUrl}
          title="Live Demo Preview"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            console.log("Iframe load event fired");
            // Only clear error if it wasn’t marked by timeout
            if (!iframeError) {
              setIframeLoading(false);
              setIframeError(false);
              setErrorType(null);
            }
          }}
          onError={() => {
            console.log("Iframe network error");
            setIframeLoading(false);
            setIframeError(true);
            setErrorType("network");
          }}
          style={{
            opacity: iframeLoading || iframeError ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
