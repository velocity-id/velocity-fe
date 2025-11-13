"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

export default function ThemeProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}
