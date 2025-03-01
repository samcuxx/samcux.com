import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamCux | Portfolio",
  description: "Professional portfolio showcasing my projects and skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <ConvexClientProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
