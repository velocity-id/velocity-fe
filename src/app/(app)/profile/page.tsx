"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { fetchProfileData } from "@/features/profile/api";
import { ProfileData } from "@/features/profile/type";
import {
  User,
  MapPin,
  Edit3,
  RefreshCw,
  LogOut,
  CheckCircle,
  Link as LinkIcon,
  Settings,
  Facebook,
  Instagram,
  Tag,
  Users,
  Camera,
  ShieldCheck,
  Sun,
  Moon,
  Phone,
  Mail,
  Calendar,
  IdCard,
  Briefcase,
  Hash,
  DollarSign,
  Clock,
  Cloud,
  Bell,
  Lock,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

async function getFacebookProfile(token: string) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`
    );
    const data = await res.json();
    if (data.error) {
      console.error("❌ Facebook API Error:", data.error);
      return null;
    }
    return data; // { id, name }
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    return null;
  }
}


export default function Page() {
  const [connected, setConnected] = useState(true);
  const [campaignNotifications, setCampaignNotifications] = useState(true);
  const { theme, setTheme } = useTheme();
  const [fbName, setFbName] = useState<string>("Loading...");


  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;

    if (!token) {
      console.warn("⚠️ Missing NEXT_PUBLIC_FB_ACCESS_TOKEN");
      setFbName("Token Not Found");
      return;
    }

    // panggil fungsi
    getFacebookProfile(token).then((profile) => {
      if (profile?.name) {
        setFbName(profile.name);
      } else {
        setFbName("Unknown User");
      }
    });
  }, []);

  // Dummy dynamic data (bisa nanti diganti API)
  const data = {
    business: {
      name: "PT Velocity Indonesia",
      location: "Jakarta, Indonesia",
      website: "www.velocity.co.id",
      phone: "+62 21 1234 5678",
      email: "velocity.rplupi@gmail.com",
      since: "15 Jan 2020",
      verified: true,
    },
    metaAds: {
      managerId: "2237849152",
      adAccountName: "Velocity Official Ads",
      adAccountId: "act_102983554",
      currency: "IDR (Indonesian Rupiah)",
      created: "15 Jan 2020",
    },
    manager: {
      name: "Velocity Business Manager",
      verified: true,
      teamMembers: 8,
      adAccounts: 3,
      tokenStatus: "Active",
      tokenExpiry: "27 Nov 2025",
    },
    social: {
      facebook: [
        { name: "Velocity Official", handle: "@velocityofficial", followers: "125K", category: "Technology" },
        { name: "Velocity Gaming", handle: "@velocitygaming", followers: "85K", category: "Gaming" },
      ],
      instagram: [
        { name: "@velocityofficial", followers: "92K", posts: 1234 },
        { name: "@velocitygaming", followers: "63K", posts: 856 },
      ],
    },
  };

  return (
  <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 p-6 space-y-6 transition-colors">
    
    {/* ================= HEADER ================= */}
<Card className="p-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
    {/* Avatar dan nama bisnis */}
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20 bg-blue-600">
        <AvatarFallback>VE</AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-2xl font-semibold">{fbName}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Ad Account ID: {process.env.NEXT_PUBLIC_AD_ACCOUNT_ID}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Velocity Official Ads</p>

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
      {/* ✅ Edit Profile */}
     <Dialog>
  <DialogTrigger asChild>
    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
      <Edit3 size={16} />
      Edit Profile
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Business Profile</DialogTitle>
    </DialogHeader>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("✅ Profile updated (simulasi frontend)");
      }}
      className="space-y-5"    >
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Business Name</Label>
        <Input defaultValue={data.business.name} placeholder="Enter business name" className="py-2.5" />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Email</Label>
        <Input defaultValue={data.business.email} placeholder="Enter email address" type="email" className="py-2.5" />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Phone Number</Label>
        <Input defaultValue={data.business.phone} placeholder="Enter phone number" className="py-2.5" />
      </div>
      
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
        Save Changes
      </Button>
    </form>
  </DialogContent>
</Dialog>

      <Button
  variant="outline"
  className={`gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer ${
    connected ? "" : "animate-pulse"
  }`}
  onClick={() => {
    setConnected(false);
    setTimeout(() => {
      setConnected(true);
      alert("✅ Meta Ads data synced successfully!");
    }, 1500);
  }}
>
  <RefreshCw size={16} className={connected ? "" : "animate-spin"} />
  {connected ? "Sync Meta Ads" : "Reconnecting..."}
</Button>

      {/* 🔗 Open Meta */}
      <Button variant="outline" className="gap-2 cursor-pointer">
        <LinkIcon size={16} />
        Open in Meta
      </Button>

      {/* 🚪 Logout */}
      <Button variant="ghost" className="text-gray-600 hover:text-gray-900 gap-2 cursor-pointer">
        <LogOut size={16} />
        Logout
      </Button>

      <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>


    </div>
  </div>
</Card>


      {/* ================= BUSINESS PROFILE + META ACCOUNT ================= */}
<section className="grid md:grid-cols-2 gap-6">
  {/* ========== BUSINESS INFO ========== */}
  <CardWithHeader title="Business Profile Information">
    <Info icon={<User size={16} />} label="Business Name" value={data.business.name} />
    <Info icon={<MapPin size={16} />} label="Business Location" value={data.business.location} />
    <Info icon={<LinkIcon size={16} />} label="Website" value={data.business.website} />
    <Info icon={<Phone size={16} />} label="Phone Number" value={data.business.phone} />
    <Info icon={<Mail size={16} />} label="Email" value={data.business.email} />
    <Info icon={<Calendar size={16} />} label="Business Since" value={data.business.since} />
    <Info
      icon={<ShieldCheck size={16} />}
      label="Verification Status"
      value={data.business.verified ? "Verified Business" : "Not Verified"}
      highlight={data.business.verified}
    />
  </CardWithHeader>

  {/* ========== META ADS INFO ========== */}
  <CardWithHeader title="Meta Ads Account">
    <Info icon={<IdCard size={16} />} label="Business Manager ID" value={data.metaAds.managerId} />
    <Info icon={<Briefcase size={16} />} label="Ad Account Name" value={data.metaAds.adAccountName} />
    <Info icon={<Hash size={16} />} label="Ad Account ID" value={data.metaAds.adAccountId} />
    <Info icon={<DollarSign size={16} />} label="Account Currency" value={data.metaAds.currency} />
    <Info icon={<Clock size={16} />} label="Account Created" value={data.metaAds.created} />
    <Info
      icon={<Cloud size={16} />}
      label="API Connection"
      value={connected ? "Connected" : "Disconnected"}
      highlight={connected}
    />
  </CardWithHeader>
</section>


      {/* ================= BUSINESS MANAGER ================= */}
      <CardWithHeader title="Business Manager Details">
        <div className="grid md:grid-cols-3 gap-4">
          <SubInfo title="Business Manager Name" value={data.manager.name} />
          <SubInfo
            title="Business Verification"
            value={data.manager.verified ? "Verified" : "Pending"}
            highlight={data.manager.verified}
          />
          <SubInfo title="Team Members" value={`${data.manager.teamMembers} Active Users`} />
          <SubInfo title="Ad Accounts" value={`${data.manager.adAccounts} Linked Accounts`} />
          <SubInfo title="Access Token" value={data.manager.tokenStatus} />
          <SubInfo title="Expires On" value={data.manager.tokenExpiry} />
        </div>
      </CardWithHeader>

      {/* ================= SOCIAL ACCOUNTS ================= */}
      <section className="grid md:grid-cols-2 gap-6">
        <CardWithHeader title="Facebook Pages" icon={<Facebook className="text-blue-600" size={18} />}>
          {data.social.facebook.map((page, i) => (
            <SocialItem key={i} name={page.name} handle={page.handle} followers={page.followers} category={page.category} />
          ))}
        </CardWithHeader>

        <CardWithHeader title="Instagram Accounts" icon={<Instagram className="text-pink-500" size={18} />}>
          {data.social.instagram.map((acc, i) => (
            <SocialItem key={i} name={acc.name} followers={acc.followers} posts={acc.posts} />
          ))}
        </CardWithHeader>
      </section>

      {/* ================= SETTINGS ================= */}
      <CardWithHeader title="Settings & Integration" icon={<Settings size={18} />}>
        <div className="space-y-6">
          {/* Access & Security Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Access & Security</h3>
            <Info label="Meta Ads Access Token" value={`Valid until ${data.manager.tokenExpiry}`} />
            <Info label="Account Status" value="Active" highlight={true} />
            <Info label="Last Sync" value="2 minutes ago" />
          </div>

          {/* Meta Integration Features Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Meta Integration</h3>
            
            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
              <div className="flex items-center gap-2">
                <Facebook size={16} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Facebook Page Insights</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View analytics and performance</p>
                </div>
              </div>
              <CheckCircle size={16} className="text-green-500" />
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
              <div className="flex items-center gap-2">
                <Instagram size={16} className="text-pink-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Instagram Insights</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monitor account activity</p>
                </div>
              </div>
              <CheckCircle size={16} className="text-green-500" />
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition" onClick={() => setCampaignNotifications(!campaignNotifications)}>
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Campaign Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get alerts for important events</p>
                </div>
              </div>
              <Switch 
                checked={campaignNotifications}
                onCheckedChange={setCampaignNotifications}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">API Permissions</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage access rights</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                Manage
              </Button>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reconnect Meta Ads
            </Button>
            <Button variant="destructive" className="flex-1 cursor-pointer">
              Delete Account
            </Button>
          </div>
        </div>
      </CardWithHeader>

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
        className={`font-semibold ${
          highlight ? "text-green-600 dark:text-green-400" : ""
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

