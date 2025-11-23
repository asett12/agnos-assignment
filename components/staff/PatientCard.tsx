"use client";

import { useMemo } from "react";
import { PatientRealtimePayload } from "@/lib/types";
import type { StaffStatus } from "./StaffView";

function getComputedStatus(
  payload: PatientRealtimePayload,
  now: Date
): StaffStatus {
  const { status, lastUpdatedAt } = payload;

  if (status === "submitted") return "submitted";
  if (!lastUpdatedAt) return "idle";

  const last = new Date(lastUpdatedAt).getTime();
  const diffMs = now.getTime() - last;

  if (status === "active" && diffMs > 30_000) {
    return "inactive";
  }

  return status as StaffStatus;
}

type PatientCardProps = {
  patientId: string;
  payload: PatientRealtimePayload;
  index: number;
  now: Date;
};

export default function PatientCard({
  patientId,
  payload,
  index,
  now,
}: PatientCardProps) {
  const { form, lastUpdatedAt } = payload;

  const computedStatus = useMemo(
    () => getComputedStatus(payload, now),
    [payload, now]
  );

  const hasBasicData =
    form.firstName || form.lastName || form.phoneNumber || form.email;

  const displayName =
    (form.firstName || form.lastName
      ? `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim()
      : null) || `Patient ${index + 1}`;

  const statusLabel: string =
    computedStatus === "submitted"
      ? "Submitted"
      : computedStatus === "active"
      ? "Active"
      : computedStatus === "inactive"
      ? "Inactive"
      : "Idle";

  const statusColor =
    computedStatus === "submitted"
      ? "bg-emerald-900/60 text-emerald-200 border-emerald-500"
      : computedStatus === "active"
      ? "bg-sky-900/60 text-sky-200 border-sky-500"
      : computedStatus === "inactive"
      ? "bg-amber-900/60 text-amber-200 border-amber-500"
      : "bg-slate-900/60 text-slate-200 border-slate-700";

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">{displayName}</h3>
            <p className="text-[11px] text-slate-400">
              ID: <span className="font-mono">{patientId.slice(0, 6)}</span>
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-[11px] font-medium ${statusColor}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>{statusLabel}</span>
          </div>
        </div>

        {lastUpdatedAt && (
          <p className="text-[10px] text-slate-400">
            Last update: {new Date(lastUpdatedAt).toLocaleString()}
          </p>
        )}

        {!hasBasicData && (
          <p className="text-[11px] text-slate-400">
            Patient has started typing but has not filled basic info yet.
          </p>
        )}
      </header>

      <div className="grid gap-2 text-xs md:grid-cols-2">
        <InfoField label="First Name" value={form.firstName} />
        <InfoField label="Middle Name" value={form.middleName} />
        <InfoField label="Last Name" value={form.lastName} />
        <InfoField label="Date of Birth" value={form.dateOfBirth} />
        <InfoField label="Gender" value={form.gender} />
        <InfoField label="Phone Number" value={form.phoneNumber} />
        <InfoField label="Email" value={form.email} />
        <InfoField
          label="Preferred Language"
          value={form.preferredLanguage}
        />
        <InfoField label="Nationality" value={form.nationality} />
        <InfoField label="Religion" value={form.religion} />

        <InfoField
          label="Address"
          value={form.address}
          className="md:col-span-2"
        />
        <InfoField
          label="Emergency Contact Name"
          value={form.emergencyContactName}
        />
        <InfoField
          label="Emergency Contact Relationship"
          value={form.emergencyContactRelationship}
        />
      </div>
    </article>
  );
}

type InfoFieldProps = {
  label: string;
  value?: string;
  className?: string;
};

function InfoField({ label, value, className = "" }: InfoFieldProps) {
  return (
    <div className={className}>
      <div className="text-[10px] font-semibold uppercase text-slate-400">
        {label}
      </div>
      <div className="mt-1 min-h-[32px] rounded-md border border-slate-800 bg-slate-950/60 px-2 py-1.5 text-[11px] text-slate-100">
        {value && value.trim() ? (
          value
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </div>
    </div>
  );
}
