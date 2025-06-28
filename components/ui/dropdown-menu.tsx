"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  {
    trigger: React.ReactNode;
    align?: "start" | "center" | "end";
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, trigger, align = "start", ...props }, _ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div
      ref={dropdownRef}
      className={cn("relative inline-block text-left", className)}
      {...props}
    >
      <div onClick={toggleDropdown}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[8rem] rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}) as React.FC<
  {
    trigger: React.ReactNode;
    align?: "start" | "center" | "end";
  } & React.HTMLAttributes<HTMLDivElement>
>;

DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </button>
));

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("my-1 h-px bg-gray-200 dark:bg-gray-800", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  >
    {children}
  </div>
));

DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
