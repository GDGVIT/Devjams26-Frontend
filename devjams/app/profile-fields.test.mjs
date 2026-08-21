import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./profile/page.tsx", import.meta.url), "utf8");

test("internal profile keeps gender beside registration number", () => {
  assert.match(
    source,
    /Registration Number[\s\S]*profile\.registrationNumber[\s\S]*Gender[\s\S]*profile\??\.gender[\s\S]*\)\}\s*\{\/\* Phone Field \*\//,
  );
});

test("mobile number spans the full profile width", () => {
  assert.match(
    source,
    /className="w-full flex flex-col items-start gap-2 md:col-span-2"/,
  );
});

test("internal profiles keep hostel block and room number paired", () => {
  assert.match(
    source,
    /:\s*\[\s*\["Hostel Block", profile\?\.hostelBlock\],\s*\["Room Number", profile\?\.roomNumber\]/s,
  );
});
