import { getDb, isDatabaseConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Health check used by hosts and uptime monitors.
 *
 * The marketing site is fully static and does not need a database, so a
 * missing DATABASE_URL is a supported state: we return 200 and say so in
 * the body, rather than failing the deployment. A database that IS
 * configured but unreachable is a real outage, so that returns 503.
 *
 *   200 { ok: true,  database: "connected" }
 *   200 { ok: false, database: "not-configured" }   ← app healthy, DB optional
 *   503 { ok: false, database: "unreachable" }      ← configured but broken
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { ok: false, database: "not-configured" },
      { status: 200 }
    );
  }

  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, database: "connected" });
  } catch {
    return Response.json(
      { ok: false, database: "unreachable" },
      { status: 503 }
    );
  }
}
