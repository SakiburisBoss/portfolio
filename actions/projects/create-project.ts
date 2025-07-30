"use server";

import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

// Fixed Zod schema with proper nullable URL handling
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
    .transform(val => val === "" ? null : val), // Convert empty string to null
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
      {
        folder: "projects",
        resource_type: "auto",
      }
    );
    
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

// Create project action with fixed validation
export async function createProject(
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Authentication check
    const user =await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized. Please log in to create a project.",
      };
    }

   

    // Process file upload
    const file = formData.get("featuredImage") as File | null;
    let featuredImageUrl: string | undefined;

    if (file && file.size > 0) {
      // File validation
      const validTypes = [
        "image/jpeg", "image/png", "image/gif", 
        "image/webp", "image/jpg"
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

      featuredImageUrl = await uploadToCloudinary(file);
    }

    // Get form data
    const liveDemoUrlInput = formData.get("liveDemoUrl");
    const liveDemoUrl = liveDemoUrlInput === "" ? null : liveDemoUrlInput;

    // Get form data
    const codesInput = formData.get("codes");
    const codes = codesInput === "" ? null : codesInput;

    // Validate form data
    const validatedData = projectSchema.parse({
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      liveDemoUrl: liveDemoUrl,
      featuredImage: featuredImageUrl,
      codes: codes,
    });

    // Create project in database
    await prisma.projects.create({
      data: {
        title: validatedData.title,
        category: validatedData.category,
        description: validatedData.description,
        liveDemoUrl: validatedData.liveDemoUrl, // Can be null
        featuredImage: validatedData.featuredImage || "",
        codes: validatedData.codes,
        authorId: user.id,
      },
    });

   
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach(issue => {
        const path = issue.path.join('.');
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

    console.error("Error creating project:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
  revalidatePath("/projects");
  redirect("/projects");
}