import { database } from "@/lib/db";
import { accountKey } from "@/lib/account";
import { awardedPoints, normalizeSettings } from "@/lib/game";

export async function POST(request) {
  const key = await accountKey();
  if (!key) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!Number.isSafeInteger(body?.catches) || body.catches < 0 || body.catches > 10000) {
    return Response.json({ error: "Invalid catch count" }, { status: 400 });
  }
  const settings = normalizeSettings(body.speed, body.stars);
  const score = awardedPoints(body.catches, settings.speed, settings.stars);
  const sql = database();
  const rows = await sql`
    UPDATE players SET
      high_score = GREATEST(high_score, ${score}),
      speed_level = ${settings.speed}, star_level = ${settings.stars}, updated_at = now()
    WHERE account_key = ${key}
    RETURNING high_score`;
  if (!rows[0]) return Response.json({ error: "Create a username first" }, { status: 409 });
  return Response.json({ score, highScore: rows[0].high_score });
}
