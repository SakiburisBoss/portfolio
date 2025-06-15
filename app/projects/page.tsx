import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchInput from "@/components/projects/search-input";
import CategoryFilter from "@/components/projects/category-filter";
import ProjectGrid from "@/components/projects/projects-grid";
import { fetchProjectByQuery } from "@/lib/query/fetch-projec";
import NoSearchResults from "@/components/no-result";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    category?: string;
  };
}) {
  const searchText = searchParams?.search || "";
  const projects = await fetchProjectByQuery(searchText);

  return (
    <div
      className={cn(
        "relative container mx-auto px-4 py-8 sm:py-12 min-h-screen",
        "bg-white text-gray-900",
        "dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-950 dark:to-indigo-950 dark:text-white"
      )}
    >
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[800px] before:w-[800px] before:rounded-full before:blur-3xl dark:before:bg-gradient-to-r dark:before:from-violet-600/20 dark:before:to-indigo-600/20 before:bg-gradient-to-r before:from-blue-400/10 before:to-purple-400/10 z-[-1]" />

      {/* Header Section */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <h1
          className={cn(
            "text-3xl sm:text-4xl font-extrabold tracking-tight",
            "text-gray-900 dark:text-white"
          )}
        >
          Projects
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <SearchInput />

          {/* Category Filter */}
          <CategoryFilter />

          {/* Create New Button */}
          <Button
            asChild
            className="py-5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/projects/create">Create New</Link>
          </Button>
        </div>
      </div>

      {/* Show no results message if projects are empty */}
      {projects.length === 0 ? (
        <NoSearchResults />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </div>
  );
}