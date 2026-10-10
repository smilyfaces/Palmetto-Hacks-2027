import { Pool } from "pg";
 
// Reuse one pool across hot reloads in dev so we don't open a new connection each time
const globalForPg = globalThis as unknown as { pool?: Pool };
 
// Accepts either name, so you can reuse the variable from your Python script
const rawUrl = process.env.DATABASE_URL ?? process.env.TIMESCALE_SERVICE_URL ?? "";
 
// A "?sslmode=require" in the URL makes pg verify the certificate strictly and ignore the
// ssl option below, which causes SELF_SIGNED_CERT_IN_CHAIN. Remove it and set SSL explicitly.
const connectionString = rawUrl.replace(/([?&])sslmode=[^&]*&?/, "$1").replace(/[?&]$/, "");
 
export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
 
if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;