// components/projects/project-detail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Project } from "@prisma/client";

interface ProjectDetailPageProps {
  project: Project & {
    author: {
      id: string;
      name: string;
      email: string;
      imageUrl: string | null;
    };
  };
  isProjectOwner: boolean;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  isProjectOwner,
}) => {
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkEmbed = async () => {
      if (!project.liveDemoUrl) {
        setIframeError(true);
        return;
      }

      try {
        await fetch(project.liveDemoUrl, { method: "HEAD", mode: "no-cors" });
      } catch {
        if (!cancelled) setIframeError(true);
      }
    };

    checkEmbed();

    return () => {
      cancelled = true;
    };
  }, [project.liveDemoUrl]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{project.category}</p>
      <div className="mb-6">
        {project.featuredImage && (
          <img
            src={project.featuredImage}
            alt={project.title}
            className="w-full rounded-lg shadow-md"
          />
        )}
      </div>

      <p className="mb-6">{project.description}</p>

      {project.liveDemoUrl && !iframeError ? (
        <iframe
          src={project.liveDemoUrl}
          className="w-full h-[500px] rounded-lg border"
          title="Live Demo"
        />
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg border">
          <p className="text-gray-500">
            Live demo not available or refused to connect.
          </p>
        </div>
      )}

      {isProjectOwner && project.codes && (
        <div className="mt-6">
          <a
            href={project.codes}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Source Code
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
