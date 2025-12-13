import { getServerSession } from "next-auth";
import { Campaign } from "./type";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const GRAPH_URL = "https://graph.facebook.com/v23.0";


export async function fetchCampaigns(adAcountId: string): Promise<Campaign[]> {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken
    if (!accessToken) {
      throw new Error("Unauthorized");
    }

  const url = new URL(`${GRAPH_URL}/act_${adAcountId}/campaigns`);
  url.search = new URLSearchParams({
    fields: "id,name,objective,status,created_time",
    limit: "100",
    access_token: accessToken,
  }).toString();

  const res = await fetch(url.toString());
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Gagal memuat campaign");
  }

  const campaigns = json.data ?? [];

  return campaigns.map((c: Campaign): Campaign => ({
    id: c.id,
    name: c.name,
    objective: c.objective ?? "Unknown",
    status: c.status ?? "INACTIVE",
    created_time: c.created_time,
  }));
}
