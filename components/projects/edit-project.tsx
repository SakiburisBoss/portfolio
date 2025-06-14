"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Prisma, Projects } from "@prisma/client";
import React, { useActionState, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ActionResponse, editProject } from "@/actions/projects/edit-project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

type Props = {
  project: Prisma.ProjectsGetPayload<{ include: { author: true } }>;
};

const EditProjectPage: React.FC<Props> = ({ project }) => {
  const projectId = project.id;
  const [selectedCategory, setSelectedCategory] = useState(project.category);
  const [liveDemoUrl, setLiveDemoUrl] = useState(project.liveDemoUrl || "");

  // Initialize useActionState with projectId bound to the action
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    editProject.bind(null, projectId),
    { success: false, message: undefined, errors: undefined }
  );

  // Handle category change for select component
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Handle live demo URL input change
  const handleLiveDemoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiveDemoUrl(e.target.value);
  };



  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
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
                  <Select
                    name="category"
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="py-5 px-4 rounded-xl border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <SelectItem
                        value="web"
                        className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Web Development
                      </SelectItem>
                      <SelectItem
                        value="mobile"
                        className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Mobile App
                      </SelectItem>
                      <SelectItem
                        value="ai"
                        className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        AI
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Current Image:
                      </p>
                      <img
                        src={project.featuredImage}
                        alt="Current featured"
                        className="w-full h-48 object-cover rounded-lg border"
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
              <motion.div
                className={cn(
                  "relative h-[500px] w-full overflow-hidden rounded-xl border",
                  "border-gray-300 bg-gray-100",
                  "dark:border-gray-700 dark:bg-gray-900/30"
                )}
                whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
                transition={{ duration: 0.3 }}
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
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditProjectPage;
