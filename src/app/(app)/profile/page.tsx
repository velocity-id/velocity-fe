"use client";

import {
  Camera,
  Facebook,
  Instagram,
  Link as LinkIcon,
  LogOut,
  ShieldCheck,
  Tag,
  User,
  Users
} from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";



import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 p-6 space-y-6 transition-colors">

      {/* ================= HEADER ================= */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Avatar dan nama bisnis */}
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                {session?.user?.name?.[0] ?? "A"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold">{session?.user?.name ?? "Admin"}</h1>
              <p className="text-gray-600 dark:text-gray-400">{session?.user?.email ?? "No email"}</p>

              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                  <ShieldCheck size={12} /> Verified Business
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* Tombol-tombol aksi */}
          <div className="flex flex-wrap gap-3">

            {/* 🔗 Open Meta */}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                window.open("https://adsmanager.facebook.com/adsmanager/", "_blank");
              }}
            >
              <LinkIcon size={16} />
              Open in Meta
            </Button>

            {/* 🚪 Logout */}
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 gap-2"
              onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut size={16} />
              Logout
            </Button>

          </div>
        </div>
      </Card>


      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm mt-6">
        © 2025 Velocity — Meta Ads Integrated Profile
      </footer>
    </main>
  );
}



interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function CardWithHeader({ title, icon, children, className, ...props }: CardProps) {
  return (
    <Card className={`p-6 space-y-3 ${className}`} {...props}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-2">
          {icon}
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
        </div>
      )}
      {children}
    </Card>
  );
}

function Info({
  icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-none">
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-500">{icon}</span>}
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p
        className={cn(
          "text-sm font-medium",
          highlight
            ? "text-green-600 dark:text-green-400"
            : "text-gray-900 dark:text-gray-100"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function SubInfo({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className="p-4 bg-gray-50 dark:bg-gray-800">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`font-semibold ${highlight ? "text-green-600 dark:text-green-400" : ""
          }`}
      >
        {value}
      </p>
    </Card>
  );
}

function SocialItem({
  name,
  handle,
  followers,
  posts,
  category,
}: {
  name: string;
  handle?: string;
  followers: string;
  posts?: number;
  category?: string;
}) {
  const isInstagram = name.startsWith("@");
  return (
    <Card className="p-4 mb-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        {isInstagram ? (
          <Instagram className="text-pink-500" size={18} />
        ) : (
          <Facebook className="text-blue-600" size={18} />
        )}
        <p className="font-semibold">{name}</p>
      </div>

      {handle && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <User size={14} />
          <span>{handle}</span>
        </div>
      )}

      {category && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <Tag size={14} />
          <span>{category}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{followers} Followers</span>
        </div>
        {posts !== undefined && (
          <div className="flex items-center gap-1">
            <Camera size={14} />
            <span>{posts} posts</span>
          </div>
        )}
      </div>
    </Card>
  );
}

