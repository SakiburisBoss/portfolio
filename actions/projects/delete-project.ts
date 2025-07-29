"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export const deleteProject = async (projectId: string) => {
  // Get authenticated user from Clerk
  const { userId } =await auth();
  
  if (!userId) {
    throw new Error("You must be signed in to delete a project");
  }

  try {
    // Find the project with its author
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        author: {
          select: {
            id: true
          }
        }
      }
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Verify ownership using id
    if (!project.author || project.author.id !== userId) {
      redirect("/unauthorized");
    }

    // Delete the project
    await prisma.projects.delete({
      where: { id: projectId }
    });

    // Revalidate cache
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete project"
    );
  }

  // Redirect after successful deletion
  redirect("/projects");
};