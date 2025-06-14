import Link from 'next/link';
import { Rocket, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="bg-indigo-100 p-6 rounded-full animate-pulse">
              <Rocket className="text-indigo-600 w-16 h-16" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-8xl md:text-9xl font-bold text-indigo-600 mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              The page you&apos;re looking for might have been moved, deleted, or never existed.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
          
          <div className="mt-10 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search our site..."
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Your App Name • All Rights Reserved
        </div>
      </div>
    </div>
  );
}