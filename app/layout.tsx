import type { Metadata } from "next";
import { Open_Sans, JetBrains_Mono, Playfair_Display, Badeen_Display } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: "italic",
});

const badeenDisplay = Badeen_Display({
  variable: "--font-badeen",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yuri Santos | Mobile Developer",
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
        className={`${openSans.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${badeenDisplay.variable} antialiased bg-background text-text-primary font-sans selection:bg-primary selection:text-white`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
