import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CategoryFilter = () => {
  return (
    <form className="relative w-full sm:w-64">
      <Select name="category">
        <SelectTrigger className="py-5 px-4 rounded-xl border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-200 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <SelectItem
            value="all"
            className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            All Categories
          </SelectItem>
          <SelectItem
            value="web"
            className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Web Development
          </SelectItem>
          <SelectItem
            value="mobile"
            className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Mobile App
          </SelectItem>
          <SelectItem
            value="ai"
            className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            AI
          </SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
};

export default CategoryFilter;
