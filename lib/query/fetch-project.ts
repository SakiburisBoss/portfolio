// lib/query/fetch-projects.ts
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

// Define the return type with author information
type ProjectWithAuthor = Prisma.ProjectsGetPayload<{
  include: {
    author: true;
  };
}>;

export const fetchProjects = async (
  search: string = "",
  category: string = ""
): Promise<ProjectWithAuthor[]> => {
  try {
    const projects = await prisma.projects.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          category ? { category: { equals: category } } : {},
        ],
      },
      include: {
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
