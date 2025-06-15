"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from 'cloudinary';

// Define the return type
export type UpdateTechFormState = {
  success: boolean;
  error?: string;
};

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const updateTech = async (
  id: number,
  prevState: UpdateTechFormState | null,
  formData: FormData
): Promise<UpdateTechFormState> => {
  try {
    const name = formData.get("name") as string;
    const imageFile = formData.get("path") as File;

    // Sanitize and validate name
    const sanitizedName = name.trim();
    if (!sanitizedName || sanitizedName.length > 100) {
      return { success: false, error: "Name must be between 1-100 characters" };
    }

    let imageUrl: string | undefined;
    
    // Process image if provided
    if (imageFile && imageFile.size > 0) {
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

      imageUrl = result.secure_url;
    }

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

    // Update the database record
    await prisma.techs.update({
      where: { id },
      data: {
        name: sanitizedName,
        ...(imageUrl && { path: imageUrl }), // Only update image if a new one is provided
      },
    });

    revalidatePath("/me/techs");
    return { success: true };

  } catch (error: unknown) {
    console.error("Update tech error:", error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || "Failed to update tech",
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