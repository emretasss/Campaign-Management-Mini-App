import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { TRPCProvider } from "@/lib/trpc";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campaign Management Mini-App",
  description: "Manage your influencer campaigns with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
