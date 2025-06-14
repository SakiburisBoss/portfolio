'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ErrorPage({ 
  error, 
  reset 
}: { 
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  useEffect(() => {
    if (error) {
      console.error('Page Error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="bg-rose-100 p-6 rounded-full animate-pulse">
              <AlertTriangle className="text-rose-600 w-16 h-16" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              We're working to fix the problem. Please try again later.
            </p>
            
            {/* Safe error details */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm text-gray-700 font-medium mb-2">Error details:</p>
                
                {error.message && (
                  <code className="text-sm text-gray-700 break-words block mb-1">
                    Message: {error.message}
                  </code>
                )}
                
                {error.digest && (
                  <code className="text-sm text-gray-700 break-words block">
                    Digest: {error.digest}
                  </code>
                )}
                
                {!error.message && !error.digest && (
                  <code className="text-sm text-gray-700 break-words block">
                    No additional error information available
                  </code>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {reset && (
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                aria-label="Retry loading the page"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}
            
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all"
              aria-label="Go to home page"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}