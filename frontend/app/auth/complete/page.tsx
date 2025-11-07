"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Activity } from "lucide-react";

/**
 * Auth completion page
 * Handles storing tokens and redirecting to dashboard
 */
export default function AuthCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userId = searchParams.get("user_id");
    const userEmail = searchParams.get("user_email");
    const userName = searchParams.get("user_name");
    const userPicture = searchParams.get("user_picture");

    if (accessToken && refreshToken && userId) {
      // Store tokens and user info in localStorage
      // In production, use secure HTTP-only cookies instead
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("user_email", userEmail || "");
      localStorage.setItem("user_name", userName || "");
      localStorage.setItem("user_picture", userPicture || "");
      localStorage.setItem("auth_timestamp", Date.now().toString());

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      // Missing tokens, redirect to home with error
      router.push("/?error=auth_incomplete");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Activity className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Setting Up Your Coach Account...
        </h1>
        <p className="text-gray-600">
          Please wait while we prepare your dashboard
        </p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

