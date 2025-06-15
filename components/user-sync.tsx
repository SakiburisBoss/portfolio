// components/UserSyncTrigger.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Changed from useClerk
import { syncCurrentUser } from "@/actions/sync-current-user";

export default function UserSyncTrigger() {
  // Use useUser hook instead of useClerk
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Add slight delay to avoid blocking initial render
      const timer = setTimeout(() => {
        syncCurrentUser().catch(console.error);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user]);

  return null;
}