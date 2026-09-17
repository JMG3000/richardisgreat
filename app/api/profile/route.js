import { database } from "@/lib/db";
import { accountKey } from "@/lib/account";
import { normalizeSettings, validUsername } from "@/lib/game";

export async function GET() {
  const key = await accountKey();
  if (!key) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const sql = database();
  const rows = await sql`SELECT username, high_score, speed_level, star_level FROM players WHERE account_key = ${key}`;
  return Response.json({ profile: rows[0] ?? null });
}

export async function POST(request) {
  const key = await accountKey();
  if (!key) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!validUsername(body?.username)) {
    return Response.json({ error: "Use 3–18 letters, numbers, or underscores." }, { status: 400 });
  }
  const { speed, stars } = normalizeSettings(body.speed ?? 4, body.stars ?? 1);
  const sql = database();
  try {
    const rows = await sql`
      INSERT INTO players (account_key, username, speed_level, star_level)
      VALUES (${key}, ${body.username}, ${speed}, ${stars})
      ON CONFLICT (account_key) DO UPDATE SET
        speed_level = EXCLUDED.speed_level,
        star_level = EXCLUDED.star_level,
        updated_at = now()
      RETURNING username, high_score, speed_level, star_level`;
    return Response.json({ profile: rows[0] });
  } catch (error) {
    if (error?.code === "23505") return Response.json({ error: "That username is already taken. Try another." }, { status: 409 });
    throw error;
  }
}
