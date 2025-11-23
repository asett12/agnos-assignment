"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PatientFormData,
  PatientRealtimePayload,
} from "../../lib/types";
import { subscribeToPatientUpdates } from "../../lib/realtime";

type StaffStatus = "idle" | "active" | "inactive" | "submitted";

export default function StaffPage() {
  const [patients, setPatients] = useState<
    Record<string, PatientRealtimePayload>
  >({});

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPatientUpdates((incoming) => {
      console.log("Realtime payload:", incoming.patientId, incoming);
      setPatients((prev) => ({
        ...prev,
        [incoming.patientId]: incoming,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const patientEntries = Object.entries(patients);
  const hasAnyPatients = patientEntries.length > 0;

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">Staff View</h2>
        <p className="text-sm text-slate-300">
          Monitor multiple patients in real time. Open the Patient Form on
          different devices or browser tabs; each will appear as a separate
          card below.
        </p>
      </header>

      {!hasAnyPatients ? (
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
          Waiting for patients to start filling the form…
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {patientEntries.map(([patientId, payload], index) => (
            <PatientCard
              key={patientId}
              patientId={patientId}
              payload={payload}
              index={index}
              now={now}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function getComputedStatus(
  payload: PatientRealtimePayload,
  now: Date
): StaffStatus {
  const { status, lastUpdatedAt } = payload;

  if (status === "submitted") return "submitted";
  if (!lastUpdatedAt) return "idle";

  const last = new Date(lastUpdatedAt).getTime();
  const diffMs = now.getTime() - last;

  // 30s of no update while "active" => inactive
  if (status === "active" && diffMs > 30_000) {
    return "inactive";
  }

  return status;
}

function PatientCard({
  patientId,
  payload,
  index,
  now,
}: {
  patientId: string;
  payload: PatientRealtimePayload;
  index: number;
  now: Date;
}) {
  const { data, lastUpdatedAt } = payload;

  const computedStatus = useMemo(
    () => getComputedStatus(payload, now),
    [payload, now]
  );

  const hasBasicData =
    data.firstName || data.lastName || data.phoneNumber || data.email;

  const displayName =
    (data.firstName || data.lastName
      ? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
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
              ID: <span className="font-mono">{patientId.slice(0, 10)}…</span>
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
        <InfoField label="First Name" value={data.firstName} />
        <InfoField label="Middle Name" value={data.middleName} />
        <InfoField label="Last Name" value={data.lastName} />
        <InfoField label="Date of Birth" value={data.dateOfBirth} />
        <InfoField label="Gender" value={data.gender} />
        <InfoField label="Phone Number" value={data.phoneNumber} />
        <InfoField label="Email" value={data.email} />
        <InfoField
          label="Preferred Language"
          value={data.preferredLanguage}
        />
        <InfoField label="Nationality" value={data.nationality} />
        <InfoField label="Religion" value={data.religion} />

        <InfoField
          label="Address"
          value={data.address}
          className="md:col-span-2"
        />
        <InfoField
          label="Emergency Contact Name"
          value={data.emergencyContactName}
        />
        <InfoField
          label="Emergency Contact Relationship"
          value={data.emergencyContactRelationship}
        />
      </div>
    </article>
  );
}

function InfoField({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string;
  className?: string;
}) {
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
