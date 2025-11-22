import "./globals.css";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome</h2>
      <p className="text-sm text-slate-300">
        This app demonstrates a responsive, real-time patient input form and
        staff view system built with Next.js and TailwindCSS.
        Open the Patient Form in one tab and the Staff View in another to see
        real-time updates.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="font-semibold">Patient Form</h3>
          <p className="mt-1 text-sm text-slate-300">
            Patients can submit their personal details with validation and a
            mobile-friendly layout.
          </p>
          <a
            href="/patient"
            className="mt-3 inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium hover:bg-sky-500"
          >
            Go to Patient Form
          </a>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="font-semibold">Staff View</h3>
          <p className="mt-1 text-sm text-slate-300">
            Staff can monitor patient entries in real time, including submission
            status and activity indicators.
          </p>
          <a
            href="/staff"
            className="mt-3 inline-flex rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium hover:bg-emerald-500"
          >
            Go to Staff View
          </a>
        </div>
      </div>
    </section>
  );
}

