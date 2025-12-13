"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ForecastingForm() {
  const [budget, setBudget] = useState(400000);
  const [cpr, setCpr] = useState(8000);
  const [vcResult, setVcResult] = useState(0);
  const [resultKontak, setResultKontak] = useState(0);
  const [kontakClosing, setKontakClosing] = useState(0);
  const [closingQtySale, setClosingQtySale] = useState(0);
  const [adAccount, setAdAccount] = useState("");
  const [product, setProduct] = useState("");
  const [days, setDays] = useState(30);


  return (
    <div className="space-y-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Input Forecasting</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Budget</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value) || 0)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CPR</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={cpr}
                    onChange={(e) => setCpr(Number(e.target.value) || 0)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>VC - Result</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={vcResult}
                    onChange={(e) => setVcResult(Number(e.target.value) || 0)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Result - Kontak</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={resultKontak}
                    onChange={(e) =>
                      setResultKontak(Number(e.target.value) || 0)
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kontak - Closing</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={kontakClosing}
                    onChange={(e) =>
                      setKontakClosing(Number(e.target.value) || 0)
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Closing - QTY Sale</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={closingQtySale}
                    onChange={(e) =>
                      setClosingQtySale(Number(e.target.value) || 0)
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ad Account</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={adAccount}
                    onChange={(e) => setAdAccount(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Days</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value) || 1)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-4">
            <Badge variant="destructive">Adv ROI : -57%</Badge>
          </div>
        </CardContent>
      </Card>

      {/* TABS STRATEGI */}
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Single Product</TabsTrigger>
          <TabsTrigger value="multi">Multiple Product</TabsTrigger>
          <TabsTrigger value="multiAccount">Multi Account & Product</TabsTrigger>
        </TabsList>

        {/* SINGLE PRODUCT */}
        <TabsContent value="single">
          <StrategyCard
            title="Strategi Single Product"
            dailyAdCost={888000}
            monthlyAdCost={26640000}
            dailyRevenue={750157}
            monthlyRevenue={22504720}
          />
        </TabsContent>

        {/* MULTI PRODUCT */}
        <TabsContent value="multi">
          <StrategyCard
            title="Strategi Multiple Product"
            dailyAdCost={888000}
            monthlyAdCost={26640000}
            dailyRevenue={750157}
            monthlyRevenue={22504720}
          />
        </TabsContent>

        {/* MULTI ACCOUNT */}
        <TabsContent value="multiAccount">
          <StrategyCard
            title="Strategi Multiple Account & Product"
            dailyAdCost={1776000}
            monthlyAdCost={53280000}
            dailyRevenue={1500315}
            monthlyRevenue={45009440}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StrategyCard({
  title,
  dailyAdCost,
  monthlyAdCost,
  dailyRevenue,
  monthlyRevenue,
}: {
  title: string;
  dailyAdCost: number;
  monthlyAdCost: number;
  dailyRevenue: number;
  monthlyRevenue: number;
}) {
  const dailyProfit = dailyRevenue - dailyAdCost;
  const monthlyProfit = monthlyRevenue - monthlyAdCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* RINGKASAN BIAYA & OMZET */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keterangan</TableHead>
              <TableHead>Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Biaya Iklan (Harian)</TableCell>
              <TableCell>Rp {dailyAdCost.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Biaya Iklan (Bulanan)</TableCell>
              <TableCell>Rp {monthlyAdCost.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Omzet Harian</TableCell>
              <TableCell>Rp {dailyRevenue.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Profit Harian</TableCell>
              <TableCell className={dailyProfit < 0 ? "text-red-600" : "text-green-600"}>
                Rp {dailyProfit.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Omzet Bulanan</TableCell>
              <TableCell>Rp {monthlyRevenue.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Profit Bulanan</TableCell>
              <TableCell className={monthlyProfit < 0 ? "text-red-600" : "text-green-600"}>
                Rp {monthlyProfit.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* PERFORMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PerformanceCard title="Performa Sales Harian" result={12} lead={6} closing={3} qty={3} />
          <PerformanceCard title="Performa Sales Bulanan" result={369} lead={185} closing={83} qty={83} />
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceCard({
  title,
  result,
  lead,
  closing,
  qty,
}: {
  title: string;
  result: number;
  lead: number;
  closing: number;
  qty: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Result</TableCell>
              <TableCell>{result}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lead</TableCell>
              <TableCell>{lead}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Closing</TableCell>
              <TableCell>{closing}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Qty Sale</TableCell>
              <TableCell>{qty}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
