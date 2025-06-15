"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from 'cloudinary';

// Define the return type
export type TechFormState = {
  success: boolean;
  error?: string;
};

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createTech = async (
  prevState: TechFormState | null,
  formData: FormData
): Promise<TechFormState> => {
  try {
    const name = formData.get("name") as string;
    const imageFile = formData.get("path") as File;

    // Sanitize and validate name
    const sanitizedName = name.trim();
    if (!sanitizedName || sanitizedName.length > 100) {
      return { success: false, error: "Name must be between 1-100 characters" };
    }

    // Validate image
    if (!imageFile) {
      return { success: false, error: "Image is required" };
    }

    if (!imageFile.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      return { success: false, error: "File too large (max 2MB)" };
    }

    // Upload to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'tech-icons' },
        (error, result) => {
          if (error) reject(error);
          if (result) resolve(result);
        }
      ).end(buffer);
    });

    const imageUrl = result.secure_url;

    // Verify user permissions
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
    
   
    const user = await (await clerkClient()).users.getUser(userId);
    const emails = user.emailAddresses.map(e => e.emailAddress);
    
    const allowedEmail = process.env.ADMIN_EMAIL || 'iamsakibur@gmail.com';
    if (!emails.includes(allowedEmail)) {
      return { success: false, error: "Forbidden" };
    }

    // Check for existing tech
    const existingTech = await prisma.techs.findFirst({
      where: { name: sanitizedName },
    });
    
    if (existingTech) {
      return { success: false, error: "Tech with this name already exists" };
    }

    // Create database record
    await prisma.techs.create({
      data: {
        name: sanitizedName,
        path: imageUrl,
      },
    });

    revalidatePath("/me/techs");
    return { success: true };

  } catch (error: unknown) {
    console.error("Create Tech Error:", error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || "Failed to create tech",
      };
    }
    
    return {
      success: false,
      error: "An unknown error occurred",
    };
  } finally {
    redirect("/me/techs");
  }
};