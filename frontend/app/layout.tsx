import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const glacialIndifferenceBplPsa = localFont({
  src: [
    {
      path: "./fonts/glacialindifferencebplpsa-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/glacialindifferencebplpsa-italic-webfont.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/glacialindifferencebplpsa-regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-glacial",
});

const lovelo = localFont({
  src: "./fonts/Lovelo-Black.woff2",
  variable: "--font-lovelo",
});

const montserrat = Montserrat({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "BPL PSA Grievance Tracker",
  description: "Grievance tracking for the BPL PSA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${glacialIndifferenceBplPsa.variable} ${lovelo.variable} ${montserrat.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen items-center bg-teal-0 font-glacial">
          <div className="backdrop-blur-xs flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full max-w-5xl mx-auto px-5 md:px-10 py-5">
            <div className="text-teal-500 font-montserrat font-bold text-xl uppercase">
              <Link href="/">Home</Link>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
