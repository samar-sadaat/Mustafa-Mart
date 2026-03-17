import { X, TriangleAlert } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Confirm delete",
  message = "Are you sure?",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-600/20 p-3 text-red-400">
              <TriangleAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-6 text-slate-300">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-slate-700 px-4 py-2 text-slate-200 transition hover:bg-slate-900 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}