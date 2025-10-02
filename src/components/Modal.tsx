import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[90%] max-w-md">
        {/* Gradient glow border */}
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-2xl opacity-80 blur-md"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, #a855f7, #ec4899, #f59e0b, #22d3ee, #a855f7)",
          }}
        />
        <div className="relative rounded-xl bg-zinc-900 text-white p-6 shadow-xl border border-white/10">
          {title ? (
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
          ) : null}
          <div className="mb-4">{children}</div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
