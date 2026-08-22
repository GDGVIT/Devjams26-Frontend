import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./portal/onboarding/page.tsx", import.meta.url), "utf8");

test("onboarding keeps the name editable with the requested placeholder", () => {
  const nameInput = source.match(/<input[\s\S]*?value=\{name\}[\s\S]*?\/>/)?.[0] || "";
  assert.match(nameInput, /onChange=\{\(e\) => setName\(e\.target\.value\)\}/);
  assert.match(nameInput, /placeholder="E\.G Neeraj Sathish Kumar"/);
  assert.doesNotMatch(nameInput, /readOnly/);
});

test("internal onboarding keeps registration number editable with the requested placeholder", () => {
  const registrationInput = source.match(/<input[\s\S]*?value=\{registrationNumber\}[\s\S]*?\/>/)?.[0] || "";
  assert.match(registrationInput, /onChange=\{\(e\) => setRegistrationNumber\(e\.target\.value\.toUpperCase\(\)\)\}/);
  assert.match(registrationInput, /placeholder="E\.G 25BCE2055"/);
  assert.doesNotMatch(registrationInput, /readOnly/);
});

test("onboarding keeps the OAuth email read-only", () => {
  const emailInput = source.match(/<input[\s\S]*?value=\{email\}[\s\S]*?\/>/)?.[0] || "";
  assert.match(emailInput, /readOnly/);
  assert.match(emailInput, /aria-readonly="true"/);
});
