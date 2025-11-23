type SuccessModalProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
};

export default function SuccessModal({
  open,
  title,
  description,
  onConfirm,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
        <button
          type="button"
          onClick={onConfirm}
          className="mt-4 inline-flex w-full justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          OK
        </button>
      </div>
    </div>
  );
}
