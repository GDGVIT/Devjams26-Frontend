import test from "node:test";
import assert from "node:assert/strict";
import { lockedSubmissionStatus } from "./idea-submission-status.ts";

test("locked submission exposes final review copy", () => {
  assert.deepEqual(lockedSubmissionStatus, {
    headline: "Your idea has been submitted and locked for review.",
    detail: "Submissions are one-time and final. Mentor evaluation will proceed based on these details.",
    buttonLabel: "Submitted and Locked",
  });
});
