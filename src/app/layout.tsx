import type { Metadata } from "next";
import { Manrope, DM_Serif_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Atlas Marketplace - Curated Excellence",
  description:
    "Discover a meticulously sourced collection of premium products across all categories of your life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols has no next/font equivalent */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-on-surface">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
