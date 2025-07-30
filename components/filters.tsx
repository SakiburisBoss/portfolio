"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";


type FiltersProps = {
  initialSearch: string;
  initialCategory: string;
  categories: string[];
};

export default function Filters({
  initialSearch = "",
  initialCategory = "",
  categories = []
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  // Create query string with updated parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      
      // Reset page number when filters change
      params.delete("page");
      
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(pathname + "?" + createQueryString("search", e.target.value));
  };

  return (
    <div className="flex gap-4 w-full">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search projects..."
          defaultValue={initialSearch}
          onChange={handleSearch}
          className="border p-2 w-full rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Category Filter */}
      <div className="w-64">
        <div className="relative">
          <input
            type="text"
            list="category-options"
            defaultValue={initialCategory}
            onChange={(e) => router.push(pathname + "?" + createQueryString("category", e.target.value))}
            placeholder="Filter by category..."
            className="border p-2 w-full rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <datalist id="category-options">
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>
    </div>
  );
}