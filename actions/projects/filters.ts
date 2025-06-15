// app/actions.ts
"use server";

import { redirect } from "next/navigation";

const updateQueryParam = (
  currentQuery: string | null,
  key: string,
  value: string | null
) => {
  const params = new URLSearchParams(currentQuery || "");
  
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  
  // Reset pagination when filters change
  params.delete("page");
  
  return params.toString();
};

export const searchAction = async (formData: FormData) => {
  const searchText = formData.get("search") as string | null;
  const currentQuery = formData.get("currentQuery") as string | null;
  
  const newQuery = updateQueryParam(currentQuery, "search", searchText);
  redirect(`/projects?${newQuery}`);
};

export const categoryAction = async (formData: FormData) => {
  const category = formData.get("category") as string | null;
  const currentQuery = formData.get("currentQuery") as string | null;
  
  const newQuery = updateQueryParam(currentQuery, "category", category);
  redirect(`/projects?${newQuery}`);
};