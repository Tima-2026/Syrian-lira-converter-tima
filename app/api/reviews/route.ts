import { sql } from "@vercel/postgres";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS tema_reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function GET() {
  await ensureTable();
  const { rows } = await sql`
    SELECT id, name, comment, rating, created_at
    FROM tema_reviews
    ORDER BY created_at DESC
    LIMIT 100;
  `;
  return Response.json({ items: rows });
}

export async function POST(request: Request) {
  await ensureTable();
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 60);
  const comment = String(body.comment || "").trim().slice(0, 500);
  const ratingNum = Number(body.rating);
  const rating = Number.isFinite(ratingNum) ? Math.max(1, Math.min(5, Math.round(ratingNum))) : 5;

  if (!name || !comment) {
    return Response.json({ error: "الاسم والتعليق مطلوبين" }, { status: 400 });
  }

  await sql`
    INSERT INTO tema_reviews (name, comment, rating)
    VALUES (${name}, ${comment}, ${rating});
  `;

  return Response.json({ ok: true });
}
