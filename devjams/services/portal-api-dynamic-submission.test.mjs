import test from "node:test";
import assert from "node:assert/strict";
import { backendUrl } from "./test-environment.mjs";
import { portalApi } from "./portalApi.ts";

const storage = new Map([
  ["devjams26_jwt_token", "participant-token"],
]);
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

async function withFetch(handler, run) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("fetches a participant submission form by slug", async () => {
  let requestedUrl;
  await withFetch(async (url, options) => {
    requestedUrl = String(url);
    assert.equal(options.method, "GET");
    return new Response(JSON.stringify({
      form: {
        slug: "project-intake",
        title: "Project Intake",
        description: "Provide your project details.",
        submission_type: "individual",
        status: "open",
        notes: [
          { type: "warning", title: "Before you start", content: "Use working links.", position: 1 },
        ],
        fields: [
          { id: "field-1", key: "project_title", type: "short_text", label: "Project title", placeholder: "Example project", required: false, position: 1 },
        ],
      },
      response: null,
      can_edit: true,
      can_submit: true,
    }), { headers: { "content-type": "application/json" } });
  }, async () => {
    const form = await portalApi.fetchSubmissionForm("project-intake");
    assert.equal(form.form.slug, "project-intake");
    assert.equal(form.form.status, "open");
    assert.equal(form.form.notes[0].type, "warning");
    assert.equal(form.form.notes[0].content, "Use working links.");
    assert.equal(form.form.fields[0].placeholder, "Example project");
    assert.equal(form.form.fields[0].required, false);
  });
  assert.equal(requestedUrl, `${backendUrl}/participant/submissions/project-intake`);
});

test("saves and submits participant submission answers", async () => {
  const requests = [];
  await withFetch(async (url, options) => {
    requests.push({ url: String(url), options });
    return new Response(JSON.stringify({ response: { status: "draft", answers: { title: "Draft" } } }), {
      headers: { "content-type": "application/json" },
    });
  }, async () => {
    await portalApi.saveSubmissionDraft("project-intake", { title: "Draft" });
    await portalApi.submitSubmissionResponse("project-intake", { title: "Final" });
  });

  assert.equal(requests[0].url, `${backendUrl}/participant/submissions/project-intake/draft`);
  assert.equal(requests[0].options.method, "PUT");
  assert.deepEqual(JSON.parse(requests[0].options.body), { answers: { title: "Draft" } });
  assert.equal(requests[1].url, `${backendUrl}/participant/submissions/project-intake/submit`);
  assert.equal(requests[1].options.method, "POST");
  assert.deepEqual(JSON.parse(requests[1].options.body), { answers: { title: "Final" } });
});
