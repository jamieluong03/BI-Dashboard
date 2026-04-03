import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from './providers';
import SideNav from "@/components/ui/sideNav";
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jewelry BI Dashboard",
  description: "Analytics for jewelry sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              {/* <div className="w-full flex-none md:w-64">
                <SideNav />
              </div> */}
              <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
