import { readFileSync } from "node:fs";

function configuredBackendUrl() {
  const inherited = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (inherited) return inherited.replace(/\/+$/, "");

  const contents = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const match = contents.match(/^NEXT_PUBLIC_BACKEND_URL\s*=\s*(.+)\s*$/m);
  const configured = match?.[1]?.trim();
  if (!configured) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL must be set in the environment or .env.local");
  }

  process.env.NEXT_PUBLIC_BACKEND_URL = configured;
  return configured.replace(/\/+$/, "");
}

export const backendUrl = configuredBackendUrl();
