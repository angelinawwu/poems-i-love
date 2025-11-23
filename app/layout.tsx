import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "poems i love",
  description: "a compendium of my favorite words",
  openGraph: {
    title: "poems i love",
    description: "a compendium of my favorite words",
    images: [
      {
        url: '/demo.png',
        width: 1200,
        height: 630,
        alt: "poems i love preview",
      },
    ],
    siteName: "poems i love",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "poems i love",
    description: "a compendium of my favorite words",
    images: ["/demo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ebGaramond.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
