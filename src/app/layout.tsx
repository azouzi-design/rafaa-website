import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSans = localFont({
  src: "../fonts/InstrumentSans-Variable.woff2",
  variable: "--font-instrument-sans",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rafaa-website.vercel.app"),
  title: "SIMPLE by Rafaa Chawali — your creative partner",
  description: "Rafaa Chawali — your creative partner",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
