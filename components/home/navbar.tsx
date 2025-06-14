import Link from "next/link";
import React from "react";
import { ModeToggle } from "../toggle-theme";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutGrid, PlusCircle } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-red-600 to-indigo-600 dark:from-purple-400 dark:via-red-400 dark:to-indigo-400">
              Sakibur
            </span>
            <span className="text-red-500">&appos;s</span>
          </span>
          <span className="bg-gradient-to-r dark:from-cyan-400 dark:via-yellow-400 dark:to-green-400 bg-clip-text text-transparent from-cyan-700 via-yellow-700 to-green-700 font-extrabold">
            Portfolio
          </span>
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Button asChild variant="journal" className="flex items-center">
            <Link href="/projects" className="flex items-center">
              <LayoutGrid
                className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
              Projects
            </Link>
          </Button>
          <ModeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 flex items-center transition-transform hover:scale-105 duration-200 ease-in-out">
                <PlusCircle className="mr-2 h-4 w-4" />
                Join to Add Your Project
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;