import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

console.log("Database connection string:", connectionString.replace(/:[^:@]*@/, ':****@'));

// Use direct connection with IPv4 compatible settings
const queryClient = postgres(connectionString, { 
  prepare: true,
  max: 1,
  ssl: {
    rejectUnauthorized: false
  },
  connection: {
    options: `-c timezone=utc`
  },
  // IPv4 compatibility
  host: 'db.bmojiwfcjkufhurdcijh.supabase.co',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'Emretas.1459'
});

export const db = drizzle(queryClient, { schema });
export * from "./schema";
