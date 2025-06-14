"use server";

import { redirect } from "next/navigation";


export const searchAction = async (formData: FormData) => {
    const searchText = formData.get("search")

    if(typeof searchText !== "string" || searchText.length === 0){
        return [];
    }

    redirect(`/projects/search/${searchText}`)
}