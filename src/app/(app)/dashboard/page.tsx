// ===============================
// File: app/(app)/dashboard/page.tsx
// ===============================

"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Target, Layers, Megaphone, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCampaigns, fetchInsights } from "@/features/dashboard/api";
import type { Campaign } from "@/features/dashboard/type";

type ViewType = "Ad" | "Ad Set" | "Campaign";

export default function DashboardPage() {
  const [view] = React.useState<ViewType>("Campaign");
  const [range, setRange] = React.useState<"7d" | "30d">("7d");
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [totalSpend, setTotalSpend] = React.useState(0);
  const [totalClicks, setTotalClicks] = React.useState(0);
  const [totalImpressions, setTotalImpressions] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [campaignRes, insightsRes] = await Promise.all([
        fetchCampaigns(),
        fetchInsights(range),
      ]);

      setCampaigns(campaignRes);
      setChartData(insightsRes);

      const spendSum = insightsRes.reduce((s: number, r: any) => s + (Number(r.spend) || 0), 0);
      const clicksSum = insightsRes.reduce((s: number, r: any) => s + (Number(r.clicks) || 0), 0);
      const impSum = insightsRes.reduce((s: number, r: any) => s + (Number(r.impressions) || 0), 0);

      setTotalSpend(spendSum);
      setTotalClicks(clicksSum);
      setTotalImpressions(impSum);
      setLoading(false);
    };

    load();
  }, [range]);

  const last = chartData[chartData.length - 1] || {};
  const prev = chartData[chartData.length - 2] || {};

  const pct = (curr: number = 0, prev: number = 0) => {
    if (!prev || prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  };

  const spendChange = pct(last.spend, prev.spend);
  const clicksChange = pct(last.clicks, prev.clicks);
  const impressionsChange = pct(last.impressions, prev.impressions);

  const stats = [
    {
      title: "Total Campaigns",
      value: loading ? "-" : campaigns.length,
      change: 0,
      icon: <Target className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      title: "Total Spend (Rp)",
      value: loading ? "-" : `Rp${totalSpend.toLocaleString("id-ID")}`,
      change: Number(spendChange.toFixed(1)),
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Clicks",
      value: loading ? "-" : totalClicks,
      change: Number(clicksChange.toFixed(1)),
      icon: <Megaphone className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Impressions",
      value: loading ? "-" : totalImpressions,
      change: Number(impressionsChange.toFixed(1)),
      icon: <Layers className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Pantau performa campaign dan aktivitas iklanmu dari Meta Ads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((item, i) => {
            const showChange = typeof item.change === "number" && !isNaN(item.change!);
            const positive = (item.change ?? 0) >= 0;
            const TrendIcon = positive ? TrendingUp : TrendingDown;

            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }} whileHover={{ y: -4, scale: 1.02 }} className="transition-all duration-300 ease-in-out"><Card className="flex flex-row items-center justify-between p-5 bg-white shadow-sm rounded-2xl">
                <div>
                  <CardTitle className="text-lg text-slate-700">{item.title}</CardTitle>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">{item.value}</p>

                  {showChange && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendIcon className={`w-4 h-4 ${positive ? "text-green-600" : "text-red-600"}`} />
                      <p className={`text-sm font-medium ${positive ? "text-green-700" : "text-red-700"}`}> 
                        {positive ? "+" : ""}{item.change?.toFixed(1)}%
                      </p>
                      
                    </div>
                  )}
                </div>

                <div className={`rounded-xl p-3 ${item.bg}`}>{item.icon}</div>
              </Card></motion.div>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-sm text-gray-500">Lihat performa berdasarkan waktu dan kategori</p>
            </div>
            <Select value={range} onValueChange={(v: "7d" | "30d") => setRange(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue>{range === "7d" ? "This Week" : "This Month"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">This Week</SelectItem>
                <SelectItem value="30d">This Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent className="h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={range}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.1 }}
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <p className="text-sm text-gray-500">Data diambil langsung dari Meta Ads API</p>
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
                    <td colSpan={5} className="text-center py-4">Loading from Meta Ads...</td>
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
