// lib/query/fetch-projects.ts
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

// Define the return type with author information
type ProjectWithAuthor = Prisma.ProjectsGetPayload<{
  include: {
    author: true;
  };
}>;

// Simple in-memory cache
const cache = new Map<
  string,
  { data: ProjectWithAuthor[]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (search: string, category: string) =>
  `projects:${search}:${category}`;

const isCacheValid = (timestamp: number) => Date.now() - timestamp < CACHE_TTL;

export const fetchProjects = async (
  search: string = "",
  category: string = ""
): Promise<ProjectWithAuthor[]> => {
  try {
    const cacheKey = getCacheKey(search, category);
    const cached = cache.get(cacheKey);

    // Return cached data if valid
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

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

    // Cache the result
    cache.set(cacheKey, { data: projects, timestamp: Date.now() });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Clear cache when projects are modified
export const clearProjectsCache = () => {
  cache.clear();
};
