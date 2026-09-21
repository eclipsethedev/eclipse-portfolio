import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";

export const metadata: Metadata = {
  title: "Eclipse — Developer",
  description: "Developer building websites, web applications, and technical systems for online projects.",
  keywords: ["developer", "web development", "Next.js", "React", "Discord"],
  authors: [{ name: "Eclipse" }],
  openGraph: {
    title: "Eclipse — Developer",
    description: "Developer building websites, web applications, and technical systems for online projects.",
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
        <ScrollProgress />
        <Navbar />
        <main className="flex-1 pt-16">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
        <Footer />
        <MusicPlayer />
      </body>
    </html>
  );
}
