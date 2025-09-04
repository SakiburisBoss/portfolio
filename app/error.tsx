// app/(next)/error.tsx
"use client";

import { useEffect } from 'react';
import Link from 'next/link';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">Something went wrong!</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-3">{error.message}</p>
        
        {error.digest && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Error digest: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 flex-1 sm:flex-none"
          >
            Try again
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-all duration-200 hover:shadow-lg dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-300 flex-1 sm:flex-none"
          >
            Back to Previous
          </button>
          
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-200 hover:shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 text-center flex-1 sm:flex-none"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}