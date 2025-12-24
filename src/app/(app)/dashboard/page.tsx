"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Target,
  Layers,
  Megaphone,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCampaigns } from "@/features/dashboard/api";
import { Campaign } from "@/features/dashboard/type";
import { fetchInsights } from "@/features/dashboard/api";
import { useEffect } from "react";

type ChartPoint = {
  date: string;
  spend: number;
  clicks: number;
  impressions: number;
};


export default function DashboardPage() {
  const [range, setRange] = React.useState<"7d" | "30d">("7d");
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [chartData, setChartData] = React.useState<ChartPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalSpend, setTotalSpend] = React.useState(0);
  const [totalClicks, setTotalClicks] = React.useState(0);
  const [totalImpressions, setTotalImpressions] = React.useState(0);


  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [campaignRes] = await Promise.all([
        fetchCampaigns('1382299553408417'),
      ]);

      setCampaigns(campaignRes);
      setLoading(false);
    };

    load();
  }, [range]);
  
  useEffect(() => {
  const loadInsights = async () => {
    const data = await fetchInsights("1570550344300399", range);

    const chart = data.map((d) => ({
      date: d.date_start,
      spend: Number(d.spend || 0),
      clicks: Number(d.clicks || 0),
      impressions: Number(d.impressions || 0),
    }));

    setChartData(chart);
    setTotalSpend(chart.reduce((s, d) => s + d.spend, 0));
    setTotalClicks(chart.reduce((s, d) => s + d.clicks, 0));
    setTotalImpressions(chart.reduce((s, d) => s + d.impressions, 0));
  };

  loadInsights();
}, [range]);

  // === Statistik ===
  const totalCampaigns = campaigns.length;
  const prevCampaigns = totalCampaigns - 1;
  const campaignChange = prevCampaigns > 0 ? ((totalCampaigns - prevCampaigns) / prevCampaigns) * 100 : 0;

  const stats = [
    {
      title: "Total Campaign",
      value: totalCampaigns,
      change: campaignChange.toFixed(1),
      icon: <Target className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      title: "Total Spend (Rp)",
      value: '0',
      change: '0',
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Clicks",
      value: loading ? "-" : totalClicks,
      change: '0',
      icon: <Megaphone className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Impressions",
      value: loading ? "-" : totalImpressions,
      change: '0',
      icon: <Layers className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">
            Pantau performa campaign dan aktivitas iklanmu dari Meta Ads
          </p>
        </div>

        {/* === Statistik Cards (2 jajar) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((item, i) => {
            const isPositive = parseFloat(item.change) >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            const trendColor = isPositive ? "text-green-600" : "text-red-600";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <Card className="flex flex-row items-center justify-between p-5 w-full bg-white shadow-md hover:shadow-lg rounded-2xl transition-all duration-300 ease-in-out">
                  <div>
                    <CardTitle className="text-lg text-slate-700">
                      {item.title}
                    </CardTitle>

                    <p className="text-2xl font-semibold text-slate-900 mt-1">
                      {item.value}
                    </p>

                    {/* Trend indicator */}
                    <div className="flex items-center gap-1 mt-2">
                      <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                      <span className={`text-sm font-medium ${trendColor}`}>
                        {isPositive ? "+" : ""}
                        {item.change}%
                      </span>
                    </div>
                  </div>

                  <div className={`rounded-xl p-3 ${item.bg}`}>
                    {item.icon}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* === Chart Performance Overview === */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-sm text-gray-500">
                Lihat performa berdasarkan waktu dan kategori
              </p>
            </div>

            <div className="flex gap-2">
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
                key={range}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="spend" stroke="#16a34a" dot />
                    <Line type="monotone" dataKey="clicks" stroke="#0ea5e9" dot />
                    <Line type="monotone" dataKey="impressions" stroke="#a855f7" dot />
                    <Line type="monotone" dataKey="conversions" stroke="#ef4444" dot />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* === Recent Campaigns === */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-2">Campaign Name</th>
                  <th>Objective</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading from Meta Ads...
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2">{c.name}</td>
                      <td>{c.objective}</td>
                      <td>
                        <Badge
                          variant={
                            c.status === "ACTIVE"
                              ? "success"
                              : c.status === "PAUSED"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td>{c.created_time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
