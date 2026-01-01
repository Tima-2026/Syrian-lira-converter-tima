"use client";

import { useEffect, useMemo, useState } from "react";

function isStandalone() {
  // iOS + other browsers
  // @ts-ignore
  return window.matchMedia?.("(display-mode: standalone)")?.matches || (navigator as any).standalone;
}

function isIOS() {
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

export default function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("tema_install_dismissed");
      if (v === "1") setDismissed(true);
    } catch {}
  }, []);

  const show = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (dismissed) return false;
    if (isStandalone()) return false;
    return true;
  }, [dismissed]);

  if (!show) return null;

  return (
    <>
      {/* install bar */}
      <div
        style={{
          position: "fixed",
          bottom: 78,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(720px, calc(100% - 24px))",
          background: "rgba(12, 18, 32, 0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 22,
          padding: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 60,
          backdropFilter: "blur(10px)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        }}
      >
        <img src="/icon-192.png" alt="icon" style={{ width: 34, height: 34, borderRadius: 10 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: "white", lineHeight: 1.1 }}>تثبيت التطبيق</div>
          <div style={{ fontSize: 12, opacity: 0.85, color: "#d1d5db" }}>للوصول السريع من الشاشة</div>
        </div>

        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#0ea371",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: 16,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          تثبيت الآن
        </button>

        <button
          aria-label="إغلاق"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("tema_install_dismissed", "1");
            } catch {}
          }}
          style={{
            background: "transparent",
            color: "#e5e7eb",
            border: "none",
            fontSize: 18,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 70,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 100%)",
              background: "white",
              borderRadius: 18,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              textAlign: "right",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
              لتثبيت التطبيق على {isIOS() ? "iPhone" : "الموبايل"}:
            </div>

            {isIOS() ? (
              <ol style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.9 }}>
                <li>اضغط زر "مشاركة" (Share) أسفل الشاشة</li>
                <li>اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</li>
              </ol>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.9 }}>
                <li>افتح القائمة (⋮)</li>
                <li>اختر "تثبيت التطبيق" أو "Add to Home screen"</li>
              </ol>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "#eef2f7",
                  border: "1px solid #e5e7eb",
                  padding: "10px 16px",
                  borderRadius: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
