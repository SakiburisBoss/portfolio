import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "journal"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gradient"
    | "purple-glow";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 btn-modern";

    const variants = {
      default:
        "bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-lg hover:from-purple-700 hover:to-emerald-700 focus-visible:ring-purple-500 dark:from-blue-600 dark:to-teal-600 dark:hover:from-blue-700 dark:hover:to-teal-700 dark:focus-visible:ring-blue-500",
      journal:
        "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 focus-visible:ring-orange-500",
      destructive:
        "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:from-red-600 hover:to-pink-600 focus-visible:ring-red-500",
      outline:
        "border-2 border-purple-200 bg-transparent text-purple-700 shadow-sm hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50 dark:hover:border-blue-600 dark:hover:text-blue-200",
      secondary:
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm hover:from-gray-200 hover:to-gray-300 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600",
      ghost:
        "text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-blue-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-200",
      link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700 dark:text-blue-400 dark:hover:text-blue-300",
      gradient:
        "bg-gradient-to-r from-purple-600 via-emerald-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg focus-visible:ring-purple-500 dark:from-blue-600 dark:via-teal-600 dark:to-blue-600 dark:focus-visible:ring-blue-500",
      "purple-glow":
        "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white shadow-lg hover:shadow-purple-500/25 focus-visible:ring-purple-500 animate-pulse-glow",
    };

    const sizes = {
      default: "h-11 px-6 py-3",
      sm: "h-9 rounded-lg px-4 py-2 text-xs",
      lg: "h-12 rounded-xl px-8 py-4 text-base",
      icon: "h-11 w-11 rounded-xl",
    };

    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
