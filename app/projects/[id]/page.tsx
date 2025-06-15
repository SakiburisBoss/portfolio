import ProjectDetailPage from "@/components/projects/project-detail";
import { prisma } from "@/lib/prisma";
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
      author: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });


  if (!project) {
    return notFound();
  }

  return <ProjectDetailPage project={project} />;
};

export default page;
