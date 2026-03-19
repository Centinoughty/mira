import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-225 rounded-xl bg-white shadow-xl"
        >
          {children}
        </div>
      </div>
    </>
  );
}
