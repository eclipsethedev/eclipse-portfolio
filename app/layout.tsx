import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "Eclipse — Developer & Community Operations",
  description: "Developer building web experiences and working with online communities. Skilled in web development, Discord infrastructure, and community operations.",
  keywords: ["developer", "web development", "community management", "Discord", "React", "Next.js"],
  authors: [{ name: "Eclipse" }],
  openGraph: {
    title: "Eclipse — Developer & Community Operations",
    description: "Developer building web experiences and working with online communities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <MusicPlayer />
      </body>
    </html>
  );
}
