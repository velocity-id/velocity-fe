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
import { fetchCampaigns, fetchInsights } from "@/features/dashboard/api";
import { Campaign } from "@/features/dashboard/type";

type ViewType = "Ad" | "Ad Set" | "Campaign";

export default function DashboardPage() {
  const [view, setView] = React.useState<ViewType>("Campaign");
  const [range, setRange] = React.useState<"7d" | "30d">("7d");
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch Meta Ads
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const campaignData = await fetchCampaigns();
      const insightData = await fetchInsights(range);
      setCampaigns(campaignData);
      setChartData(insightData);
      setLoading(false);
    };
    fetchData();
  }, [range]);

  // Statistik
  const totalCampaigns = campaigns.length;
  const totalSpend = chartData.reduce((sum, d) => sum + (d.spend || 0), 0);
  const totalClicks = chartData.reduce((sum, d) => sum + (d.clicks || 0), 0);
  const totalImpressions = chartData.reduce(
    (sum, d) => sum + (d.impressions || 0),
    0
  );

  const stats = [
    {
      title: "Total Campaigns",
      value: loading ? "-" : totalCampaigns,
      change: 0,
      icon: <Target className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      title: "Total Spend (Rp)",
      value: loading ? "-" : `Rp${(totalSpend * 100).toLocaleString("id-ID")}`,
      change: 0,
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Clicks",
      value: loading ? "-" : totalClicks,
      change: 0,
      icon: <Megaphone className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Impressions",
      value: loading ? "-" : totalImpressions,
      change: 0,
      icon: <Layers className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500">
            Pantau performa campaign dan aktivitas iklanmu dari Meta Ads
          </p>
        </div>

        {/* Statistik (2 atas, 2 bawah) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Chart */}
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#16a34a" dot />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="#ef4444"
                      dot
                    />
                    <Line
                      type="monotone"
                      dataKey="impressions"
                      stroke="#a855f7"
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Campaign Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <p className="text-sm text-gray-500">
              Data diambil langsung dari Meta Ads API
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-2">Campaign Name</th>
                  <th>Objective</th>
                  <th>Budget</th>
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
                      <td>{c.budget}</td>
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
                      <td>{c.date}</td>
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
