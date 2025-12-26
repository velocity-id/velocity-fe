"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdAccounts } from "@/features/campaign/api";
import { fetchCampaigns, fetchInsights } from "@/features/dashboard/api";
import { Campaign } from "@/features/dashboard/type";
import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  Layers,
  Megaphone,
  Target
} from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  const [adAccounts, setAdAccounts] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [selectedAdAccount, setSelectedAdAccount] =
    React.useState<string | null>(null);

  useEffect(() => {
    const loadAdAccounts = async () => {
      const [resAdAccount] = await Promise.all([getAdAccounts()]);
      setAdAccounts(resAdAccount);

      // auto select pertama
      if (resAdAccount.length > 0) {
        setSelectedAdAccount(resAdAccount[0].id);
      }
    };

    loadAdAccounts();
  }, []);


  useEffect(() => {
    const loadInsights = async () => {
      if (selectedAdAccount != null) {
        const data = await fetchInsights(selectedAdAccount!, range);
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

      }

    };

    loadInsights();
  }, [range]);

  useEffect(() => {
    if (!selectedAdAccount) return;

    const load = async () => {
      setLoading(true);

      const campaigns = await fetchCampaigns(selectedAdAccount);
      setCampaigns(campaigns);

      const data = await fetchInsights(selectedAdAccount, range);

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

      setLoading(false);
    };

    load();
  }, [selectedAdAccount, range]);

  // === Statistik ===
  const totalCampaigns = campaigns.length;

  const stats = [
    {
      title: "Total Campaign",
      value: totalCampaigns,
      icon: <Target className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      title: "Total Spend (Rp)",
      value: '0',
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Clicks",
      value: loading ? "-" : totalClicks,
      icon: <Megaphone className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Impressions",
      value: loading ? "-" : totalImpressions,
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
          <div>
            <h2 className="font-semibold mb-2">Ad Account</h2>

            <Select
              value={selectedAdAccount ?? ""}
              onValueChange={(val) => setSelectedAdAccount(val)}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select Ad Account" />
              </SelectTrigger>

              <SelectContent>
                {adAccounts.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* === Statistik Cards (2 jajar) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((item, i) => {
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
