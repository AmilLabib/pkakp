import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const val = trimmed.slice(idx + 1);
    out[key] = val;
  }
  return out;
}

const envPath = path.resolve(process.cwd(), ".env.local");
const env = readEnvFile(envPath);

const SUPABASE_URL =
  env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error(
    "Missing SUPABASE URL or ANON KEY. Check .env.local or environment variables.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  // enable debug logs to console
  // @ts-expect-error global.fetch exists in Node 18+ runtime used here
  global: { fetch: global.fetch },
});

async function run() {
  console.log("Using Supabase URL:", SUPABASE_URL);
  try {
    const payload = {
      title: "Test Insert " + Date.now(),
      year: String(new Date().getFullYear()),
      image: "",
    };
    console.log("Inserting payload:", payload);
    const res = await supabase.from("prestasi").insert([payload]);
    // Log full response
    console.log("Full response:");
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Exception while inserting:", err);
  }
}

run();
