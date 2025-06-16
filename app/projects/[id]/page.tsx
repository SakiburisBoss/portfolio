import ProjectDetailPage from "@/components/projects/project-detail";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

const page: React.FC<ProjectDetailPageProps> = async ({ params }) => {
  const id = (await params).id;

  const project = await prisma.projects.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
    },
  });


  if (!project) {
    return notFound();
  }

  const {userId} = await auth()

  const isProjectOwner = project.author.clerkUserId === userId

  return <ProjectDetailPage project={project} isProjectOwner={isProjectOwner} />;
};

export default page;
