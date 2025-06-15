// lib/sync-user-image.ts
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUserImage(clerkUserId: string) {
  try {
    // Get Clerk user data
    const clerkUser = await (await clerkClient()).users.getUser(clerkUserId);
    
    // Get corresponding database user
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true, imageUrl: true }
    });

    if (!dbUser) {
      console.warn(`User not found in database: ${clerkUserId}`);
      return null;
    }

    // Skip if image hasn't changed
    if (!clerkUser.imageUrl || dbUser.imageUrl === clerkUser.imageUrl) {
      return null;
    }

    // Update database
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { imageUrl: clerkUser.imageUrl }
    });

    return {
      userId: dbUser.id,
      oldImage: dbUser.imageUrl,
      newImage: clerkUser.imageUrl
    };
  } catch (error) {
    console.error(`Error syncing user ${clerkUserId}:`, error);
    return null;
  }
}