"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 18px",
  borderRadius: 22,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  minWidth: 120,
};

export default function BottomNav() {
  const pathname = usePathname();
  const isConverter = pathname === "/";
  const isReviews = pathname.startsWith("/reviews");

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 28,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        padding: "10px 12px",
        display: "flex",
        gap: 10,
        zIndex: 50,
        backdropFilter: "blur(10px)",
      }}
      aria-label="التنقل السفلي"
    >
      <Link
        href="/reviews"
        style={{
          ...baseBtn,
          background: isReviews ? "#c77717" : "transparent",
          color: isReviews ? "white" : "#111827",
        }}
      >
        ⭐ الآراء
      </Link>

      <Link
        href="/"
        style={{
          ...baseBtn,
          background: isConverter ? "#0ea371" : "transparent",
          color: isConverter ? "white" : "#111827",
        }}
      >
        🧮 المحوّل
      </Link>
    </nav>
  );
}
