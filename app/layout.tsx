import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BRSSD Sorting Hat Guide",
  description:
    "A Sorting Hat-themed middle school exploration game for BRSSD families.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
