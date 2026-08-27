"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import {
  portalApi,
  type DynamicSubmissionField,
  type DynamicSubmissionPayload,
  type UserSession,
} from "@/services/portalApi";

function answerIsEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  return Array.isArray(value) && value.length === 0;
}

function missingRequiredFields(fields: DynamicSubmissionField[], answers: Record<string, unknown>): string[] {
  return fields
    .filter((field) => field.required && answerIsEmpty(answers[field.key]))
    .map((field) => field.label);
}

function formatDate(value?: string | null): string {
  if (!value) return "No deadline set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function answerDisplayValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value === null || value === undefined || value === "" ? "Not answered" : String(value);
}

function FieldInput({
  field,
  value,
  disabled,
  onChange,
}: {
  field: DynamicSubmissionField;
  value: unknown;
  disabled: boolean;
  onChange: (value: unknown) => void;
}) {
  const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/60 disabled:cursor-not-allowed disabled:opacity-60";

  if (field.type === "long_text") {
    return (
      <textarea
        id={field.key}
        className={`${inputClass} min-h-32 resize-y`}
        placeholder={field.placeholder}
        value={typeof value === "string" ? value : ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === "single_choice") {
    return (
      <div className="space-y-2">
        {(field.options ?? []).map((option) => (
          <label key={option.value} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-neutral-200">
            <input
              type="radio"
              name={field.key}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="accent-amber-400"
            />
            {option.label}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "multiple_choice") {
    const selected = Array.isArray(value) ? value.map(String) : [];
    return (
      <div className="space-y-2">
        {(field.options ?? []).map((option) => (
          <label key={option.value} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-neutral-200">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              disabled={disabled}
              onChange={(event) => {
                onChange(event.target.checked
                  ? [...selected, option.value]
                  : selected.filter((item) => item !== option.value));
              }}
              className="accent-amber-400"
            />
            {option.label}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "dropdown") {
    return (
      <select
        id={field.key}
        className={inputClass}
        value={typeof value === "string" ? value : ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select an option</option>
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 text-sm text-neutral-200">
        <input
          id={field.key}
          type="checkbox"
          checked={value === true}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-amber-400"
        />
        Yes
      </label>
    );
  }

  if (field.type === "linear_scale") {
    const min = Number(field.validation?.min ?? 1);
    const max = Number(field.validation?.max ?? 5);
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: Math.max(0, max - min + 1) }, (_, index) => min + index).map((option) => (
          <label key={option} className="flex min-w-12 cursor-pointer flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-neutral-300">
            <input
              type="radio"
              name={field.key}
              value={option}
              checked={Number(value) === option}
              disabled={disabled}
              onChange={() => onChange(option)}
              className="accent-amber-400"
            />
            {option}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "multiple_urls") {
    const links = Array.isArray(value) ? value.map(String) : [];
    return (
      <textarea
        id={field.key}
        className={`${inputClass} min-h-24 resize-y`}
        placeholder={field.placeholder || "One link per line"}
        value={links.join("\n")}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
      />
    );
  }

  const inputType = field.type === "short_text" ? "text" : field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "number" ? "number" : field.type;
  return (
    <input
      id={field.key}
      type={inputType}
      className={inputClass}
      placeholder={field.placeholder}
      value={value === null || value === undefined ? "" : String(value)}
      disabled={disabled}
      onChange={(event) => onChange(field.type === "number" ? (event.target.value === "" ? "" : Number(event.target.value)) : event.target.value)}
    />
  );
}

export default function DynamicSubmissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [session] = useState<UserSession | null>(() => portalApi.getSession());
  const [payload, setPayload] = useState<DynamicSubmissionPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || !portalApi.getToken()) {
      router.push("/portal");
      return;
    }

    portalApi.fetchSubmissionForm(slug)
      .then((nextPayload) => {
        setPayload(nextPayload);
        const existingAnswers = nextPayload.response?.answers ?? {};
        setAnswers(existingAnswers);
        setEditing(!nextPayload.response || nextPayload.response.status === "draft");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load this submission.");
      })
      .finally(() => setLoading(false));
  }, [router, session, slug]);

  const response = payload?.response ?? null;
  const form = payload?.form;
  const isOpen = form?.status === "open";
  const isLocked = response?.status === "auto_submitted" || (response?.status === "submitted" && !editing);
  const canEdit = Boolean(payload?.can_edit) && response?.status !== "auto_submitted";
  const canSaveDraft = Boolean(form?.drafts_enabled && payload?.can_edit && isOpen && !isLocked);
  const canSubmit = Boolean(payload?.can_submit && isOpen && !isLocked);

  const updateAnswer = (key: string, value: unknown) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  };

  const saveDraft = async () => {
    if (!canSaveDraft) return;
    setSaving(true);
    setError("");
    try {
      const result = await portalApi.saveSubmissionDraft(slug, answers);
      setPayload((current) => current ? { ...current, response: result.response } : current);
      setSavedMessage("Draft saved.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save your draft.");
    } finally {
      setSaving(false);
    }
  };

  const submitResponse = async () => {
    if (!form || !canSubmit) return;
    const missing = missingRequiredFields(form.fields, answers);
    if (missing.length > 0) {
      setError(`Complete the required fields: ${missing.join(", ")}`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await portalApi.submitSubmissionResponse(slug, answers);
      setPayload((current) => current ? { ...current, response: result.response } : current);
      setEditing(false);
      setSavedMessage("Submission received.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not submit your response.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C] text-sm text-neutral-400">Loading submission...</div>;
  }

  if (!form) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0A0A0C] px-6 text-center text-white">
        <h1 className="text-2xl font-semibold">Submission unavailable</h1>
        <p className="text-sm text-neutral-400">{error || "This submission could not be loaded."}</p>
        <button type="button" onClick={() => router.push("/portal")} className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black">Return to portal</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white">
      <PortalNavbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber-300">
            <span>{form.submission_type === "team" ? "Team submission" : "Individual submission"}</span>
            {form.submission_type === "team" && form.team_response_policy && <span className="text-neutral-500">• {form.team_response_policy === "leader_only" ? "Leader submits" : "Any team member"}</span>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{form.title}</h1>
          {form.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{form.description}</p>}
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-neutral-400">
            <span className="rounded-full border border-white/10 px-3 py-1.5">Status: {form.status}</span>
            {form.end_at && <span className="rounded-full border border-white/10 px-3 py-1.5">Deadline: {formatDate(form.end_at)}</span>}
          </div>
          {payload.scope?.type === "team" && <p className="mt-4 text-sm text-neutral-300">Team: <strong className="text-white">{payload.scope.team_name}</strong></p>}
        </div>

        {error && <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {savedMessage && <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{savedMessage}</div>}

        {!isOpen && <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">This submission is currently {form.status}. Responses cannot be changed right now.</div>}
        {response?.status === "auto_submitted" && <div className="mb-5 rounded-2xl border border-blue-400/30 bg-blue-400/10 px-4 py-3 text-sm text-blue-100">Your saved draft was automatically submitted at the deadline.</div>}
        {response?.status === "submitted" && !editing && <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">Your response has been submitted.</div>}

        <div className="space-y-5">
          {form.fields.map((field, index) => (
            <section key={field.id || field.key} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <label htmlFor={field.key} className="text-base font-semibold text-white">{index + 1}. {field.label}{field.required && <span className="ml-1 text-amber-300">*</span>}</label>
                </div>
                {field.description && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-400">{field.description}</p>}
              </div>
              {isLocked ? <p className="rounded-xl bg-black/20 px-4 py-3 text-sm text-neutral-200">{answerDisplayValue(answers[field.key])}</p> : <FieldInput field={field} value={answers[field.key]} disabled={!isOpen || !editing || !canEdit} onChange={(value) => updateAnswer(field.key, value)} />}
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => router.back()} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-neutral-300 transition hover:border-white/30 hover:text-white">Back</button>
          <div className="flex flex-wrap gap-3">
            {response?.status === "submitted" && canEdit && !editing && <button type="button" onClick={() => { setEditing(true); setSavedMessage(""); }} className="rounded-full border border-amber-300/50 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-300/10">Edit submission</button>}
            {canSaveDraft && <button type="button" onClick={saveDraft} disabled={saving || submitting} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/30 disabled:opacity-50">{saving ? "Saving..." : "Save draft"}</button>}
            {canSubmit && <button type="button" onClick={submitResponse} disabled={saving || submitting} className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50">{submitting ? "Submitting..." : response?.status === "submitted" ? "Resubmit" : "Submit response"}</button>}
          </div>
        </div>
      </main>
    </div>
  );
}
