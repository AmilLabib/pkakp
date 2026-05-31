import { defineConfig, globalIgnores } from "eslint/config";

// Try to import the .js entry first (works in environments that require explicit .js),
// then fall back to the non-.js path. Use top-level await which is supported in ESM.
async function tryImport(...paths) {
  for (const p of paths) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const mod = await import(p);
      return mod;
    } catch (e) {
      // ignore and try next
    }
  }
  return null;
}

const nextVitalsRaw = await tryImport(
  "eslint-config-next/core-web-vitals.js",
  "eslint-config-next/core-web-vitals",
);
const nextTsRaw = await tryImport(
  "eslint-config-next/typescript.js",
  "eslint-config-next/typescript",
);

// defensive: some package exports might be default-wrapped or already an array
const nextVitals = Array.isArray(nextVitalsRaw)
  ? nextVitalsRaw
  : nextVitalsRaw && Array.isArray(nextVitalsRaw.default)
    ? nextVitalsRaw.default
    : [];
const nextTs = Array.isArray(nextTsRaw)
  ? nextTsRaw
  : nextTsRaw && Array.isArray(nextTsRaw.default)
    ? nextTsRaw.default
    : [];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
