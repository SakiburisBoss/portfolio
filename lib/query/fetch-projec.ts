import { prisma } from "../prisma";

export const fetchProjectByQuery = async (searchText: string) => {
  // Return empty array immediately if searchText is empty
  if (!searchText.trim()) {
    return await prisma.projects.findMany({
      include: {
        author: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  // Search only when there's actual search text
  return await prisma.projects.findMany({
    where: {
      OR: [
        { title: { contains: searchText, mode: "insensitive" } },
        { category: { contains: searchText, mode: "insensitive" } },
        { description: { contains: searchText, mode: "insensitive" } }
      ]
    },
    include: {
      author: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    }
  });
};