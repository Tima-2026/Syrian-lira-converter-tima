"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: number;
  name: string;
  comment: string;
  rating: number;
  created_at: string;
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexDirection: "row-reverse" }} aria-label="التقييم">
      {[1, 2, 3, 4, 5].map((s) => {
        const active = s <= value;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
              color: active ? "#f59e0b" : "#cbd5e1",
            }}
            aria-label={`تقييم ${s} نجوم`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/reviews", { cache: "no-store" });
    
      if (!r.ok) {
        setItems([]);
        return;
      }
    
      const text = await r.text();
      const data = text ? JSON.parse(text) : { items: [] };
    
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
    
  }

  useEffect(() => {
    load();
  }, []);

  const canSend = useMemo(() => name.trim().length >= 2 && comment.trim().length >= 3, [name, comment]);

  async function submit() {
    if (!canSend || sending) return;
    setSending(true);
    setMsg("");
    const r = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, comment, rating }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      setMsg(data.error || "صار خطأ");
      setSending(false);
      return;
    }
    setName("");
    setComment("");
    setRating(5);
    setMsg("تمت إضافة المراجعة ✅");
    await load();
    setSending(false);
  }

  return (
    <main style={styles.page}>
      <section style={styles.headerCard}>
        <img src="/logo.png" alt="TEMA" style={{ width: 72, height: "auto" }} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>الآراء</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>شاركنا رأيك عن محول الليرة السورية</div>
        </div>
      </section>

      <section style={styles.card}>
        <input
          style={styles.input}
          placeholder="اسمك الكريم"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          style={{ ...styles.input, height: 95, resize: "none" }}
          placeholder="اكتب تعليقك هنا..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 800 }}>التقييم</span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <button
          onClick={submit}
          disabled={!canSend || sending}
          style={{
            ...styles.primaryBtn,
            opacity: !canSend || sending ? 0.6 : 1,
            cursor: !canSend || sending ? "not-allowed" : "pointer",
          }}
        >
          ➤ إضافة المراجعة
        </button>

        {msg && <div style={{ marginTop: 10, fontWeight: 700, color: msg.includes("✅") ? "#0ea371" : "#b42318" }}>{msg}</div>}
      </section>

      <section style={styles.card}>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>مراجعات المستخدمين</div>
        {loading ? (
          <div style={{ opacity: 0.7 }}>جارٍ التحميل...</div>
        ) : items.length === 0 ? (
          <div style={{ opacity: 0.7 }}>لا يوجد آراء بعد.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((r) => (
              <div key={r.id} style={styles.reviewRow}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{r.name}</div>
                  <div style={{ display: "flex", gap: 2, direction: "ltr" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < r.rating ? "#f59e0b" : "#e2e8f0" }}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ opacity: 0.8, marginTop: 6, whiteSpace: "pre-wrap" }}>{r.comment}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ height: 100 }} />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 16,
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  headerCard: {
    background: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    marginBottom: 12,
    fontSize: 16,
    outline: "none",
    background: "#f8fafc",
  },
  primaryBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    background: "#0ea371",
    color: "white",
    border: "none",
    fontSize: 18,
    fontWeight: 900,
  },
  reviewRow: {
    border: "1px solid #eef2f7",
    borderRadius: 16,
    padding: 14,
    background: "#ffffff",
  },
};
