// actions/sync-current-user.ts
"use server";

import { syncUserImage } from "@/lib/synce-user-image";
import { auth } from "@clerk/nextjs/server";



export async function syncCurrentUser() {
  const { userId } =await auth();
  
  if (!userId) {
    return { success: false, message: "User not authenticated" };
  }

  const result = await syncUserImage(userId);
  
  return {
    success: true,
    updated: !!result,
    newImage: result?.newImage
  };
}