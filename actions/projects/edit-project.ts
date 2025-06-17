"use server";

import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Zod schema for project validation
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
 liveDemoUrl: z
    .union([
      z.string().url("Invalid URL format"),
      z.literal(""),
      z.null()
    ])
    .optional()
    .transform(val => val === "" ? null : val),
  featuredImage: z.string().optional(),
  codes: z
    .union([
      z.string().url("Invalid URL format"),
      z.literal(""),
      z.null()
    ])
    .optional()
    .transform(val => val === "" ? null : val),
});

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      { folder: "projects" }
    );

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

export async function editProject(
  projectId: string,
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Unauthorized. Please log in to edit a project.",
      };
    }
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        author: true,
      },
    });
    if (!project) {
      return {
        success: false,
        message: "Project not found.",
      };
    }
    if (project.author.clerkUserId !== userId) {
      redirect("/unauthorized");
    }

    // Process file upload
    const file = formData.get("featuredImage") as File | null;
    let featuredImageUrl: string | undefined;

    if (file && file.size > 0) {
      // File validation
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/jpg",
      ];

      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          message: "Invalid file type",
          errors: {
            featuredImage: "Only JPEG, PNG, GIF or WebP images are allowed",
          },
        };
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          success: false,
          message: "File too large",
          errors: { featuredImage: "Image must be less than 5MB" },
        };
      }

      // Upload to Cloudinary
      featuredImageUrl = await uploadToCloudinary(file);
    }

    // Validate form data
    const validatedData = projectSchema.parse({
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      liveDemoUrl: formData.get("liveDemoUrl"),
      featuredImage: featuredImageUrl,
      codes: formData.get("codes"),
    });

    // Update project in database
    await prisma.projects.update({
      where: { id: projectId },
      data: {
        title: validatedData.title,
        category: validatedData.category,
        description: validatedData.description,
        liveDemoUrl: validatedData.liveDemoUrl,
        featuredImage: featuredImageUrl || undefined, // Only update if new image
        codes: validatedData.codes,
      },
    });

    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects");
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    // Handle Cloudinary errors
    if (error instanceof Error && error.message === "Image upload failed") {
      return {
        success: false,
        message: "Image upload failed. Please try again.",
      };
    }

    console.error("Error updating project:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
  redirect(`/projects/${projectId}`);
}
