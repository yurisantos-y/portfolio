import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yuri Santos | FullStack Developer",
  description: "Portfolio ultraminimalista de Yuri Santos - Flutter, Next.js, Mobile First",
};

import { Header } from "@/components/sections/Header";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-text-primary font-sans selection:bg-primary selection:text-white`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
