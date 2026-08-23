import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./portal/onboarding/page.tsx", import.meta.url), "utf8");

test("onboarding locks name and registration for a valid OAuth internal identity", () => {
  const nameInput = source.match(/<input[\s\S]*?value=\{name\}[\s\S]*?\/>/)?.[0] || "";
  const registrationInput = source.match(/<input[\s\S]*?value=\{registrationNumber\}[\s\S]*?\/>/)?.[0] || "";

  assert.match(nameInput, /readOnly=\{identityLocked\}/);
  assert.match(registrationInput, /readOnly=\{identityLocked\}/);
});

test("onboarding keeps malformed OAuth identity fields editable", () => {
  assert.match(source, /const \[identityLocked, setIdentityLocked\] = useState\(false\)/);
  assert.match(source, /oauthIdentityLocked/);
});

test("onboarding keeps the requested identity placeholders", () => {
  assert.match(source, /placeholder="E\.G Neeraj Sathish Kumar"/);
  assert.match(source, /placeholder="E\.G 25BCE2055"/);
});

test("onboarding keeps the OAuth email read-only", () => {
  const emailInput = source.match(/<input[\s\S]*?value=\{email\}[\s\S]*?\/>/)?.[0] || "";
  assert.match(emailInput, /readOnly/);
  assert.match(emailInput, /aria-readonly="true"/);
});
