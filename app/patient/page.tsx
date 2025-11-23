"use client";

import { FormEvent, useEffect, useState } from "react";
import { PatientFormData, PatientStatus } from "../../lib/types";
import { sendPatientUpdate } from "../../lib/realtime";

const initialForm: PatientFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  preferredLanguage: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  religion: "",
};

type Errors = Partial<Record<keyof PatientFormData, string>>;

function generatePatientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `patient-${Math.random().toString(36).slice(2, 10)}`;
}

export default function PatientPage() {
  const [patientId] = useState<string>(() => generatePatientId());

  const [form, setForm] = useState<PatientFormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<PatientStatus>("idle");
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const validate = (data: PatientFormData): Errors => {
    const newErrors: Errors = {};

    if (!data.firstName.trim()) newErrors.firstName = "First name is required";
    if (!data.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9\s\-]{10,15}$/.test(data.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim().toLowerCase())
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.gender.trim()) newErrors.gender = "Gender is required";
    if (!data.address.trim()) newErrors.address = "Address is required";
    if (!data.preferredLanguage.trim())
      newErrors.preferredLanguage = "Preferred language is required";
    if (!data.nationality.trim())
      newErrors.nationality = "Nationality is required";

    return newErrors;
  };

  useEffect(() => {
    if (status === "submitted") return;

    const timeout = setTimeout(() => {
      const hasAnyValue = Object.values(form).some(
        (value) => typeof value === "string" && value.trim() !== ""
      );
      if (hasAnyValue) {
        const now = new Date().toISOString();
        setStatus("active");
        sendPatientUpdate({
          patientId,
          data: form,
          status: "active",
          lastUpdatedAt: now,
        });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [form, status, patientId]);

  const handleChange =
    (field: keyof PatientFormData) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (status === "idle") setStatus("active");
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validate(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    const now = new Date().toISOString();
    setStatus("submitted");
    setSubmittedAt(now);

    sendPatientUpdate({
      patientId,
      data: form,
      status: "submitted",
      lastUpdatedAt: now,
    });
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    setSubmittedAt(null);

    sendPatientUpdate({
      patientId,
      data: initialForm,
      status: "idle",
      lastUpdatedAt: new Date().toISOString(),
    });
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Patient Form</h2>
          <p className="text-sm text-slate-300">
            Please fill in your personal details. Fields marked * are required.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Status:{" "}
          <span
            className={
              status === "submitted"
                ? "text-emerald-400"
                : status === "active"
                ? "text-sky-400"
                : "text-slate-300"
            }
          >
            {status === "idle"
              ? "Not started"
              : status === "active"
              ? "Filling in progress"
              : "Submitted"}
          </span>
          {submittedAt && (
            <div className="mt-0.5">
              Submitted at{" "}
              <span className="text-slate-200">
                {new Date(submittedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-2"
      >
        {/* Left column */}
        <div className="space-y-4">
          <Field
            label="First Name *"
            value={form.firstName}
            onChange={handleChange("firstName")}
            error={errors.firstName}
          />
          <Field
            label="Middle Name"
            value={form.middleName || ""}
            onChange={handleChange("middleName")}
            error={errors.middleName}
          />
          <Field
            label="Last Name *"
            value={form.lastName}
            onChange={handleChange("lastName")}
            error={errors.lastName}
          />
          <Field
            label="Date of Birth *"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            error={errors.dateOfBirth}
          />
          <div>
            <label className="text-xs font-medium text-slate-200" htmlFor="gender">
              Gender *
            </label>

            <select
              id="gender"
              value={form.gender}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/80 
                        px-3 py-2 text-sm text-slate-50 focus:border-sky-500 
                        focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="LGBTQ+">LGBTQ+</option>
            </select>

            {errors.gender && (
              <p className="mt-1 text-xs text-rose-400">{errors.gender}</p>
            )}
          </div>

          <Field
            label="Phone Number *"
            value={form.phoneNumber}
            onChange={handleChange("phoneNumber")}
            placeholder="+66 ..."
            error={errors.phoneNumber}
          />
          <Field
            label="Email *"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="name@example.com"
            error={errors.email}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Field
            label="Address *"
            as="textarea"
            value={form.address}
            onChange={handleChange("address")}
            error={errors.address}
          />
          <Field
            label="Preferred Language *"
            value={form.preferredLanguage}
            onChange={handleChange("preferredLanguage")}
            placeholder="e.g. English, Thai"
            error={errors.preferredLanguage}
          />
          <Field
            label="Nationality *"
            value={form.nationality}
            onChange={handleChange("nationality")}
            error={errors.nationality}
          />
          <Field
            label="Emergency Contact Name"
            value={form.emergencyContactName || ""}
            onChange={handleChange("emergencyContactName")}
            error={errors.emergencyContactName}
          />
          <Field
            label="Emergency Contact Relationship"
            value={form.emergencyContactRelationship || ""}
            onChange={handleChange("emergencyContactRelationship")}
            error={errors.emergencyContactRelationship}
          />
          <Field
            label="Religion"
            value={form.religion || ""}
            onChange={handleChange("religion")}
            error={errors.religion}
          />
        </div>

        <div className="col-span-full mt-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm hover:border-slate-500"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  error?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  as = "input",
  placeholder,
  error,
}: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-").replace("*", "");

  const baseClasses =
    "mt-1 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div>
      <label className="text-xs font-medium text-slate-200" htmlFor={id}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
