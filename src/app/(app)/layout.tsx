import { cookies } from "next/headers"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-dvh">
        <SidebarTrigger userName="Admin Bumi Tauhid" />
        <main className="px-10 py-5 bg-blue-50 gap-5 flex flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>

  )
}
