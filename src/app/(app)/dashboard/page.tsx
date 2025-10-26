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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Layers,
  Megaphone,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// === Statistik Kartu ===
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
    title: "Total Ad Set",
    value: 36,
    change: 5,
    icon: <Layers className="w-6 h-6 text-purple-500" />,
    bg: "bg-purple-100",
  },
];

// === Data Chart Unik Tiap Kombinasi ===
const chartDataByViewAndRange = {
  Ad: {
    "7d": [
      { name: "Mon", clicks: 1200, conversions: 800, impressions: 5400 },
      { name: "Tue", clicks: 1600, conversions: 1000, impressions: 7200 },
      { name: "Wed", clicks: 900, conversions: 950, impressions: 6500 },
      { name: "Thu", clicks: 1800, conversions: 1200, impressions: 8000 },
      { name: "Fri", clicks: 2200, conversions: 1500, impressions: 9500 },
      { name: "Sat", clicks: 1700, conversions: 1100, impressions: 8700 },
      { name: "Sun", clicks: 1300, conversions: 900, impressions: 7600 },
    ],
    "30d": [
      { name: "Week 1", clicks: 6500, conversions: 4000, impressions: 27000 },
      { name: "Week 2", clicks: 7200, conversions: 4300, impressions: 28000 },
      { name: "Week 3", clicks: 8400, conversions: 5000, impressions: 31000 },
      { name: "Week 4", clicks: 9100, conversions: 5200, impressions: 34000 },
    ],
  },

  "Ad Set": {
    "7d": [
      { name: "Mon", clicks: 800, conversions: 600, impressions: 4500 },
      { name: "Tue", clicks: 1000, conversions: 700, impressions: 5000 },
      { name: "Wed", clicks: 1500, conversions: 900, impressions: 6000 },
      { name: "Thu", clicks: 2000, conversions: 1200, impressions: 7200 },
      { name: "Fri", clicks: 2500, conversions: 1300, impressions: 7800 },
      { name: "Sat", clicks: 2300, conversions: 1100, impressions: 7600 },
      { name: "Sun", clicks: 1800, conversions: 1000, impressions: 7100 },
    ],
    "30d": [
      { name: "Week 1", clicks: 5500, conversions: 2800, impressions: 20000 },
      { name: "Week 2", clicks: 6000, conversions: 3500, impressions: 22000 },
      { name: "Week 3", clicks: 7200, conversions: 4100, impressions: 24000 },
      { name: "Week 4", clicks: 8000, conversions: 4600, impressions: 26000 },
    ],
  },

  Campaign: {
    "7d": [
      { name: "Mon", clicks: 400, conversions: 900, impressions: 3500 },
      { name: "Tue", clicks: 600, conversions: 1000, impressions: 4000 },
      { name: "Wed", clicks: 800, conversions: 1200, impressions: 4500 },
      { name: "Thu", clicks: 1000, conversions: 1600, impressions: 5200 },
      { name: "Fri", clicks: 1300, conversions: 2000, impressions: 6100 },
      { name: "Sat", clicks: 900, conversions: 1500, impressions: 4800 },
      { name: "Sun", clicks: 700, conversions: 1300, impressions: 4600 },
    ],
    "30d": [
      { name: "Week 1", clicks: 4000, conversions: 7000, impressions: 15000 },
      { name: "Week 2", clicks: 5000, conversions: 8500, impressions: 17000 },
      { name: "Week 3", clicks: 5800, conversions: 9300, impressions: 19000 },
      { name: "Week 4", clicks: 6400, conversions: 10500, impressions: 21000 },
    ],
  },
};

// === Data Campaign (Rupiah) ===
const campaigns = [
  {
    name: "Summer Sale 2025",
    objective: "Conversions",
    adsets: 5,
    ads: 12,
    status: "Active",
    budget: "Rp7.500.000",
    spend: "Rp18.200.000",
    conv: 45,
    date: "15 Okt 2025",
  },
  {
    name: "Brand Awareness Q4",
    objective: "Brand Awareness",
    adsets: 3,
    ads: 8,
    status: "Active",
    budget: "Rp4.500.000",
    spend: "Rp12.400.000",
    conv: 28,
    date: "10 Okt 2025",
  },
  {
    name: "Product Launch Campaign",
    objective: "Traffic",
    adsets: 4,
    ads: 10,
    status: "Paused",
    budget: "Rp6.000.000",
    spend: "Rp8.200.000",
    conv: 15,
    date: "5 Okt 2025",
  },
  {
    name: "Retargeting Campaign",
    objective: "Conversions",
    adsets: 2,
    ads: 6,
    status: "Active",
    budget: "Rp3.000.000",
    spend: "Rp6.200.000",
    conv: 32,
    date: "1 Okt 2025",
  },
  {
    name: "Holiday Special Promo",
    objective: "Sales",
    adsets: 6,
    ads: 15,
    status: "Draft",
    budget: "Rp9.000.000",
    spend: "Rp0",
    conv: 0,
    date: "20 Okt 2025",
  },
];

export default function DashboardPage() {
  const [view, setView] = React.useState<"Ad" | "Ad Set" | "Campaign">("Ad Set");
  const [range, setRange] = React.useState<"7d" | "30d">("7d");

  const chartData = chartDataByViewAndRange[view][range];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500">
            Pantau performa campaign dan aktivitas iklanmu
          </p>
        </div>

        {/* === Statistik Kartu === */}
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

        {/* === Chart === */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-sm text-gray-500">
                Lihat performa berdasarkan waktu dan kategori
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

              <Select onValueChange={(val: "7d" | "30d") => setRange(val)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Pilih Rentang Waktu">
                    {range === "7d" ? "This Week" : "This Month"}
                  </SelectValue>
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
                key={`${view}-${range}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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

        {/* === Campaign Table (Status di kanan) === */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <p className="text-sm text-gray-500">
              Kelola dan pantau campaign aktif kamu
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
                  <th>Budget</th>
                  <th>Spend</th>
                  <th>Conversions</th>
                  <th>Created Date</th>
                  <th>Status</th> {/* ✅ Status pindah ke paling kanan */}
                </tr>
              </thead>

              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{c.name}</td>
                    <td>{c.objective}</td>
                    <td>{c.adsets}</td>
                    <td>{c.ads}</td>
                    <td>{c.budget}</td>
                    <td>{c.spend}</td>
                    <td>{c.conv}</td>
                    <td>{c.date}</td>
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
