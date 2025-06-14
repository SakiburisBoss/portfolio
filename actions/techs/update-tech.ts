"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type UpdateTechFormState = {
  success: boolean;
  error?: string;
};

export const updateTech = async (
  id: number,
  prevState: UpdateTechFormState | null,
  formData: FormData
): Promise<UpdateTechFormState> => {
  try {
    const name = formData.get("name") as string;
    const imageFile = formData.get("path") as File;

    // If a new image is provided, validate and process it
    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        return { success: false, error: "Only image files are allowed" };
      }

      if (imageFile.size > 2 * 1024 * 1024) {
        return { success: false, error: "File too large (max 2MB)" };
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      imageUrl = `data:${imageFile.type};base64,${base64}`;
    }

    const {userId} = await auth();

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const emails = user.emailAddresses.map(e=>e.emailAddress);
    if(!emails.includes('iamsakibur@gmail.com')){
      return { success: false, error: "Forbidden" };
    }

    // If no name is provided, return an error
    if (!name) {
      return { success: false, error: "Name is required" };
    }

    // Update the database record
    await prisma.techs.update({
      where: { id },
      data: {
        name,
        ...(imageUrl && { path: imageUrl }), // Only update image if a new one is provided
      },
    });

    revalidatePath("/me/techs");
  } catch (error: any) {
    console.error("Update tech error:", error);
    return {
      success: false,
      error: error.message || "Failed to update tech",
    };
  }
  redirect("/me/techs");
};