import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("tema_reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const name = String(body.name || "").trim().slice(0, 60);
  const comment = String(body.comment || "").trim().slice(0, 500);
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

  if (!name || !comment) {
    return Response.json(
      { error: "الاسم والتعليق مطلوبين" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("tema_reviews").insert([
    { name, comment, rating }
  ]);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
