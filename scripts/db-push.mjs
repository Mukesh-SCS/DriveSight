/**
 * Push migrations (+ optional seeds) without `supabase link`.
 * Requires one of these in .env.local:
 *   DATABASE_URL=postgresql://...
 *   SUPABASE_DB_PASSWORD=your-db-password
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    return {};
  }

  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const index = trimmed.indexOf("=");
    if (index === -1) {
      continue;
    }
    vars[trimmed.slice(0, index)] = trimmed.slice(index + 1).trim();
  }
  return vars;
}

function getProjectRef(supabaseUrl) {
  const match = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1];
}

function buildDatabaseUrl(env) {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  const ref = getProjectRef(env.NEXT_PUBLIC_SUPABASE_URL);
  const password = env.SUPABASE_DB_PASSWORD;

  if (!ref || !password) {
    return null;
  }

  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
}

const env = loadEnv();
const dbUrl = buildDatabaseUrl(env);

if (!dbUrl) {
  console.error(
    [
      "Missing database credentials for db push.",
      "",
      "Add to .env.local (Supabase → Project Settings → Database):",
      "  SUPABASE_DB_PASSWORD=your-database-password",
      "",
      "Or use the CLI link flow:",
      "  npx supabase login",
      "  npx supabase link --project-ref YOUR_PROJECT_REF",
      "  npx supabase db push --include-seed",
    ].join("\n"),
  );
  process.exit(1);
}

const includeSeed = process.argv.includes("--no-seed") ? "" : " --include-seed";
const command = `npx supabase db push --db-url "${dbUrl}"${includeSeed} --yes`;

console.log("Pushing migrations to remote database…");
execSync(command, { cwd: root, stdio: "inherit" });
