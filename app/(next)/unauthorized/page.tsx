"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Unauthorized Access
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          You do not have permission to access this page.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Previous
        </Button>
      </div>
    </section>
  );
}
