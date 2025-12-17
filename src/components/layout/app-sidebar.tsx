"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Users,
  Layers,
  ChevronDown,
  ChevronRight,
  LucideLayoutDashboard,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

type SidebarItem = {
  key: string;
  title: string;
  icon: React.ElementType;
  url?: string;
  items?: {
    key: string;
    title: string;
    url: string;
  }[];
};

const items: SidebarItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: LucideLayoutDashboard,
    url: "/dashboard",
  },
  {
    key: "advert-click",
    title: "Advert Click",
    icon: Layers,
    url: "/advert-click",
  },
  {
    key: "profile",
    title: "Profile",
    icon: User,
    url: "/profile",
  },
  // {
  //   key: "forecasting",
  //   title: "Forecasting",
  //   icon: Layers,
  //   url: "/forecasting",
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold">
            <Image
              src="/velocity-logo.png"
              alt="Velocity"
              width={50}
              height={40}
            />
          </SidebarGroupLabel>

          <Separator className="my-2" />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isOpen = openGroups.includes(item.key);
                const hasChildren = !!item.items?.length;

                return (
                  <div key={item.key}>
                    {/* Jika punya sub-items → collapsible */}
                    {hasChildren ? (
                      <>
                        <SidebarMenuButton
                          className="flex items-center justify-between w-full cursor-pointer"
                          onClick={() => toggleGroup(item.key)}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </SidebarMenuButton>

                        {isOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.items?.map((subItem) => (
                              <SidebarMenuItem key={subItem.key}>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={subItem.url}
                                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                                      pathname === subItem.url
                                        ? "bg-muted font-semibold"
                                        : "hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Kalau nggak punya sub-item → langsung link */
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url!}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                              pathname === item.url
                                ? "bg-muted font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
