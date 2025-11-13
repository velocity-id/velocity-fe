import { cookies } from "next/headers"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { LoadingProvider } from "@/hooks/use-loading"
import { AlertProvider } from "@/hooks/use-alert"
import ThemeProviderWrapper from "./_providers/theme-provider"

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-dvh">
        <SidebarTrigger userName="Admin Bumi Tauhid" />
        <LoadingProvider>
          <AlertProvider>
            <ThemeProviderWrapper>
              <main className="px-10 py-5  gap-5 flex flex-col">
                {children}
              </main>
            </ThemeProviderWrapper>
          </AlertProvider>
        </LoadingProvider>

      </SidebarInset>
    </SidebarProvider>

  )
}
