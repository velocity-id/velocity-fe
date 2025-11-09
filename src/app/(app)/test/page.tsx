"use client";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log("Session data:", session);

  return (
    <div>
      <h1>Dashboard</h1>
      {session ? (
        <p>Selamat datang, {session.user?.name}</p>
      ) : (
        <p>Belum login</p>
      )}
    </div>
  );
}
