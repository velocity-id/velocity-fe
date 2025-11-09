"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const handleFacebookLogin = async () => {
    const result = await signIn("facebook", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
    console.log("signIn result:", result);
    if (result?.url) {
      window.location.href = result.url;
    } else if (result?.error) {
      console.error("Login error:", result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 italic">
        Velocity
      </h2>

      {/* Login */}
      <button
        onClick={handleFacebookLogin}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H8.1v-2.91h2.34V9.41c0-2.32 1.38-3.6 3.48-3.6.99 0 2.03.18 2.03.18v2.24h-1.15c-1.13 0-1.48.7-1.48 1.42v1.71h2.52l-.4 2.91h-2.12v7.02c4.78-.75 8.44-4.91 8.44-9.93z" />
        </svg>
        Log in with Facebook
      </button>
    </div>
  );
}
