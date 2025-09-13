import EditProjectPage from "@/components/projects/edit-project";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { notFound, redirect } from "next/navigation";
import React from "react";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

const page: React.FC<EditPageProps> = async ({ params }) => {
  const { userId } = await auth();

  if (!userId) {
    const currentPath = `/projects/${(await params).id}/edit`;
    redirect(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
  }

  const { id } = await params;

  const project = await prisma.projects.findUnique({
    where: { id: id },
    include: {
      author: true,
    },
  });

  if (!project) {
    return notFound();
  }
  if (project.author.id !== userId) {
    redirect("/unauthorized");
  }

  return (
    <div
      className={cn(
        "relative px-4 py-8 sm:py-12 min-h-screen",
        "text-gray-900",
        "dark:text-white"
      )}
    >

      {/* Header with title and back link */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 bg-white/95 dark:bg-purple-950/95 px-4 py-6">
        <h1
          className={cn(
            "text-3xl sm:text-4xl font-extrabold tracking-tight",
            "text-gray-900 dark:text-white"
          )}
        >
          Edit Project
        </h1>
        <Link
          href={`/projects/${project.id}`}
          className={cn(
            "px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 font-medium shadow hover:shadow-md",
            "dark:bg-indigo-600 dark:hover:bg-indigo-700"
          )}
        >
          Back to Project
        </Link>
      </div>

      <EditProjectPage project={project} />
    </div>
  );
};

export default page;
