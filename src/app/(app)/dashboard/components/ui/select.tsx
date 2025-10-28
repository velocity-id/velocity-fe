"use client";
import * as React from "react";

interface SelectProps {
  children: React.ReactNode;
}

export function Select({ children }: SelectProps) {
  return <div className="relative">{children}</div>;
}

export function SelectTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full border rounded-lg px-3 py-2 text-left bg-white hover:bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <span className="text-gray-600">{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute mt-1 bg-white border rounded-lg shadow-lg w-full z-10">
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <div
      className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
      onClick={() => console.log("Selected:", value)}
    >
      {children}
    </div>
  );
}
