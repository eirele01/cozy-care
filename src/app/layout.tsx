import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "CozyCare PH — Deep Cleaning Services in Metro Manila | From ₱1,099",
  description:
    "Metro Manila's trusted deep cleaning service. 25,000+ homes & offices served. Intensive general, post-construction, move-in/out & carpet deep cleaning from ₱800. Open every day. Instant online estimate & booking.",
  keywords: [
    "deep cleaning services Manila",
    "affordable house cleaning NCR",
    "post-construction cleaning Philippines",
    "carpet deep cleaning Metro Manila",
    "move-in move-out cleaning",
    "CozyCare PH",
  ],
  openGraph: {
    title: "CozyCare PH — Come home to a deeply clean space",
    description:
      "Intensive deep cleaning for homes & offices across Metro Manila. 25,000+ spaces transformed. From ₱1,099. Open every day.",
    siteName: "CozyCare PH Cleaning Services",
    type: "website",
    images: [{ url: "/images/hero-team.png", width: 1440, height: 720 }],
  },
  icons: {
    icon: "/images/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
