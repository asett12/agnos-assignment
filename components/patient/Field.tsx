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

export default function Field({
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
