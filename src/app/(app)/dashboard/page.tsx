"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Formik, Form } from "formik";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- Data Dummy ---
const stats = [
  { title: "Total Campaign", value: 24, change: "+12% from last month", icon: "🎯" },
  { title: "Total Ad", value: 24, change: "+12% from last month", icon: "📣" },
  { title: "Total Ad Set", value: 24, change: "+12% from last month", icon: "🧱" },
];

const chartData = [
  { name: "Mon", clicks: 100, conversions: 2500, impressions: 6000 },
  { name: "Tue", clicks: 500, conversions: 800, impressions: 4500 },
  { name: "Wed", clicks: 200, conversions: 7800, impressions: 10000 },
  { name: "Thu", clicks: 3500, conversions: 5500, impressions: 7000 },
  { name: "Fri", clicks: 6200, conversions: 9500, impressions: 9000 },
  { name: "Sat", clicks: 4700, conversions: 7400, impressions: 5000 },
  { name: "Sun", clicks: 5600, conversions: 2000, impressions: 4500 },
];

const campaigns = [
  { name: "Summer Sale 2025", objective: "Conversions", adsets: 5, ads: 12, status: "Active", budget: "$500", spend: "$1,234", conv: 45, date: "Oct 15, 2025" },
  { name: "Brand Awareness Q4", objective: "Brand Awareness", adsets: 3, ads: 8, status: "Active", budget: "$300", spend: "$892", conv: 28, date: "Oct 10, 2025" },
  { name: "Product Launch Campaign", objective: "Traffic", adsets: 4, ads: 10, status: "Paused", budget: "$400", spend: "$567", conv: 15, date: "Oct 5, 2025" },
  { name: "Retargeting Campaign", objective: "Conversions", adsets: 2, ads: 6, status: "Active", budget: "$200", spend: "$445", conv: 32, date: "Oct 1, 2025" },
  { name: "Holiday Special Promo", objective: "Sales", adsets: 6, ads: 15, status: "Draft", budget: "$600", spend: "$0", conv: 0, date: "Oct 20, 2025" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Monitor your campaign performance and activities</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-gray-500">{item.change}</p>
            </div>
            <div className="text-3xl">{item.icon}</div>
          </Card>
        ))}
      </div>

      {/* --- Chart --- */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <CardTitle>Performance Overview</CardTitle>
            <p className="text-sm text-gray-500">Track your campaign metrics over time</p>
          </div>

          <Formik initialValues={{ view: "Ad" }} onSubmit={() => {}}>
            {({ values, setFieldValue }) => (
              <Form className="flex gap-2">
                {["Ad", "Ad Set", "Campaign"].map((v) => (
                  <Button
                    key={v}
                    type="button"
                    onClick={() => setFieldValue("view", v)}
                    variant={values.view === v ? "default" : "outline"}
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
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </Form>
            )}
          </Formik>
        </CardHeader>

        <CardContent className="h-80">
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
        </CardContent>
      </Card>

      {/* --- Recent Campaigns --- */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <p className="text-sm text-gray-500">Manage and monitor your active campaigns</p>
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
  );
}
