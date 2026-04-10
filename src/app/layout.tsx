import type { Metadata } from "next";
import { Mina, Space_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

const mina = Mina({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Rima Zakiyatin Arifah — UI/UX Designer",
  description: "I'm a UI/UX Designer with over 4 years of experience in crafting intuitive interfaces and enhancing satisfying user experiences.",
};

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "600px" }} />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "120px" }} />,
});

const MarqueeBannerDynamic = dynamic(() => import("@/components/MarqueeBanner"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "64px" }} />,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${mina.variable} ${spaceMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <Header />
        <main className="grow">{children}</main>
        <MarqueeBannerDynamic />
        <ContactSection />
        <Footer />
      </body>
    </html>
  );
}
