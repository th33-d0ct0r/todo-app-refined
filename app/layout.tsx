import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from 'next/font/google'
import { NextFont } from "next/dist/compiled/@next/font";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Todo",
  description: "Todo app hai yeh",
};

const outfit: NextFont = Outfit({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${outfit.className} antialiased min-h-[100%]`}
          >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
