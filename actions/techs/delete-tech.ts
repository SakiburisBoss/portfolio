"use server";

import {prisma} from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteTech = async (id: number) => {
  try {
    const {userId}=await auth();

    if(!userId){
      return { error: "User not authenticated" };
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const emails = user.emailAddresses.map(e => e.emailAddress);
    if (!emails.includes('iamsakibur@gmail.com')) {
      return { error: "Forbidden" };
    }
    await prisma.techs.delete({
      where: { id }
    });
    revalidatePath("/me/techs");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete technology" };
  }
};