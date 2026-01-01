import "./globals.css";
import type { Metadata } from "next";
import BottomNav from "./components/BottomNav";
import InstallPrompt from "./components/InstallPrompt";

export const metadata: Metadata = {
  title: "Syrian Lira Converter",
  description: "محول الليرة السورية القديمة ↔ الجديدة | تيما",
  manifest: "/manifest.webmanifest",
  themeColor: "#0ea371",
  icons: {
    icon: [{ url: "/icon-192.png" }, { url: "/icon-512.png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <InstallPrompt />
        <BottomNav />
      </body>
    </html>
  );
}
