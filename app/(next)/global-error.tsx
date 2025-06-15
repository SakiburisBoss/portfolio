// app/(next)/global-error.tsx
"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-3">Global Error</h2>
            <p className="text-gray-700 mb-3">{error.message}</p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-3"
            >
              Try again
            </button>
            <p className="text-sm text-gray-500">
              If this persists, contact support
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}