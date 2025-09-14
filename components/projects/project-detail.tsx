"use client";

import React, { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  liveDemoUrl: string | null;
  authorId: string;
};

export default function ProjectDetailPage({
  project,
  isProjectOwner,
}: {
  project: Project;
  isProjectOwner: boolean;
}) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [errorType, setErrorType] = useState<
    "network" | "timeout" | "embedBlocked" | null
  >(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Pre-check + timeout
  useEffect(() => {
    if (!project.liveDemoUrl) return;

    let cancelled = false;

    const checkEmbed = async () => {
      try {
        await fetch(project.liveDemoUrl, { method: "HEAD", mode: "no-cors" });
      } catch {
        if (!cancelled) {
          setIframeError(true);
          setIframeLoading(false);
          setErrorType("network");
        }
      }
    };

    checkEmbed();

    const timeout = setTimeout(() => {
      if (!cancelled && iframeLoading) {
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

      {isProjectOwner && (
        <div className="px-4 py-2 text-sm text-green-600">
          ✅ You are the owner of this project
        </div>
      )}

      <div className="flex-1 relative bg-gray-100 mt-4">
        {!project.liveDemoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <p className="text-gray-500">🚫 No live demo available.</p>
          </div>
        ) : (
          <>
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <p className="text-gray-500">Loading preview…</p>
              </div>
            )}

            {iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                {errorType === "network" && (
                  <p className="text-red-500">
                    ⚠️ Network error — site not reachable.
                  </p>
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

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setIframeError(false);
                      setIframeLoading(true);
                      setIframeKey((k) => k + 1);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Retry
                  </button>
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-600 text-white rounded"
                  >
                    Open in new tab
                  </a>
                </div>
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
                if (!iframeError) {
                  setIframeLoading(false);
                  setIframeError(false);
                  setErrorType(null);
                }
              }}
              onError={() => {
                setIframeLoading(false);
                setIframeError(true);
                setErrorType("network");
              }}
              style={{
                opacity: iframeLoading || iframeError ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
