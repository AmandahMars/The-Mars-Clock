import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Mars Clock | Amandah Yahsarael",
  description: "Live Earth and Mars time by The Mars Clock.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
