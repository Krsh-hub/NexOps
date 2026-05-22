import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NexOps | AI Operations",
  description: "AI-native autonomous operations platform for SMBs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} h-full flex bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden`}>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full">
          <Navbar />
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
