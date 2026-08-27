"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { GDGLockup } from "@/components/portal/GDGLockup";
import {
  portalApi,
  type DynamicSubmissionField,
  type DynamicSubmissionNote,
  type DynamicSubmissionPayload,
  type UserSession,
} from "@/services/portalApi";

const SUBMISSION_NOTE_STYLES: Record<DynamicSubmissionNote["type"], string> = {
  info: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  destructive: "border-red-400/30 bg-red-400/10 text-red-100",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
};

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

function DropdownField({
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
  const [open, setOpen] = useState(false);
  const selectedOption = (field.options ?? []).find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-white/10 bg-white/[0.04] text-neutral-600"
            : selectedOption
              ? "border-amber-300/50 bg-amber-300/10 text-white hover:border-amber-200/70"
              : "border-white/15 bg-[#17171d] text-neutral-400 hover:border-white/30 hover:bg-[#1d1d24]"
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="truncate">{selectedOption?.label ?? "Choose an option"}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div role="listbox" aria-label={field.label} className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/15 bg-[#1b1b22] p-2 shadow-2xl shadow-black/50">
          <button
            type="button"
            role="option"
            aria-selected={!selectedOption}
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${!selectedOption ? "bg-amber-300/15 text-amber-100" : "text-neutral-400 hover:bg-white/10 hover:text-white"}`}
          >
            Choose an option
          </button>
          {(field.options ?? []).map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${selected ? "bg-amber-300/15 text-amber-100" : "text-neutral-200 hover:bg-white/10 hover:text-white"}`}
              >
                <span>{option.label}</span>
                {selected && <Check className="h-4 w-4 text-amber-300" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
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
      <div className="space-y-3" role="radiogroup" aria-label={field.label}>
        {(field.options ?? []).map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-sm transition ${
                disabled ? "cursor-not-allowed opacity-60" : "hover:border-amber-300/40 hover:bg-white/[0.06]"
              } ${selected ? "border-amber-300/60 bg-amber-300/10 text-white" : "border-white/10 bg-white/[0.035] text-neutral-300"}`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name={field.key}
                  value={option.value}
                  checked={selected}
                  disabled={disabled}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${selected ? "border-amber-300 bg-amber-300" : "border-white/30 bg-black/20"}`}>
                  {selected && <span className="h-2 w-2 rounded-full bg-black" />}
                </span>
                <span>{option.label}</span>
              </span>
              {selected && <span className="text-xs font-medium text-amber-200">Selected</span>}
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === "multiple_choice") {
    const selected = Array.isArray(value) ? value.map(String) : [];
    return (
      <div className="space-y-3" role="group" aria-label={field.label}>
        <p className="text-xs text-neutral-500">Select all that apply</p>
        {(field.options ?? []).map((option) => {
          const checked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-sm transition ${
                disabled ? "cursor-not-allowed opacity-60" : "hover:border-amber-300/40 hover:bg-white/[0.06]"
              } ${checked ? "border-amber-300/60 bg-amber-300/10 text-white" : "border-white/10 bg-white/[0.035] text-neutral-300"}`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={(event) => {
                    onChange(event.target.checked
                      ? [...selected, option.value]
                      : selected.filter((item) => item !== option.value));
                  }}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${checked ? "border-amber-300 bg-amber-300 text-black" : "border-white/30 bg-black/20"}`}>
                  {checked && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
                </span>
                <span>{option.label}</span>
              </span>
              {checked && <span className="text-xs font-medium text-amber-200">Selected</span>}
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === "dropdown") {
    return <DropdownField field={field} value={value} disabled={disabled} onChange={onChange} />;
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
    const hasValue = value !== undefined && value !== null && value !== "";
    const currentValue = hasValue
      ? Math.min(max, Math.max(min, Number(value)))
      : min;
    const progress = max > min ? ((currentValue - min) / (max - min)) * 100 : 0;
    return (
      <div className="space-y-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-neutral-400">Choose a score</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hasValue ? "bg-amber-300/15 text-amber-200" : "bg-white/10 text-neutral-500"}`}>
            {hasValue ? currentValue : "Not selected"}
          </span>
        </div>
        <input
          id={field.key}
          type="range"
          min={min}
          max={max}
          step="1"
          value={currentValue}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={field.label}
          aria-valuetext={hasValue ? String(currentValue) : "Not selected"}
          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #fcd34d ${progress}%, rgba(255,255,255,0.12) ${progress}%)`,
          }}
        />
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
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
    <main className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-black p-4 pb-20 text-white sm:p-6 md:p-10">
      <header
        className="absolute left-4 top-4 z-30 sm:left-6 sm:top-6 md:left-10 md:top-8"
        aria-label="Google Developer Groups"
      >
        <GDGLockup />
      </header>

      <Link
        href="/profile"
        className="group absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-white/90 transition-all hover:text-white sm:right-6 sm:top-6 md:right-10 md:top-8"
        aria-label="User Profile"
      >
        <span
          className="text-[16px] font-medium tracking-wide md:text-[18px]"
          style={{ fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif" }}
        >
          Profile
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white transition-transform group-hover:scale-105"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </Link>

      <div
        className="relative order-2 mt-6 flex h-[135px] w-full max-w-[370px] flex-shrink-0 items-center justify-center overflow-visible pointer-events-none sm:mt-8 md:order-none md:-mt-[clamp(24px,5vw,135px)] md:mt-0 md:h-[clamp(140px,22vw,314px)] md:max-w-[848px]"
        aria-hidden="true"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="absolute left-0 top-0 flex aspect-square w-[37%] items-center justify-center" style={{ mixBlendMode: "screen", filter: "brightness(1.12) saturate(1.05)" }}>
            <Image src="/assets/gear.svg" alt="Gear" width={314} height={314} priority className="h-full w-full object-contain" />
          </div>
          <div className="absolute left-[32.5%] top-[15%] flex aspect-square w-[27.3%] items-center justify-center" style={{ mixBlendMode: "screen", filter: "brightness(1.12) saturate(1.05)" }}>
            <Image src="/assets/baked/web.png" alt="Web Track" width={232} height={232} priority className="h-full w-full object-contain" />
          </div>
          <div className="absolute left-[55.5%] top-[11.8%] flex aspect-square w-[28.8%] items-center justify-center" style={{ mixBlendMode: "screen", filter: "brightness(1.12) saturate(1.05)" }}>
            <Image src="/assets/gemini.svg" alt="Gemini Track" width={244} height={244} priority className="h-full w-full object-contain" />
          </div>
          <div className="absolute left-[80%] top-[23.3%] flex aspect-[41/53] w-[20%] items-center justify-center" style={{ mixBlendMode: "screen", filter: "brightness(1.12) saturate(1.05)" }}>
            <Image src="/assets/baked/cursor.png" alt="Cursor" width={170} height={220} priority className="h-full w-full object-contain" />
          </div>
        </div>
      </div>

      <div className="relative z-20 order-1 mx-auto flex w-full max-w-[1072px] flex-col items-center justify-start gap-[clamp(12px,1.8vh,24px)] px-1 pb-8 pt-24 sm:px-3 sm:pt-24 md:order-none md:pt-0">
        <h1
          className="m-0 w-full select-none text-center text-[clamp(36px,4.5vw,64px)] font-bold capitalize leading-[1.2] tracking-normal text-white"
          style={{ fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif" }}
        >
          {form.title}
        </h1>
        {form.description && (
          <p className="w-full text-center text-sm text-neutral-400">{form.description}</p>
        )}
        <div className="flex w-full flex-wrap justify-center gap-3 text-xs text-neutral-400">
          <span className="rounded-full border border-white/10 px-3 py-1.5">
            {form.submission_type === "team" ? "Team submission" : "Individual submission"}
            {form.submission_type === "team" && form.team_response_policy
              ? ` • ${form.team_response_policy === "leader_only" ? "Leader submits" : "Any team member"}`
              : ""}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">Status: {form.status}</span>
          {form.end_at && <span className="rounded-full border border-white/10 px-3 py-1.5">Deadline: {formatDate(form.end_at)}</span>}
        </div>
        {payload.scope?.type === "team" && <p className="w-full text-center text-sm text-neutral-300">Team: <strong className="text-white">{payload.scope.team_name}</strong></p>}
        {form.notes && form.notes.length > 0 && (
          <div className="w-full space-y-3" aria-label="Submission notes">
            {form.notes.map((note) => (
              <aside
                key={`${note.position}-${note.title}`}
                role="note"
                className={`rounded-2xl border px-4 py-3 ${SUBMISSION_NOTE_STYLES[note.type]}`}
              >
                <p className="text-sm font-semibold">{note.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 opacity-90">{note.content}</p>
              </aside>
            ))}
          </div>
        )}

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
                  <label htmlFor={field.key} className="text-base font-semibold text-white">
                    {index + 1}. {field.label}
                    {field.required
                      ? <span className="ml-1 text-amber-300">*</span>
                      : <span className="ml-2 text-xs font-normal text-neutral-500">{" "}(Optional)</span>}
                  </label>
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

        {response?.last_saved_by_name && (
          <p className="mt-3 text-xs text-neutral-400 sm:text-sm" role="status">
            Last saved by {response.last_saved_by_name}
            {response.updated_at ? ` on ${new Date(response.updated_at).toLocaleString()}` : ""}
          </p>
        )}
      </div>
    </main>
  );
}
