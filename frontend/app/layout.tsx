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
  title: "TotalFit - Professional Athlete Management Platform",
  description: "AI-powered athlete management platform for coaches and trainers. Track performance, prevent injuries, and optimize training with real-time insights.",
  keywords: ["athlete management", "coaching", "sports analytics", "injury prevention", "training optimization", "AI coaching"],
  authors: [{ name: "TotalFit" }],
  openGraph: {
    title: "TotalFit - Professional Athlete Management",
    description: "Manage athletes, prevent injuries, and optimize performance with AI-powered insights.",
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
