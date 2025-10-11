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
  Megaphone,
  ShoppingBag,
  Layers,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const items = [
  {
    key: "user-management",
    title: "User Management",
    icon: Users,
    items: [
      { key: "all-users", title: "All Users", url: "/user-management" },
      { key: "create-user", title: "Create User", url: "/user-management/create" },
    ],
  },
  {
    key: "campaign",
    title: "Campaign",
    icon: Megaphone,
    items: [
      { key: "all-campaign", title: "All Campaigns", url: "/campaign" },
      { key: "create-campaign", title: "Create Campaign", url: "/campaign/create" },
    ],
  },
  {
    key: "ad",
    title: "Ad",
    icon: ShoppingBag,
    items: [
      { key: "all-ads", title: "All Ads", url: "/ad" },
      { key: "create-ad", title: "Create Ad", url: "/ad/create" },
    ],
  },
  {
    key: "ad-set",
    title: "Ad Set",
    icon: Layers,
    items: [
      { key: "all-ad-set", title: "All Ad Sets", url: "/ad-set" },
      { key: "create-ad-set", title: "Create Ad Set", url: "/ad-set/create" },
    ],
  },
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
              src="/ecogovern-logo.png"
              alt="Ecogovern"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </SidebarGroupLabel>

          <Separator className="my-2" />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isOpen = openGroups.includes(item.key);
                return (
                  <div key={item.key}>
                    {/* Parent menu (collapsible header) */}
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

                    {/* Sub items */}
                    {isOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.items.map((subItem) => (
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
