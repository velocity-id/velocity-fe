import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({
      error: "Access token not found",
      note: "Pastikan login berhasil dan access_token sudah tersimpan",
      session,
    });
  }

  const response = await fetch(
    `https://graph.facebook.com/v23.0/me?fields=id,name,email&access_token=${session.accessToken}`
  );

  const data = await response.json();

  return NextResponse.json({
    message: "Hasil tes Graph API",
    facebook_response: data,
    your_access_token: session.accessToken,
  });
}
