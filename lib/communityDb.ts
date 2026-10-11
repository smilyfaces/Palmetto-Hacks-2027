import { Pool } from "pg";
 
// Connection used for the community tables (recipe_reactions, dish_photos, reaction_events).
// Uses COMMUNITY_DATABASE_URL if you set one; otherwise it shares the same Tiger service as your recipes.
// Either way it only ever touches the three community tables, never the recipes table.
const globalForPg = globalThis as unknown as { communityPool?: Pool };
 
const raw =
  process.env.COMMUNITY_DATABASE_URL ??
  process.env.DATABASE_URL ??
  process.env.TIMESCALE_SERVICE_URL ??
  "";
 
// "?sslmode=require" makes pg ignore the ssl option below (SELF_SIGNED_CERT_IN_CHAIN), so remove it
const connectionString = raw.replace(/([?&])sslmode=[^&]*&?/, "$1").replace(/[?&]$/, "");
 
export const communityPool =
  globalForPg.communityPool ??
  new Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 5 });
 
if (process.env.NODE_ENV !== "production") globalForPg.communityPool = communityPool;
 
export const communityConfigured = () => Boolean(raw);