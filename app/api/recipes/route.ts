// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

//export const dynamic = "force-dynamic"; // never run this at build time

export async function POST() {
  try {
    const { rows } = await pool.query("SELECT count(*) FROM recipes");
    return NextResponse.json({ ok: true, recipeCount: rows[0].count });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
 