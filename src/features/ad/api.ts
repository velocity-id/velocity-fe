'use client';
import { getSession } from "next-auth/react";
import { FacebookPage } from "./type";


export async function getListPage(): Promise<FacebookPage[]> {
  try {
    const session = await getSession();
    console.log("Session in getAdAccounts:", session);

    if (!session?.accessToken) {
      throw new Error("No Facebook access token in session");
    }

    const accessToken = session.accessToken;

    const res = await fetch(
      `https://graph.facebook.com/v24.0/me/accounts?fields=id,name&access_token=${accessToken}`,
      { method: "GET" }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch ad accounts: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data.data || [];

  } catch (err) {
    console.error("Error in getAdAccounts():", err);
    throw err; 
  }
}


