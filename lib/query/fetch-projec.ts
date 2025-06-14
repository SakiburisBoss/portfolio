import { prisma } from "../prisma"

export const fetchProjectByQuery = async (searchText: string) => {
    return await prisma.projects.findMany({
        where:{
            OR:[
                {title:{
                    contains: searchText,mode: "insensitive"
                }},
                {category: {
                    contains: searchText,mode: "insensitive"
                }},
                {description: {
                    contains: searchText,mode: "insensitive"
                }}
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
    })
}