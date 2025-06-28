// components/UserSyncTrigger.tsx
"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { syncCurrentUser } from "@/actions/sync-current-user";

export default function UserSyncTrigger() {
  const { isLoaded, user } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !hasSynced.current) {
      // Only sync once per session
      hasSynced.current = true;

      // Add delay to avoid blocking initial render
      const timer = setTimeout(() => {
        syncCurrentUser().catch(console.error);
      }, 2000); // Increased delay for better performance

      return () => clearTimeout(timer);
    }
  }, [isLoaded, user]);

  return null;
}
