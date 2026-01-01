"use client";

import { useMemo, useState } from "react";

const RATE = 100; // 100 ليرة قديمة = 1 ليرة جديدة

const quickOld = [
  { label: "5 آلاف", value: 5000 },
  { label: "10 آلاف", value: 10000 },
  { label: "50 ألف", value: 50000 },
  { label: "100 ألف", value: 100000 },
  { label: "500 ألف", value: 500000 },
  { label: "مليون", value: 1000000 },
];

const denomsNew = [10, 25, 50, 100, 200, 500];

// يحوّل الأرقام العربية/الفارسية إلى 0-9
function normalizeDigits(input: string) {
  const map: Record<string, string> = {
    "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9",
    "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
  };
  return input.replace(/[٠-٩۰-۹]/g, (d) => map[d] ?? d);
}

// يرجّع فقط الأرقام بدون أي فواصل
function toRawInt(input: string) {
  const s = normalizeDigits(input)
    .replace(/[,\s،٬]/g, "") // فواصل الآلاف
    .replace(/[^\d]/g, "")  // أي شيء غير رقم
    .trim();
  return s;
}

// تنسيق مع فواصل 88,888
function fmtIntWithCommas(rawDigits: string) {
  if (!rawDigits) return "";
  const n = Number(rawDigits);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(n);
}

function fmt(n: number) {
  // بدون كسور إذا الرقم صحيح
  const isInt = Math.abs(n - Math.round(n)) < 1e-9;
  return n.toLocaleString("en-US", {
    maximumFractionDigits: isInt ? 0 : 2,
    minimumFractionDigits: 0,
  });
}

export default function Page() {
  const [oldAmount, setOldAmount] = useState<string>("");
  const [denom, setDenom] = useState<number>(10);

  const computed = useMemo(() => {
  const raw = toRawInt(oldAmount);          // "88,888" أو "٨٨٨٨٨" -> "88888"
  const oldN = raw ? Number(raw) : NaN;

  if (!Number.isFinite(oldN) || oldN < 0) {
    return { oldN: NaN, newN: NaN, notes: 0, remainder: 0 };
  }

  const newN = oldN / RATE;

  // توزيع الأوراق على أساس الليرة الجديدة
  const d = denom;
  const notes = d > 0 ? Math.floor(newN / d) : 0;
  const remainder = d > 0 ? (newN - notes * d) : newN;

  return { oldN, newN, notes, remainder };
}, [oldAmount, denom]);


  const canCopy = Number.isFinite(computed.newN);

  const copy = async () => {
    if (!canCopy) return;
    const text =
      `بالعملة القديمة: ${fmt(computed.oldN)} ل.س\n` +
      `بالعملة الجديدة (المعدلة): ${fmt(computed.newN)} ل.س\n` +
      `فئة التوزيع: ${denom} ليرة\n` +
      `عدد الأوراق: ${computed.notes}\n` +
      `المتبقي (فراطه): ${fmt(computed.remainder)} ليرة`;
    await navigator.clipboard.writeText(text);
    alert("تم النسخ ✅");
  };

  return (
    <div className="container">
      <div className="header">
       <img className="hero-logo" src="/tima-logo.png" alt="TIMA" />

       <div className="title-wrap">
  <h1 className="h1">محول الليرة السورية</h1>
  <p className="sub">شركة تيما للصرافة والحوالات المالية</p>
</div>

      </div>

      <div className="card">
        <div className="cardPad">
          <div className="sectionTitle">
            <span className="badge">100 ليرة قديمة = 1 ليرة جديدة</span>
            <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>
              (حذف صفرين)
            </span>
          </div>

          <div className="grid2">
            <div className="field">
              <div className="label">بالعملة القديمة</div>
              <div className="inputRow">
                <input
  className="input"
  value={oldAmount}
  inputMode="numeric"
  placeholder="مثال: 1,000,000"
  onChange={(e) => {
    const raw = toRawInt(e.target.value);      // 88888 أو ٨٨٨٨٨ → "88888"
    const formatted = fmtIntWithCommas(raw);   // "88888" → "88,888"
    setOldAmount(formatted);
  }}
/>

                <div className="unit">ل.س</div>
              </div>
              <div className="hint">أدخل المبلغ بالليرة السورية قبل التعديل</div>
            </div>

            <div className="field">
              <div className="label">بالعملة الجديدة (المعدلة)</div>
              <div className="inputRow">
  <div
    className="input"
    style={{
      textAlign: "right",
      color: "var(--brand2)",
      direction: "ltr"
    }}
  >
    {Number.isFinite(computed.newN) ? fmt(computed.newN) : "—"}
  </div>

  <div className="unit" style={{ color: "var(--brand2)" }}>
    ل.س
  </div>
</div>

              <div className="hint">المبلغ الناتج بعد حذف صفرين من القيمة الحالية</div>
            </div>
          </div>

          <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
            <div className="quick" style={{ flex: 1 }}>
              {quickOld.map((q) => (
                <button
  key={q.value}
  className="qbtn"
  onClick={() => setOldAmount(fmtIntWithCommas(String(q.value)))}
>
  {q.label}
</button>

              ))}
            </div>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn btnPrimary" onClick={copy} disabled={!canCopy}>
              نسخ التفاصيل
            </button>
            <button className="btn btnGhost" onClick={() => setOldAmount("")}>
              مسح
            </button>
          </div>

          <div className="hr" />

          <h2 className="sectionTitle" style={{ marginBottom: 8 }}>
            توزيع الفئات النقدية
          </h2>
          <div className="muted" style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
            اختر فئة نقدية لمعرفة عدد الأوراق المطلوبة لتغطية المبلغ
          </div>

          <div className="denoms">
            {denomsNew.map((d) => (
              <button
                key={d}
                className={"dbtn" + (denom === d ? " active" : "")}
                onClick={() => setDenom(d)}
              >
                <i className="tick" />
                <span>فئة</span>
                {d}
              </button>
            ))}
          </div>

          <div className="greenCard">
            <div style={{ position: "relative" }}>
              <div className="gcSub">أنت بحاجة إلى</div>
              <p className="bigNum">
                {Number.isFinite(computed.newN) ? computed.notes : 0}
              </p>
              <div className="gcSub">
                ورقة نقدية <span style={{ opacity: 0.9 }}>من فئة {denom} ليرة</span>
              </div>

              <div className="gcBar">
                <div>
                  <div className="note">المتبقي (فراطه):</div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>
                    {Number.isFinite(computed.newN) ? fmt(computed.remainder) : "—"} ليرة
                  </div>
                </div>
                <div style={{ fontSize: 22 }}>🧮</div>
              </div>
            </div>
          </div>

          <div className="footerNote">
            معدل التحويل الثابت: 100 ليرة قديمة = 1 ليرة جديدة
          </div>
        </div>
      </div>
    </div>
  );
}
