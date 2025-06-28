import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ModeToggle } from "../toggle-theme";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutGrid, PlusCircle } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-purple-200/20 dark:border-blue-800/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-2 border-transparent bg-clip-padding flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-br from-purple-500 via-emerald-400 to-purple-600 group-hover:opacity-80 opacity-60 z-0"></div>
              <Image
                src="/favicon.svg"
                alt="Sakibur's Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover rounded-full relative z-10"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent animate-text-shimmer">
              Sakibur
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Portfolio
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex items-center border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50"
          >
            <Link href="/projects" className="flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              View Projects
            </Link>
          </Button>

          <ModeToggle />

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="purple-glow"
                size="sm"
                className="flex items-center h-11 px-4 text-center whitespace-normal leading-tight"
              >
                <PlusCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="block">Join to add your project</span>
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="relative">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 rounded-lg ring-2 ring-purple-200 dark:ring-blue-700 hover:ring-purple-300 dark:hover:ring-blue-600 transition-all duration-300",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
