"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Define the return type
export type TechFormState = {
  success: boolean;
  error?: string;
};

export const createTech = async (
  prevState: TechFormState | null,
  formData: FormData
): Promise<TechFormState> => {
  try {
    const name = formData.get("name") as string;
    const imageFile = formData.get("path") as File;

    // Validation
    if (!name || !imageFile) {
      return { success: false, error: "Name and image are required" };
    }

    if (!imageFile.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      return { success: false, error: "File too large (max 2MB)" };
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:${imageFile.type};base64,${base64}`;

    const {userId} = await auth();

    if(!userId){
      return { success: false, error: "User not authenticated" };
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const emails = user.emailAddresses.map(e => e.emailAddress);
    if (!emails.includes('iamsakibur@gmail.com')) {
      return { success: false, error: "Forbidden" };
    }

    // Check if tech with the same name already exists
    const existingTech = await prisma.techs.findFirst({
      where: { name },
    });
    if (existingTech) {
      return { success: false, error: "Tech with this name already exists" };
    }

    // Create database record
    await prisma.techs.create({
      data: {
        name,
        path: imageUrl,
      },
    });

    revalidatePath("/me/techs");

  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create tech",
    };
  }
  redirect("/me/techs");
};
