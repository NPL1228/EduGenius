import type { Metadata } from "next";
import FeatureHeader from "@/components/FeatureHeader";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dungeon Manager",
  description: "Dungeon crawler flashcard game",
};

export default function CombineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
    >
      <FeatureHeader title="Dungeon Manager" />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
