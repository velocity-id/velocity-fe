import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
