import test from "node:test";
import assert from "node:assert/strict";
import { submittedSubmissionStatus } from "./idea-submission-status.ts";

test("submitted idea exposes leader-editable status copy", () => {
  assert.deepEqual(submittedSubmissionStatus, {
    headline: "Your idea has been submitted.",
    detail: "Only the team leader can edit and resubmit the submitted idea.",
    buttonLabel: "Submitted",
  });
});
