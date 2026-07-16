import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import Header from "./components/Header";

const raleway = Raleway({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "BLU Grievance Tracker",
  description: "Grievance tracking for the Boston Librarians Union",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <div className="flex flex-col min-h-screen bg-linear-to-br from-background to-background-dark font-body">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
