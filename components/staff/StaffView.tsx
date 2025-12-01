"use client";

import { useEffect, useMemo, useState } from "react";
import { PatientRealtimePayload } from "@/lib/types";
import { subscribeToPatientUpdates } from "@/lib/realtime";
import PatientCard from "./PatientCard";

type StaffStatus = "idle" | "active" | "inactive" | "submitted";

export default function StaffView() {
  const [patients, setPatients] = useState<
    Record<string, PatientRealtimePayload>
  >({});

  const [now, setNow] = useState<Date>(() => new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPatientUpdates((incoming) => {
      setPatients((prev) => ({
        ...prev,
        [incoming.patientId]: incoming,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const patientEntries = useMemo(
    () => Object.entries(patients),
    [patients]
  );

  const hasAnyPatients = patientEntries.length > 0;

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return patientEntries;

    const term = searchQuery.trim().toLowerCase();

    return patientEntries.filter(([patientId, payload], index) => {
      const { form } = payload;
      const displayName =
        (form.firstName || form.lastName
          ? `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim()
          : `Patient ${index + 1}`
        ).toLowerCase();

      return (
        displayName.includes(term) ||
        patientId.toLowerCase().includes(term)
      );
    });
  }, [patientEntries, searchQuery]);

  const hasFilteredPatients = filteredEntries.length > 0;

  return (
    <>
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Staff View</h2>
          <p className="text-sm text-slate-300">
            Monitor multiple patients in real time. Open the Patient Form on
            different devices or browser tabs, each will appear as a separate
            card below.
          </p>
        </div>

        <div className="w-full max-w-xs md:w-auto">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Search by name or ID
          </label>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. John, 3f9a12…"
            className="w-full rounded-md border border-slate-700 bg-slate-950/80 
                       px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 
                       focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </header>

      {!hasAnyPatients ? (
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
          Waiting for patients to start filling the form…
        </div>
      ) : !hasFilteredPatients ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
          No patients match{" "}
          <span className="font-mono text-slate-200">
            {searchQuery}
          </span>
          . Try a different name or ID.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEntries.map(([patientId, payload], index) => (
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
    </>
  );
}

export type { StaffStatus };
