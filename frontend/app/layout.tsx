import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Header from "./components/Header";

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
  src: [
    {
      path: "./fonts/Lovelo-Black.woff2",
      weight: "900",
    },
    {
      path: "./fonts/Lovelo-LineBold.woff2",
      weight: "700",
    },
    {
      path: "./fonts/Lovelo-LineLight.woff2",
      weight: "400",
    },
  ],
  variable: "--font-lovelo",
});

const montserrat = Montserrat({
  weight: ["400", "600", "700"],
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
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/10 font-body">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
