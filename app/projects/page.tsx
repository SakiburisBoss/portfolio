// app/projects/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProjectGrid from "@/components/projects/projects-grid";
import NoSearchResults from "@/components/no-result";
import Filters from "@/components/filters";
import { fetchProjects } from "@/lib/query/fetch-project";
import { prisma } from "@/lib/prisma";

type SearchPageProps = {
  searchParams: Promise<{ search?: string; category?: string }>;
};
const ProjectsPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const categoriesOfProjects = await prisma.projects.findMany({
    distinct: ["category"], // This ensures only unique category values are returned
    select: { category: true },
  });
  const categories = categoriesOfProjects.map((project) => project.category);
  const searchText = (await searchParams).search || "";
  const category = (await searchParams).category || "";

  const projects = await fetchProjects(searchText, category);

  return (
    <div
      className="relative px-2 py-4 min-h-screen  dark:text-white">

      {/* Header Section */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-purple-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 mb-10 px-4 py-6">
        <h1
          className={cn(
            "text-3xl sm:text-4xl font-extrabold tracking-tight",
            "text-gray-900 dark:text-white"
          )}
        >
          Projects
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto min-w-0">
          <Filters
            initialSearch={searchText}
            initialCategory={category}
            categories={categories}
          />
          <Button
            asChild
            className="py-5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/projects/create">Create New</Link>
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <NoSearchResults />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </div>
  );
};

export default ProjectsPage;
