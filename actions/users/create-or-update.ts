// actions/users/create-or-update.ts
"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createOrUpdateUser() {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress ?? `user-${user.id}@example.com`,
        name: user.firstName || `user-${user.id}`,
        imageUrl: user.imageUrl,
      },
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? `user-${user.id}@example.com`,
        name: user.firstName || `user-${user.id}`,
        imageUrl: user.imageUrl,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    return { success: false, error: "Failed to sync user" };
  }
}
