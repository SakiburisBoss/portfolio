"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import React, { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import { ActionResponse, editProject } from "@/actions/projects/edit-project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Image from "next/image";

type Props = {
  project: Prisma.ProjectsGetPayload<{ include: { author: true } }>;
};

const EditProjectPage: React.FC<Props> = ({ project }) => {
  const projectId = project.id;
  const [selectedCategory, setSelectedCategory] = useState(project.category);
  const [liveDemoUrl, setLiveDemoUrl] = useState(project.liveDemoUrl || "");
  const [codes, setCodes] = useState(project.codes || "");

  // Initialize useActionState with projectId bound to the action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(editProject.bind(null, projectId), {
    success: false,
    message: undefined,
    errors: undefined,
  });

  // Handle category change for select component
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Handle live demo URL input change
  const handleLiveDemoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiveDemoUrl(e.target.value);
  };

  // Handle codes input change
  const handleCodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodes(e.target.value);
  };

  return (
    <div className="animate-fade-in-up">
      <Card
        className="
        bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden
        dark:bg-gray-800/80 dark:border dark:border-gray-700
        group relative transition-all
        dark:before:absolute dark:before:-inset-[2px] dark:before:z-[-1]
        dark:before:rounded-[inherit] dark:before:bg-[conic-gradient(from_var(--angle),transparent_20%,rgba(192,132,252,0.6)_50%,transparent_80%)]
        dark:before:opacity-0 dark:hover:before:opacity-100
        dark:before:transition-opacity dark:before:duration-500
        dark:after:absolute dark:after:-inset-[3px] dark:after:z-[-2]
        dark:after:rounded-[inherit] dark:after:bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.4)_0%,transparent_70%)]
        dark:after:blur-[12px] dark:after:opacity-0 dark:hover:after:opacity-100
        dark:after:transition-opacity dark:after:duration-700
      "
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form Section */}
            <div>
              <h2
                className={cn(
                  "text-2xl font-bold mb-6 pb-2 border-b",
                  "text-gray-900 border-gray-200",
                  "dark:text-white dark:border-gray-700"
                )}
              >
                Edit Project
              </h2>

              {/* Status Messages */}
              {state.message && (
                <div
                  className={cn(
                    "mb-4 p-4 rounded-xl",
                    state.success
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                  )}
                >
                  {state.message}
                  {state.errors && (
                    <ul className="mt-2 list-disc list-inside">
                      {Object.entries(state.errors).map(([field, error]) => (
                        <li key={field}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <form action={formAction} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={project.title}
                    placeholder="Enter project title"
                    className="py-5 px-4 rounded-xl border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </Label>
                  <div className="relative">
                    <input
                      type="text"
                      name="category"
                      list="category-options"
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      placeholder="Select or type a category"
                      className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                      required
                    />
                    <datalist id="category-options">
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="AI">AI</option>
                      <option value="Design">Design</option>
                      <option value="Game Development">Game Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Blockchain">Blockchain</option>
                    </datalist>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={project.description}
                    placeholder="Enter project description"
                    rows={5}
                    className="py-3 px-4 rounded-xl border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Live Demo URL */}
                <div className="space-y-2">
                  <Label
                    htmlFor="liveDemoUrl"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Live Demo URL
                    <span className="text-gray-500"> (optional)</span>
                  </Label>
                  <Input
                    type="url"
                    id="liveDemoUrl"
                    name="liveDemoUrl"
                    value={liveDemoUrl}
                    onChange={handleLiveDemoUrlChange}
                    placeholder="Enter live demo URL (e.g., https://example.com)"
                    className="py-5 px-4 rounded-xl border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Featured Image */}
                <div className="space-y-2">
                  <Label
                    htmlFor="featuredImage"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Featured Image
                  </Label>
                  {project.featuredImage && (
                    <div className="mb-3 relative h-48">
                      {" "}
                      {/* Added relative positioning */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Current Image:
                      </p>
                      <Image
                        src={project.featuredImage}
                        fill
                        alt="Current featured"
                        className="object-cover rounded-lg border pointer-events-none" // Removed w-full h-48, added pointer-events-none
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    id="featuredImage"
                    name="featuredImage"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
                    className="px-4 rounded-xl border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Github Code Link */}

                <div className="space-y-2">
                  <Label
                    htmlFor="liveDemoUrl"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Github Code Link
                    <span className="text-gray-500"> (optional)</span>
                  </Label>
                  <Input
                    type="url"
                    id="codes"
                    name="codes"
                    value={codes}
                    onChange={handleCodesChange}
                    placeholder="Enter Github repository URL (e.g., https://github.com/.....)"
                    className="py-5 px-4 rounded-xl border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:focus:ring-blue-500"
                  />
                </div>
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    "px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg",
                    "dark:bg-gradient-to-r dark:from-violet-600 dark:to-indigo-600 dark:hover:from-violet-700 dark:hover:to-indigo-700",
                    isPending && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isPending ? (
                    <span className="animate-pulse">Updating...</span>
                  ) : (
                    "Update Project"
                  )}
                </Button>
              </form>
            </div>

            {/* Live Demo Preview */}
            <div>
              <h2
                className={cn(
                  "text-2xl font-bold mb-6 pb-2 border-b",
                  "text-gray-900 border-gray-200",
                  "dark:text-white dark:border-gray-700"
                )}
              >
                Live Preview
              </h2>
              <div
                className={cn(
                  "relative h-[500px] w-full overflow-hidden rounded-xl border",
                  "border-gray-300 bg-gray-100",
                  "dark:border-gray-700 dark:bg-gray-900/30"
                )}
              >
                {liveDemoUrl ? (
                  <iframe
                    src={liveDemoUrl}
                    title="Live Demo Preview"
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      "bg-gray-100 text-gray-400",
                      "dark:bg-gray-800 dark:text-gray-400"
                    )}
                  >
                    Enter a Live Demo URL to see the preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectPage;
