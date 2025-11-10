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
  const [totalSpend, setTotalSpend] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [campaignRes, insightsRes] = await Promise.all([
        fetchCampaigns(),
        fetchInsights(range),
      ]);

      setCampaigns(campaignRes);
      setChartData(insightsRes);

      const total = insightsRes.reduce((sum: number, item: any) => {
        return sum + Number(item.spend || 0);
      }, 0);

      setTotalSpend(total);
      setLoading(false);
    };

    load();
  }, [range]);

  // === Statistik ===
  const totalCampaigns = campaigns.length;
  const totalClicks = chartData.reduce((sum, d) => sum + (d.clicks || 0), 0);
  const totalImpressions = chartData.reduce(
    (sum, d) => sum + (d.impressions || 0),
    0
  );

  // === Hitung perubahan persentase ===
  const prevSpend = chartData[chartData.length - 2]?.spend || 0;
  const spendChange = prevSpend > 0 ? ((totalSpend - prevSpend) / prevSpend) * 100 : 0;

  const prevClicks = chartData[chartData.length - 2]?.clicks || 0;
  const clicksChange = prevClicks > 0 ? ((totalClicks - prevClicks) / prevClicks) * 100 : 0;

  const prevImpressions = chartData[chartData.length - 2]?.impressions || 0;
  const impressionsChange = prevImpressions > 0 ? ((totalImpressions - prevImpressions) / prevImpressions) * 100 : 0;

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
      value: loading ? "-" : `Rp${totalSpend.toLocaleString("id-ID")}`,
      change: spendChange.toFixed(1),
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Clicks",
      value: loading ? "-" : totalClicks,
      change: clicksChange.toFixed(1),
      icon: <Megaphone className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Impressions",
      value: loading ? "-" : totalImpressions,
      change: impressionsChange.toFixed(1),
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
