import { getServerSession } from "next-auth"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { LoadingProvider } from "@/hooks/use-loading"
import { AlertProvider } from "@/hooks/use-alert"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await getServerSession(authOptions)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-dvh">
        <SidebarTrigger
          userName={session?.user?.name ?? "Admin"}
        />

        <LoadingProvider>
          <AlertProvider>
            <main className="px-10 py-5 gap-5 flex flex-col">
              {children}
            </main>
          </AlertProvider>
        </LoadingProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
