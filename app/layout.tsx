import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galileo Dashboard",
  description:
    "Autonomous procurement command center for enterprise travel sourcing, supplier intelligence, and live negotiations.",
  icons: {
    icon: "/Galileo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
