import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Mars Clock — Tracking Time on Two Worlds",
  description:
    "Live Earth and Mars time display. Amanda Yahsarael's Mars research calendar with NASA Mars24 coordinated time at Airy-0.",
  keywords: [
    "Mars clock",
    "Mars calendar",
    "Mars time",
    "MTC",
    "Airy-0",
    "NASA Mars24",
    "Earth time",
    "celestial timekeeping",
  ],
  authors: [{ name: "Amanda Murrain", url: "https://thedigitalyards.co.uk" }],
  openGraph: {
    title: "The Mars Clock — Tracking Time on Two Worlds",
    description:
      "Live Earth and Mars time display with research calendar coordinates.",
    type: "website",
    url: "https://themarsclock.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#101a2a" />
      </head>
      <body>{children}</body>
    </html>
  )
}
