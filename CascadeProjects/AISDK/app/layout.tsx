/**
 * @fileoverview Root layout component with theme provider and font configuration
 * @description Sets up global providers, fonts, and metadata for the application
 */

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Lab - Vercel AI SDK Playground",
  description: "A comprehensive playground for exploring Vercel AI SDK capabilities including streaming, tool calling, agents, and multimodal interactions.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application
 * @description Provides theme context, global styling, and layout structure
 * @param props - Layout props containing children to render
 * @returns JSX element containing the root HTML structure
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider defaultTheme="system" storageKey="aisdk-theme">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
