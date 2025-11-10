"use client";

import React from "react";
import { ShieldCheck, Link as LinkIcon, Zap, RefreshCw } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ProfileExtrasProps {
  businessName?: string;
  manager?: string;
  tokenExpiry?: string;
  connected?: boolean;
  impressions?: number;
  clicks?: number;
  spend?: string;
}

export default function ProfileExtras({
  businessName = "Velocity Official",
  manager = "Velocity Business Manager",
  tokenExpiry = "27 Nov 2025",
  connected = true,
  impressions = 120400,
  clicks = 1200,
  spend = "7.8M",
}: ProfileExtrasProps) {
  return (
    <Card className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Row: top quick info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 bg-blue-600">
            <AvatarImage src="/images/velocity-logo.png" />
            <AvatarFallback>VE</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{businessName}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                <ShieldCheck size={14} /> Verified Business
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${connected ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw size={16} /> Sync Now
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <LinkIcon size={16} /> Open in Meta
          </Button>
        </div>
      </div>

      {/* Row: small stats + manager */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500">Business Manager</p>
          <p className="font-semibold">{manager}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500">Access Token</p>
          <p className="font-semibold">Active · Expires {tokenExpiry}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500">Quick Actions</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="gap-2">
              <Zap size={14} /> Promote
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </Card>
      </div>

      {/* Row: separator + small campaigns summary */}
      <Card className="p-4">
        <p className="text-sm font-medium mb-2">Recent Campaigns Summary</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Impressions</p>
            <p className="font-semibold">{(impressions / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Clicks</p>
            <p className="font-semibold">{(clicks / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Spend</p>
            <p className="font-semibold">Rp {spend}</p>
          </div>
        </div>
      </Card>
    </Card>
  );
}
