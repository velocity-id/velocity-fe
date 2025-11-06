import { NextRequest, NextResponse } from "next/server";

let campaigns = [
  {
    id: "1",
    name: "Summer Sale 2025",
    objective: "Conversions",
    adsets: 3,
    ads: 10,
    status: "Active",
    budget: "Rp5.000.000",
    spend: "Rp2.000.000",
    conv: 42,
    date: "10 Okt 2025",
  },
];

export async function GET() {
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newCampaign = {
    id: Date.now().toString(),
    name: body.name,
    objective: body.objective,
    adsets: 0,
    ads: 0,
    status: "Draft",
    budget: "-",
    spend: "-",
    conv: 0,
    date: new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  campaigns.push(newCampaign);
  return NextResponse.json({ success: true, data: newCampaign });
}
