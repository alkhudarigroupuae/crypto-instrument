import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "SparkFi — Institutional-grade lending",
  description: "Lend, borrow, and earn on crypto with bank-grade security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dm.variable} ${syne.variable} font-sans`}>
        <Providers>
          <NavBar />
          <div className="relative z-10 pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
