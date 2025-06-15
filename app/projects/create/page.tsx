import CreateProjectForm from "@/components/projects/create-form";
import Link from "next/link";


export default function CreateProjectPage() {
  return (
    <div className="relative container mx-auto px-4 py-8 sm:py-12 min-h-screen bg-white text-gray-900 dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-950 dark:to-indigo-950 dark:text-white">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[800px] before:w-[800px] before:rounded-full before:blur-3xl dark:before:bg-gradient-to-r dark:before:from-violet-600/20 dark:before:to-indigo-600/20 before:bg-gradient-to-r before:from-blue-400/10 before:to-purple-400/10 z-[-1]" />
      
      {/* Header with title and back link */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Create New Project
        </h1>
        <Link
          href="/projects"
          className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 font-medium shadow hover:shadow-md dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          Back to Projects
        </Link>
      </div>

      {/* Client Form */}
      <CreateProjectForm />
    </div>
  );
}