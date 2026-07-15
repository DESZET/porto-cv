import type { Metadata } from "next";
import { Bangers, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spider-Man Cinematic Portfolio | Desta Anandhika",
  description: "An interactive, cinematic Spider-Verse portfolio experience showcasing full-stack developer journey, interactive 3D cities, physics engines, and mini-games.",
  keywords: ["Spider-Man", "Spider-Verse", "Desta Anandhika", "Portfolio", "Three.js", "Matter.js", "GSAP", "React Three Fiber", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bangers.variable} ${spaceGrotesk.variable}`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
