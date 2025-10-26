"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Layers, Megaphone, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Statistik ---
const stats = [
  {
    title: "Total Campaign",
    value: 24,
    change: -3,
    icon: <Target className="w-6 h-6 text-blue-500" />,
    bg: "bg-blue-100",
  },
  {
    title: "Total Ad",
    value: 48,
    change: 8,
    icon: <Megaphone className="w-6 h-6 text-green-500" />,
    bg: "bg-green-100",
  },
  {
    title: "Total Ad set",
    value: 36,
    change: 5,
    icon: <Layers className="w-6 h-6 text-purple-500" />,
    bg: "bg-purple-100",
  },
];

// --- Data Chart Berdasarkan View ---
const chartDataByView = {
  Ad: [
    { name: "Mon", clicks: 300, conversions: 1200, impressions: 5000 },
    { name: "Tue", clicks: 500, conversions: 800, impressions: 4000 },
    { name: "Wed", clicks: 700, conversions: 1500, impressions: 7000 },
    { name: "Thu", clicks: 1200, conversions: 2000, impressions: 8500 },
    { name: "Fri", clicks: 2000, conversions: 2800, impressions: 9500 },
    { name: "Sat", clicks: 1700, conversions: 2500, impressions: 8000 },
    { name: "Sun", clicks: 1900, conversions: 2600, impressions: 7800 },
  ],
  "Ad Set": [
    { name: "Mon", clicks: 100, conversions: 2500, impressions: 6000 },
    { name: "Tue", clicks: 500, conversions: 800, impressions: 4500 },
    { name: "Wed", clicks: 200, conversions: 7800, impressions: 10000 },
    { name: "Thu", clicks: 3500, conversions: 5500, impressions: 7000 },
    { name: "Fri", clicks: 6200, conversions: 9500, impressions: 9000 },
    { name: "Sat", clicks: 4700, conversions: 7400, impressions: 5000 },
    { name: "Sun", clicks: 5600, conversions: 2000, impressions: 4500 },
  ],
  Campaign: [
    { name: "Mon", clicks: 500, conversions: 3000, impressions: 7000 },
    { name: "Tue", clicks: 700, conversions: 2500, impressions: 6500 },
    { name: "Wed", clicks: 1000, conversions: 6000, impressions: 9000 },
    { name: "Thu", clicks: 2500, conversions: 8000, impressions: 9500 },
    { name: "Fri", clicks: 4000, conversions: 10000, impressions: 11000 },
    { name: "Sat", clicks: 3200, conversions: 8500, impressions: 9000 },
    { name: "Sun", clicks: 2800, conversions: 7000, impressions: 7500 },
  ],
};

// --- Data Campaigns ---
const campaigns = [
  {
    name: "Summer Sale 2025",
    objective: "Conversions",
    adsets: 5,
    ads: 12,
    status: "Active",
    budget: "$500",
    spend: "$1,234",
    conv: 45,
    date: "Oct 15, 2025",
  },
  {
    name: "Brand Awareness Q4",
    objective: "Brand Awareness",
    adsets: 3,
    ads: 8,
    status: "Active",
    budget: "$300",
    spend: "$892",
    conv: 28,
    date: "Oct 10, 2025",
  },
  {
    name: "Product Launch Campaign",
    objective: "Traffic",
    adsets: 4,
    ads: 10,
    status: "Paused",
    budget: "$400",
    spend: "$567",
    conv: 15,
    date: "Oct 5, 2025",
  },
  {
    name: "Retargeting Campaign",
    objective: "Conversions",
    adsets: 2,
    ads: 6,
    status: "Active",
    budget: "$200",
    spend: "$445",
    conv: 32,
    date: "Oct 1, 2025",
  },
  {
    name: "Holiday Special Promo",
    objective: "Sales",
    adsets: 6,
    ads: 15,
    status: "Draft",
    budget: "$600",
    spend: "$0",
    conv: 0,
    date: "Oct 20, 2025",
  },
];

export default function DashboardPage() {
  const [view, setView] = React.useState<"Ad" | "Ad Set" | "Campaign">("Ad Set");

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">
            Monitor your campaign performance and activities
          </p>
        </div>

        {/* --- Stats Cards --- */}
        <div className="flex flex-col md:flex-row gap-4">
          {stats.map((item, i) => {
            const isPositive = item.change >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            const trendColor = isPositive ? "text-green-500" : "text-red-500";

            return (
              <Card
                key={i}
                className="flex flex-row items-center justify-between p-5 w-full bg-white shadow-sm rounded-2xl"
              >
                <div>
                  <CardTitle className="text-lg text-slate-700">
                    {item.title}
                  </CardTitle>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {item.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <p
                      className={`text-sm font-medium ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? `+${item.change}%` : `${item.change}%`}
                    </p>
                  </div>
                </div>
                <div
                  className={`rounded-xl p-3 ${item.bg} flex items-center justify-center`}
                >
                  {item.icon}
                </div>
              </Card>
            );
          })}
        </div>

        {/* --- Chart Section --- */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-sm text-gray-500">
                Track your campaign metrics over time
              </p>
            </div>

            <div className="flex gap-2">
              {["Ad", "Ad Set", "Campaign"].map((v) => (
                <Button
                  key={v}
                  onClick={() => setView(v as any)}
                  variant={view === v ? "default" : "outline"}
                  className="text-sm"
                >
                  {v}
                </Button>
              ))}

              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Custom Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">This Week</SelectItem>
                  <SelectItem value="30d">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartDataByView[view]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#16a34a" dot />
                    <Line type="monotone" dataKey="conversions" stroke="#ef4444" dot />
                    <Line type="monotone" dataKey="impressions" stroke="#a855f7" dot />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* --- Recent Campaigns --- */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <p className="text-sm text-gray-500">
              Manage and monitor your active campaigns
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-2">Campaign Name</th>
                  <th>Objective</th>
                  <th>Ad Sets</th>
                  <th>Ads</th>
                  <th>Status</th>
                  <th>Daily Budget</th>
                  <th>Spend</th>
                  <th>Conversions</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{c.name}</td>
                    <td>{c.objective}</td>
                    <td>{c.adsets}</td>
                    <td>{c.ads}</td>
                    <td>
                      <Badge
                        variant={
                          c.status === "Active"
                            ? "success"
                            : c.status === "Paused"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td>{c.budget}</td>
                    <td>{c.spend}</td>
                    <td>{c.conv}</td>
                    <td>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
