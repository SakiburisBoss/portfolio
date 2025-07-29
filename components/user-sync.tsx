
"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { createOrUpdateUser } from "@/actions/users/create-or-update";

export default function UserSyncTrigger() {
  const { isLoaded, user, isSignedIn } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && user && isSignedIn && !hasSynced.current) {
      hasSynced.current = true;

      // Create/update user first, then sync image
      const syncUser = async () => {
        try {
          // 1. Create or update user
          await createOrUpdateUser();
        } catch (error) {
          console.error("Error in UserSyncTrigger:", error);
        }
      };

      // Small delay to prevent blocking initial render
      const timer = setTimeout(syncUser, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user, isSignedIn]);

  return null;
}