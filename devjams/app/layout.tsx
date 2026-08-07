import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevJams '26",
  description: "DevJams '26 - Hack Pack, DevJams' Back.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased flex flex-col justify-between overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
