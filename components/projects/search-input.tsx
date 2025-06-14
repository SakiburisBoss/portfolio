import React from 'react'
import { Input } from '../ui/input'

const SearchInput = () => {
  return (
     <div className="relative w-full sm:w-64">
            <Input
             name="search"
              type="text"
              placeholder="Search projects..."
              className="py-5 px-4 rounded-xl border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:focus:ring-blue-500"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-violet-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
  )
}

export default SearchInput