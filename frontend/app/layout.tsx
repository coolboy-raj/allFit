import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TotalFit - AI Health Advisor for Google Fit Users",
  description: "Connect your Google Fit app and get AI-powered health insights, injury risk warnings, and personalized recommendations based on your daily activity data.",
  keywords: ["fitness", "health", "AI", "Google Fit", "injury prevention", "health tracking"],
  authors: [{ name: "TotalFit" }],
  openGraph: {
    title: "TotalFit - AI Health Advisor",
    description: "Turn your fitness data into actionable insights with AI-powered health analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
