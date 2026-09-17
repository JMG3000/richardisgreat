import { database } from "@/lib/db";

export async function GET() {
  const sql = database();
  const leaders = await sql`SELECT username, high_score FROM players ORDER BY high_score DESC, updated_at ASC LIMIT 10`;
  return Response.json({ leaders }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
}
