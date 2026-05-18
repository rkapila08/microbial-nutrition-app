import type { Metadata } from "next";
import { Instrument_Serif, Nunito } from "next/font/google";
import { Navbar } from "~/components/navbar";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MicroType — Discover Your Gut Microbiome Type",
  description:
    "Like Myers-Briggs for your gut. Answer 32 questions and get matched to one of 16 microbiome profiles, each with a personalized nutrition plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} ${instrumentSerif.variable}`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
